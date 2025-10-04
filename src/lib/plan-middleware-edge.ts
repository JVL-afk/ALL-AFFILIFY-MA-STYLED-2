// plan-middleware-edge.ts - Edge-compatible plan enforcement
// This file provides plan enforcement functions that work in Edge Runtime
// without using Node.js crypto modules

import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, getUserPlanFromToken, PlanType } from './auth-edge';

// Define feature access map
export const FEATURE_ACCESS_MAP = {
  // Basic plan features
  'dashboard/create-website/basic': ['basic', 'pro', 'enterprise'],
  'dashboard/my-websites': ['basic', 'pro', 'enterprise'],
  'dashboard/basic': ['basic', 'pro', 'enterprise'],
  'dashboard/analyze-website': ['basic', 'pro', 'enterprise'],
  
  // Pro plan features
  'dashboard/advanced-analytics': ['pro', 'enterprise'],
  'dashboard/custom-integrations': ['pro', 'enterprise'],
  'dashboard/email-marketing': ['pro', 'enterprise'],
  'dashboard/create-website/pro': ['pro', 'enterprise'],
  'dashboard/pro': ['pro', 'enterprise'],
  'dashboard/ai-chatbot': ['pro', 'enterprise'],
  
  // Enterprise plan features
  'dashboard/advanced-reporting': ['enterprise'],
  'dashboard/reviews': ['enterprise'],
  'dashboard/ab-testing': ['enterprise'],
  'dashboard/api-management': ['enterprise'],
  'dashboard/team-collaboration': ['enterprise'],
  'dashboard/create-website/enterprise': ['enterprise'],
  'dashboard/enterprise': ['enterprise']
};

// Helper function to check if user can access a feature based on their plan
export function canAccessFeature(userPlan: PlanType, featurePath: string): boolean {
  // Extract the feature path from the URL
  const path = featurePath.split('/').slice(1).join('/');
  
  // Find the matching feature in the access map
  for (const [feature, allowedPlans] of Object.entries(FEATURE_ACCESS_MAP)) {
    if (path.includes(feature) && !allowedPlans.includes(userPlan)) {
      return false;
    }
  }
  
  return true;
}

// Helper function to get the appropriate redirect URL based on user's plan
export function getRedirectUrl(userPlan: PlanType): string {
  switch (userPlan) {
    case 'basic':
      return '/dashboard/basic';
    case 'pro':
      return '/dashboard/pro';
    case 'enterprise':
      return '/dashboard/enterprise';
    default:
      return '/dashboard';
  }
}

// Helper function to get the upgrade URL based on current plan
export function getUpgradeUrl(currentPlan: PlanType): string {
  switch (currentPlan) {
    case 'basic':
      return '/pricing?plan=pro';
    case 'pro':
      return '/pricing?plan=enterprise';
    default:
      return '/pricing';
  }
}

// Middleware function to enforce plan restrictions
export async function enforcePlanRestrictions(
  request: NextRequest,
  featurePath: string
): Promise<{
  allowed: boolean;
  redirectUrl?: string;
  userId?: string;
  plan?: PlanType;
}> {
  try {
    // Get token from request
    const token = getTokenFromRequest(request);
    if (!token) {
      return {
        allowed: false,
        redirectUrl: '/login?redirect=' + encodeURIComponent(request.nextUrl.pathname)
      };
    }
    
    // Get user plan from token
    const userPlanInfo = await getUserPlanFromToken(token);
    if (!userPlanInfo || !userPlanInfo.isAuthenticated) {
      return {
        allowed: false,
        redirectUrl: '/login?redirect=' + encodeURIComponent(request.nextUrl.pathname)
      };
    }
    
    // Check if user can access the feature
    const canAccess = canAccessFeature(userPlanInfo.plan, featurePath);
    if (!canAccess) {
      // Determine which plan is needed for this feature
      const neededPlan = getNeededPlanForFeature(featurePath);
      
      return {
        allowed: false,
        redirectUrl: `/pricing?upgrade=${neededPlan}&from=${userPlanInfo.plan}&feature=${encodeURIComponent(featurePath)}`,
        userId: userPlanInfo.userId,
        plan: userPlanInfo.plan
      };
    }
    
    return {
      allowed: true,
      userId: userPlanInfo.userId,
      plan: userPlanInfo.plan
    };
  } catch (error) {
    console.error('Error enforcing plan restrictions:', error);
    return {
      allowed: false,
      redirectUrl: '/login'
    };
  }
}

// Helper function to determine which plan is needed for a feature
function getNeededPlanForFeature(featurePath: string): PlanType {
  const path = featurePath.split('/').slice(1).join('/');
  
  // Check if it's an enterprise feature
  for (const [feature, allowedPlans] of Object.entries(FEATURE_ACCESS_MAP)) {
    if (path.includes(feature) && allowedPlans.includes('enterprise') && allowedPlans.length === 1) {
      return 'enterprise';
    }
  }
  
  // Check if it's a pro feature
  for (const [feature, allowedPlans] of Object.entries(FEATURE_ACCESS_MAP)) {
    if (path.includes(feature) && allowedPlans.includes('pro') && !allowedPlans.includes('basic')) {
      return 'pro';
    }
  }
  
  return 'basic';
}
