import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

/**
 * Plan limits for multimedia features
 * Enforces feature access and quota limits based on user subscription plan
 */
export const MULTIMEDIA_PLAN_LIMITS = {
  basic: {
    videoGenerationPerMonth: 5,
    voiceSynthesis: true,
    voiceCloning: false,
    contentRepurposing: true,
    adVariants: 2,
    maxVideoLength: 120, // seconds
    maxRepurposingPerMonth: 5,
  },
  pro: {
    videoGenerationPerMonth: 20,
    voiceSynthesis: true,
    voiceCloning: false,
    contentRepurposing: true,
    adVariants: 5,
    maxVideoLength: 300, // seconds
    maxRepurposingPerMonth: 20,
  },
  enterprise: {
    videoGenerationPerMonth: 999, // Unlimited
    voiceSynthesis: true,
    voiceCloning: true,
    contentRepurposing: true,
    adVariants: 999, // Unlimited
    maxVideoLength: 999, // Unlimited
    maxRepurposingPerMonth: 999, // Unlimited
  },
};

/**
 * Check if user has access to a multimedia feature
 */
export async function checkMultimediaFeatureAccess(
  userId: string,
  feature: 'videoGeneration' | 'voiceCloning' | 'contentRepurposing' | 'adVariants'
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const { db } = await connectToDatabase();

    // Fetch user plan
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return { allowed: false, reason: 'User not found' };
    }

    const plan = user.plan || 'basic';
    const limits = MULTIMEDIA_PLAN_LIMITS[plan as keyof typeof MULTIMEDIA_PLAN_LIMITS];

    if (!limits) {
      return { allowed: false, reason: 'Invalid plan' };
    }

    // Check feature access
    switch (feature) {
      case 'videoGeneration':
        return { allowed: true };

      case 'voiceCloning':
        if (!limits.voiceCloning) {
          return {
            allowed: false,
            reason: `Voice cloning is only available on the Enterprise plan. Upgrade to access this feature.`,
          };
        }
        return { allowed: true };

      case 'contentRepurposing':
        if (!limits.contentRepurposing) {
          return {
            allowed: false,
            reason: `Content repurposing is only available on the Pro and Enterprise plans.`,
          };
        }
        return { allowed: true };

      case 'adVariants':
        if (limits.adVariants === 0) {
          return {
            allowed: false,
            reason: `Ad variants are not available on your plan.`,
          };
        }
        return { allowed: true };

      default:
        return { allowed: false, reason: 'Unknown feature' };
    }
  } catch (error) {
    console.error('Error checking multimedia feature access:', error);
    return { allowed: false, reason: 'Error checking access' };
  }
}

/**
 * Check if user has reached their monthly video generation quota
 */
export async function checkVideoGenerationQuota(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
  reason?: string;
}> {
  try {
    const { db } = await connectToDatabase();

    // Fetch user plan
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return {
        allowed: false,
        remaining: 0,
        limit: 0,
        reason: 'User not found',
      };
    }

    const plan = user.plan || 'basic';
    const limits = MULTIMEDIA_PLAN_LIMITS[plan as keyof typeof MULTIMEDIA_PLAN_LIMITS];
    const monthlyLimit = limits.videoGenerationPerMonth;

    // Get current month's usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const videoCount = await db.collection('video_assets').countDocuments({
      userId: new ObjectId(userId),
      createdAt: { $gte: startOfMonth },
    });

    const remaining = Math.max(0, monthlyLimit - videoCount);
    const allowed = remaining > 0;

    if (!allowed) {
      return {
        allowed: false,
        remaining: 0,
        limit: monthlyLimit,
        reason: `You have reached your monthly video generation limit of ${monthlyLimit}. Upgrade your plan or wait until next month.`,
      };
    }

    return {
      allowed: true,
      remaining,
      limit: monthlyLimit,
    };
  } catch (error) {
    console.error('Error checking video generation quota:', error);
    return {
      allowed: false,
      remaining: 0,
      limit: 0,
      reason: 'Error checking quota',
    };
  }
}

/**
 * Check if user has reached their monthly content repurposing quota
 */
export async function checkRepurposingQuota(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
  reason?: string;
}> {
  try {
    const { db } = await connectToDatabase();

    // Fetch user plan
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return {
        allowed: false,
        remaining: 0,
        limit: 0,
        reason: 'User not found',
      };
    }

    const plan = user.plan || 'basic';
    const limits = MULTIMEDIA_PLAN_LIMITS[plan as keyof typeof MULTIMEDIA_PLAN_LIMITS];
    const monthlyLimit = limits.maxRepurposingPerMonth;

    // Get current month's usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const repurposingCount = await db.collection('content_repurposing').countDocuments({
      userId: new ObjectId(userId),
      createdAt: { $gte: startOfMonth },
    });

    const remaining = Math.max(0, monthlyLimit - repurposingCount);
    const allowed = remaining > 0;

    if (!allowed) {
      return {
        allowed: false,
        remaining: 0,
        limit: monthlyLimit,
        reason: `You have reached your monthly content repurposing limit of ${monthlyLimit}. Upgrade your plan or wait until next month.`,
      };
    }

    return {
      allowed: true,
      remaining,
      limit: monthlyLimit,
    };
  } catch (error) {
    console.error('Error checking repurposing quota:', error);
    return {
      allowed: false,
      remaining: 0,
      limit: 0,
      reason: 'Error checking quota',
    };
  }
}

