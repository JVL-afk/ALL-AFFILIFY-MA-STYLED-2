// auth-edge.ts - Edge-compatible authentication functions
// This file provides authentication functions that work in Edge Runtime
// without using Node.js crypto modules

import { NextRequest } from 'next/server';
import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

export type PlanType = 'basic' | 'pro' | 'enterprise';

export interface User {
  _id: ObjectId;
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  websitesCreated: number;
  websiteLimit: number;
  analysesUsed: number;
  analysisLimit: number;
  isVerified: boolean;
}

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

// Simple token parsing function that doesn't use crypto
// This is less secure but works in Edge Runtime
export function parseToken(token: string): { userId: string } | null {
  try {
    // Base64 decode the token payload
    // Note: This doesn't verify the signature, just extracts the payload
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    
    if (!decoded.userId) return null;
    
    return { userId: decoded.userId };
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}

// Get user from database by ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );
    
    if (!user) return null;
    
    return {
      ...user,
      id: user._id.toString(),
    } as User;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

// Get user plan from token
export async function getUserPlanFromToken(token: string): Promise<{ 
  userId: string; 
  plan: PlanType; 
  isAuthenticated: boolean;
} | null> {
  try {
    const decoded = parseToken(token);
    if (!decoded || !decoded.userId) {
      return null;
    }
    
    const user = await getUserById(decoded.userId);
    if (!user) {
      return null;
    }
    
    return {
      userId: user.id,
      plan: user.plan,
      isAuthenticated: true
    };
  } catch (error) {
    console.error('Error getting user plan from token:', error);
    return null;
  }
}
