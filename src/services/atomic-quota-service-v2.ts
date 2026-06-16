/**
 * Atomic Quota Service V2 - Fully Atomic Quota Deduction
 * 
 * INVARIANT: Quota deduction must be atomic (all-or-nothing)
 * INVARIANT: No separate rollback operation (single atomic transaction)
 * INVARIANT: Fails closed: denies quota on any error
 */

import { Db } from 'mongodb';

export interface QuotaUsage {
  tenantId: string;
  month: string;
  aiAuditsUsed: number;
  aiAuditsLimit: number;
  trafficEventsUsed: number;
  trafficEventsLimit: number;
}

export class AtomicQuotaServiceV2 {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * Deduct AI audit quota atomically
   * Uses MongoDB aggregation pipeline within findOneAndUpdate for atomic check-and-increment
   * 
   * RETURNS: true if quota was successfully deducted, false if quota exceeded or error occurred
   */
  async deductAiAuditQuota(tenantId: string, tier: 'free' | 'pro' | 'enterprise', traceId: string): Promise<boolean> {
    try {
      // Determine quota limit based on tier
      const quotaLimit = this.getAiAuditQuotaLimit(tier);

      // Get current month
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const quotaCollection = this.db.collection('quota_usage');

      // FULLY ATOMIC OPERATION: Check and increment in a single operation
      const result = await quotaCollection.findOneAndUpdate(
        { tenantId, month },
        [
          {
            $set: {
              aiAuditsUsed: {
                $cond: [
                  { $lt: ['$aiAuditsUsed', quotaLimit] },
                  { $add: ['$aiAuditsUsed', 1] },
                  '$aiAuditsUsed', // Don't increment if quota exceeded
                ],
              },
              lastUpdated: new Date(),
              quotaExceeded: { $gte: ['$aiAuditsUsed', quotaLimit] },
            },
          },
        ],
        { upsert: true, returnDocument: 'after' }
      );

      // MongoDB driver v6+: findOneAndUpdate returns the document directly (not wrapped in .value)
      // Use nullish coalescing to handle both old and new driver behaviour safely.
      const updatedDoc = (result as any)?.value ?? (result as any);
      if (!updatedDoc) {
        console.warn(`[ATOMIC_QUOTA] Quota deduction failed - no result. TenantId: ${tenantId}, Tier: ${tier}, TraceId: ${traceId}`);
        return false;
      }

      // Check if quota was exceeded BEFORE the increment
      if ((updatedDoc.aiAuditsUsed || 0) >= quotaLimit) {
        console.warn(
          `[ATOMIC_QUOTA] Quota exceeded. TenantId: ${tenantId}, Tier: ${tier}, Used: ${updatedDoc.aiAuditsUsed}, Limit: ${quotaLimit}, TraceId: ${traceId}`
        );
        return false;
      }

      console.log(
        `[ATOMIC_QUOTA] Quota deducted successfully. TenantId: ${tenantId}, Tier: ${tier}, Used: ${updatedDoc.aiAuditsUsed}, Limit: ${quotaLimit}, TraceId: ${traceId}`
      );
      return true;
    } catch (error) {
      console.error(`[ATOMIC_QUOTA] Error deducting quota. TenantId: ${tenantId}, Tier: ${tier}, TraceId: ${traceId}`, error);
      // Fail closed: deny quota on error
      return false;
    }
  }

  /**
   * Get current quota usage for a tenant
   */
  async getQuotaUsage(tenantId: string, tier: 'free' | 'pro' | 'enterprise'): Promise<QuotaUsage> {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const quotaCollection = this.db.collection('quota_usage');
    const doc = await quotaCollection.findOne({ tenantId, month });

    const aiAuditsLimit = this.getAiAuditQuotaLimit(tier);
    const trafficEventsLimit = this.getTrafficEventQuotaLimit(tier);

    return {
      tenantId,
      month,
      aiAuditsUsed: (doc?.aiAuditsUsed || 0) as number,
      aiAuditsLimit,
      trafficEventsUsed: (doc?.trafficEventsUsed || 0) as number,
      trafficEventsLimit,
    };
  }

  /**
   * Get AI audit quota limit based on tier
   */
  private getAiAuditQuotaLimit(tier: 'free' | 'pro' | 'enterprise'): number {
    switch (tier) {
      case 'free':
        return 5;
      case 'pro':
        return 100;
      case 'enterprise':
        return Number.MAX_SAFE_INTEGER; // Unlimited
      default:
        return 5;
    }
  }

  /**
   * Get traffic event quota limit based on tier
   */
  private getTrafficEventQuotaLimit(tier: 'free' | 'pro' | 'enterprise'): number {
    switch (tier) {
      case 'free':
        return 10000;
      case 'pro':
        return 1000000;
      case 'enterprise':
        return Number.MAX_SAFE_INTEGER; // Unlimited
      default:
        return 10000;
    }
  }
}
