import { Db } from 'mongodb';
import { logger } from '@/lib/debug-logger';

/**
 * Observability Service
 * 
 * Tracks metrics and events for monitoring and observability:
 * - Email send metrics (success, failure, latency)
 * - Queue metrics (pending, processing, completed, DLQ)
 * - Circuit breaker state changes
 * - Quota enforcement events
 * - Error tracking
 */

export interface MetricEvent {
  timestamp: Date;
  service: string;
  metric: string;
  value: number;
  tags?: Record<string, string>;
}

export interface ErrorEvent {
  timestamp: Date;
  service: string;
  error: string;
  context?: Record<string, any>;
}

export class ObservabilityService {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * Record a retry attempt.
   */
  async recordRetryAttempt(service: string, attempt: number, success: boolean): Promise<void> {
    await this.recordMetric({
      service,
      metric: success ? 'retry_success' : 'retry_failure',
      value: 1,
      tags: { attempt: attempt.toString() },
    });
  }

  /**
   * Record a circuit breaker state change.
   */
  async recordCircuitBreakerStateChange(service: string, newState: string): Promise<void> {
    await this.recordMetric({
      service,
      metric: 'circuit_breaker_state_change',
      value: 1,
      tags: { newState },
    });
  }

  /**
   * Record an input validation failure.
   */
  async recordValidationFailure(service: string, validationType: string): Promise<void> {
    await this.recordMetric({
      service,
      metric: 'validation_failure',
      value: 1,
      tags: { validationType },
    });
  }

  /**
   * Record a quota enforcement event.
   */
  async recordQuotaEvent(service: string, allowed: boolean, remaining: number): Promise<void> {
    await this.recordMetric({
      service,
      metric: allowed ? 'quota_allowed' : 'quota_exceeded',
      value: 1,
      tags: { remaining: remaining.toString() },
    });
  }

  /**
   * Record a tenant isolation violation attempt.
   */
  async recordTenantIsolationViolation(service: string, attemptedUserId: string): Promise<void> {
    await this.recordMetric({
      service,
      metric: 'tenant_isolation_violation',
      value: 1,
      tags: { attemptedUserId },
    });
  }

  /**
   * Get recent metrics for a service.
   */
  async getRecentMetrics(service: string, minutesBack: number = 5): Promise<MetricEvent[]> {
    const cutoffTime = new Date(Date.now() - minutesBack * 60 * 1000);
    return this.db.collection('metrics').find({
      service,
      timestamp: { $gte: cutoffTime },
    }).toArray();
  }

  /**
   * Record a metric event.
   */
  async recordMetric(metric: Omit<MetricEvent, 'timestamp'>): Promise<void> {
    try {
      await this.db.collection('metrics').insertOne({
        ...metric,
        timestamp: new Date(),
      });

      logger.debug('ObservabilityService', 'recordMetric', 'Metric recorded', {
        service: metric.service,
        metric: metric.metric,
        value: metric.value,
      });
    } catch (error) {
      logger.error('ObservabilityService', 'recordMetric', 'Failed to record metric', {
        error: (error as Error).message,
        metric: metric.metric,
      });
    }
  }

  /**
   * Record an error event.
   */
  async recordError(error: Omit<ErrorEvent, 'timestamp'>): Promise<void> {
    try {
      await this.db.collection('error_events').insertOne({
        ...error,
        timestamp: new Date(),
      });

      logger.debug('ObservabilityService', 'recordError', 'Error event recorded', {
        service: error.service,
        error: error.error,
      });
    } catch (err) {
      logger.error('ObservabilityService', 'recordError', 'Failed to record error event', {
        error: (err as Error).message,
      });
    }
  }

