import { connectToDatabase } from '@/lib/mongodb';
import { sendGridAdapter } from '@/services/sendgrid-adapter';
import { JobQueueService, JobStatus } from '@/services/job-queue';
import { logger } from '@/lib/debug-logger';

/**
 * Email Worker
 * 
 * Processes email jobs from the queue asynchronously.
 * This worker should be run as a background process or cron job.
 * 
 * Features:
 * - Atomic job dequeuing
 * - Retry logic with exponential backoff
 * - Dead Letter Queue handling
 * - Structured logging
 */

class EmailWorker {
  private jobQueueService: JobQueueService | null = null;
  private isRunning: boolean = false;
  private batchSize: number = 10; // Process 10 jobs at a time
  private pollInterval: number = 5000; // Poll every 5 seconds

  /**
   * Start the email worker.
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('EmailWorker', 'start', 'Worker is already running');
      return;
    }

    this.isRunning = true;
    logger.info('EmailWorker', 'start', 'Email worker started');

    try {
      const { db } = await connectToDatabase();
      this.jobQueueService = new JobQueueService(db);

      // Start processing jobs
      this.processJobs();
    } catch (error) {
      logger.error('EmailWorker', 'start', 'Failed to start email worker', {
        error: (error as Error).message,
      });
      this.isRunning = false;
    }
  }

  /**
   * Stop the email worker.
   */
  stop(): void {
    this.isRunning = false;
    logger.info('EmailWorker', 'stop', 'Email worker stopped');
  }

  /**
   * Process jobs from the queue.
   */
  private async processJobs(): Promise<void> {
    while (this.isRunning) {
      try {
        if (!this.jobQueueService) {
          logger.error('EmailWorker', 'processJobs', 'Job queue service not initialized');
          await this.sleep(this.pollInterval);
          continue;
        }

        // Process a batch of jobs
        for (let i = 0; i < this.batchSize; i++) {
          const job = await this.jobQueueService.dequeueJob();

          if (!job) {
            // No more jobs to process
            break;
          }

          try {
            // Send email
            const sendResult = await sendGridAdapter.sendEmail({
              to: job.recipient,
              subject: job.subject,
              html: job.htmlContent,
              text: job.textContent,
            });

            if (sendResult.success && sendResult.messageId) {
              // Mark job as completed
              await this.jobQueueService.completeJob(job._id!, sendResult.messageId);

              logger.info('EmailWorker', 'processJobs', 'Email job completed', {
                jobId: job._id!.toString(),
                recipient: job.recipient,
                messageId: sendResult.messageId,
              });
            } else {
              // Mark job as failed (will retry or move to DLQ)
              await this.jobQueueService.failJob(job._id!, sendResult.error || 'Unknown error');

              logger.warn('EmailWorker', 'processJobs', 'Email job failed', {
                jobId: job._id!.toString(),
                recipient: job.recipient,
                error: sendResult.error,
              });
            }
          } catch (error) {
            // Handle unexpected errors
            await this.jobQueueService.failJob(job._id!, (error as Error).message);

            logger.error('EmailWorker', 'processJobs', 'Exception processing email job', {
              jobId: job._id!.toString(),
              recipient: job.recipient,
              error: (error as Error).message,
            });
          }
        }

        // Get queue statistics
        const stats = await this.jobQueueService.getQueueStats();
        if (stats.pending > 0 || stats.processing > 0) {
          logger.debug('EmailWorker', 'processJobs', 'Queue statistics', stats);
        }

        // Wait before next poll
        await this.sleep(this.pollInterval);
      } catch (error) {
        logger.error('EmailWorker', 'processJobs', 'Error in job processing loop', {
          error: (error as Error).message,
        });

        // Wait before retrying
        await this.sleep(this.pollInterval);
      }
    }
  }

  /**
   * Sleep for a given number of milliseconds.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const emailWorker = new EmailWorker();

// If this file is run directly, start the worker
if (require.main === module) {
  emailWorker.start().catch((error) => {
    logger.error('EmailWorker', 'main', 'Failed to start email worker', {
      error: (error as Error).message,
    });
    process.exit(1);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('EmailWorker', 'SIGTERM', 'Received SIGTERM signal, shutting down gracefully');
    emailWorker.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('EmailWorker', 'SIGINT', 'Received SIGINT signal, shutting down gracefully');
    emailWorker.stop();
    process.exit(0);
  });
}
