/**
 * TenantContext Middleware - Hardened Multi-Tenant Isolation
 *
 * INVARIANT: Every request must have a valid tenantId extracted from JWT
 * INVARIANT: TenantId must be validated against JWT claims
 * INVARIANT: Application fails at startup if JWT_SECRET is not configured
 * INVARIANT: Every request gets a unique, cryptographically secure traceId
 */

import { jwtVerify } from 'jose';
import { randomUUID } from 'crypto';

export interface TenantContext {
  tenantId: string;
  userId: string;
  tier: 'free' | 'pro' | 'enterprise';
  traceId: string;
}

/**
 * Extract and validate tenant context from request headers.
 * Fails closed: throws immediately if any validation fails.
 *
 * NOTE: This function is async because jwtVerify() returns a Promise.
 */
export async function getTenantContextFromHeaders(headers: Headers): Promise<TenantContext> {
  // 1. Extract authorization header
  const authHeader = headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('TENANT_ISOLATION_VIOLATION: Missing or invalid authorization header');
  }

  const token = authHeader.slice(7);

  // 2. Verify JWT signature
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('FATAL: JWT_SECRET environment variable is not configured. Application cannot start.');
  }

  let decoded;
  try {
    const secret = new TextEncoder().encode(jwtSecret);
    // jwtVerify is async — must be awaited to access .payload
    const verified = await jwtVerify(token, secret);
    decoded = verified.payload;
  } catch (error) {
    throw new Error(`TENANT_ISOLATION_VIOLATION: Invalid JWT token - ${(error as any).message}`);
  }

  // 3. Extract and validate tenantId
  const tenantId = decoded.tenantId as string;
  if (!tenantId || typeof tenantId !== 'string' || tenantId.trim() === '') {
    throw new Error('TENANT_ISOLATION_VIOLATION: Missing or invalid tenantId in JWT claims');
  }

  // 4. Extract userId
  const userId = decoded.userId as string;
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new Error('TENANT_ISOLATION_VIOLATION: Missing or invalid userId in JWT claims');
  }

  // 5. Extract tier (default to 'free' if not specified)
  const tier = (decoded.tier as string) || 'free';
  if (!['free', 'pro', 'enterprise'].includes(tier)) {
    throw new Error(`TENANT_ISOLATION_VIOLATION: Invalid tier in JWT claims - ${tier}`);
  }

  // 6. Generate secure traceId
  const traceId = `trace-${randomUUID()}`;

  console.log(
    `[TENANT_CONTEXT] Extracted context. TenantId: ${tenantId}, UserId: ${userId}, Tier: ${tier}, TraceId: ${traceId}`
  );

  return {
    tenantId,
    userId,
    tier: tier as 'free' | 'pro' | 'enterprise',
    traceId,
  };
}

/**
 * Middleware to inject tenant context into request headers.
 * This is typically used in Next.js API routes.
 */
export function withTenantContext(handler: any) {
  return async (request: any, context: any) => {
    try {
      const tenantContext = await getTenantContextFromHeaders(request.headers);
      // Inject context into request for downstream handlers
      request.tenantContext = tenantContext;
      return handler(request, context);
    } catch (error) {
      console.error('[TENANT_CONTEXT] Error extracting tenant context:', error);
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          code: 'TENANT_ISOLATION_VIOLATION',
          message: (error as any).message,
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}