  /**
   * Get email metrics for a time range.
   */
  async getEmailMetrics(startTime: Date, endTime: Date): Promise<{
    totalSent: number;
    totalFailed: number;
    averageLatency: number;
    successRate: number;
  }> {
    const metrics = await this.db
      .collection('metrics')
      .find({
        service: 'EmailSendingService',
        timestamp: { $gte: startTime, $lte: endTime },
      })
      .toArray();

    const sent = metrics.filter((m) => m.metric === 'email_sent').length;
    const failed = metrics.filter((m) => m.metric === 'email_failed').length;
    const latencies = metrics
      .filter((m) => m.metric === 'email_latency')
      .map((m) => m.value);

    const averageLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
    const successRate = sent + failed > 0 ? (sent / (sent + failed)) * 100 : 0;

    return {
      totalSent: sent,
      totalFailed: failed,
      averageLatency,
      successRate,
    };
  }

  /**
   * Get queue metrics.
   */
  async getQueueMetrics(): Promise<{
    pending: number;
    processing: number;
    completed: number;
    dlq: number;
  }> {
    const stats = await this.db.collection('email_jobs').aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]).toArray();

    const result = {
      pending: 0,
      processing: 0,
      completed: 0,
      dlq: 0,
    };

    for (const stat of stats) {
      if (stat._id === 'PENDING') result.pending = stat.count;
      if (stat._id === 'PROCESSING') result.processing = stat.count;
      if (stat._id === 'COMPLETED') result.completed = stat.count;
      if (stat._id === 'DLQ') result.dlq = stat.count;
    }

    return result;
  }

  /**
   * Get error metrics for a time range.
   */
  async getErrorMetrics(startTime: Date, endTime: Date): Promise<{
    totalErrors: number;
    errorsByService: Record<string, number>;
    topErrors: Array<{ error: string; count: number }>;
  }> {
    const errors = await this.db
      .collection('error_events')
      .find({
        timestamp: { $gte: startTime, $lte: endTime },
      })
      .toArray();

    const errorsByService: Record<string, number> = {};
    const errorCounts: Record<string, number> = {};

    for (const error of errors) {
      errorsByService[error.service] = (errorsByService[error.service] || 0) + 1;
      errorCounts[error.error] = (errorCounts[error.error] || 0) + 1;
    }

    const topErrors = Object.entries(errorCounts)
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalErrors: errors.length,
      errorsByService,
      topErrors,
    };
  }

  /**
   * Get health status of the system.
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, any>;
  }> {
    try {
      // Check database connectivity
      const dbHealthy = await this.checkDatabaseHealth();

      // Check queue health
      const queueMetrics = await this.getQueueMetrics();
      const queueHealthy = queueMetrics.dlq < 100; // Unhealthy if more than 100 jobs in DLQ

      // Check error rate
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const emailMetrics = await this.getEmailMetrics(oneHourAgo, now);
      const errorRateHealthy = emailMetrics.successRate > 95; // Unhealthy if success rate < 95%

      const allHealthy = dbHealthy && queueHealthy && errorRateHealthy;
      const anyUnhealthy = !dbHealthy || !queueHealthy || !errorRateHealthy;

      return {
        status: allHealthy ? 'healthy' : anyUnhealthy ? 'unhealthy' : 'degraded',
        details: {
          database: dbHealthy ? 'healthy' : 'unhealthy',
          queue: queueHealthy ? 'healthy' : 'unhealthy',
          errorRate: errorRateHealthy ? 'healthy' : 'unhealthy',
          queueMetrics,
          emailMetrics,
        },
      };
    } catch (error) {
      logger.error('ObservabilityService', 'getHealthStatus', 'Failed to get health status', {
        error: (error as Error).message,
      });

      return {
        status: 'unhealthy',
        details: {
          error: (error as Error).message,
        },
      };
    }
  }

  /**
   * Check database connectivity.
   */
  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      const result = await this.db.admin().ping();
      return result.ok === 1;
    } catch (error) {
      logger.error('ObservabilityService', 'checkDatabaseHealth', 'Database health check failed', {
        error: (error as Error).message,
      });
      return false;
    }
  }
}
