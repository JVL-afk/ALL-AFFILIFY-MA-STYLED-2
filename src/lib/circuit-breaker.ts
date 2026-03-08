import { logger } from './debug-logger';

/**
 * Circuit Breaker Pattern Implementation
 * 
 * Provides fault tolerance by preventing cascading failures.
 * States: CLOSED (normal) -> OPEN (failing) -> HALF_OPEN (recovering) -> CLOSED
 */

export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening
  successThreshold: number; // Number of successes before closing (in half-open state)
  timeout: number; // Time in ms before transitioning from OPEN to HALF_OPEN
  name: string;
}

export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number = 0;
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>, traceId?: string): Promise<T> {
    logger.debug('CircuitBreaker', 'execute', `Executing with circuit breaker: ${this.config.name}`, {
      trace_id: traceId,
      state: this.state,
      failureCount: this.failureCount,
    });

    // Check if circuit should transition from OPEN to HALF_OPEN
    if (this.state === CircuitBreakerState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.config.timeout) {
        logger.info('CircuitBreaker', 'execute', `Circuit breaker transitioning to HALF_OPEN: ${this.config.name}`, {
          trace_id: traceId,
        });
        this.state = CircuitBreakerState.HALF_OPEN;
        this.successCount = 0;
      } else {
        logger.warn('CircuitBreaker', 'execute', `Circuit breaker is OPEN: ${this.config.name}`, {
          trace_id: traceId,
        });
        throw new Error(`Circuit breaker is OPEN for ${this.config.name}`);
      }
    }

    try {
      const result = await fn();
      this.onSuccess(traceId);
      return result;
    } catch (error) {
      this.onFailure(traceId);
      throw error;
    }
  }

  /**
   * Handle successful execution
   */
  private onSuccess(traceId?: string): void {
    logger.debug('CircuitBreaker', 'onSuccess', `Success recorded for: ${this.config.name}`, {
      trace_id: traceId,
      state: this.state,
    });

    this.failureCount = 0;

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.successCount++;

      if (this.successCount >= this.config.successThreshold) {
        logger.info('CircuitBreaker', 'onSuccess', `Circuit breaker transitioning to CLOSED: ${this.config.name}`, {
          trace_id: traceId,
        });
        this.state = CircuitBreakerState.CLOSED;
        this.successCount = 0;
      }
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(traceId?: string): void {
    logger.warn('CircuitBreaker', 'onFailure', `Failure recorded for: ${this.config.name}`, {
      trace_id: traceId,
      state: this.state,
      failureCount: this.failureCount + 1,
    });

    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      logger.warn('CircuitBreaker', 'onFailure', `Circuit breaker transitioning to OPEN (from HALF_OPEN): ${this.config.name}`, {
        trace_id: traceId,
      });
      this.state = CircuitBreakerState.OPEN;
    } else if (this.state === CircuitBreakerState.CLOSED && this.failureCount >= this.config.failureThreshold) {
      logger.error('CircuitBreaker', 'onFailure', `Circuit breaker transitioning to OPEN: ${this.config.name}`, {
        trace_id: traceId,
        failureCount: this.failureCount,
        threshold: this.config.failureThreshold,
      });
      this.state = CircuitBreakerState.OPEN;
    }
  }

  /**
   * Get the current state of the circuit breaker
   */
  getState(): CircuitBreakerState {
    return this.state;
  }

  /**
   * Reset the circuit breaker to CLOSED state
   */
  reset(traceId?: string): void {
    logger.info('CircuitBreaker', 'reset', `Resetting circuit breaker: ${this.config.name}`, {
      trace_id: traceId,
    });
    this.state = CircuitBreakerState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelayMs: number = 100,
  maxDelayMs: number = 10000,
  traceId?: string
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      logger.debug('RetryWithBackoff', 'retryWithBackoff', `Attempt ${attempt} of ${maxAttempts}`, {
        trace_id: traceId,
      });
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts) {
        const delayMs = Math.min(initialDelayMs * Math.pow(2, attempt - 1), maxDelayMs);
        logger.warn('RetryWithBackoff', 'retryWithBackoff', `Attempt ${attempt} failed, retrying in ${delayMs}ms`, {
          trace_id: traceId,
          error: (error as Error).message,
        });
        await sleep(delayMs);
      } else {
        logger.error('RetryWithBackoff', 'retryWithBackoff', `All ${maxAttempts} attempts failed`, {
          trace_id: traceId,
          error: (error as Error).message,
        });
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

/**
 * Sleep utility function
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Backpressure handler for queue depth monitoring
 */
export class BackpressureHandler {
  private queueDepth: number = 0;
  private maxQueueDepth: number;
  private rejectionThreshold: number; // Percentage of max depth at which to start rejecting

  constructor(maxQueueDepth: number, rejectionThreshold: number = 0.8) {
    this.maxQueueDepth = maxQueueDepth;
    this.rejectionThreshold = rejectionThreshold;
  }

  /**
   * Enqueue an item and check for backpressure
   */
  enqueue(traceId?: string): { allowed: boolean; queueDepth: number } {
    this.queueDepth++;

    const rejectionPoint = this.maxQueueDepth * this.rejectionThreshold;

    if (this.queueDepth > rejectionPoint) {
      logger.warn('BackpressureHandler', 'enqueue', 'Backpressure threshold reached', {
        trace_id: traceId,
        queueDepth: this.queueDepth,
        maxQueueDepth: this.maxQueueDepth,
        rejectionPoint,
      });

      return {
        allowed: this.queueDepth <= this.maxQueueDepth,
        queueDepth: this.queueDepth,
      };
    }

    return {
      allowed: true,
      queueDepth: this.queueDepth,
    };
  }

  /**
   * Dequeue an item
   */
  dequeue(traceId?: string): void {
    if (this.queueDepth > 0) {
      this.queueDepth--;
    }

    logger.debug('BackpressureHandler', 'dequeue', 'Item dequeued', {
      trace_id: traceId,
      queueDepth: this.queueDepth,
    });
  }

  /**
   * Get the current queue depth
   */
  getQueueDepth(): number {
    return this.queueDepth;
  }

  /**
   * Reset the queue depth
   */
  reset(traceId?: string): void {
    logger.info('BackpressureHandler', 'reset', 'Backpressure handler reset', {
      trace_id: traceId,
    });
    this.queueDepth = 0;
  }
}
