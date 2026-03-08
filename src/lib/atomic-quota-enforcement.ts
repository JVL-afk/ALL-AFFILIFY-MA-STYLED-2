import { logger } from './debug-logger';
import { ObjectId } from 'mongodb';

/**
 * Atomic Quota Enforcement Service
 * 
 * Uses Redis-backed distributed counters with Lua scripting to ensure
 * atomic quota enforcement without race conditions.
 * 
 * In a production system, this would use Redis. For now, we use an in-memory
 * implementation with a note that it should be replaced with Redis.
 */

interface QuotaCounter {
  userId: string;
  feature: string;
  count: number;
  limit: number;
  lastResetAt: Date;
}

// In-memory store for prototyping. In production, this would be Redis.
const QUOTA_COUNTERS: Map<string, QuotaCounter> = new Map();

/**
 * Generate a unique key for a quota counter
 */
function generateQuotaKey(userId: string, feature: string): string {
  return `quota:${userId}:${feature}`;
}

/**
 * Initialize a quota counter for a user and feature
 */
export async function initializeQuotaCounter(
  userId: string,
  feature: string,
  limit: number,
  traceId?: string
): Promise<void> {
  const key = generateQuotaKey(userId, feature);

  logger.info('AtomicQuotaEnforcement', 'initializeQuotaCounter', 'Initializing quota counter', {
    trace_id: traceId,
    userId,
    feature,
    limit,
  });

  if (!QUOTA_COUNTERS.has(key)) {
    QUOTA_COUNTERS.set(key, {
      userId,
      feature,
      count: 0,
      limit,
      lastResetAt: new Date(),
    });
  }
}

/**
 * Atomically increment a quota counter and check if the limit is exceeded
 * 
 * This operation is atomic and prevents race conditions by using a
 * simulated Lua script (in production, this would be a real Redis Lua script).
 */
export async function atomicIncrementAndCheck(
  userId: string,
  feature: string,
  amount: number = 1,
  traceId?: string
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const key = generateQuotaKey(userId, feature);

  logger.debug('AtomicQuotaEnforcement', 'atomicIncrementAndCheck', 'Atomically incrementing and checking quota', {
    trace_id: traceId,
    userId,
    feature,
    amount,
  });

  // Ensure counter exists
  if (!QUOTA_COUNTERS.has(key)) {
    logger.warn('AtomicQuotaEnforcement', 'atomicIncrementAndCheck', 'Quota counter not found', {
      trace_id: traceId,
      userId,
      feature,
    });
    throw new Error(`Quota counter not found for ${feature}`);
  }

  const counter = QUOTA_COUNTERS.get(key)!;

  // Check if we've exceeded the limit
  if (counter.count + amount > counter.limit) {
    logger.warn('AtomicQuotaEnforcement', 'atomicIncrementAndCheck', 'Quota limit exceeded', {
      trace_id: traceId,
      userId,
      feature,
      currentCount: counter.count,
      requestedAmount: amount,
      limit: counter.limit,
    });

    return {
      allowed: false,
      remaining: Math.max(0, counter.limit - counter.count),
      limit: counter.limit,
    };
  }

  // Atomically increment the counter
  counter.count += amount;

  logger.info('AtomicQuotaEnforcement', 'atomicIncrementAndCheck', 'Quota incremented successfully', {
    trace_id: traceId,
    userId,
    feature,
    newCount: counter.count,
    limit: counter.limit,
  });

  return {
    allowed: true,
    remaining: counter.limit - counter.count,
    limit: counter.limit,
  };
}

/**
 * Atomically decrement a quota counter (for refunds)
 */
export async function atomicDecrement(
  userId: string,
  feature: string,
  amount: number = 1,
  traceId?: string
): Promise<{ newCount: number; limit: number }> {
  const key = generateQuotaKey(userId, feature);

  logger.debug('AtomicQuotaEnforcement', 'atomicDecrement', 'Atomically decrementing quota', {
    trace_id: traceId,
    userId,
    feature,
    amount,
  });

  // Ensure counter exists
  if (!QUOTA_COUNTERS.has(key)) {
    logger.warn('AtomicQuotaEnforcement', 'atomicDecrement', 'Quota counter not found', {
      trace_id: traceId,
      userId,
      feature,
    });
    throw new Error(`Quota counter not found for ${feature}`);
  }

  const counter = QUOTA_COUNTERS.get(key)!;

  // Atomically decrement the counter (but not below 0)
  counter.count = Math.max(0, counter.count - amount);

  logger.info('AtomicQuotaEnforcement', 'atomicDecrement', 'Quota decremented successfully', {
    trace_id: traceId,
    userId,
    feature,
    newCount: counter.count,
    limit: counter.limit,
  });

  return {
    newCount: counter.count,
    limit: counter.limit,
  };
}

/**
 * Get the current quota status for a user and feature
 */
