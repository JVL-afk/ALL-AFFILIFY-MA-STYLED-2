import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from './mongodb'
import { logger } from './debug-logger'

export interface User {
  _id: ObjectId
  id: string
  name: string
  email: string
  password: string
  plan: 'basic' | 'pro' | 'enterprise'
  websitesCreated: number
  websiteLimit: number
  analysesUsed: number
  analysisLimit: number
  stripeCustomerId?: string
  subscriptionId?: string
  subscriptionStatus?: string
  createdAt: Date
  updatedAt: Date
  isVerified: boolean
  verificationToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
}

export interface AuthenticatedUser extends Omit<User, 'password'> {}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || '7d'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
  return jwt.sign({ userId }, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function getUserById(userId: string): Promise<AuthenticatedUser | null> {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    )
    
    if (!user) return null
    
    return {
      ...user,
      id: user._id.toString(),
    } as AuthenticatedUser
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection('users').findOne({ email })
    
    if (!user) return null
    
    return {
      ...user,
      id: user._id.toString(),
    } as User
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
  plan?: 'basic' | 'pro' | 'enterprise'
}): Promise<AuthenticatedUser | null> {
  try {
    const { db } = await connectToDatabase()
    
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email)
    if (existingUser) {
      throw new Error('User already exists')
    }
    
    // Hash password
    const hashedPassword = await hashPassword(userData.password)
    
    // Set plan limits
    const planLimits = {
      basic: { websiteLimit: 3, analysisLimit: 10 },
      pro: { websiteLimit: 25, analysisLimit: 50 },
      enterprise: { websiteLimit: 999999, analysisLimit: 999999 } // Use large number for "unlimited"
    }
    
    const plan = userData.plan || 'basic'
    const limits = planLimits[plan as keyof typeof planLimits] || planLimits.basic
    
    // Create user
    const newUser = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      plan,
      websitesCreated: 0,
      websiteLimit: limits.websiteLimit,
      analysesUsed: 0,
      analysisLimit: limits.analysisLimit,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: true, // Auto-verify for simplicity
    }
    
    const result = await db.collection('users').insertOne(newUser)
    
    if (!result.insertedId) {
      throw new Error('Failed to create user')
    }
    
    return {
      ...newUser,
      _id: result.insertedId,
      id: result.insertedId.toString(),
    } as AuthenticatedUser
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      }
    )
    
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error updating user:', error)
    return false
  }
}

export async function incrementUserWebsites(userId: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { websitesCreated: 1 },
        $set: { updatedAt: new Date() }
      }
    )
    
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error incrementing user websites:', error)
    return false
  }
}

export async function incrementUserAnalyses(userId: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { analysesUsed: 1 },
        $set: { updatedAt: new Date() }
      }
    )
    
    return result.modifiedCount > 0
  } catch (error) {
    console.error('Error incrementing user analyses:', error)
    return false
  }
}
// --- Plan Requirement Wrappers ---



