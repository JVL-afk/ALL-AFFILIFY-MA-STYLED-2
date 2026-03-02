/**
 * Role-Based Access Control (RBAC) Module
 * Implements fine-grained permission enforcement based on user roles.
 *
 * Roles:
 * - user: Regular user with basic permissions
 * - admin: Administrator with elevated permissions
 */

import { VerifiedJWTPayload } from './auth-strict';
import { logger } from './debug-logger';

/**
 * Represents a permission action and resource.
 */
export interface Permission {
  action: string; // e.g., 'create', 'read', 'update', 'delete', 'send', 'reset_quota'
  resource: string; // e.g., 'campaign', 'subscriber', 'quota', 'analytics'
}

/**
 * Role-to-permissions mapping.
 */
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  user: [
    // Campaign permissions
    { action: 'create', resource: 'campaign' },
    { action: 'read', resource: 'campaign' },
    { action: 'update', resource: 'campaign' },
    { action: 'delete', resource: 'campaign' },
    { action: 'send', resource: 'campaign' },
    { action: 'read', resource: 'campaign_analytics' },

    // Subscriber permissions
    { action: 'create', resource: 'subscriber' },
    { action: 'read', resource: 'subscriber' },
    { action: 'update', resource: 'subscriber' },
    { action: 'delete', resource: 'subscriber' },
    { action: 'import', resource: 'subscriber' },

    // Template permissions
    { action: 'create', resource: 'template' },
    { action: 'read', resource: 'template' },
    { action: 'update', resource: 'template' },
    { action: 'delete', resource: 'template' },

    // Segment permissions
    { action: 'create', resource: 'segment' },
    { action: 'read', resource: 'segment' },
    { action: 'update', resource: 'segment' },
    { action: 'delete', resource: 'segment' },

    // Account permissions
    { action: 'read', resource: 'account' },
    { action: 'update', resource: 'account' },
  ],
  admin: [
    // All user permissions
    ...ROLE_PERMISSIONS['user'],

    // Admin-only permissions
    { action: 'reset_quota', resource: 'quota' },
    { action: 'view_all_campaigns', resource: 'campaign' },
    { action: 'view_all_subscribers', resource: 'subscriber' },
    { action: 'view_analytics', resource: 'system' },
    { action: 'manage_users', resource: 'user' },
    { action: 'manage_plans', resource: 'plan' },
    { action: 'view_logs', resource: 'system' },
    { action: 'manage_circuit_breaker', resource: 'system' },
  ],
};

/**
 * Check if a user has a specific permission.
 *
 * @param payload - The verified JWT payload
 * @param permission - The permission to check
 * @param traceId - Optional trace ID for logging
 * @returns true if the user has the permission, false otherwise
 */
export function hasPermission(
  payload: VerifiedJWTPayload,
  permission: Permission,
  traceId?: string
): boolean {
  const userPermissions = ROLE_PERMISSIONS[payload.role] || [];
  const hasPermission = userPermissions.some(
    (p) => p.action === permission.action && p.resource === permission.resource
  );

  if (!hasPermission) {
    logger.warn('Permission denied', {
      trace_id: traceId,
      service: 'RBACModule',
      component: 'hasPermission',
      action: 'Permission check failed',
      message: `User does not have permission to ${permission.action} ${permission.resource}`,
      user_id: payload.userId,
      details: { role: payload.role, requiredPermission: permission },
    });
  }

  return hasPermission;
}

/**
 * Check if a user has all specified permissions.
 *
 * @param payload - The verified JWT payload
 * @param permissions - The permissions to check
 * @param traceId - Optional trace ID for logging
 * @returns true if the user has all permissions, false otherwise
 */
export function hasAllPermissions(
  payload: VerifiedJWTPayload,
  permissions: Permission[],
  traceId?: string
): boolean {
  return permissions.every((p) => hasPermission(payload, p, traceId));
}

/**
 * Check if a user has any of the specified permissions.
 *
 * @param payload - The verified JWT payload
 * @param permissions - The permissions to check
 * @param traceId - Optional trace ID for logging
 * @returns true if the user has any of the permissions, false otherwise
 */
export function hasAnyPermission(
  payload: VerifiedJWTPayload,
  permissions: Permission[],
  traceId?: string
): boolean {
  return permissions.some((p) => hasPermission(payload, p, traceId));
}

/**
 * Enforce a permission check and throw an error if denied.
 *
 * @param payload - The verified JWT payload
 * @param permission - The permission to enforce
 * @param traceId - Optional trace ID for logging
 * @throws Error if permission is denied
 */
export function enforcePermission(
  payload: VerifiedJWTPayload,
  permission: Permission,
  traceId?: string
): void {
  if (!hasPermission(payload, permission, traceId)) {
    logger.error('Permission enforcement failed', {
      trace_id: traceId,
      service: 'RBACModule',
      component: 'enforcePermission',
      action: 'Permission enforcement error',
      message: `User is not authorized to ${permission.action} ${permission.resource}`,
      user_id: payload.userId,
      details: { role: payload.role, requiredPermission: permission },
    });
    throw new Error(`Unauthorized: You do not have permission to ${permission.action} ${permission.resource}`);
  }
}

/**
 * Get all permissions for a user's role.
 *
 * @param role - The user's role
 * @returns Array of permissions for the role
 */
export function getPermissionsForRole(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a user can access a specific resource.
 *
 * @param payload - The verified JWT payload
 * @param resource - The resource to access
 * @param traceId - Optional trace ID for logging
 * @returns true if the user can read the resource, false otherwise
 */
export function canAccessResource(
  payload: VerifiedJWTPayload,
  resource: string,
  traceId?: string
): boolean {
  return hasPermission(payload, { action: 'read', resource }, traceId);
}

/**
 * Check if a user can modify a specific resource.
 *
 * @param payload - The verified JWT payload
 * @param resource - The resource to modify
 * @param traceId - Optional trace ID for logging
 * @returns true if the user can update the resource, false otherwise
 */
export function canModifyResource(
  payload: VerifiedJWTPayload,
  resource: string,
  traceId?: string
): boolean {
  return hasPermission(payload, { action: 'update', resource }, traceId);
}
