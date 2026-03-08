import { logger } from './debug-logger';
import { ObjectId } from 'mongodb';

/**
 * Dead Letter Queue (DLQ) and Idempotency Storage
 * 
 * Provides safe retry mechanisms and poison message detection.
 */

export enum MessageStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  DEAD_LETTER = 'DEAD_LETTER',
}

export interface QueueMessage {
  _id?: ObjectId;
  messageId: string;
  payload: any;
  status: MessageStatus;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;
  error?: string;
  processingStartedAt?: Date;
  completedAt?: Date;
}

export interface IdempotencyRecord {
  _id?: ObjectId;
  idempotencyKey: string;
  requestHash: string;
  response: any;
  status: 'SUCCESS' | 'FAILED' | 'PROCESSING';
  createdAt: Date;
  expiresAt: Date; // TTL for cleanup
}

/**
 * In-memory store for prototyping. In production, this would be MongoDB.
 */
const DLQ_STORE: Map<string, QueueMessage> = new Map();
const IDEMPOTENCY_STORE: Map<string, IdempotencyRecord> = new Map();

/**
 * Enqueue a message for processing
 */
export async function enqueueMessage(
  messageId: string,
  payload: any,
  maxRetries: number = 3,
  traceId?: string
): Promise<QueueMessage> {
  logger.info('DLQAndIdempotency', 'enqueueMessage', 'Enqueueing message', {
    trace_id: traceId,
    messageId,
    maxRetries,
  });

  const message: QueueMessage = {
    messageId,
    payload,
    status: MessageStatus.PENDING,
    retryCount: 0,
    maxRetries,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  DLQ_STORE.set(messageId, message);

  return message;
}

/**
 * Mark a message as processing
 */
export async function markMessageProcessing(
  messageId: string,
  traceId?: string
): Promise<QueueMessage> {
  logger.debug('DLQAndIdempotency', 'markMessageProcessing', 'Marking message as processing', {
    trace_id: traceId,
    messageId,
  });

  const message = DLQ_STORE.get(messageId);
  if (!message) {
    throw new Error(`Message not found: ${messageId}`);
  }

  message.status = MessageStatus.PROCESSING;
  message.processingStartedAt = new Date();
  message.updatedAt = new Date();

  return message;
}

/**
 * Mark a message as successfully processed
 */
export async function markMessageSuccess(
  messageId: string,
  traceId?: string
): Promise<QueueMessage> {
  logger.info('DLQAndIdempotency', 'markMessageSuccess', 'Marking message as success', {
    trace_id: traceId,
    messageId,
  });

  const message = DLQ_STORE.get(messageId);
  if (!message) {
    throw new Error(`Message not found: ${messageId}`);
  }

  message.status = MessageStatus.SUCCESS;
  message.completedAt = new Date();
  message.updatedAt = new Date();

  return message;
}

/**
 * Mark a message as failed and potentially move to DLQ
 */
export async function markMessageFailed(
  messageId: string,
  error: string,
  traceId?: string
): Promise<QueueMessage> {
  logger.warn('DLQAndIdempotency', 'markMessageFailed', 'Marking message as failed', {
    trace_id: traceId,
    messageId,
    error,
  });

  const message = DLQ_STORE.get(messageId);
  if (!message) {
    throw new Error(`Message not found: ${messageId}`);
  }

  message.retryCount++;
  message.error = error;
  message.updatedAt = new Date();

  // If max retries exceeded, move to DLQ
  if (message.retryCount >= message.maxRetries) {
    logger.error('DLQAndIdempotency', 'markMessageFailed', 'Message moved to DLQ (max retries exceeded)', {
      trace_id: traceId,
      messageId,
      retryCount: message.retryCount,
      maxRetries: message.maxRetries,
    });
    message.status = MessageStatus.DEAD_LETTER;
  } else {
    message.status = MessageStatus.PENDING;
  }

  return message;
}

/**
 * Detect poison messages (messages that consistently fail)
 */
export async function detectPoisonMessage(
  messageId: string,
  failureThreshold: number = 3,
  traceId?: string
): Promise<{ isPoison: boolean; failureCount: number }> {
  logger.debug('DLQAndIdempotency', 'detectPoisonMessage', 'Detecting poison message', {
    trace_id: traceId,
    messageId,
    failureThreshold,
  });

  const message = DLQ_STORE.get(messageId);
  if (!message) {
    throw new Error(`Message not found: ${messageId}`);
  }

  const isPoison = message.retryCount >= failureThreshold;

  if (isPoison) {
    logger.warn('DLQAndIdempotency', 'detectPoisonMessage', 'Poison message detected', {
      trace_id: traceId,
      messageId,
      failureCount: message.retryCount,
      failureThreshold,
    });
  }

  return {
    isPoison,
    failureCount: message.retryCount,
  };
}

/**
 * Store an idempotency record to prevent duplicate processing
 */
export async function storeIdempotencyRecord(
  idempotencyKey: string,
  requestHash: string,
  response: any,
  ttlSeconds: number = 3600,
  traceId?: string
): Promise<IdempotencyRecord> {
  logger.info('DLQAndIdempotency', 'storeIdempotencyRecord', 'Storing idempotency record', {
    trace_id: traceId,
    idempotencyKey,
  });

  const record: IdempotencyRecord = {
    idempotencyKey,
    requestHash,
    response,
    status: 'SUCCESS',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + ttlSeconds * 1000),
  };

  IDEMPOTENCY_STORE.set(idempotencyKey, record);

  return record;
}

