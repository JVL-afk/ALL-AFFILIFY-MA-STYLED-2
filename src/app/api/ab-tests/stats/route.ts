import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ABTestingRepository } from '@/lib/repositories/ab-testing-repository';
import { logger } from '@/lib/debug-logger';
import { getTraceId, initializeTraceContext, runWithTraceContext } from '@/lib/trace-context';

/**
 * A/B Testing Stats API Route (Production Grade)
 * 
 * Replaces mock implementation with real database aggregation and tenant isolation.
 * Uses the ABTestingRepository for data access and TraceContext for observability.
 */
export async function GET(request: NextRequest) {
  const traceContext = initializeTraceContext();
  const traceId = traceContext.traceId;

  return runWithTraceContext(traceContext, async () => {
    try {
      // 1. Authentication & Authorization
      const token = request.cookies.get('auth-token')?.value;
      if (!token) {
        logger.warn('ABTestingStatsAPI', 'GET', 'Authentication required', { traceId });
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        logger.warn('ABTestingStatsAPI', 'GET', 'Invalid token', { traceId });
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      const user = await getUserById(decoded.userId);
      if (!user) {
        logger.warn('ABTestingStatsAPI', 'GET', 'User not found', { userId: decoded.userId, traceId });
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // 2. Enterprise Plan Enforcement
      if (user.plan !== 'enterprise') {
        logger.warn('ABTestingStatsAPI', 'GET', 'Enterprise plan required', { userId: user._id, plan: user.plan, traceId });
        return NextResponse.json({ error: 'Enterprise plan required' }, { status: 403 });
      }

      // 3. Data Retrieval via Repository
      const { db } = await connectToDatabase();
      const repository = new ABTestingRepository(db, user._id);
      const experiments = await repository.findAll();

      // 4. Production-Grade Aggregation
      const stats = {
        totalTests: experiments.length,
        runningTests: experiments.filter(t => t.status === 'RUNNING').length,
        completedTests: experiments.filter(t => t.status === 'COMPLETED').length,
        totalVisitors: 0,
        averageUplift: 0,
        significantWins: 0
      };

      let totalUplift = 0;
      let testsWithUplift = 0;

      experiments.forEach(test => {
        if (test.variants && Array.isArray(test.variants)) {
          // Calculate total visitors across all variants
          test.variants.forEach((variant: any) => {
            stats.totalVisitors += variant.visitors || 0;
          });

          // Calculate uplift if there's a control and variant
          const control = test.variants.find((v: any) => v.isControl);
          const variants = test.variants.filter((v: any) => !v.isControl);

          if (control && variants.length > 0 && control.visitors > 0) {
            const controlCR = (control.conversions || 0) / control.visitors;
            
            variants.forEach((variant: any) => {
              if (variant.visitors > 0) {
                const variantCR = (variant.conversions || 0) / variant.visitors;
                
                if (controlCR > 0) {
                  const uplift = ((variantCR - controlCR) / controlCR) * 100;
                  if (uplift > 0) {
                    totalUplift += uplift;
                    testsWithUplift++;
                    
                    // Only count as significant win if statistical engine has flagged it
                    if (test.metrics?.statisticalSignificance && test.metrics?.winner === variant.id) {
                      stats.significantWins++;
                    }
                  }
                }
              }
            });
          }
        }
      });

      stats.averageUplift = testsWithUplift > 0 ? Number((totalUplift / testsWithUplift).toFixed(1)) : 0;

      logger.info('ABTestingStatsAPI', 'GET', 'Stats calculated successfully', {
        userId: user._id,
        totalTests: stats.totalTests,
        traceId,
      });

      return NextResponse.json({
        success: true,
        stats,
        traceId,
      });

    } catch (error) {
      logger.error('ABTestingStatsAPI', 'GET', 'Internal server error', {
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
