import { Db, ObjectId } from 'mongodb';
import { logger } from '@/lib/debug-logger';

/**
 * Job Queue Service
 * 
 * Implements a persistent job queue using MongoDB for asynchronous email processing.
 * Features:
 * - Atomic job creation and state transitions
 * - Idempotency key support
 * - Dead Letter Queue (DLQ) for failed jobs
 * - Retry tracking
 * - Job status monitoring
 */

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  DLQ = 'DLQ', // Dead Letter Queue
}

export interface EmailJob {
  _id?: ObjectId;
  userId: ObjectId;
  campaignId: ObjectId;
  recipient: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  nextRetryAt?: Date;
  lastError?: string;
  idempotencyKey: string;
  messageId?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export class JobQueueService {
  private db: Db;
  private maxRetries: number = 5;
  private retryDelayMs: number = 60000; // 1 minute

  constructor(db: Db) {
    this.db = db;
  }

  /**
   * Enqueue an email job for asynchronous processing.
   * Uses idempotency key to prevent duplicate jobs.
   */
  async enqueueJob(job: Omit<EmailJob, '_id' | 'status' | 'attempts' | 'createdAt' | 'updatedAt'>): Promise<ObjectId> {
    // Check if job with same idempotency key already exists
    const existingJob = await this.db.collection('email_jobs').findOne({
      idempotencyKey: job.idempotencyKey,
    });

    if (existingJob) {
      logger.warn('JobQueueService', 'enqueueJob', 'Job with same idempotency key already exists', {
        idempotencyKey: job.idempotencyKey,
        existingJobId: existingJob._id.toString(),
      });
      return existingJob._id;
    }

    // Create new job
    const newJob: EmailJob = {
      ...job,
      status: JobStatus.PENDING,
      attempts: 0,
      maxAttempts: this.maxRetries,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.db.collection('email_jobs').insertOne(newJob);

    logger.info('JobQueueService', 'enqueueJob', 'Email job enqueued', {
      jobId: result.insertedId.toString(),
      userId: job.userId.toString(),
      campaignId: job.campaignId.toString(),
      recipient: job.recipient,
      idempotencyKey: job.idempotencyKey,
    });

    return result.insertedId;
  }

  /**
   * Dequeue a job for processing.
   * Atomically transitions job from PENDING to PROCESSING.
   */
  async dequeueJob(): Promise<EmailJob | null> {
    const now = new Date();

    const job = await this.db.collection('email_jobs').findOneAndUpdate(
      {
        status: JobStatus.PENDING,
        $or: [{ nextRetryAt: { $exists: false } }, { nextRetryAt: { $lte: now } }],
      },
      {
        $set: {
          status: JobStatus.PROCESSING,
          updatedAt: now,
        },
        $inc: {
          attempts: 1,
        },
      },
      { returnDocument: 'after' }
    );

    if (job.value) {
      logger.debug('JobQueueService', 'dequeueJob', 'Job dequeued for processing', {
        jobId: job.value._id.toString(),
        recipient: job.value.recipient,
        attempts: job.value.attempts,
      });
    }

    return job.value as EmailJob | null;
  }

  /**
   * Mark a job as completed.
   */
  async completeJob(jobId: ObjectId, messageId: string): Promise<void> {
    const result = await this.db.collection('email_jobs').updateOne(
      { _id: jobId },
      {
        $set: {
          status: JobStatus.COMPLETED,
          messageId,
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      logger.warn('JobQueueService', 'completeJob', 'Job not found for completion', {
        jobId: jobId.toString(),
      });
      return;
    }

    logger.info('JobQueueService', 'completeJob', 'Job completed successfully', {
      jobId: jobId.toString(),
      messageId,
    });
  }

  /**
   * Mark a job as failed and schedule retry or move to DLQ.
   */
  async failJob(jobId: ObjectId, error: string): Promise<void> {
    const job = await this.db.collection('email_jobs').findOne({ _id: jobId });

    if (!job) {
      logger.warn('JobQueueService', 'failJob', 'Job not found for failure handling', {
        jobId: jobId.toString(),
      });
      return;
    }

    // Check if we should retry or move to DLQ
    if (job.attempts < job.maxAttempts) {
      // Schedule retry
      const nextRetryAt = new Date(Date.now() + this.retryDelayMs * job.attempts); // Exponential backoff

      await this.db.collection('email_jobs').updateOne(
        { _id: jobId },
        {
          $set: {
            status: JobStatus.PENDING,
            lastError: error,
            nextRetryAt,
            updatedAt: new Date(),
          },
        }
      );

      logger.warn('JobQueueService', 'failJob', 'Job scheduled for retry', {
        jobId: jobId.toString(),
        attempts: job.attempts,
        maxAttempts: job.maxAttempts,
        nextRetryAt: nextRetryAt.toISOString(),
        error,
      });
    } else {
      // Move to DLQ
      await this.db.collection('email_jobs').updateOne(
        { _id: jobId },
        {
          $set: {
            status: JobStatus.DLQ,
            lastError: error,
            updatedAt: new Date(),
          },
        }
      );

      logger.error('JobQueueService', 'failJob', 'Job moved to DLQ after max retries', {
        jobId: jobId.toString(),
        attempts: job.attempts,
        maxAttempts: job.maxAttempts,
        error,
      });
    }
  }

  /**
   * Get job status.
   */
  async getJobStatus(jobId: ObjectId): Promise<EmailJob | null> {
    return (await this.db.collection('email_jobs').findOne({ _id: jobId })) as EmailJob | null;
  }

  /**
   * Get queue statistics.
   */
  async getQueueStats(): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    dlq: number;
  }> {
    const stats = await this.db.collection('email_jobs').aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]).toArray();

    const result = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      dlq: 0,
    };

    for (const stat of stats) {
      if (stat._id === JobStatus.PENDING) result.pending = stat.count;
      if (stat._id === JobStatus.PROCESSING) result.processing = stat.count;
      if (stat._id === JobStatus.COMPLETED) result.completed = stat.count;
      if (stat._id === JobStatus.FAILED) result.failed = stat.count;
      if (stat._id === JobStatus.DLQ) result.dlq = stat.count;
    }

    logger.debug('JobQueueService', 'getQueueStats', 'Queue statistics retrieved', result);

    return result;
  }

  /**
   * Get DLQ jobs for manual review.
   */
  async getDLQJobs(limit: number = 100): Promise<EmailJob[]> {
    return (await this.db
      .collection('email_jobs')
      .find({ status: JobStatus.DLQ })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .toArray()) as EmailJob[];
  }

  /**
   * Retry a DLQ job (admin function).
   */
  async retryDLQJob(jobId: ObjectId): Promise<void> {
    await this.db.collection('email_jobs').updateOne(
      { _id: jobId, status: JobStatus.DLQ },
      {
        $set: {
          status: JobStatus.PENDING,
          attempts: 0,
          nextRetryAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    logger.info('JobQueueService', 'retryDLQJob', 'DLQ job retried', {
      jobId: jobId.toString(),
    });
  }
}
