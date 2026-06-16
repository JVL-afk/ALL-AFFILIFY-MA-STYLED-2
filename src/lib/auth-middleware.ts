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
 * Authenticate a request. Accepts native Request or NextRequest.
 * Reads token from Authorization header or cookies.
 */
export async function authenticateRequest(
  request: Request
): Promise<{ success: boolean; user?: AuthenticatedUser; error?: string }> {
  try {
    let token: string | null = null;

    // 1. Authorization: Bearer <token>
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // 2. Cookies - parse from raw header (works for any Request type)
    if (!token) {
      const cookieHeader = request.headers.get('cookie') || '';
      const parseCookie = (name: string): string | undefined => {
        const match = cookieHeader.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : undefined;
      };
      token =
        parseCookie('token') ||
        parseCookie('auth-token') ||
        parseCookie('authToken') ||
        parseCookie('jwt') ||
        null;

      // Also try NextRequest.cookies API if available
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
 * requireAuth - supports two call patterns, detected via typeof (NOT instanceof):
 *
 *   Curried:  export const GET = requireAuth(handler)
 *   Direct:   export async function GET(req) { return requireAuth(req, handler) }
 *
 * Using typeof instead of instanceof NextRequest because Next.js 16 App Router
 * passes native Request subclasses that fail instanceof checks at runtime.
 */
export function requireAuth(handler: AuthenticatedHandler): (request: Request) => Promise<NextResponse | Response>;
export function requireAuth(request: Request, handler: AuthenticatedHandler): Promise<NextResponse | Response>;
export function requireAuth(
  requestOrHandler: Request | AuthenticatedHandler,
  handler?: AuthenticatedHandler
): any {
  // Curried pattern: first arg is a function
  if (typeof requestOrHandler === 'function') {
    const h = requestOrHandler;
    return async (request: Request): Promise<NextResponse | Response> => {
      const authResult = await authenticateRequest(request);
      if (!authResult.success) {
        return NextResponse.json({ error: authResult.error || 'Authentication required' }, { status: 401 });
      }
      return h(request as NextRequest, authResult.user!);
    };
  }

  // Direct pattern: first arg is a Request
  return (async () => {
    const authResult = await authenticateRequest(requestOrHandler);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error || 'Authentication required' }, { status: 401 });
    }
    return handler!(requestOrHandler as NextRequest, authResult.user!);
  })();
}

/**
 * requirePremium - restricts to pro or enterprise users.
 * Supports both curried and direct call patterns.
 */
export function requirePremium(handler: AuthenticatedHandler): (request: Request) => Promise<NextResponse | Response>;
export function requirePremium(request: Request, handler: AuthenticatedHandler): Promise<NextResponse | Response>;
export function requirePremium(
  requestOrHandler: Request | AuthenticatedHandler,
  handler?: AuthenticatedHandler
): any {
  const check = async (request: Request, h: AuthenticatedHandler): Promise<NextResponse | Response> => {
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error || 'Authentication required' }, { status: 401 });
    }
    const user = authResult.user!;
    if (user.plan !== 'pro' && user.plan !== 'enterprise') {
      return NextResponse.json({ error: 'Premium plan required' }, { status: 403 });
    }
    return h(request as NextRequest, user);
  };

  if (typeof requestOrHandler === 'function') {
    const h = requestOrHandler;
    return async (request: Request) => check(request, h);
  }

  return check(requestOrHandler, handler!);
}

/**
 * requireEnterprise - restricts to enterprise users only.
 * Supports both curried and direct call patterns.
 */
export function requireEnterprise(handler: AuthenticatedHandler): (request: Request) => Promise<NextResponse | Response>;
export function requireEnterprise(request: Request, handler: AuthenticatedHandler): Promise<NextResponse | Response>;
export function requireEnterprise(
  requestOrHandler: Request | AuthenticatedHandler,
  handler?: AuthenticatedHandler
): any {
  const check = async (request: Request, h: AuthenticatedHandler): Promise<NextResponse | Response> => {
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error || 'Authentication required' }, { status: 401 });
    }
    const user = authResult.user!;
    if (user.plan !== 'enterprise') {
      return NextResponse.json({ error: 'Enterprise plan required' }, { status: 403 });
    }
    return h(request as NextRequest, user);
  };

  if (typeof requestOrHandler === 'function') {
    const h = requestOrHandler;
    return async (request: Request) => check(request, h);
  }

  return check(requestOrHandler, handler!);
}
