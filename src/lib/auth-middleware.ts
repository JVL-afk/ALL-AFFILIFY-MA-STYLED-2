import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

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

/**
 * Authenticate a raw request and return the user, or an error.
 * Accepts both NextRequest and native Request (Next.js 16 compatibility).
 */
export async function authenticateRequest(
  request: Request
): Promise<{ success: boolean; user?: AuthenticatedUser; error?: string }> {
  try {
    let token: string | null = null;

    // Check Authorization header (Bearer token)
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Parse cookies from header (works for both NextRequest and native Request)
    if (!token) {
      const cookieHeader = request.headers.get('cookie') || '';
      const parseCookie = (name: string): string | undefined => {
        const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
        return match ? decodeURIComponent(match[1]) : undefined;
      };
      token =
        parseCookie('token') ||
        parseCookie('auth-token') ||
        parseCookie('authToken') ||
        parseCookie('jwt') ||
        null;

      // Also try NextRequest.cookies if the object supports it
      if (!token && typeof (request as any).cookies?.get === 'function') {
        const nreq = request as NextRequest;
        token =
          nreq.cookies.get('token')?.value ||
          nreq.cookies.get('auth-token')?.value ||
          nreq.cookies.get('authToken')?.value ||
          nreq.cookies.get('jwt')?.value ||
          null;
      }
    }

    if (!token) {
      return { success: false, error: 'Authentication required' };
    }

    const JWT_SECRET =
      process.env.JWT_SECRET ||
      'affilify_jwt_2025_romania_student_success_portocaliu_orange_power_gaming_affiliate_marketing_revolution_secure_token_generation_system_v1';

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return { success: false, error: 'Invalid token' };
    }

    const { db } = await connectToDatabase();
    const userDoc = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    );

    if (!userDoc) {
      return { success: false, error: 'User not found' };
    }

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
 * requireAuth(request, handler) — authenticates and runs handler if valid.
 *
 * ROOT CAUSE FIX (Next.js 16):
 * The previous implementation used `instanceof NextRequest` to detect which
 * calling convention was being used. In Next.js 16 App Router, the request
 * passed to route handlers is NOT always a true NextRequest instance — it is
 * a native Web API Request subclass. The instanceof check therefore evaluated
 * to false, causing requireAuth to fall into the curried path and return a
 * FUNCTION instead of a Response. Next.js then logged:
 *   "No response is returned from route handler"
 * across every single API route using this middleware.
 *
 * Fix: The function now has a single, unambiguous signature — it always takes
 * (request, handler) and always returns a Promise<Response>. No overloading,
 * no instanceof, no runtime dispatch. The call sites already use this pattern.
 */
export async function requireAuth(
  request: Request,
  handler: AuthenticatedHandler
): Promise<NextResponse | Response> {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error || 'Authentication required' },
      { status: 401 }
    );
  }
  return handler(request as NextRequest, authResult.user!);
}

/**
 * requirePremium — restricts to pro or enterprise users only.
 */
export async function requirePremium(
  request: Request,
  handler: AuthenticatedHandler
): Promise<NextResponse | Response> {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error || 'Authentication required' },
      { status: 401 }
    );
  }
  const user = authResult.user!;
  if (user.plan !== 'pro' && user.plan !== 'enterprise') {
    return NextResponse.json({ error: 'Premium plan required' }, { status: 403 });
  }
  return handler(request as NextRequest, user);
}

/**
 * requireEnterprise — restricts to enterprise users only.
 */
export async function requireEnterprise(
  request: Request,
  handler: AuthenticatedHandler
): Promise<NextResponse | Response> {
  const authResult = await authenticateRequest(request);
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error || 'Authentication required' },
      { status: 401 }
    );
  }
  const user = authResult.user!;
  if (user.plan !== 'enterprise') {
    return NextResponse.json({ error: 'Enterprise plan required' }, { status: 403 });
  }
  return handler(request as NextRequest, user);
}
