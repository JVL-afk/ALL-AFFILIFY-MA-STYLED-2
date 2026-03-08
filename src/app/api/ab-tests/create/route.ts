import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ABTestingRepository } from '@/lib/repositories/ab-testing-repository';
import { logger } from '@/lib/debug-logger';
import { getTraceId, initializeTraceContext, runWithTraceContext } from '@/lib/trace-context';
import { ExperimentSchema } from '@/lib/models/ab-testing';
import { ObjectId } from 'mongodb';

/**
 * A/B Testing Create API Route (Production Grade)
 * 
 * Replaces mock implementation with strict Zod validation, tenant isolation,
 * and repository-based persistence.
 */
export async function POST(request: NextRequest) {
  const traceContext = initializeTraceContext();
  const traceId = traceContext.traceId;

  return runWithTraceContext(traceContext, async () => {
    try {
      // 1. Authentication & Authorization
      const token = request.cookies.get('auth-token')?.value;
      if (!token) {
        logger.warn('ABTestingCreateAPI', 'POST', 'Authentication required', { traceId });
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        logger.warn('ABTestingCreateAPI', 'POST', 'Invalid token', { traceId });
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      const user = await getUserById(decoded.userId);
      if (!user) {
        logger.warn('ABTestingCreateAPI', 'POST', 'User not found', { userId: decoded.userId, traceId });
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // 2. Enterprise Plan Enforcement
      if (user.plan !== 'enterprise') {
        logger.warn('ABTestingCreateAPI', 'POST', 'Enterprise plan required', { userId: user._id, plan: user.plan, traceId });
        return NextResponse.json({ error: 'Enterprise plan required' }, { status: 403 });
      }

      // 3. Input Validation with Zod
      const body = await request.json();
      
      // Prepare data for validation
      const experimentData = {
        ...body,
        tenantId: new ObjectId(user._id),
        websiteId: body.websiteId ? new ObjectId(body.websiteId) : undefined,
        status: 'DRAFT',
        version: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const validationResult = ExperimentSchema.safeParse(experimentData);
      
      if (!validationResult.success) {
        logger.warn('ABTestingCreateAPI', 'POST', 'Validation failed', { 
          errors: validationResult.error.format(),
          traceId 
        });
        return NextResponse.json({ 
          error: 'Invalid experiment data', 
          details: validationResult.error.format(),
          traceId 
        }, { status: 400 });
      }

      // 4. Persistence via Repository
      const { db } = await connectToDatabase();
      const repository = new ABTestingRepository(db, user._id);
      const result = await repository.create(validationResult.data);

      logger.info('ABTestingCreateAPI', 'POST', 'Experiment created successfully', {
        userId: user._id,
        experimentId: result.insertedId.toString(),
        traceId,
      });

      return NextResponse.json({
        success: true,
        testId: result.insertedId.toString(),
        message: 'A/B test created successfully! Configure variants and start testing.',
        traceId,
      }, { status: 201 });

    } catch (error) {
      logger.error('ABTestingCreateAPI', 'POST', 'Internal server error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
        traceId,
      });
      return NextResponse.json(
        { error: 'Internal server error', traceId },
        { status: 500 }
      );
    }
  });
}