/**
 * Retrieve an idempotency record
 */
export async function getIdempotencyRecord(
  idempotencyKey: string,
  traceId?: string
): Promise<IdempotencyRecord | null> {
  logger.debug('DLQAndIdempotency', 'getIdempotencyRecord', 'Retrieving idempotency record', {
    trace_id: traceId,
    idempotencyKey,
  });

  const record = IDEMPOTENCY_STORE.get(idempotencyKey);

  if (record && record.expiresAt < new Date()) {
    // Record has expired, remove it
    IDEMPOTENCY_STORE.delete(idempotencyKey);
    return null;
  }

  return record || null;
}

/**
 * Check if a request has already been processed (idempotency check)
 */
export async function checkIdempotency(
  idempotencyKey: string,
  requestHash: string,
  traceId?: string
): Promise<{ isDuplicate: boolean; cachedResponse?: any }> {
  logger.debug('DLQAndIdempotency', 'checkIdempotency', 'Checking idempotency', {
    trace_id: traceId,
    idempotencyKey,
  });

  const record = await getIdempotencyRecord(idempotencyKey, traceId);

  if (!record) {
    return { isDuplicate: false };
  }

  // Verify the request hash matches
  if (record.requestHash !== requestHash) {
    logger.warn('DLQAndIdempotency', 'checkIdempotency', 'Idempotency key mismatch (different request)', {
      trace_id: traceId,
      idempotencyKey,
    });
    return { isDuplicate: false };
  }

  logger.debug('DLQAndIdempotency', 'checkIdempotency', 'Duplicate request detected', {
    trace_id: traceId,
    idempotencyKey,
  });

  return {
    isDuplicate: true,
    cachedResponse: record.response,
  };
}

/**
 * Get all messages in the DLQ
 */
export async function getDLQMessages(traceId?: string): Promise<QueueMessage[]> {
  logger.info('DLQAndIdempotency', 'getDLQMessages', 'Retrieving DLQ messages', {
    trace_id: traceId,
  });

  const dlqMessages = Array.from(DLQ_STORE.values()).filter(
    msg => msg.status === MessageStatus.DEAD_LETTER
  );

  return dlqMessages;
}

/**
 * Manually replay a message from the DLQ
 */
export async function replayDLQMessage(
  messageId: string,
  traceId?: string
): Promise<QueueMessage> {
  logger.info('DLQAndIdempotency', 'replayDLQMessage', 'Replaying DLQ message', {
    trace_id: traceId,
    messageId,
  });

  const message = DLQ_STORE.get(messageId);
  if (!message) {
    throw new Error(`Message not found: ${messageId}`);
  }

  if (message.status !== MessageStatus.DEAD_LETTER) {
    throw new Error(`Message is not in DLQ: ${messageId}`);
  }

  // Reset the message for replay
  message.status = MessageStatus.PENDING;
  message.retryCount = 0;
  message.error = undefined;
  message.updatedAt = new Date();

  return message;
}

/**
 * Clean up expired idempotency records
 */
export async function cleanupExpiredIdempotencyRecords(traceId?: string): Promise<number> {
  logger.info('DLQAndIdempotency', 'cleanupExpiredIdempotencyRecords', 'Cleaning up expired records', {
    trace_id: traceId,
  });

  let cleanedCount = 0;
  const now = new Date();

  for (const [key, record] of IDEMPOTENCY_STORE.entries()) {
    if (record.expiresAt < now) {
      IDEMPOTENCY_STORE.delete(key);
      cleanedCount++;
    }
  }

  logger.info('DLQAndIdempotency', 'cleanupExpiredIdempotencyRecords', 'Cleanup completed', {
    trace_id: traceId,
    cleanedCount,
  });

  return cleanedCount;
}
