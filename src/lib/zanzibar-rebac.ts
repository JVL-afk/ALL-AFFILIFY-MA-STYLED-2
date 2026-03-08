import { logger } from './debug-logger';
import { VerifiedJWTPayload } from './auth-strict';
import { ObjectId } from 'mongodb';
import RelationshipTupleModel, { IRelationshipTuple } from './models/RelationshipTuple';

// Define the core relationship tuple structure
export interface RelationshipTuple {
  object: string; // e.g., 'document:doc123', 'folder:fld456'
  relation: string; // e.g., 'viewer', 'editor', 'owner', 'parent'
  subject: string; // e.g., 'user:user789', 'group:eng#member', 'user:user789#owner'
}

// Zookie interface for consistency tokens
export interface Zookie {
  version: string; // A globally unique timestamp or sequence number
}

// Function to add a relationship tuple
export async function addRelationship(tuple: RelationshipTuple, traceId?: string): Promise<Zookie> {
  const newTuple: IRelationshipTuple = {
    ...tuple,
    createdAt: new Date(),
  } as IRelationshipTuple;

  await RelationshipTupleModel.create(newTuple);

  const zookie = generateZookie(); // Generate a new Zookie on write

  logger.info('ZanzibarReBAC', 'addRelationship', 'Relationship tuple added', {
    trace_id: traceId,
    tuple: newTuple,
    zookie,
  });
  return zookie;
}

// Function to delete a relationship tuple
export async function deleteRelationship(tuple: RelationshipTuple, traceId?: string): Promise<Zookie> {
  await RelationshipTupleModel.deleteOne({
    object: tuple.object,
    relation: tuple.relation,
    subject: tuple.subject,
  });

  const zookie = generateZookie(); // Generate a new Zookie on write

  logger.info('ZanzibarReBAC', 'deleteRelationship', 'Relationship tuple deleted', {
    trace_id: traceId,
    tuple,
    zookie,
  });
  return zookie;
}

// Function to check a permission using the Zanzibar model
export async function checkPermission(
  subject: string, // e.g., 'user:user789'
  relation: string, // e.g., 'viewer'
  object: string, // e.g., 'document:doc123'
  zookie?: Zookie, // Optional Zookie for consistency
  traceId?: string
): Promise<boolean> {
  logger.debug('ZanzibarReBAC', 'checkPermission', 'Checking permission', {
    trace_id: traceId,
    subject, relation, object, zookie
  });

  // Direct check: Does the exact tuple exist?
  const directMatch = await RelationshipTupleModel.findOne({
    object,
    relation,
    subject,
  });

  if (directMatch) {
    logger.debug('ZanzibarReBAC', 'checkPermission', 'Direct relationship found', { trace_id: traceId, subject, relation, object });
    return true;
  }

  // Handle '...' in subject (e.g., 'group:eng#member')
  const subjectParts = subject.split('#');
  if (subjectParts.length === 2) {
    const [subjectNamespaceId, subjectRelation] = subjectParts;

    // Find relationships where the object is the subjectNamespaceId and the relation is subjectRelation
    // And the subject of *that* relationship is the original subject (e.g., user:user789 is a member of group:eng)
    const indirectMembership = await RelationshipTupleModel.findOne({
      object: subjectNamespaceId,
      relation: subjectRelation,
      subject: subject,
    });

    if (indirectMembership) {
      // Now, check if that group (subjectNamespaceId) has the permission on the object
      const groupPermission = await RelationshipTupleModel.findOne({
        object,
        relation,
        subject: subjectNamespaceId,
      });

      if (groupPermission) {
        logger.debug('ZanzibarReBAC', 'checkPermission', 'Indirect relationship found via group membership', { trace_id: traceId, subject, relation, object });
        return true;
      }
    }
  }

  logger.warn('ZanzibarReBAC', 'checkPermission', 'Permission denied', { trace_id: traceId, subject, relation, object });
  return false;
}

// Helper to construct subject string from user payload
export function userToSubject(user: VerifiedJWTPayload): string {
  return `user:${user.userId}`;
}

// Helper to construct object string
export function toObject(type: string, id: string): string {
  return `${type}:${id}`;
}

// Middleware to enforce Zanzibar permissions
export async function enforceZanzibarPermission(
  user: VerifiedJWTPayload,
  requiredRelation: string,
  objectType: string,
  objectId: string,
  zookie?: Zookie,
  traceId?: string
): Promise<void> {
  const subject = userToSubject(user);
  const object = toObject(objectType, objectId);

  const hasAccess = await checkPermission(subject, requiredRelation, object, zookie, traceId);

  if (!hasAccess) {
    logger.error('ZanzibarReBAC', 'enforceZanzibarPermission', 'Permission enforcement failed', {
      trace_id: traceId,
      user_id: user.userId,
      subject, requiredRelation, object,
      message: `User ${user.userId} is not authorized to ${requiredRelation} ${objectType}:${objectId}`,
    });
    throw new Error(`Unauthorized: You do not have permission to ${requiredRelation} ${objectType}:${objectId}`);
  }
}

// Generates a Zookie based on a simple timestamp. In a real Zanzibar system, this would be tied to the consistent global state of the relationship database.
export function generateZookie(): Zookie {
  return { version: new Date().toISOString() };
}
