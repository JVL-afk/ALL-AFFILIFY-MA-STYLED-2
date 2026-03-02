import { logger } from '@/lib/debug-logger';
import { configService } from './config-service';

/**
 * Retry Service with Exponential Backoff
 * 
 * Implements retry logic with exponential backoff and jitter to handle
 * transient failures in external API calls.
 * 
 * Formula: delay = min(maxDelay, baseDelay * (2^n) + random_jitter)
 */

export interface RetryConfig {
  maxRetries: number; // Maximum number of retry attempts
  baseDelay: number; // Initial delay in milliseconds
  maxDelay: number; // Maximum delay between retries in milliseconds
  jitter: number; // Random jitter in milliseconds (0-jitter)
  backoffMultiplier: number; // Exponential backoff multiplier
}

export class RetryService {
  private config: RetryConfig;
  private name: string;

  constructor(name: string, config: Partial<RetryConfig> = {}) {
    this.name = name;
    // Load defaults from ConfigService, allow override via config parameter
    const dynamicConfig = configService.getRetryConfig();
    this.config = {
      maxRetries: config.maxRetries ?? dynamicConfig.maxRetries,
      baseDelay: config.baseDelay ?? dynamicConfig.baseDelayMs,
      maxDelay: config.maxDelay ?? dynamicConfig.maxDelayMs,
      jitter: config.jitter ?? dynamicConfig.jitterMs,
      backoffMultiplier: config.backoffMultiplier || 2,
    };
  }

  /**
   * Execute a function with retry logic.
   * If the function fails, it will be retried with exponential backoff.
   */
  async execute<T>(
    fn: () => Promise<T>,
    isRetryable: (error: Error) => boolean = () => true
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const result = await fn();
        if (attempt > 0) {
          logger.info('RetryService', 'execute', `${this.name} succeeded after ${attempt} retries`, {
            name: this.name,
            attempts: attempt + 1,
          });
        }
        return result;
      } catch (error) {
        lastError = error as Error;

        // Check if error is retryable
        if (!isRetryable(lastError)) {
          logger.warn('RetryService', 'execute', `${this.name} failed with non-retryable error`, {
            name: this.name,
            error: lastError.message,
            attempt: attempt + 1,
          });
          throw lastError;
        }

        // If this was the last attempt, throw the error
        if (attempt === this.config.maxRetries) {
          logger.error('RetryService', 'execute', `${this.name} failed after ${this.config.maxRetries} retries`, {
            name: this.name,
            error: lastError.message,
            attempts: attempt + 1,
          });
          throw lastError;
        }

        // Calculate delay for next retry
        const delay = this.calculateDelay(attempt);
        logger.warn('RetryService', 'execute', `${this.name} failed, retrying in ${delay}ms`, {
          name: this.name,
          error: lastError.message,
          attempt: attempt + 1,
          nextRetryDelay: delay,
        });

        // Wait before retrying
        await this.sleep(delay);
      }
    }

    // This should never be reached, but just in case
    throw lastError || new Error(`${this.name} failed after ${this.config.maxRetries} retries`);
  }

  /**
   * Calculate delay for exponential backoff with jitter.
   * Formula: delay = min(maxDelay, baseDelay * (2^n) + random_jitter)
   */
  private calculateDelay(attempt: number): number {
    const exponentialDelay = this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt);
    const jitterValue = Math.random() * this.config.jitter;
    const delay = Math.min(this.config.maxDelay, exponentialDelay + jitterValue);
    return Math.floor(delay);
  }

  /**
   * Sleep for a given number of milliseconds.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
