/**
 * Dynamic Configuration Service
 * Centralizes all configuration settings, allowing for dynamic adjustment without code changes.
 *
 * Configuration is loaded from environment variables with sensible defaults.
 */

import { logger } from '../lib/debug-logger';

/**
 * Represents plan-specific quota limits.
 */
export interface PlanLimits {
  emailsPerMonth: number;
  emailsPerDay: number;
  maxRecipientsPerSend: number;
  maxCampaignsPerMonth: number;
}

/**
 * Represents retry configuration.
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterMs: number;
}

/**
 * Represents circuit breaker configuration.
 */
export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeoutMs: number;
}

/**
 * Represents worker configuration.
 */
export interface WorkerConfig {
  batchSize: number;
  pollIntervalMs: number;
  maxConcurrentJobs: number;
}

/**
 * Represents alert threshold configuration.
 */
export interface AlertThresholds {
  errorRateThreshold: number; // percentage
  dlqAccumulationThreshold: number; // number of jobs
  circuitBreakerOpenThreshold: number; // number of consecutive failures
  quotaExceededThreshold: number; // percentage of quota used
}

/**
 * Central configuration service.
 */
export class ConfigService {
  private static instance: ConfigService;

  // Plan limits
  private planLimits: Record<string, PlanLimits>;

  // Retry configuration
  private retryConfig: RetryConfig;

  // Circuit breaker configuration
  private circuitBreakerConfig: CircuitBreakerConfig;

  // Worker configuration
  private workerConfig: WorkerConfig;

  // Alert thresholds
  private alertThresholds: AlertThresholds;

  // Feature flags
  private featureFlags: Record<string, boolean>;

  private constructor() {
    this.planLimits = this.loadPlanLimits();
    this.retryConfig = this.loadRetryConfig();
    this.circuitBreakerConfig = this.loadCircuitBreakerConfig();
    this.workerConfig = this.loadWorkerConfig();
    this.alertThresholds = this.loadAlertThresholds();
    this.featureFlags = this.loadFeatureFlags();

    logger.info('Configuration service initialized', {
      service: 'ConfigService',
      component: 'constructor',
      action: 'Configuration loaded',
      message: 'Configuration service initialized with environment settings',
      details: {
        planLimits: this.planLimits,
        retryConfig: this.retryConfig,
        circuitBreakerConfig: this.circuitBreakerConfig,
        workerConfig: this.workerConfig,
        alertThresholds: this.alertThresholds,
      },
    });
  }

  /**
   * Get singleton instance of ConfigService.
   */
  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Load plan limits from environment variables.
   */
  private loadPlanLimits(): Record<string, PlanLimits> {
    return {
      free: {
        emailsPerMonth: parseInt(process.env.PLAN_FREE_EMAILS_PER_MONTH || '1000', 10),
        emailsPerDay: parseInt(process.env.PLAN_FREE_EMAILS_PER_DAY || '100', 10),
        maxRecipientsPerSend: parseInt(process.env.PLAN_FREE_MAX_RECIPIENTS || '100', 10),
        maxCampaignsPerMonth: parseInt(process.env.PLAN_FREE_MAX_CAMPAIGNS || '10', 10),
      },
      pro: {
        emailsPerMonth: parseInt(process.env.PLAN_PRO_EMAILS_PER_MONTH || '100000', 10),
        emailsPerDay: parseInt(process.env.PLAN_PRO_EMAILS_PER_DAY || '5000', 10),
        maxRecipientsPerSend: parseInt(process.env.PLAN_PRO_MAX_RECIPIENTS || '10000', 10),
        maxCampaignsPerMonth: parseInt(process.env.PLAN_PRO_MAX_CAMPAIGNS || '100', 10),
      },
      enterprise: {
        emailsPerMonth: parseInt(process.env.PLAN_ENTERPRISE_EMAILS_PER_MONTH || '10000000', 10),
        emailsPerDay: parseInt(process.env.PLAN_ENTERPRISE_EMAILS_PER_DAY || '500000', 10),
        maxRecipientsPerSend: parseInt(process.env.PLAN_ENTERPRISE_MAX_RECIPIENTS || '1000000', 10),
        maxCampaignsPerMonth: parseInt(process.env.PLAN_ENTERPRISE_MAX_CAMPAIGNS || '10000', 10),
      },
    };
  }

  /**
   * Load retry configuration from environment variables.
   */
  private loadRetryConfig(): RetryConfig {
    return {
      maxRetries: parseInt(process.env.RETRY_MAX_RETRIES || '5', 10),
      baseDelayMs: parseInt(process.env.RETRY_BASE_DELAY_MS || '100', 10),
      maxDelayMs: parseInt(process.env.RETRY_MAX_DELAY_MS || '30000', 10),
      jitterMs: parseInt(process.env.RETRY_JITTER_MS || '50', 10),
    };
  }