/**
 * Check if user can create a specific number of ad variants
 */
export async function checkAdVariantQuota(
  userId: string,
  requestedCount: number
): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
  reason?: string;
}> {
  try {
    const { db } = await connectToDatabase();

    // Fetch user plan
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return {
        allowed: false,
        remaining: 0,
        limit: 0,
        reason: 'User not found',
      };
    }

    const plan = user.plan || 'basic';
    const limits = MULTIMEDIA_PLAN_LIMITS[plan as keyof typeof MULTIMEDIA_PLAN_LIMITS];
    const monthlyLimit = limits.adVariants;

    // Get current month's usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const adVariantCount = await db.collection('content_repurposing').aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $size: '$repurposedAssets.adVariants' },
          },
        },
      },
    ]).toArray();

    const currentUsage = adVariantCount[0]?.total || 0;
    const remaining = Math.max(0, monthlyLimit - currentUsage);
    const allowed = remaining >= requestedCount;

    if (!allowed) {
      return {
        allowed: false,
        remaining,
        limit: monthlyLimit,
        reason: `You can create ${remaining} more ad variants this month. Upgrade your plan for more.`,
      };
    }

    return {
      allowed: true,
      remaining: remaining - requestedCount,
      limit: monthlyLimit,
    };
  } catch (error) {
    console.error('Error checking ad variant quota:', error);
    return {
      allowed: false,
      remaining: 0,
      limit: 0,
      reason: 'Error checking quota',
    };
  }
}

/**
 * Middleware function to enforce multimedia plan limits
 */
export async function enforceMultimediaLimits(
  request: NextRequest,
  userId: string,
  feature: 'videoGeneration' | 'voiceCloning' | 'contentRepurposing' | 'adVariants'
): Promise<NextResponse | null> {
  // Check feature access
  const featureAccess = await checkMultimediaFeatureAccess(userId, feature);
  if (!featureAccess.allowed) {
    return NextResponse.json(
      {
        error: 'Feature not available',
        message: featureAccess.reason,
      },
      { status: 403 }
    );
  }

  // Check quotas based on feature
  if (feature === 'videoGeneration') {
    const quota = await checkVideoGenerationQuota(userId);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: 'Quota exceeded',
          message: quota.reason,
          remaining: quota.remaining,
          limit: quota.limit,
        },
        { status: 429 }
      );
    }
  }

  if (feature === 'contentRepurposing') {
    const quota = await checkRepurposingQuota(userId);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: 'Quota exceeded',
          message: quota.reason,
          remaining: quota.remaining,
          limit: quota.limit,
        },
        { status: 429 }
      );
    }
  }

  // No violations, allow request to proceed
  return null;
}

/**
 * Get user's multimedia usage statistics
 */
export async function getMultimediaUsageStats(userId: string): Promise<{
  plan: string;
  videoGeneration: {
    used: number;
    limit: number;
    remaining: number;
  };
  contentRepurposing: {
    used: number;
    limit: number;
    remaining: number;
  };
  adVariants: {
    used: number;
    limit: number;
    remaining: number;
  };
}> {
  try {
    const { db } = await connectToDatabase();

    // Fetch user plan
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId),
    });

    const plan = user?.plan || 'basic';
    const limits = MULTIMEDIA_PLAN_LIMITS[plan as keyof typeof MULTIMEDIA_PLAN_LIMITS];

    // Get current month's usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Count videos
    const videoCount = await db.collection('video_assets').countDocuments({
      userId: new ObjectId(userId),
      createdAt: { $gte: startOfMonth },
    });

    // Count repurposing
    const repurposingCount = await db.collection('content_repurposing').countDocuments({
      userId: new ObjectId(userId),
      createdAt: { $gte: startOfMonth },
    });

    // Count ad variants
    const adVariantCount = await db.collection('content_repurposing').aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $size: '$repurposedAssets.adVariants' },
          },
        },
      },
    ]).toArray();

    return {
      plan,
      videoGeneration: {
        used: videoCount,
        limit: limits.videoGenerationPerMonth,
        remaining: Math.max(0, limits.videoGenerationPerMonth - videoCount),
      },
      contentRepurposing: {
        used: repurposingCount,
        limit: limits.maxRepurposingPerMonth,
        remaining: Math.max(0, limits.maxRepurposingPerMonth - repurposingCount),
      },
      adVariants: {
        used: adVariantCount[0]?.total || 0,
        limit: limits.adVariants,
        remaining: Math.max(0, limits.adVariants - (adVariantCount[0]?.total || 0)),
      },
    };
  } catch (error) {
    console.error('Error getting multimedia usage stats:', error);
    return {
      plan: 'basic',
      videoGeneration: { used: 0, limit: 0, remaining: 0 },
      contentRepurposing: { used: 0, limit: 0, remaining: 0 },
      adVariants: { used: 0, limit: 0, remaining: 0 },
    };
  }
}
