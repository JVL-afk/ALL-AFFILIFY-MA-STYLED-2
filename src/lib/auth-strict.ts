/**
 * Strict JWT Verification Module
 * Implements rigorous JWT validation with signature verification, expiration checks,
 * issuer validation, and audience claims verification.
 *
 * This module replaces any lenient JWT handling and ensures that all tokens are
 * cryptographically verified and claim-validated before use.
 */

import jwt from 'jsonwebtoken';
import { logger } from './debug-logger';

/**
 * Represents a verified JWT payload with strict typing.
 */
export interface VerifiedJWTPayload {
  sub: string; // Subject (user ID)
  userId: string;
  email: string;
  userPlan: 'free' | 'pro' | 'enterprise';
  role: 'user' | 'admin';
  iat: number; // Issued at
  exp: number; // Expiration time
  iss: string; // Issuer
  aud: string; // Audience
}

/**
 * Strict JWT verification with comprehensive claim validation.
 *
 * @param token - The JWT token to verify
 * @param secret - The secret key for verification (from environment)
 * @returns Verified JWT payload or null if verification fails
 * @throws Error if verification fails (for logging purposes)
 */
export function verifyAuthStrict(token: string, secret: string): VerifiedJWTPayload | null {
  const traceId = crypto.randomUUID();

  try {
    // Remove "Bearer " prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verify signature and decode
    const decoded = jwt.verify(cleanToken, secret, {
      algorithms: ['HS256', 'RS256'], // Restrict to secure algorithms
      issuer: process.env.JWT_ISSUER || 'affilify',
      audience: process.env.JWT_AUDIENCE || 'affilify-api',
      clockTolerance: 5, // 5 second tolerance for clock skew
    }) as VerifiedJWTPayload;

    // Validate required claims
    if (!decoded.sub || !decoded.userId || !decoded.email) {
      logger.warn('JWT missing required claims', {
        trace_id: traceId,
        service: 'AuthStrictModule',
        component: 'verifyAuthStrict',
        action: 'JWT validation failed',
        message: 'Missing required claims (sub, userId, email)',
        details: {
          hasSub: !!decoded.sub,
          hasUserId: !!decoded.userId,
          hasEmail: !!decoded.email,
        },
      });
      return null;
    }

    // Validate user plan
    const validPlans = ['free', 'pro', 'enterprise'];
    if (!validPlans.includes(decoded.userPlan)) {
      logger.warn('JWT invalid user plan', {
        trace_id: traceId,
        service: 'AuthStrictModule',
        component: 'verifyAuthStrict',
        action: 'JWT validation failed',
        message: `Invalid user plan: ${decoded.userPlan}`,
        user_id: decoded.userId,
      });
      return null;
    }

    // Validate role
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(decoded.role)) {
      logger.warn('JWT invalid role', {
        trace_id: traceId,
        service: 'AuthStrictModule',
        component: 'verifyAuthStrict',
        action: 'JWT validation failed',
        message: `Invalid role: ${decoded.role}`,
        user_id: decoded.userId,
      });
      return null;
    }

    // Validate expiration (jwt.verify already checks this, but explicit validation for clarity)
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp <= now) {
      logger.warn('JWT expired', {
        trace_id: traceId,
        service: 'AuthStrictModule',
        component: 'verifyAuthStrict',
        action: 'JWT validation failed',
        message: 'Token has expired',
        user_id: decoded.userId,
        details: { expiredAt: new Date(decoded.exp * 1000).toISOString() },
      });
      return null;
    }

    logger.info('JWT verification successful', {
      trace_id: traceId,
      service: 'AuthStrictModule',
      component: 'verifyAuthStrict',
      action: 'JWT verified',
      message: 'JWT token verified successfully',
      user_id: decoded.userId,
    });

    return decoded;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('JWT verification failed', {
      trace_id: traceId,
      service: 'AuthStrictModule',
      component: 'verifyAuthStrict',
      action: 'JWT verification error',
      message: `JWT verification error: ${errorMessage}`,
      details: { errorType: error instanceof jwt.JsonWebTokenError ? error.name : 'Unknown' },
    });
    return null;
  }
}

/**
 * Extract and verify JWT from Authorization header.
 *
 * @param authHeader - The Authorization header value
 * @param secret - The secret key for verification
 * @returns Verified JWT payload or null if verification fails
 */
export function extractAndVerifyJWT(authHeader: string | undefined, secret: string): VerifiedJWTPayload | null {
  if (!authHeader) {
    logger.warn('Missing Authorization header', {
      service: 'AuthStrictModule',
      component: 'extractAndVerifyJWT',
      action: 'Authorization header missing',
      message: 'No Authorization header provided',
    });
    return null;
  }

  return verifyAuthStrict(authHeader, secret);
}

/**
 * Verify that the JWT belongs to the specified user (prevents token hijacking).
 *
 * @param payload - The verified JWT payload
 * @param expectedUserId - The expected user ID
 * @returns true if the user ID matches, false otherwise
 */
export function verifyUserIdMatch(payload: VerifiedJWTPayload, expectedUserId: string): boolean {
  const matches = payload.userId === expectedUserId;
  if (!matches) {
    logger.warn('User ID mismatch in JWT', {
      service: 'AuthStrictModule',
      component: 'verifyUserIdMatch',
      action: 'User ID mismatch',
      message: 'JWT user ID does not match expected user ID',
      user_id: payload.userId,
      details: { expectedUserId },
    });
  }
  return matches;
}

/**
 * Check if the JWT holder has admin privileges.
 *
 * @param payload - The verified JWT payload
 * @returns true if the user is an admin, false otherwise
 */
export function isAdmin(payload: VerifiedJWTPayload): boolean {
  return payload.role === 'admin';
}

/**
 * Check if the JWT holder has a specific plan or higher.
 *
 * @param payload - The verified JWT payload
 * @param requiredPlan - The minimum required plan ('free', 'pro', 'enterprise')
 * @returns true if the user's plan meets or exceeds the requirement
 */
export function hasPlanOrHigher(payload: VerifiedJWTPayload, requiredPlan: 'free' | 'pro' | 'enterprise'): boolean {
  const planHierarchy = { free: 0, pro: 1, enterprise: 2 };
  return planHierarchy[payload.userPlan] >= planHierarchy[requiredPlan];
}
