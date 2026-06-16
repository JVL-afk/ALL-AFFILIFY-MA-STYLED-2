import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

// Type definitions
export interface AuthenticatedUser {
  _id: string | ObjectId;
  id: string;
  name: string;
  email: string;
  plan: 'basic' | 'pro' | 'enterprise';
  role?: string;
  websitesCreated: number;
  websiteLimit: number;
  analysesUsed: number;
  analysisLimit: number;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}

type AuthenticatedHandler = (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse | Response>;

// Best-in-Class: Robust authentication middleware that handles multiple token sources
export async function authenticateRequest(request: NextRequest): Promise<{ success: boolean; user?: AuthenticatedUser; error?: string }> {
  try {
    // 1. Extract token from multiple sources (Authorization header, cookies)
    let token = null;

    // Check Authorization header (Bearer token)
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Check cookies (multiple possible names)
    if (!token) {
      token = request.cookies.get('token')?.value ||
              request.cookies.get('auth-token')?.value ||
              request.cookies.get('authToken')?.value ||
              request.cookies.get('jwt')?.value;
    }

    if (!token) {
      return { success: false, error: 'Authentication required' };
    }

    // 2. Verify JWT signature
    const JWT_SECRET = process.env.JWT_SECRET || 'affilify_jwt_2025_romania_student_success_portocaliu_orange_power_gaming_affiliate_marketing_revolution_secure_token_generation_system_v1';
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return { success: false, error: 'Invalid token' };
    }

    // 3. Fetch user from database (real-time data)
    const { db } = await connectToDatabase();
    const userDoc = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    );

    if (!userDoc) {
      return { success: false, error: 'User not found' };
    }

    // 4. Return authenticated user
    const user: AuthenticatedUser = {
      _id: userDoc._id.toString(),
      id: userDoc._id.toString(),
      name: userDoc.name || '',
      email: userDoc.email || '',
      plan: (userDoc.plan as any) || 'basic',
      role: userDoc.role || 'user',
      websitesCreated: userDoc.websitesCreated || 0,
      websiteLimit: userDoc.websiteLimit || 3,
      analysesUsed: userDoc.analysesUsed || 0,
      analysisLimit: userDoc.analysisLimit || 10,
      stripeCustomerId: userDoc.stripeCustomerId,
      subscriptionId: userDoc.subscriptionId,
      subscriptionStatus: userDoc.subscriptionStatus,
      createdAt: userDoc.createdAt || new Date(),
      updatedAt: userDoc.updatedAt || new Date(),
      isVerified: userDoc.isVerified || false,
    };

    return { success: true, user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

/**
 * requireAuth supports two calling conventions:
 *   1. Curried:  requireAuth(handler)(request)
 *   2. Direct:   requireAuth(request, handler)
 */
export function requireAuth(
  requestOrHandler: NextRequest | AuthenticatedHandler,
  handler?: AuthenticatedHandler
): any {
  // Convention 2: requireAuth(request, handler)
  if (requestOrHandler instanceof NextRequest && handler) {
    return (async () => {
      const authResult = await authenticateRequest(requestOrHandler);
      if (!authResult.success) {
        return NextResponse.json({ error: authResult.error || 'Authentication required' }, { status: 401 });
      }
      return handler(requestOrHandler, authResult.user!);
    })();
  }

  // Convention 1: requireAuth(handler) — returns async (request) => ...
  const h = requestOrHandler as AuthenticatedHandler;
  return async (request: NextRequest) => {
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error || 'Authentication required' }, { status: 401 });
    }
    return h(request, authResult.user!);
  };
}

/**
 * requirePremium supports two calling conventions:
 *   1. Curried:  requirePremium(handler)(request)
 *   2. Direct:   requirePremium(request, handler)
 */
export function requirePremium(
  requestOrHandler: NextRequest | AuthenticatedHandler,
  handler?: AuthenticatedHandler
): any {
  const check = async (request: NextRequest, h: AuthenticatedHandler) => {
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error || 'Authentication required' }, { status: 401 });
    }
    const user = authResult.user!;
    const isPremium = user.plan === 'pro' || user.plan === 'enterprise';
    if (!isPremium) {
      return NextResponse.json({ error: 'Premium plan required' }, { status: 403 });
    }
    return h(request, user);
  };

  if (requestOrHandler instanceof NextRequest && handler) {
    return check(requestOrHandler, handler);
  }

  const h = requestOrHandler as AuthenticatedHandler;
  return async (request: NextRequest) => check(request, h);
}

/**
 * requireEnterprise supports two calling conventions:
 *   1. Curried:  requireEnterprise(handler)(request)
 *   2. Direct:   requireEnterprise(request, handler)
 */
export function requireEnterprise(
  requestOrHandler: NextRequest | AuthenticatedHandler,
  handler?: AuthenticatedHandler
): any {
  const check = async (request: NextRequest, h: AuthenticatedHandler) => {
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error || 'Authentication required' }, { status: 401 });
    }
    const user = authResult.user!;
    if (user.plan !== 'enterprise') {
      return NextResponse.json({ error: 'Enterprise plan required' }, { status: 403 });
    }
    return h(request, user);
  };

  if (requestOrHandler instanceof NextRequest && handler) {
    return check(requestOrHandler, handler);
  }

  const h = requestOrHandler as AuthenticatedHandler;
  return async (request: NextRequest) => check(request, h);
}
