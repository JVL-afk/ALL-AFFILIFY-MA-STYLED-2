/**
 * Trace Context Manager
 * Uses AsyncLocalStorage to automatically propagate trace IDs across async boundaries.
 *
 * This ensures that all operations within a request context share the same trace ID,
 * enabling end-to-end request tracing without manual propagation.
 */

import { AsyncLocalStorage } from 'async_hooks';
import { logger } from './debug-logger';

/**
 * Represents the trace context for a request.
 */
export interface TraceContext {
  traceId: string;
  spanId: string;
  userId?: string;
  campaignId?: string;
  subscriberId?: string;
  startTime: number;
}

/**
 * AsyncLocalStorage instance for trace context.
 */
const traceContextStorage = new AsyncLocalStorage<TraceContext>();

/**
 * Initialize a new trace context for a request.
 * Should be called at the beginning of each request.
 *
 * @param userId - Optional user ID
 * @param campaignId - Optional campaign ID
 * @param subscriberId - Optional subscriber ID
 * @returns The created trace context
 */
export function initializeTraceContext(
  userId?: string,
  campaignId?: string,
  subscriberId?: string
): TraceContext {
  const traceContext: TraceContext = {
    traceId: crypto.randomUUID(),
    spanId: crypto.randomUUID(),
    userId,
    campaignId,
    subscriberId,
    startTime: Date.now(),
  };

  logger.info('TraceContextManager', 'initializeTraceContext', 'Trace context initialized', {
    trace_id: traceContext.traceId,
    span_id: traceContext.spanId,
    user_id: userId,
    campaign_id: campaignId,
    subscriber_id: subscriberId,
  });

  return traceContext;
}

/**
 * Run a function within a trace context.
 * The trace context will be automatically available to all async operations within the function.
 *
 * @param traceContext - The trace context
 * @param fn - The function to run
 * @returns The result of the function
 */
export async function runWithTraceContext<T>(
  traceContext: TraceContext,
  fn: () => Promise<T>
): Promise<T> {
  return traceContextStorage.run(traceContext, fn);
}

/**
 * Get the current trace context.
 * Returns undefined if no trace context is active.
 *
 * @returns The current trace context or undefined
 */
export function getTraceContext(): TraceContext | undefined {
  return traceContextStorage.getStore();
}

/**
 * Get the current trace ID.
 * Returns a new UUID if no trace context is active (fallback).
 *
 * @returns The current trace ID
 */
export function getTraceId(): string {
  const context = traceContextStorage.getStore();
  return context?.traceId || crypto.randomUUID();
}

/**
 * Get the current span ID.
 * Returns a new UUID if no trace context is active (fallback).
 *
 * @returns The current span ID
 */
export function getSpanId(): string {
  const context = traceContextStorage.getStore();
  return context?.spanId || crypto.randomUUID();
}

/**
 * Get the current user ID from the trace context.
 *
 * @returns The current user ID or undefined
 */
export function getUserIdFromContext(): string | undefined {
  return traceContextStorage.getStore()?.userId;
}

/**
 * Get the current campaign ID from the trace context.
 *
 * @returns The current campaign ID or undefined
 */
export function getCampaignIdFromContext(): string | undefined {
  return traceContextStorage.getStore()?.campaignId;
}

/**
 * Get the current subscriber ID from the trace context.
 *
 * @returns The current subscriber ID or undefined
 */
export function getSubscriberIdFromContext(): string | undefined {
  return traceContextStorage.getStore()?.subscriberId;
}

/**
 * Update the trace context with additional information.
 * This is useful for adding context as the request progresses.
 *
 * @param updates - Partial trace context updates
 */
export function updateTraceContext(updates: Partial<Omit<TraceContext, 'traceId' | 'startTime'>>): void {
  const context = traceContextStorage.getStore();
  if (!context) {
    logger.warn('TraceContextManager', 'updateTraceContext', 'No active trace context to update', {});
    return;
  }

  Object.assign(context, updates);
  logger.debug('TraceContextManager', 'updateTraceContext', 'Trace context updated', {
    trace_id: context.traceId,
    updates,
  });
}

/**
 * Get the elapsed time since the trace context was created (in milliseconds).
 *
 * @returns The elapsed time in milliseconds
 */
export function getElapsedTime(): number {
  const context = traceContextStorage.getStore();
  if (!context) {
    return 0;
  }
  return Date.now() - context.startTime;
}

/**
 * Create a child span within the current trace context.
 * This is useful for tracking nested operations.
 *
 * @returns A new span ID for the child operation
 */
export function createChildSpan(): string {
  const context = traceContextStorage.getStore();
  if (!context) {
    logger.warn('TraceContextManager', 'createChildSpan', 'No active trace context for child span', {});
    return crypto.randomUUID();
  }

  const childSpanId = crypto.randomUUID();
  logger.debug('TraceContextManager', 'createChildSpan', 'Child span created', {
    trace_id: context.traceId,
    parent_span_id: context.spanId,
    child_span_id: childSpanId,
  });

  return childSpanId;
}

/**
 * Middleware for Express/Next.js to initialize trace context for each request.
 * Should be added at the top of the middleware stack.
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
export function traceContextMiddleware(req: any, res: any, next: any): void {
  const traceContext = initializeTraceContext();
  runWithTraceContext(traceContext, () => {
    // Attach trace context to request for easy access
    req.traceContext = traceContext;
    return new Promise<void>((resolve) => {
      res.on('finish', () => {
        const elapsed = getElapsedTime();
        logger.info('TraceContextManager', 'traceContextMiddleware', 'Request completed', {
          trace_id: traceContext.traceId,
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          elapsedMs: elapsed,
        });
        resolve();
      });
      next();
    });
  });
}
