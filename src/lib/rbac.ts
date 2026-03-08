import { VerifiedJWTPayload } from './auth-strict';
import { logger } from './debug-logger';
import { enforceZanzibarPermission, toObject, userToSubject, Zookie } from './zanzibar-rebac';

/**
 * Represents a permission action and resource.
 * In the Zanzibar model, this maps to a relation and object type.
 */
export interface Permission {
  action: string; // e.g., 'create', 'read', 'update', 'delete', 'send', 'reset_quota'
  resource: string; // e.g., 'campaign', 'subscriber', 'quota', 'analytics'
}

/**
 * Enforce a permission check using the Zanzibar-inspired ReBAC model.
 * This function acts as a bridge from the existing RBAC interface to the new ReBAC system.
 *
 * @param payload - The verified JWT payload containing user information.
 * @param permission - The permission to enforce (action and resource).
 * @param traceId - Optional trace ID for logging.
 * @param zookie - Optional Zookie for consistency in Zanzibar checks.
 * @throws Error if permission is denied.
 */
export async function enforcePermission(
  payload: VerifiedJWTPayload,
  permission: Permission,
  traceId?: string,
  zookie?: Zookie
): Promise<void> {
  const subject = userToSubject(payload);
  const object = toObject(permission.resource, 'global'); // For now, assume global resource for simplicity, will be refined later
  const relation = permission.action; // Map action to relation

  try {
    await enforceZanzibarPermission(payload, relation, permission.resource, 'global', zookie, traceId);
    logger.debug('RBACModule', 'enforcePermission', 'Permission granted via Zanzibar', {
      trace_id: traceId,
      user_id: payload.userId,
      subject, relation, object,
    });
  } catch (error: any) {
    logger.error('RBACModule', 'enforcePermission', 'Permission enforcement failed via Zanzibar', {
      trace_id: traceId,
      user_id: payload.userId,
      subject, relation, object,
      error: error.message,
    });
    throw new Error(`Unauthorized: ${error.message}`);
  }
}

// The following functions are now deprecated or will be re-implemented using Zanzibar concepts.
// For now, they are kept as no-ops or simple wrappers to avoid breaking existing code.

export function hasPermission(
  payload: VerifiedJWTPayload,
  permission: Permission,
  traceId?: string
): boolean {
  // This function should ideally be replaced by a check against the Zanzibar service.
  // For now, it will always return true, assuming enforcePermission will handle actual checks.
  logger.warn('RBACModule', 'hasPermission', 'Using deprecated hasPermission. Use enforcePermission for actual checks.', {
    trace_id: traceId,
    user_id: payload.userId,
    permission,
  });
  return true; // Temporary: actual check will be done by enforcePermission
}

export function hasAllPermissions(
  payload: VerifiedJWTPayload,
  permissions: Permission[],
  traceId?: string
): boolean {
  logger.warn('RBACModule', 'hasAllPermissions', 'Using deprecated hasAllPermissions. Use enforcePermission for actual checks.', {
    trace_id: traceId,
    user_id: payload.userId,
    permissions,
  });
  return true; // Temporary
}

export function hasAnyPermission(
  payload: VerifiedJWTPayload,
  permissions: Permission[],
  traceId?: string
): boolean {
  logger.warn('RBACModule', 'hasAnyPermission', 'Using deprecated hasAnyPermission. Use enforcePermission for actual checks.', {
    trace_id: traceId,
    user_id: payload.userId,
    permissions,
  });
  return true; // Temporary
}

export function getPermissionsForRole(role: string): Permission[] {
  logger.warn('RBACModule', 'getPermissionsForRole', 'Using deprecated getPermissionsForRole. Roles are being replaced by Zanzibar relations.', {
    role,
  });
  return []; // Deprecated in Zanzibar model
}

export function canAccessResource(
  payload: VerifiedJWTPayload,
  resource: string,
  traceId?: string
): boolean {
  logger.warn('RBACModule', 'canAccessResource', 'Using deprecated canAccessResource. Use enforcePermission for actual checks.', {
    trace_id: traceId,
    user_id: payload.userId,
    resource,
  });
  return true; // Temporary
}

export function canModifyResource(
  payload: VerifiedJWTPayload,
  resource: string,
  traceId?: string
): boolean {
  logger.warn('RBACModule', 'canModifyResource', 'Using deprecated canModifyResource. Use enforcePermission for actual checks.', {
    trace_id: traceId,
    user_id: payload.userId,
    resource,
  });
  return true; // Temporary
}