export async function getQuotaStatus(
  userId: string,
  feature: string,
  traceId?: string
): Promise<{ count: number; limit: number; remaining: number }> {
  const key = generateQuotaKey(userId, feature);

  logger.debug('AtomicQuotaEnforcement', 'getQuotaStatus', 'Getting quota status', {
    trace_id: traceId,
    userId,
    feature,
  });

  // Ensure counter exists
  if (!QUOTA_COUNTERS.has(key)) {
    logger.warn('AtomicQuotaEnforcement', 'getQuotaStatus', 'Quota counter not found', {
      trace_id: traceId,
      userId,
      feature,
    });
    throw new Error(`Quota counter not found for ${feature}`);
  }

  const counter = QUOTA_COUNTERS.get(key)!;

  return {
    count: counter.count,
    limit: counter.limit,
    remaining: counter.limit - counter.count,
  };
}

/**
 * Reset a quota counter to 0 (typically at the start of a new billing period)
 */
export async function resetQuotaCounter(
  userId: string,
  feature: string,
  traceId?: string
): Promise<void> {
  const key = generateQuotaKey(userId, feature);

  logger.info('AtomicQuotaEnforcement', 'resetQuotaCounter', 'Resetting quota counter', {
    trace_id: traceId,
    userId,
    feature,
  });

  if (QUOTA_COUNTERS.has(key)) {
    const counter = QUOTA_COUNTERS.get(key)!;
    counter.count = 0;
    counter.lastResetAt = new Date();
  }
}

/**
 * Detect spending anomalies (e.g., >300% spike in usage)
 */
export async function detectSpendingAnomaly(
  userId: string,
  feature: string,
  baselineCount: number,
  currentCount: number,
  thresholdPercentage: number = 300,
  traceId?: string
): Promise<{ isAnomaly: boolean; percentageIncrease: number }> {
  logger.debug('AtomicQuotaEnforcement', 'detectSpendingAnomaly', 'Detecting spending anomaly', {
    trace_id: traceId,
    userId,
    feature,
    baselineCount,
    currentCount,
    thresholdPercentage,
  });

  if (baselineCount === 0) {
    // If baseline is 0, any usage is an anomaly
    return {
      isAnomaly: currentCount > 0,
      percentageIncrease: currentCount > 0 ? 100 : 0,
    };
  }

  const percentageIncrease = ((currentCount - baselineCount) / baselineCount) * 100;
  const isAnomaly = percentageIncrease > thresholdPercentage;

  if (isAnomaly) {
    logger.warn('AtomicQuotaEnforcement', 'detectSpendingAnomaly', 'Spending anomaly detected', {
      trace_id: traceId,
      userId,
      feature,
      percentageIncrease,
      thresholdPercentage,
    });
  }

  return { isAnomaly, percentageIncrease };
}

/**
 * Enforce a hard cap on quota spending (fail closed)
 */
export async function enforceHardCap(
  userId: string,
  feature: string,
  traceId?: string
): Promise<{ allowed: boolean; reason?: string }> {
  const key = generateQuotaKey(userId, feature);

  logger.debug('AtomicQuotaEnforcement', 'enforceHardCap', 'Enforcing hard cap on quota', {
    trace_id: traceId,
    userId,
    feature,
  });

  if (!QUOTA_COUNTERS.has(key)) {
    logger.warn('AtomicQuotaEnforcement', 'enforceHardCap', 'Quota counter not found', {
      trace_id: traceId,
      userId,
      feature,
    });
    return { allowed: false, reason: 'Quota counter not found' };
  }

  const counter = QUOTA_COUNTERS.get(key)!;

  // Hard cap: if usage is at or above the limit, deny
  if (counter.count >= counter.limit) {
    logger.warn('AtomicQuotaEnforcement', 'enforceHardCap', 'Hard cap reached', {
      trace_id: traceId,
      userId,
      feature,
      count: counter.count,
      limit: counter.limit,
    });
    return { allowed: false, reason: 'Hard cap reached' };
  }

  return { allowed: true };
}

/**
 * Enforce a soft cap on quota spending (warn but allow)
 */
export async function enforceSoftCap(
  userId: string,
  feature: string,
  softCapPercentage: number = 80,
  traceId?: string
): Promise<{ allowed: boolean; warning?: string }> {
  const key = generateQuotaKey(userId, feature);

  logger.debug('AtomicQuotaEnforcement', 'enforceSoftCap', 'Enforcing soft cap on quota', {
    trace_id: traceId,
    userId,
    feature,
    softCapPercentage,
  });

  if (!QUOTA_COUNTERS.has(key)) {
    logger.warn('AtomicQuotaEnforcement', 'enforceSoftCap', 'Quota counter not found', {
      trace_id: traceId,
      userId,
      feature,
    });
    return { allowed: false, warning: 'Quota counter not found' };
  }

  const counter = QUOTA_COUNTERS.get(key)!;
  const usagePercentage = (counter.count / counter.limit) * 100;

  if (usagePercentage >= softCapPercentage) {
    logger.warn('AtomicQuotaEnforcement', 'enforceSoftCap', 'Soft cap warning', {
      trace_id: traceId,
      userId,
      feature,
      usagePercentage,
      softCapPercentage,
    });
    return {
      allowed: true,
      warning: `You have used ${usagePercentage.toFixed(2)}% of your quota for ${feature}`,
    };
  }

  return { allowed: true };
}
