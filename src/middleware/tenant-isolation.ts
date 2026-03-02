import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/debug-logger';
import { verifyAuth } from '@/lib/auth';

/**
 * Multi-Tenant Isolation Middleware
 * 
 * Enforces strict tenant isolation at the request boundary:
 * 1. Extracts and validates tenant ID from JWT token
 * 2. Injects tenant ID into request context
 * 3. Validates tenant ID in all subsequent operations
 * 4. Prevents cross-tenant data access
 */

export interface TenantContext {
  tenantId: string;
  userId: string;
  userPlan: 'free' | 'pro' | 'enterprise';
}

// Store tenant context in a request-scoped manner
const tenantContextMap = new WeakMap<Request, TenantContext>();

/**
 * Extract and validate tenant context from request.
 */
export async function extractTenantContext(request: NextRequest): Promise<TenantContext | null> {
  try {
    const authResult = await verifyAuth(request);

    if (!authResult.success || !authResult.user) {
      logger.warn('TenantIsolation', 'extractTenantContext', 'Authentication failed', {
        path: request.nextUrl.pathname,
      });
      return null;
    }

    const user = authResult.user as any;
    const tenantId = user.id;

    if (!tenantId) {
      logger.error('TenantIsolation', 'extractTenantContext', 'User ID missing from auth token', {
        path: request.nextUrl.pathname,
      });
      return null;
    }

    const tenantContext: TenantContext = {
      tenantId,
      userId: user.id,
      userPlan: user.plan || 'free',
    };

    logger.debug('TenantIsolation', 'extractTenantContext', 'Tenant context extracted', {
      tenantId,
      userPlan: user.plan,
      path: request.nextUrl.pathname,
    });

    return tenantContext;
  } catch (error) {
    logger.error('TenantIsolation', 'extractTenantContext', 'Error extracting tenant context', {
      error: (error as Error).message,
      path: request.nextUrl.pathname,
    });
    return null;
  }
}

/**
 * Validate that a query or operation includes the tenant filter.
 * This is a runtime guard to prevent accidental cross-tenant data access.
 */
export function validateTenantFilter(tenantId: string, filter: Record<string, any>): boolean {
  if (!filter || typeof filter !== 'object') {
    return false;
  }

  // Check if userId is present in the filter
  const hasUserIdFilter = 'userId' in filter;

  if (!hasUserIdFilter) {
    logger.error('TenantIsolation', 'validateTenantFilter', 'Query missing tenant filter (userId)', {
      tenantId,
      filter: JSON.stringify(filter),
    });
    return false;
  }

  return true;
}

/**
 * Enforce tenant isolation in database queries.
 * Automatically adds userId filter to queries.
 */
export function enforceTenantFilter(tenantId: string, filter: Record<string, any>): Record<string, any> {
  if (!filter) {
    filter = {};
  }

  // Always include userId in the filter
  filter.userId = tenantId;

  logger.debug('TenantIsolation', 'enforceTenantFilter', 'Tenant filter enforced', {
    tenantId,
    filter: JSON.stringify(filter),
  });

  return filter;
}

/**
 * Create a middleware wrapper that enforces tenant isolation.
 */
export function withTenantIsolation(
  handler: (request: NextRequest, context: TenantContext) => Promise<NextResponse>
) {
  return async (request: NextRequest, params?: any): Promise<NextResponse> => {
    const tenantContext = await extractTenantContext(request);

    if (!tenantContext) {
      logger.warn('TenantIsolation', 'withTenantIsolation', 'Tenant context extraction failed, rejecting request', {
        path: request.nextUrl.pathname,
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      return await handler(request, tenantContext);
    } catch (error) {
      logger.error('TenantIsolation', 'withTenantIsolation', 'Error in tenant-isolated handler', {
        tenantId: tenantContext.tenantId,
        error: (error as Error).message,
        path: request.nextUrl.pathname,
      });
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}

/**
 * Guard against queries without tenant filters.
 * This is a runtime assertion that will throw if a query is executed without proper tenant isolation.
 */
export function assertTenantFilter(tenantId: string, filter: Record<string, any>): void {
  if (!validateTenantFilter(tenantId, filter)) {
    const error = new Error(`CRITICAL: Query executed without tenant filter for tenant ${tenantId}`);
    logger.error('TenantIsolation', 'assertTenantFilter', 'Tenant isolation violation detected', {
      tenantId,
      filter: JSON.stringify(filter),
      stack: error.stack,
    });
    throw error;
  }
}
