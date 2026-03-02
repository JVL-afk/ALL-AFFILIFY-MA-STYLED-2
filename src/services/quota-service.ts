import { Db, ObjectId } from 'mongodb';
import { logger } from '@/lib/debug-logger';
import { configService } from './config-service';

/**
 * Atomic Quota Enforcement Service
 * 
 * Enforces quotas using MongoDB atomic operations (findOneAndUpdate with $inc)
 * to prevent race conditions. All quota checks and decrements are transactional.
 */

export interface UserQuota {
  userId: ObjectId;
  emailsSentThisMonth: number;
  emailsSentToday: number;
  emailsAllowedPerMonth: number;
  emailsAllowedPerDay: number;
  lastResetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class QuotaService {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * Initialize or get user quota from database.
   * If user doesn't have a quota record, create one with default limits.
   */
  async initializeUserQuota(userId: ObjectId, planType: 'free' | 'pro' | 'enterprise'): Promise<UserQuota> {
    const quotaLimits = this.getQuotaLimitsByPlan(planType);

    const result = await this.db.collection('user_quotas').findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          userId,
          emailsSentThisMonth: 0,
          emailsSentToday: 0,
          emailsAllowedPerMonth: quotaLimits.monthly,
          emailsAllowedPerDay: quotaLimits.daily,
          lastResetDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: 'after' }
    );

    if (!result.value) {
      throw new Error(`Failed to initialize quota for user ${userId.toString()}`);
    }

    logger.info('QuotaService', 'initializeUserQuota', 'User quota initialized', {
      userId: userId.toString(),
      planType,
      monthlyLimit: quotaLimits.monthly,
      dailyLimit: quotaLimits.daily,
    });

    return result.value as UserQuota;
  }

  /**
   * Atomically check and decrement email quota.
   * 
   * This operation is atomic and prevents race conditions:
   * 1. Reads current quota
   * 2. Checks if quota is available
   * 3. Decrements quota in a single operation
   * 
   * If quota is insufficient, the operation fails and no decrement occurs.
   */
  async checkAndDecrementQuota(userId: ObjectId, emailCount: number = 1): Promise<{ allowed: boolean; remaining: number; reason?: string }> {
    // First, ensure quota record exists
    const quota = await this.db.collection('user_quotas').findOne({ userId });
    if (!quota) {
      logger.warn('QuotaService', 'checkAndDecrementQuota', 'User quota not found', { userId: userId.toString() });
      return { allowed: false, remaining: 0, reason: 'Quota not initialized' };
    }

    // Check if daily reset is needed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReset = new Date(quota.lastResetDate);
    lastReset.setHours(0, 0, 0, 0);

    if (lastReset.getTime() < today.getTime()) {
      // Reset daily counter
      await this.db.collection('user_quotas').updateOne(
        { userId },
        {
          $set: {
            emailsSentToday: 0,
            lastResetDate: today,
            updatedAt: new Date(),
          },
        }
      );
      quota.emailsSentToday = 0;
      quota.lastResetDate = today;
    }

    // Check monthly quota
    if (quota.emailsSentThisMonth + emailCount > quota.emailsAllowedPerMonth) {
      logger.warn('QuotaService', 'checkAndDecrementQuota', 'Monthly quota exceeded', {
        userId: userId.toString(),
        requested: emailCount,
        current: quota.emailsSentThisMonth,
        limit: quota.emailsAllowedPerMonth,
      });
      return {
        allowed: false,
        remaining: Math.max(0, quota.emailsAllowedPerMonth - quota.emailsSentThisMonth),
        reason: 'Monthly quota exceeded',
      };
    }

    // Check daily quota
    if (quota.emailsSentToday + emailCount > quota.emailsAllowedPerDay) {
      logger.warn('QuotaService', 'checkAndDecrementQuota', 'Daily quota exceeded', {
        userId: userId.toString(),
        requested: emailCount,
        current: quota.emailsSentToday,
        limit: quota.emailsAllowedPerDay,
      });
      return {
        allowed: false,
        remaining: Math.max(0, quota.emailsAllowedPerDay - quota.emailsSentToday),
        reason: 'Daily quota exceeded',
      };
    }

    // Atomically decrement quota using $inc operator
    // This is atomic at the database level and prevents race conditions
    const updateResult = await this.db.collection('user_quotas').findOneAndUpdate(
      {
        userId,
        emailsSentThisMonth: { $lte: quota.emailsAllowedPerMonth - emailCount },
        emailsSentToday: { $lte: quota.emailsAllowedPerDay - emailCount },
      },
      {
        $inc: {
          emailsSentThisMonth: emailCount,
          emailsSentToday: emailCount,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!updateResult.value) {
      // This should rarely happen as we checked quotas above, but it's possible in high-concurrency scenarios
      logger.error('QuotaService', 'checkAndDecrementQuota', 'Atomic quota decrement failed due to race condition', {
        userId: userId.toString(),
        emailCount,
      });
      return {
        allowed: false,
        remaining: 0,
        reason: 'Race condition detected during quota decrement',
      };
    }

    logger.info('QuotaService', 'checkAndDecrementQuota', 'Quota decremented successfully', {
      userId: userId.toString(),
      emailCount,
      newMonthlyUsage: updateResult.value.emailsSentThisMonth,
      newDailyUsage: updateResult.value.emailsSentToday,
    });

    return {
      allowed: true,
      remaining: updateResult.value.emailsAllowedPerMonth - updateResult.value.emailsSentThisMonth,
    };
  }

  /**
   * Get remaining quota for a user without decrementing.
   */
  async getRemainingQuota(userId: ObjectId): Promise<{ monthly: number; daily: number }> {
    const quota = await this.db.collection('user_quotas').findOne({ userId });

    if (!quota) {
      return { monthly: 0, daily: 0 };
    }

    return {
      monthly: Math.max(0, quota.emailsAllowedPerMonth - quota.emailsSentThisMonth),
      daily: Math.max(0, quota.emailsAllowedPerDay - quota.emailsSentToday),
    };
  }

  /**
   * Reset user quota (admin function).
   */
  async resetUserQuota(userId: ObjectId): Promise<void> {
    await this.db.collection('user_quotas').updateOne(
      { userId },
      {
        $set: {
          emailsSentThisMonth: 0,
          emailsSentToday: 0,
          lastResetDate: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    logger.info('QuotaService', 'resetUserQuota', 'User quota reset', { userId: userId.toString() });
  }

  /**
   * Get quota limits based on plan type (dynamically loaded from ConfigService).
   */
  private getQuotaLimitsByPlan(planType: 'free' | 'pro' | 'enterprise'): { monthly: number; daily: number } {
    const limits = configService.getPlanLimits(planType);
    return { monthly: limits.emailsPerMonth, daily: limits.emailsPerDay };
  }
}
