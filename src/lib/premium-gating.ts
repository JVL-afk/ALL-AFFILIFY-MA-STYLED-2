/**
 * CRM Feature Access System for AFFILIFY
 * All subscription plans (basic, pro, enterprise) have full CRM access.
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
 * Check if user has an active subscription and return their CRM access level.
 * All plans (basic, pro, enterprise) receive full CRM access.
 */
export async function checkPremiumStatus(userId: string): Promise<PremiumUser | null> {
  const requestId = Math.random().toString(36).substring(7);
  try {
    logger.info('PREMIUM_GATING', 'CHECK_START', 'CHECK_START', { requestId, userId });
    await connectMongoose();
    
    // Log the search attempt
    const collectionName = User.collection.name;
    const dbName = mongoose.connection.db?.databaseName;
    logger.debug('PREMIUM_GATING', 'SEARCHING_USER', 'SEARCHING_USER', { 
      requestId, 
      userId, 
      collectionName, 
      dbName,
      readyState: mongoose.connection.readyState 
    });
    
    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    
    if (!user) {
      logger.warn('PREMIUM_GATING', 'USER_NOT_FOUND', 'USER_NOT_FOUND', { requestId, userId });
      
      // DIAGNOSTIC: Try finding by string ID just in case
      const userByString = await User.findById(userId);
      if (userByString) {
        logger.info('PREMIUM_GATING', 'USER_FOUND_BY_STRING_ID', 'USER_FOUND_BY_STRING_ID', { requestId, userId });
      } else {
        // DIAGNOSTIC: List a few users to see what's in the collection
        const sampleUsers = await User.find().limit(3).select('_id email');
        logger.debug('PREMIUM_GATING', 'COLLECTION_SAMPLE', 'COLLECTION_SAMPLE', { 
          requestId, 
          sampleCount: sampleUsers.length,
          samples: sampleUsers.map(u => ({ id: u._id.toString(), email: u.email }))
        });
      }
      return null;
    }

    logger.debug('PREMIUM_GATING', 'USER_FOUND', 'USER_FOUND', { 
      requestId, 
      userId: user._id.toString(), 
      email: user.email,
      hasSubscription: !!user.subscription,
      rawUserKeys: Object.keys(user.toObject ? user.toObject() : user)
    });

    // Map plan to tier — all registered plans are supported
    const planTierMap: { [key: string]: PremiumTier } = {
      'pro': 'pro',
      'enterprise': 'enterprise',
      'basic': 'basic',
    };

    // Support both nested Mongoose schema and flat native MongoDB schema
    const userPlan = user.subscription?.plan || (user as any).plan || 'basic';
    const tier = planTierMap[userPlan] || 'basic';

    // All plans receive full CRM feature access
    const fullCrmAccess: PremiumUser['crmFeatures'] = {
      leads: true,
      tasks: true,
      proposals: true,
      clientPortal: true,
      maxClients: tier === 'enterprise' ? 999 : tier === 'pro' ? 100 : 50,
      maxProposals: tier === 'enterprise' ? 999 : tier === 'pro' ? 100 : 50,
    };

    const premiumUser: PremiumUser = {
      id: user._id.toString(),
      email: user.email,
      tier,
      subscription: {
        status: (user.subscription?.status || (user as any).subscriptionStatus || 'active') as 'active' | 'inactive' | 'cancelled',
        startDate: user.subscription?.startDate ? new Date(user.subscription.startDate) : new Date(),
        endDate: user.subscription?.endDate ? new Date(user.subscription.endDate) : null,
        plan: userPlan as 'basic' | 'pro' | 'enterprise',
      },
      crmFeatures: fullCrmAccess,
    };

    logger.info('PREMIUM_GATING', 'CRM_ACCESS_GRANTED', 'CRM_ACCESS_GRANTED', { userId, tier, features: premiumUser.crmFeatures });
    return premiumUser;
  } catch (error: any) {
    logger.error('PREMIUM_GATING', 'CHECK_STATUS_ERROR', 'CHECK_STATUS_ERROR', { userId, error: error.message }, error);
    return null;
  }
}

/**
 * Higher-order function to gate CRM endpoints to authenticated users.
 * All subscription plans are accepted.
 */
export function requirePremiumCRM(
  handler: (request: NextRequest, user: PremiumUser) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const requestId = Math.random().toString(36).substring(7);
    
    try {
      logger.info('CRM_GATE', 'REQUEST_START', 'REQUEST_START', { requestId, url: request.url });

      // Verify authentication
      const authResult = await verifyAuth(request);
      if (!authResult.success || !authResult.user) {
        logger.warn('CRM_GATE', 'AUTH_FAILED', 'AUTH_FAILED', { requestId, error: authResult.error });
        return NextResponse.json(
          { message: 'Unauthorized', requestId },
          { status: 401 }
        );
      }

      const userId = authResult.user.id || authResult.user._id?.toString();
      logger.debug('CRM_GATE', 'USER_AUTHENTICATED', 'USER_AUTHENTICATED', { requestId, userId });

      // Get user CRM access (all plans are accepted)
      const premiumUser = await checkPremiumStatus(userId);
      
      if (!premiumUser) {
        logger.warn('CRM_GATE', 'USER_NOT_FOUND', 'USER_NOT_FOUND', { requestId, userId });
        return NextResponse.json(
          {
            message: 'User not found. Please log in again.',
            error: 'USER_NOT_FOUND',
            requestId,
          },
          { status: 403 }
        );
      }

      logger.debug('CRM_GATE', 'ACCESS_GRANTED', 'ACCESS_GRANTED', { requestId, userId, tier: premiumUser.tier });

      // Call the handler with the user
      return await handler(request, premiumUser);
    } catch (error: any) {
      logger.error('CRM_GATE', 'GATE_ERROR', 'GATE_ERROR', { requestId, error: error.message }, error);
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
    logger.error('PREMIUM_GATING', 'FEATURE_CHECK_ERROR', 'FEATURE_CHECK_ERROR', { userId, feature, error: error.message }, error);
    return false;
  }
}

/**
 * Get user tier for display/UI purposes
 */
export async function getPremiumTier(userId: string): Promise<PremiumTier | null> {
  try {
    const premiumUser = await checkPremiumStatus(userId);
    return premiumUser?.tier || null;
  } catch (error: any) {
    logger.error('PREMIUM_GATING', 'GET_TIER_ERROR', 'GET_TIER_ERROR', { userId, error: error.message }, error);
    return null;
  }
}
