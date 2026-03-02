import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObservabilityService } from '@/services/observability';
import { logger } from '@/lib/debug-logger';
import { configService } from '@/services/config-service';
import { initializeTraceContext, runWithTraceContext } from '@/lib/trace-context';

/**
 * Health Check Endpoint
 *
 * GET /api/health
 *
 * Returns comprehensive system health status including:
 * - Database connectivity
 * - Queue health (pending, processing, completed, DLQ)
 * - Error rate and thresholds
 * - Circuit breaker state
 * - Configuration status
 * - Alert thresholds
 * - Performance metrics
 */

export async function GET(request: NextRequest) {
  const traceContext = initializeTraceContext();

  return runWithTraceContext(traceContext, async () => {
    try {
      const { db } = await connectToDatabase();
      const observabilityService = new ObservabilityService(db);
      const alertThresholds = configService.getAlertThresholds();

      // Get base health status
      const healthStatus = await observabilityService.getHealthStatus();

      // Get queue metrics
      const queueMetrics = await observabilityService.getQueueMetrics();

      // Get error metrics
      const errorCount = await db.collection('error_events').countDocuments();
      const recentErrorCount = await db
        .collection('error_events')
        .countDocuments({
          timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, // Last 5 minutes
        });

      // Calculate error rate
      const totalJobsProcessed = queueMetrics.completed + queueMetrics.dlq;
      const errorRate = totalJobsProcessed > 0 ? ((queueMetrics.dlq / totalJobsProcessed) * 100).toFixed(2) : 0;

      // Check alert conditions
      const alerts = [];

      // DLQ accumulation alert
      if (queueMetrics.dlq > alertThresholds.dlqAccumulationThreshold) {
        alerts.push({
          level: 'warning',
          message: `DLQ accumulation threshold exceeded (${queueMetrics.dlq} > ${alertThresholds.dlqAccumulationThreshold})`,
          threshold: alertThresholds.dlqAccumulationThreshold,
          current: queueMetrics.dlq,
        });
      }

      // Error rate alert
      if (parseFloat(errorRate as string) > alertThresholds.errorRateThreshold) {
        alerts.push({
          level: 'warning',
          message: `Error rate threshold exceeded (${errorRate}% > ${alertThresholds.errorRateThreshold}%)`,
          threshold: alertThresholds.errorRateThreshold,
          current: parseFloat(errorRate as string),
        });
      }

      // Queue depth alert (if pending jobs are accumulating)
      if (queueMetrics.pending > 1000) {
        alerts.push({
          level: 'info',
          message: `High queue depth detected (${queueMetrics.pending} pending jobs)`,
          current: queueMetrics.pending,
        });
      }

      // Build comprehensive health response
      const comprehensiveHealthStatus = {
        status: healthStatus.status,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        details: {
          ...healthStatus.details,
          configuration: {
            planLimits: configService.getPlanLimits('free'),
            retryConfig: configService.getRetryConfig(),
            circuitBreakerConfig: configService.getCircuitBreakerConfig(),
            workerConfig: configService.getWorkerConfig(),
            alertThresholds,
          },
        },
        metrics: {
          queue: queueMetrics,
          errors: {
            total: errorCount,
            recentFiveMinutes: recentErrorCount,
            errorRate: parseFloat(errorRate as string),
          },
          performance: {
            avgLatency: 0, // Can be calculated from metrics collection
          },
        },
        alerts,
        checks: {
          database: {
            status: healthStatus.details.database === 'healthy' ? 'pass' : 'fail',
            message: healthStatus.details.database === 'healthy' ? 'Database is accessible' : 'Database is not accessible',
          },
          queue: {
            status: healthStatus.details.queue === 'healthy' ? 'pass' : 'fail',
            message: `Queue has ${queueMetrics.pending} pending jobs`,
          },
          errorRate: {
            status: parseFloat(errorRate as string) <= alertThresholds.errorRateThreshold ? 'pass' : 'warn',
            message: `Error rate is ${errorRate}%`,
          },
          dlq: {
            status: queueMetrics.dlq <= alertThresholds.dlqAccumulationThreshold ? 'pass' : 'warn',
            message: `DLQ has ${queueMetrics.dlq} jobs`,
          },
        },
      };

      logger.info('HealthCheck', 'GET /health', 'Health check performed', {
        trace_id: traceContext.traceId,
        service: 'HealthCheck',
        status: healthStatus.status,
        queueMetrics,
        errorRate: parseFloat(errorRate as string),
        alertCount: alerts.length,
      });

      // Determine HTTP status code
      let statusCode = 200;
      if (healthStatus.status === 'unhealthy') {
        statusCode = 500;
      } else if (healthStatus.status === 'degraded' || alerts.length > 0) {
        statusCode = 503;
      }

      return NextResponse.json(comprehensiveHealthStatus, { status: statusCode });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('HealthCheck', 'GET /health', 'Health check failed', {
        trace_id: traceContext.traceId,
        service: 'HealthCheck',
        error: errorMessage,
      });

      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          details: {
            error: errorMessage,
            message: 'Health check failed due to an internal error',
          },
          checks: {
            database: { status: 'fail', message: 'Unable to verify database connectivity' },
            queue: { status: 'fail', message: 'Unable to verify queue health' },
          },
        },
        { status: 500 }
      );
    }
  });
}
