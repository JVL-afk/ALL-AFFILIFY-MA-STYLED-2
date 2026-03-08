import { logger } from './debug-logger';
import { ObjectId } from 'mongodb';

/**
 * Common Intermediate Representation (CIR) for CRDT Operations
 * 
 * This layer abstracts away the differences between Yjs and Automerge,
 * allowing operations from different CRDT implementations to be seamlessly exchanged.
 */

export enum CIROperationType {
  INSERT = 'INSERT',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  MERGE = 'MERGE',
}

export interface CIRMetadata {
  authorId: string;
  timestamp: Date;
  clientOrigin: string;
  operationId: string;
  causality: string[]; // Vector clock or HLC for causal ordering
}

export interface CIROperation {
  type: CIROperationType;
  objectId: string;
  path: string; // JSON path to the field being modified
  value?: any; // New value for INSERT/UPDATE
  oldValue?: any; // Previous value for DELETE/UPDATE (for undo/redo)
  metadata: CIRMetadata;
}

export interface CIRDocument {
  _id: ObjectId;
  documentId: string;
  operations: CIROperation[];
  currentState: any; // The current merged state of the document
  version: number; // Monotonically increasing version number
  lastModified: Date;
}

/**
 * Translate a Yjs operation to CIR format
 */
export function translateYjsOperationToCIR(
  yjsOp: any,
  authorId: string,
  clientOrigin: string,
  traceId?: string
): CIROperation {
  logger.debug('CRDT-CIR', 'translateYjsOperationToCIR', 'Translating Yjs operation to CIR', {
    trace_id: traceId,
    yjsOp,
  });

  // Simplified translation: assumes Yjs operations have a structure like:
  // { type: 'insert' | 'delete' | 'update', path: string, value?: any, oldValue?: any }
  const cirOp: CIROperation = {
    type: yjsOp.type === 'insert' ? CIROperationType.INSERT : 
          yjsOp.type === 'delete' ? CIROperationType.DELETE : 
          CIROperationType.UPDATE,
    objectId: yjsOp.objectId || 'unknown',
    path: yjsOp.path || '',
    value: yjsOp.value,
    oldValue: yjsOp.oldValue,
    metadata: {
      authorId,
      timestamp: new Date(),
      clientOrigin,
      operationId: generateOperationId(),
      causality: yjsOp.causality || [],
    },
  };

  logger.debug('CRDT-CIR', 'translateYjsOperationToCIR', 'Yjs operation translated to CIR', {
    trace_id: traceId,
    cirOp,
  });

  return cirOp;
}

/**
 * Translate an Automerge operation to CIR format
 */
export function translateAutomergeOperationToCIR(
  automergeOp: any,
  authorId: string,
  clientOrigin: string,
  traceId?: string
): CIROperation {
  logger.debug('CRDT-CIR', 'translateAutomergeOperationToCIR', 'Translating Automerge operation to CIR', {
    trace_id: traceId,
    automergeOp,
  });

  // Simplified translation: assumes Automerge operations have a structure like:
  // { action: 'set' | 'del' | 'ins', obj: string, key: string, value?: any, oldValue?: any }
  const cirOp: CIROperation = {
    type: automergeOp.action === 'set' ? CIROperationType.UPDATE :
          automergeOp.action === 'del' ? CIROperationType.DELETE :
          CIROperationType.INSERT,
    objectId: automergeOp.obj || 'unknown',
    path: automergeOp.key || '',
    value: automergeOp.value,
    oldValue: automergeOp.oldValue,
    metadata: {
      authorId,
      timestamp: new Date(),
      clientOrigin,
      operationId: generateOperationId(),
      causality: automergeOp.causality || [],
    },
  };

  logger.debug('CRDT-CIR', 'translateAutomergeOperationToCIR', 'Automerge operation translated to CIR', {
    trace_id: traceId,
    cirOp,
  });

  return cirOp;
}

/**
 * Translate a CIR operation to Yjs format
 */
export function translateCIRToYjsOperation(cirOp: CIROperation, traceId?: string): any {
  logger.debug('CRDT-CIR', 'translateCIRToYjsOperation', 'Translating CIR operation to Yjs', {
    trace_id: traceId,
    cirOp,
  });

  const yjsOp = {
    type: cirOp.type === CIROperationType.INSERT ? 'insert' :
           cirOp.type === CIROperationType.DELETE ? 'delete' :
           'update',
    objectId: cirOp.objectId,
    path: cirOp.path,
    value: cirOp.value,
    oldValue: cirOp.oldValue,
    causality: cirOp.metadata.causality,
  };

  logger.debug('CRDT-CIR', 'translateCIRToYjsOperation', 'CIR operation translated to Yjs', {
    trace_id: traceId,
    yjsOp,
  });

  return yjsOp;
}

