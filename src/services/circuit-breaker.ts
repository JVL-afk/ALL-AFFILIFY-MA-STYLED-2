import { logger } from '@/lib/debug-logger';

/**
 * Circuit Breaker Pattern Implementation
 * 
 * Prevents cascading failures by monitoring the health of external services
 * and failing fast when they become unavailable.
 * 
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Service is failing, requests are rejected immediately
 * - HALF_OPEN: Testing if service has recovered, limited requests allowed
 */

export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of consecutive failures before opening
  successThreshold: number; // Number of consecutive successes before closing from half-open
  timeout: number; // Milliseconds to wait before transitioning from open to half-open
  monitoringWindow: number; // Milliseconds for tracking failure rate
}

export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number = 0;
  private config: CircuitBreakerConfig;
  private name: string;

  constructor(name: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.name = name;
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      successThreshold: config.successThreshold || 2,
      timeout: config.timeout || 60000, // 1 minute
      monitoringWindow: config.monitoringWindow || 120000, // 2 minutes
    };
  }

  /**
   * Execute a function with circuit breaker protection.
   * If the circuit is open, the function is not executed and an error is thrown.
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitBreakerState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.config.timeout) {
        // Transition to half-open state
        this.state = CircuitBreakerState.HALF_OPEN;
        this.successCount = 0;
        logger.info('CircuitBreaker', 'execute', `Circuit breaker ${this.name} transitioned to HALF_OPEN`, { name: this.name });
      } else {
        // Circuit is still open, reject the request
        logger.warn('CircuitBreaker', 'execute', `Circuit breaker ${this.name} is OPEN, rejecting request`, { name: this.name });
        throw new Error(`Circuit breaker ${this.name} is OPEN`);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Record a successful operation.
   */
  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = CircuitBreakerState.CLOSED;
        this.successCount = 0;
        logger.info('CircuitBreaker', 'onSuccess', `Circuit breaker ${this.name} transitioned to CLOSED`, { name: this.name });
      }
    }
  }

  /**
   * Record a failed operation.
   */
  private onFailure(): void {
    this.lastFailureTime = Date.now();
    this.failureCount++;
    this.successCount = 0;

    logger.warn('CircuitBreaker', 'onFailure', `Circuit breaker ${this.name} recorded failure`, {
      name: this.name,
      failureCount: this.failureCount,
      threshold: this.config.failureThreshold,
    });

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitBreakerState.OPEN;
      logger.error('CircuitBreaker', 'onFailure', `Circuit breaker ${this.name} transitioned to OPEN`, {
        name: this.name,
        failureCount: this.failureCount,
      });
    }
  }

  /**
   * Get the current state of the circuit breaker.
   */
  getState(): CircuitBreakerState {
    return this.state;
  }

  /**
   * Reset the circuit breaker to closed state (admin function).
   */
  reset(): void {
    this.state = CircuitBreakerState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
    logger.info('CircuitBreaker', 'reset', `Circuit breaker ${this.name} reset to CLOSED`, { name: this.name });
  }
}