type AuthenticatedHandler = (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>

const checkPlan = (requiredPlan: 'premium' | 'enterprise') => (handler: AuthenticatedHandler) => async (request: NextRequest) => {
  const authResult = await verifyAuth(request)
  
  if (!authResult.success) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const user = authResult.user as AuthenticatedUser
  
  const isPremium = user.plan === 'pro' || user.plan === 'enterprise'
  const isEnterprise = user.plan === 'enterprise'

  if (requiredPlan === 'premium' && !isPremium) {
    return NextResponse.json({ error: 'Premium plan required' }, { status: 403 })
  }

  if (requiredPlan === 'enterprise' && !isEnterprise) {
    return NextResponse.json({ error: 'Enterprise plan required' }, { status: 403 })
  }

  return handler(request, user)
}

export const requirePremium = checkPlan('premium')
export const requireEnterprise = checkPlan('enterprise')

/**
 * REVOLUTIONARY FIX: Enhanced verifyAuth with comprehensive logging
 * Now checks BOTH Authorization header AND cookies for the JWT token
 * Provides hyper-detailed logging at every step
 */
export async function verifyAuth(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    logger.debug('AUTH', 'verifyAuth_START', { requestId, url: request.url });

    // STEP 1: Extract token from multiple sources
    let token: string | null = null;
    let tokenSource = 'UNKNOWN';

    // Check Authorization header (Bearer token) - PRIMARY SOURCE
    const authHeader = request.headers.get('Authorization');
    logger.debug('AUTH', 'CHECK_AUTH_HEADER', { requestId, authHeader: authHeader ? 'Present' : 'Missing' });
    
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      tokenSource = 'AUTHORIZATION_HEADER';
      logger.debug('AUTH', 'TOKEN_FOUND_IN_HEADER', { requestId, tokenLength: token.length });
    }

    // Check cookies (multiple possible names) - FALLBACK SOURCES
    if (!token) {
      logger.debug('AUTH', 'CHECKING_COOKIES', { requestId });
      
      const cookieNames = ['token', 'auth-token', 'authToken', 'jwt'];
      for (const cookieName of cookieNames) {
        const cookieValue = request.cookies.get(cookieName)?.value;
        if (cookieValue) {
          token = cookieValue;
          tokenSource = `COOKIE_${cookieName.toUpperCase()}`;
          logger.debug('AUTH', `TOKEN_FOUND_IN_COOKIE_${cookieName.toUpperCase()}`, { requestId, tokenLength: token.length });
          break;
        }
      }
    }

    // STEP 2: Validate token existence
    if (!token) {
      // Safely handle cookies.getAll() which might not exist on mock request objects
      const cookiesList = typeof request.cookies.getAll === 'function' 
        ? request.cookies.getAll().map(c => c.name) 
        : ['MOCK_REQUEST_NO_GETALL'];
        
      logger.warn('AUTH', 'NO_TOKEN_FOUND', { requestId, authHeader: !!authHeader, cookies: cookiesList });
      return { success: false, error: 'No token provided', details: { requestId, tokenSource } };
    }

    logger.debug('AUTH', 'TOKEN_EXTRACTED', { requestId, tokenSource, tokenLength: token.length });

    // STEP 3: Verify JWT signature
    logger.debug('AUTH', 'VERIFYING_JWT_SIGNATURE', { requestId, tokenLength: token.length });
    
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      logger.debug('AUTH', 'JWT_SIGNATURE_VALID', { requestId, userId: decoded.userId });
    } catch (jwtError: any) {
      logger.error('AUTH', 'JWT_SIGNATURE_INVALID', { requestId, error: jwtError.message }, jwtError);
      return { success: false, error: 'Invalid token', details: { requestId, tokenSource, jwtError: jwtError.message } };
    }

    // STEP 4: Extract userId from decoded token
    const userId = decoded.userId;
    if (!userId) {
      logger.error('AUTH', 'NO_USER_ID_IN_TOKEN', { requestId, decodedKeys: Object.keys(decoded) });
      return { success: false, error: 'Invalid token structure', details: { requestId, tokenSource } };
    }

    logger.debug('AUTH', 'USER_ID_EXTRACTED', { requestId, userId });

    // STEP 5: Fetch user from database
    logger.debug('AUTH', 'FETCHING_USER_FROM_DB', { requestId, userId });
    
    const { db } = await connectToDatabase();
    logger.debug('AUTH', 'MONGODB_CONNECTED', { requestId });

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      logger.warn('AUTH', 'USER_NOT_FOUND_IN_DB', { requestId, userId });
      return { success: false, error: 'User not found', details: { requestId, tokenSource, userId } };
    }

    logger.debug('AUTH', 'USER_FOUND_IN_DB', { requestId, userId, userEmail: user.email, userPlan: user.plan });

    // STEP 6: Return authenticated user
    logger.info('AUTH', 'AUTHENTICATION_SUCCESS', { requestId, userId, userEmail: user.email, tokenSource });
    
    return { 
      success: true, 
      user,
      details: { requestId, tokenSource, userId }
    };

  } catch (error: any) {
    logger.error('AUTH', 'AUTHENTICATION_FAILED', { requestId, error: error.message }, error);
    return { 
      success: false, 
      error: 'Authentication failed',
      details: { requestId, errorMessage: error.message }
    };
  }
}
