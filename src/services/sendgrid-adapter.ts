import { CircuitBreaker } from '@/services/circuit-breaker';
import { RetryService } from '@/services/retry-service';
import { logger } from '@/lib/debug-logger';
import sgMail from '@sendgrid/mail';

/**
 * SendGrid Adapter with Circuit Breaker and Retry Logic
 * 
 * Wraps SendGrid API calls with:
 * - Circuit breaker for fault tolerance
 * - Retry logic with exponential backoff
 * - Structured logging and error handling
 * - Timeout protection
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class SendGridAdapter {
  private circuitBreaker: CircuitBreaker;
  private retryService: RetryService;
  private initialized: boolean = false;
  private timeout: number = 30000; // 30 seconds

  constructor() {
    this.circuitBreaker = new CircuitBreaker('SendGrid', {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 60000, // 1 minute
    });

    this.retryService = new RetryService('SendGrid', {
      maxRetries: 3,
      baseDelay: 100,
      maxDelay: 10000,
      jitter: 50,
    });

    this.initialize();
  }

  /**
   * Initialize SendGrid with API key.
   */
  private initialize(): void {
    if (!process.env.SENDGRID_API_KEY) {
      logger.error('SendGridAdapter', 'initialize', 'SendGrid API key not configured', {
        error: 'SENDGRID_API_KEY is missing',
      });
      return;
    }

    if (!process.env.SENDGRID_FROM_EMAIL) {
      logger.error('SendGridAdapter', 'initialize', 'SendGrid FROM email not configured', {
        error: 'SENDGRID_FROM_EMAIL is missing',
      });
      return;
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.initialized = true;
    logger.info('SendGridAdapter', 'initialize', 'SendGrid adapter initialized successfully', {});
  }

  /**
   * Send an email with circuit breaker and retry protection.
   */
  async sendEmail(message: EmailMessage): Promise<SendResult> {
    if (!this.initialized) {
      logger.error('SendGridAdapter', 'sendEmail', 'SendGrid adapter not initialized', {
        to: message.to,
        subject: message.subject,
      });
      return {
        success: false,
        error: 'SendGrid adapter not initialized',
      };
    }

    try {
      const result = await this.circuitBreaker.execute(() =>
        this.retryService.execute(
          () => this.sendEmailWithTimeout(message),
          (error) => this.isRetryableError(error)
        )
      );

      logger.info('SendGridAdapter', 'sendEmail', 'Email sent successfully', {
        to: message.to,
        subject: message.subject,
        messageId: result,
      });

      return {
        success: true,
        messageId: result,
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      logger.error('SendGridAdapter', 'sendEmail', 'Failed to send email', {
        to: message.to,
        subject: message.subject,
        error: errorMessage,
        circuitBreakerState: this.circuitBreaker.getState(),
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Send email with timeout protection.
   */
  private sendEmailWithTimeout(message: EmailMessage): Promise<string> {
    return Promise.race([
      this.sendEmailInternal(message),
      this.createTimeoutPromise(this.timeout),
    ]);
  }

  /**
   * Internal email sending logic.
   */
  private async sendEmailInternal(message: EmailMessage): Promise<string> {
    const msg = {
      to: message.to,
      from: message.from || (process.env.SENDGRID_FROM_EMAIL as string),
      subject: message.subject,
      text: message.text || this.stripHtml(message.html),
      html: message.html,
      replyTo: message.replyTo,
      headers: message.headers,
    };

    const response = await sgMail.send(msg);

    // Extract message ID from response headers
    const messageId = response[0].headers['x-message-id'] || response[0].headers['x-sendgrid-message-id'] || 'unknown';
    return messageId as string;
  }

  /**
   * Check if an error is retryable.
   */
  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();

    // Retry on timeout and network errors
    if (message.includes('timeout') || message.includes('econnrefused') || message.includes('econnreset')) {
      return true;
    }

    // Retry on 5xx errors
    if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('504')) {
      return true;
    }

    // Do not retry on 4xx errors (client errors)
    if (message.includes('400') || message.includes('401') || message.includes('403') || message.includes('404')) {
      return false;
    }

    // Default to retryable for unknown errors
    return true;
  }

  /**
   * Create a timeout promise that rejects after a given delay.
   */
  private createTimeoutPromise(ms: number): Promise<string> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`SendGrid request timeout after ${ms}ms`));
      }, ms);
    });
  }

  /**
   * Strip HTML tags for plain text content.
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '');
  }

  /**
   * Get the current state of the circuit breaker.
   */
  getCircuitBreakerState(): string {
    return this.circuitBreaker.getState();
  }

  /**
   * Reset the circuit breaker (admin function).
   */
  resetCircuitBreaker(): void {
    this.circuitBreaker.reset();
    logger.info('SendGridAdapter', 'resetCircuitBreaker', 'SendGrid circuit breaker reset', {});
  }
}

// Export singleton instance
export const sendGridAdapter = new SendGridAdapter();