/**
 * Translate a CIR operation to Automerge format
 */
export function translateCIRToAutomergeOperation(cirOp: CIROperation, traceId?: string): any {
  logger.debug('CRDT-CIR', 'translateCIRToAutomergeOperation', 'Translating CIR operation to Automerge', {
    trace_id: traceId,
    cirOp,
  });

  const automergeOp = {
    action: cirOp.type === CIROperationType.UPDATE ? 'set' :
            cirOp.type === CIROperationType.DELETE ? 'del' :
            'ins',
    obj: cirOp.objectId,
    key: cirOp.path,
    value: cirOp.value,
    oldValue: cirOp.oldValue,
    causality: cirOp.metadata.causality,
  };

  logger.debug('CRDT-CIR', 'translateCIRToAutomergeOperation', 'CIR operation translated to Automerge', {
    trace_id: traceId,
    automergeOp,
  });

  return automergeOp;
}

/**
 * Apply a CIR operation to a document state
 */
export function applyCIROperation(state: any, operation: CIROperation, traceId?: string): any {
  logger.debug('CRDT-CIR', 'applyCIROperation', 'Applying CIR operation to document state', {
    trace_id: traceId,
    operation,
  });

  const newState = JSON.parse(JSON.stringify(state)); // Deep copy

  const pathParts = operation.path.split('.');
  let current = newState;

  // Navigate to the target location
  for (let i = 0; i < pathParts.length - 1; i++) {
    if (!current[pathParts[i]]) {
      current[pathParts[i]] = {};
    }
    current = current[pathParts[i]];
  }

  const lastKey = pathParts[pathParts.length - 1];

  // Apply the operation
  switch (operation.type) {
    case CIROperationType.INSERT:
    case CIROperationType.UPDATE:
      current[lastKey] = operation.value;
      break;
    case CIROperationType.DELETE:
      delete current[lastKey];
      break;
    case CIROperationType.MERGE:
      // For merge operations, merge the value into the current state
      if (typeof operation.value === 'object' && typeof current[lastKey] === 'object') {
        current[lastKey] = { ...current[lastKey], ...operation.value };
      } else {
        current[lastKey] = operation.value;
      }
      break;
  }

  logger.debug('CRDT-CIR', 'applyCIROperation', 'CIR operation applied successfully', {
    trace_id: traceId,
    newState,
  });

  return newState;
}

/**
 * Check if two operations can be merged (i.e., they don't conflict)
 */
export function canMergeOperations(op1: CIROperation, op2: CIROperation, traceId?: string): boolean {
  logger.debug('CRDT-CIR', 'canMergeOperations', 'Checking if operations can be merged', {
    trace_id: traceId,
    op1Path: op1.path,
    op2Path: op2.path,
  });

  // Two operations can be merged if they operate on different paths
  // or if they are both idempotent (e.g., two UPDATEs to the same path)
  if (op1.path !== op2.path) {
    return true;
  }

  // If they operate on the same path, they can only be merged if they are both UPDATEs
  // (i.e., the second UPDATE will overwrite the first)
  if (op1.type === CIROperationType.UPDATE && op2.type === CIROperationType.UPDATE) {
    return true;
  }

  return false;
}

/**
 * Generate a unique operation ID
 */
function generateOperationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate a CIR operation for correctness and completeness
 */
export function validateCIROperation(operation: CIROperation, traceId?: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!operation.type || !Object.values(CIROperationType).includes(operation.type)) {
    errors.push('Invalid operation type');
  }

  if (!operation.objectId) {
    errors.push('Missing objectId');
  }

  if (!operation.path) {
    errors.push('Missing path');
  }

  if (!operation.metadata) {
    errors.push('Missing metadata');
  } else {
    if (!operation.metadata.authorId) {
      errors.push('Missing metadata.authorId');
    }
    if (!operation.metadata.timestamp) {
      errors.push('Missing metadata.timestamp');
    }
    if (!operation.metadata.operationId) {
      errors.push('Missing metadata.operationId');
    }
  }

  const valid = errors.length === 0;

  if (!valid) {
    logger.warn('CRDT-CIR', 'validateCIROperation', 'CIR operation validation failed', {
      trace_id: traceId,
      errors,
    });
  }

  return { valid, errors };
}