  /**
   * Load circuit breaker configuration from environment variables.
   */
  private loadCircuitBreakerConfig(): CircuitBreakerConfig {
    return {
      failureThreshold: parseInt(process.env.CIRCUIT_BREAKER_FAILURE_THRESHOLD || '5', 10),
      successThreshold: parseInt(process.env.CIRCUIT_BREAKER_SUCCESS_THRESHOLD || '2', 10),
      timeoutMs: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT_MS || '60000', 10),
    };
  }

  /**
   * Load worker configuration from environment variables.
   */
  private loadWorkerConfig(): WorkerConfig {
    return {
      batchSize: parseInt(process.env.WORKER_BATCH_SIZE || '10', 10),
      pollIntervalMs: parseInt(process.env.WORKER_POLL_INTERVAL_MS || '5000', 10),
      maxConcurrentJobs: parseInt(process.env.WORKER_MAX_CONCURRENT_JOBS || '1', 10),
    };
  }

  /**
   * Load alert thresholds from environment variables.
   */
  private loadAlertThresholds(): AlertThresholds {
    return {
      errorRateThreshold: parseFloat(process.env.ALERT_ERROR_RATE_THRESHOLD || '5'),
      dlqAccumulationThreshold: parseInt(process.env.ALERT_DLQ_ACCUMULATION_THRESHOLD || '100', 10),
      circuitBreakerOpenThreshold: parseInt(process.env.ALERT_CIRCUIT_BREAKER_OPEN_THRESHOLD || '5', 10),
      quotaExceededThreshold: parseFloat(process.env.ALERT_QUOTA_EXCEEDED_THRESHOLD || '90'),
    };
  }

  /**
   * Load feature flags from environment variables.
   */
  private loadFeatureFlags(): Record<string, boolean> {
    return {
      enableHTMLSanitization: process.env.FEATURE_ENABLE_HTML_SANITIZATION !== 'false',
      enableStrictJWTValidation: process.env.FEATURE_ENABLE_STRICT_JWT_VALIDATION !== 'false',
      enableRBAC: process.env.FEATURE_ENABLE_RBAC !== 'false',
      enableAsyncLocalStorage: process.env.FEATURE_ENABLE_ASYNC_LOCAL_STORAGE !== 'false',
      enableDynamicWorkerScaling: process.env.FEATURE_ENABLE_DYNAMIC_WORKER_SCALING !== 'false',
    };
  }

  /**
   * Get plan limits for a specific plan.
   */
  public getPlanLimits(plan: string): PlanLimits {
    return this.planLimits[plan] || this.planLimits['free'];
  }

  /**
   * Get retry configuration.
   */
  public getRetryConfig(): RetryConfig {
    return this.retryConfig;
  }

  /**
   * Get circuit breaker configuration.
   */
  public getCircuitBreakerConfig(): CircuitBreakerConfig {
    return this.circuitBreakerConfig;
  }

  /**
   * Get worker configuration.
   */
  public getWorkerConfig(): WorkerConfig {
    return this.workerConfig;
  }

  /**
   * Get alert thresholds.
   */
  public getAlertThresholds(): AlertThresholds {
    return this.alertThresholds;
  }

  /**
   * Check if a feature flag is enabled.
   */
  public isFeatureEnabled(featureName: string): boolean {
    return this.featureFlags[featureName] ?? false;
  }

  /**
   * Reload configuration from environment variables (for dynamic updates).
   */
  public reload(): void {
    this.planLimits = this.loadPlanLimits();
    this.retryConfig = this.loadRetryConfig();
    this.circuitBreakerConfig = this.loadCircuitBreakerConfig();
    this.workerConfig = this.loadWorkerConfig();
    this.alertThresholds = this.loadAlertThresholds();
    this.featureFlags = this.loadFeatureFlags();

    logger.info('Configuration reloaded', {
      service: 'ConfigService',
      component: 'reload',
      action: 'Configuration reloaded',
      message: 'Configuration service reloaded from environment variables',
    });
  }

  /**
   * Get all configuration as a JSON object (for debugging).
   */
  public getAllConfig(): Record<string, unknown> {
    return {
      planLimits: this.planLimits,
      retryConfig: this.retryConfig,
      circuitBreakerConfig: this.circuitBreakerConfig,
      workerConfig: this.workerConfig,
      alertThresholds: this.alertThresholds,
      featureFlags: this.featureFlags,
    };
  }
}

/**
 * Export singleton instance for easy access.
 */
export const configService = ConfigService.getInstance();
