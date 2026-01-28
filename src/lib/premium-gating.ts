/**
 * Premium Feature Gating System for AFFILIFY
 * Ensures only paying members can access CRM features
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from './auth';
import { logger } from './debug-logger';
import User from './models/User';
import { connectMongoose } from './mongoose-connection';
import mongoose from 'mongoose';

export type PremiumTier = 'basic' | 'pro' | 'enterprise';

export interface PremiumUser {
  id: string;
  email: string;
  tier: PremiumTier;
  subscription: {
    status: 'active' | 'inactive' | 'cancelled';
    startDate: Date;
    endDate: Date | null;
    plan: 'basic' | 'pro' | 'enterprise';
  };
  crmFeatures: {
    leads: boolean;
    tasks: boolean;
    proposals: boolean;
    clientPortal: boolean;
    maxClients: number;
    maxProposals: number;
  };
}

/**
 * Check if user has an active premium subscription
 */
export async function checkPremiumStatus(userId: string): Promise<PremiumUser | null> {
  try {
    await connectMongoose();
    
    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    
    if (!user) {
      logger.warn('PREMIUM_GATING', 'USER_NOT_FOUND', { userId });
      return null;
    }

    // Check if subscription is active
    const now = new Date();
    const isSubscriptionActive = 
      user.subscription?.status === 'active' &&
      new Date(user.subscription.startDate) <= now &&
      (!user.subscription.endDate || new Date(user.subscription.endDate) > now);

    if (!isSubscriptionActive) {
      logger.warn('PREMIUM_GATING', 'SUBSCRIPTION_INACTIVE', { userId, status: user.subscription?.status });
      return null;
    }

    // Map plan to tier
    const planTierMap: { [key: string]: PremiumTier } = {
      'pro': 'pro',
      'enterprise': 'enterprise',
      'basic': 'basic',
    };

    const tier = planTierMap[user.subscription.plan] || 'basic';

    // Define feature access based on tier
    const featureAccess: { [key in PremiumTier]: PremiumUser['crmFeatures'] } = {
      'basic': {
        leads: false,
        tasks: false,
        proposals: false,
        clientPortal: false,
        maxClients: 0,
        maxProposals: 0,
      },
      'pro': {
        leads: true,
        tasks: true,
        proposals: true,
        clientPortal: true,
        maxClients: 10,
        maxProposals: 20,
      },
      'enterprise': {
        leads: true,
        tasks: true,
        proposals: true,
        clientPortal: true,
        maxClients: 999,
        maxProposals: 999,
      },
    };

    const premiumUser: PremiumUser = {
      id: user._id.toString(),
      email: user.email,
      tier,
      subscription: {
        status: user.subscription.status as 'active' | 'inactive' | 'cancelled',
        startDate: new Date(user.subscription.startDate),
        endDate: user.subscription.endDate ? new Date(user.subscription.endDate) : null,
        plan: user.subscription.plan,
      },
      crmFeatures: featureAccess[tier],
    };

    logger.info('PREMIUM_GATING', 'PREMIUM_STATUS_VERIFIED', { userId, tier, features: premiumUser.crmFeatures });
    return premiumUser;
  } catch (error: any) {
    logger.error('PREMIUM_GATING', 'CHECK_STATUS_ERROR', { userId, error: error.message }, error);
    return null;
  }
}

/**
 * Higher-order function to gate CRM endpoints to premium users
 */
export function requirePremiumCRM(
  handler: (request: NextRequest, user: PremiumUser) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const requestId = Math.random().toString(36).substring(7);
    
    try {
      logger.info('PREMIUM_GATE', 'REQUEST_START', { requestId, url: request.url });

      // Verify authentication
      const authResult = await verifyAuth(request);
      if (!authResult.success || !authResult.user) {
        logger.warn('PREMIUM_GATE', 'AUTH_FAILED', { requestId, error: authResult.error });
        return NextResponse.json(
          { message: 'Unauthorized', requestId },
          { status: 401 }
        );
      }

      const userId = authResult.user.id || authResult.user._id?.toString();
      logger.debug('PREMIUM_GATE', 'USER_AUTHENTICATED', { requestId, userId });

      // Check premium status
      const premiumUser = await checkPremiumStatus(userId);
      
      if (!premiumUser) {
        logger.warn('PREMIUM_GATE', 'PREMIUM_REQUIRED', { requestId, userId });
        return NextResponse.json(
          {
            message: 'Premium subscription required for CRM features',
            error: 'PREMIUM_REQUIRED',
            requestId,
          },
          { status: 403 }
        );
      }

      logger.debug('PREMIUM_GATE', 'PREMIUM_VERIFIED', { requestId, userId, tier: premiumUser.tier });

      // Call the handler with the premium user
      return await handler(request, premiumUser);
    } catch (error: any) {
      logger.error('PREMIUM_GATE', 'GATE_ERROR', { requestId, error: error.message }, error);
      return NextResponse.json(
        { message: 'Internal Server Error', requestId },
        { status: 500 }
      );
    }
  };
}

/**
 * Check if user can perform a specific CRM action
 */
export async function canAccessCRMFeature(userId: string, feature: keyof PremiumUser['crmFeatures']): Promise<boolean> {
  try {
    const premiumUser = await checkPremiumStatus(userId);
    
    if (!premiumUser) {
      return false;
    }

    // For numeric features (maxClients, maxProposals), check if > 0
    if (typeof premiumUser.crmFeatures[feature] === 'number') {
      return (premiumUser.crmFeatures[feature] as number) > 0;
    }

    return premiumUser.crmFeatures[feature] as boolean;
  } catch (error: any) {
    logger.error('PREMIUM_GATING', 'FEATURE_CHECK_ERROR', { userId, feature, error: error.message }, error);
    return false;
  }
}

/**
 * Get premium user tier for display/UI purposes
 */
export async function getPremiumTier(userId: string): Promise<PremiumTier | null> {
  try {
    const premiumUser = await checkPremiumStatus(userId);
    return premiumUser?.tier || null;
  } catch (error: any) {
    logger.error('PREMIUM_GATING', 'GET_TIER_ERROR', { userId, error: error.message }, error);
    return null;
  }
}
