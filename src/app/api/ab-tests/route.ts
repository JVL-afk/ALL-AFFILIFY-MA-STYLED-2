import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ABTestingRepository } from '@/lib/repositories/ab-testing-repository';
import { logger } from '@/lib/debug-logger';
import { getTraceId, initializeTraceContext, runWithTraceContext } from '@/lib/trace-context';

/**
 * A/B Testing List API Route (Production Grade)
 * 
 * Replaces mock implementation with repository-based data access and tenant isolation.
 */
export async function GET(request: NextRequest) {
  const traceContext = initializeTraceContext();
  const traceId = traceContext.traceId;

  return runWithTraceContext(traceContext, async () => {
    try {
      // 1. Authentication & Authorization
      const token = request.cookies.get('auth-token')?.value;
      if (!token) {
        logger.warn('ABTestingListAPI', 'GET', 'Authentication required', { traceId });
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        logger.warn('ABTestingListAPI', 'GET', 'Invalid token', { traceId });
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      const user = await getUserById(decoded.userId);
      if (!user) {
        logger.warn('ABTestingListAPI', 'GET', 'User not found', { userId: decoded.userId, traceId });
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // 2. Enterprise Plan Enforcement
      if (user.plan !== 'enterprise') {
        logger.warn('ABTestingListAPI', 'GET', 'Enterprise plan required', { userId: user._id, plan: user.plan, traceId });
        return NextResponse.json({ error: 'Enterprise plan required' }, { status: 403 });
      }

      // 3. Data Retrieval via Repository
      const { db } = await connectToDatabase();
      const repository = new ABTestingRepository(db, user._id);
      const experiments = await repository.findAll();

      logger.info('ABTestingListAPI', 'GET', 'Experiments retrieved successfully', {
        userId: user._id,
        count: experiments.length,
        traceId,
      });

      return NextResponse.json({
        success: true,
        tests: experiments,
        traceId,
      });

    } catch (error) {
      logger.error('ABTestingListAPI', 'GET', 'Internal server error', {
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
