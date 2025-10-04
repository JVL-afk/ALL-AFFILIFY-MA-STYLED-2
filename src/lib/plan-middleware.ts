import { NextRequest, NextResponse } from 'next/server';
import { getUserById, verifyToken } from './auth';
import { getUserPlan, PLAN_LIMITS } from './plan-enforcement';

// Define plan types
export type PlanType = 'basic' | 'pro' | 'enterprise';

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

// Helper function to extract token from request
export function getTokenFromRequest(request: NextRequest): string | null {
  // Check cookies first
  const tokenFromCookie = request.cookies.get('token')?.value || 
                          request.cookies.get('auth-token')?.value || 
                          request.cookies.get('authToken')?.value || 
                          request.cookies.get('jwt')?.value;
  
  if (tokenFromCookie) {
    return tokenFromCookie;
  }
  
  // Check Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

// Helper function to get user plan from token
export async function getUserPlanFromToken(token: string): Promise<{ 
  userId: string; 
  plan: PlanType; 
  isAuthenticated: boolean;
} | null> {
  try {
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return null;
    }
    
    const user = await getUserById(decoded.userId);
    if (!user) {
      return null;
    }
    
    return {
      userId: user.id,
      plan: user.plan as PlanType,
      isAuthenticated: true
    };
  } catch (error) {
    console.error('Error getting user plan from token:', error);
    return null;
  }
}

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

// Higher-order function to create a route handler that enforces plan restrictions
export function withPlanRestriction(handler: Function, requiredPlan: PlanType) {
  return async function(req: NextRequest, ...args: any[]) {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userPlanInfo = await getUserPlanFromToken(token);
    if (!userPlanInfo || !userPlanInfo.isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const planHierarchy = {
      'basic': 1,
      'pro': 2,
      'enterprise': 3
    };
    
    if (planHierarchy[userPlanInfo.plan] < planHierarchy[requiredPlan]) {
      return NextResponse.json(
        { 
          error: 'Plan upgrade required',
          currentPlan: userPlanInfo.plan,
          requiredPlan: requiredPlan,
          upgradeUrl: getUpgradeUrl(userPlanInfo.plan)
        },
        { status: 403 }
      );
    }
    
    // Add user info to the request for the handler to use
    const enhancedReq = Object.assign({}, req, {
      user: {
        id: userPlanInfo.userId,
        plan: userPlanInfo.plan
      }
    });
    
    return handler(enhancedReq, ...args);
  };
}

// Specific higher-order functions for each plan level
export function requireBasic(handler: Function) {
  return withPlanRestriction(handler, 'basic');
}

export function requirePro(handler: Function) {
  return withPlanRestriction(handler, 'pro');
}

export function requireEnterprise(handler: Function) {
  return withPlanRestriction(handler, 'enterprise');
}
