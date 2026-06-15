/**
 * Metrics Service - Structured Observability for AFFILIFY Advanced Analytics
 * 
 * Emits structured metrics for monitoring, alerting, and performance tracking.
 * Supports multiple backends: console (for development), Prometheus (for production).
 */

export interface MetricEvent {
  name: string
  value: number
  timestamp: number
  tags: Record<string, string>
  type: 'counter' | 'gauge' | 'histogram'
}

export class MetricsService {
  private static instance: MetricsService
  private metrics: Map<string, MetricEvent[]> = new Map()
  private backend: 'console' | 'prometheus' = 'console'

  private constructor(backend: 'console' | 'prometheus' = 'console') {
    this.backend = backend
  }

  static getInstance(backend?: 'console' | 'prometheus'): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService(backend)
    }
    return MetricsService.instance
  }

  /**
   * Emit a counter metric (increments by 1)
   */
  incrementCounter(name: string, tags: Record<string, string> = {}): void {
    this.emitMetric({
      name,
      value: 1,
      timestamp: Date.now(),
      tags,
      type: 'counter',
    })
  }

  /**
   * Emit a gauge metric (absolute value)
   */
  setGauge(name: string, value: number, tags: Record<string, string> = {}): void {
    this.emitMetric({
      name,
      value,
      timestamp: Date.now(),
      tags,
      type: 'gauge',
    })
  }

  /**
   * Emit a histogram metric (for latency, size, etc.)
   */
  recordHistogram(name: string, value: number, tags: Record<string, string> = {}): void {
    this.emitMetric({
      name,
      value,
      timestamp: Date.now(),
      tags,
      type: 'histogram',
    })
  }

  /**
   * Internal method to emit metric
   */
  private emitMetric(event: MetricEvent): void {
    if (this.backend === 'console') {
      this.emitToConsole(event)
    } else if (this.backend === 'prometheus') {
      this.emitToPrometheus(event)
    }

    // Store metric in memory for aggregation
    if (!this.metrics.has(event.name)) {
      this.metrics.set(event.name, [])
    }
    this.metrics.get(event.name)!.push(event)
  }

  /**
   * Emit metric to console (structured JSON)
   */
  private emitToConsole(event: MetricEvent): void {
    const logEntry = {
      level: 'METRIC',
      timestamp: new Date(event.timestamp).toISOString(),
      metric: event.name,
      value: event.value,
      type: event.type,
      tags: event.tags,
    }
    console.log(JSON.stringify(logEntry))
  }

  /**
   * Emit metric to Prometheus (placeholder for future implementation)
   */
  private emitToPrometheus(event: MetricEvent): void {
    // TODO: Integrate with Prometheus client library
    // For now, also log to console
    this.emitToConsole(event)
  }

  /**
   * Get all metrics (for testing and debugging)
   */
  getMetrics(): Record<string, MetricEvent[]> {
    const result: Record<string, MetricEvent[]> = {}
    this.metrics.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  /**
   * Clear all metrics (for testing)
   */
  clearMetrics(): void {
    this.metrics.clear()
  }
}

/**
 * Convenience functions for common metrics
 */
export const metrics = {
  // Tenant Isolation Metrics
  tenantIsolationViolation: (traceId: string) => {
    MetricsService.getInstance().incrementCounter('affilify_tenant_isolation_violations_total', {
      traceId,
    })
  },

  // Query Guard Metrics
  queryGuardViolation: (traceId: string) => {
    MetricsService.getInstance().incrementCounter('affilify_query_guard_violations_total', {
      traceId,
    })
  },

  // Quota Metrics
  quotaDeductionAttempt: (tier: string, traceId: string) => {
    MetricsService.getInstance().incrementCounter('affilify_quota_deductions_attempted_total', {
      tier,
      traceId,
    })
  },

  quotaDeductionSuccess: (tier: string, traceId: string) => {
    MetricsService.getInstance().incrementCounter('affilify_quota_deductions_success_total', {
      tier,
      traceId,
    })
  },

  quotaDeductionFailure: (tier: string, reason: string, traceId: string) => {
    MetricsService.getInstance().incrementCounter('affilify_quota_deductions_failed_total', {
      tier,
      reason,
      traceId,
    })
  },

  quotaExceeded: (tier: string, traceId: string) => {
    MetricsService.getInstance().incrementCounter('affilify_quota_exceeded_total', {
      tier,
      traceId,
    })
  },

  // API Metrics
  apiRequest: (route: string, method: string, statusCode: number, durationMs: number) => {
    MetricsService.getInstance().incrementCounter('affilify_api_requests_total', {
      route,
      method,
      status_code: statusCode.toString(),
    })
    MetricsService.getInstance().recordHistogram('affilify_api_request_duration_seconds', durationMs / 1000, {
      route,
      method,
    })
  },

  apiError: (route: string, method: string, errorCode: string, traceId: string) => {
    MetricsService.getInstance().incrementCounter('affilify_api_errors_total', {
      route,
      method,
      error_code: errorCode,
      traceId,
    })
  },

  // Database Metrics
  dbQuery: (operation: string, durationMs: number, tenantId: string) => {
    MetricsService.getInstance().recordHistogram('affilify_db_query_duration_seconds', durationMs / 1000, {
      operation,
      tenant_id: tenantId,
    })
  },

  dbError: (operation: string, errorCode: string, tenantId: string) => {
    MetricsService.getInstance().incrementCounter('affilify_db_errors_total', {
      operation,
      error_code: errorCode,
      tenant_id: tenantId,
    })
  },

  // Analytics Worker Metrics
  analyticsEventProcessed: (eventType: string, tenantId: string) => {
    MetricsService.getInstance().incrementCounter('affilify_analytics_events_processed_total', {
      event_type: eventType,
      tenant_id: tenantId,
    })
  },

  analyticsEventFailed: (eventType: string, reason: string, tenantId: string) => {
    MetricsService.getInstance().incrementCounter('affilify_analytics_events_failed_total', {
      event_type: eventType,
      reason,
      tenant_id: tenantId,
    })
  },

  analyticsEventDLQ: (eventType: string, tenantId: string) => {
    MetricsService.getInstance().incrementCounter('affilify_analytics_events_dlq_total', {
      event_type: eventType,
      tenant_id: tenantId,
    })
  },
}
