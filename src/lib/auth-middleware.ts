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

type AuthenticatedHandler = (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>;

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
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
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
}

    return { success: true, user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

// Best-in-Class: Higher-order function for basic authentication
export const requireAuth = (handler: AuthenticatedHandler) => async (request: NextRequest) => {
  const authResult = await authenticateRequest(request);

  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error || 'Authentication required' }, { status: 401 });
  }

  return handler(request, authResult.user!);
};

// Best-in-Class: Higher-order function for premium plan requirement
export const requirePremium = (handler: AuthenticatedHandler) => async (request: NextRequest) => {
  const authResult = await authenticateRequest(request);

  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error || 'Authentication required' }, { status: 401 });
  }

  const user = authResult.user!;
  const isPremium = user.plan === 'pro' || user.plan === 'enterprise';

  if (!isPremium) {
    return NextResponse.json({ error: 'Premium plan required' }, { status: 403 });
  }

  return handler(request, user);
};

// Best-in-Class: Higher-order function for enterprise plan requirement
export const requireEnterprise = (handler: AuthenticatedHandler) => async (request: NextRequest) => {
  const authResult = await authenticateRequest(request);

  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error || 'Authentication required' }, { status: 401 });
  }

  const user = authResult.user!;
  const isEnterprise = user.plan === 'enterprise';

  if (!isEnterprise) {
    return NextResponse.json({ error: 'Enterprise plan required' }, { status: 403 });
  }

  return handler(request, user);
};

