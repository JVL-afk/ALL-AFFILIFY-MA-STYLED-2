import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { ObservabilityService } from './observability';
import { getTraceId } from '@/lib/trace-context';

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const reportQueue = new Queue('report-generation', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export class ReportQueueService {
  private static instance: ReportQueueService;
  private observability = ObservabilityService.getInstance();

  private constructor() {}

  public static getInstance(): ReportQueueService {
    if (!ReportQueueService.instance) {
      ReportQueueService.instance = new ReportQueueService();
    }
    return ReportQueueService.instance;
  }

  public async addReportJob(reportId: string, userId: string) {
    const traceId = getTraceId();
    return this.observability.withSpan('report_queue.add_job', async (span) => {
      span.setAttributes({ reportId, userId, traceId });
      try {
        const job = await reportQueue.add('generate-report', {
          reportId,
          userId,
          traceId,
        });
        span.setAttribute('jobId', job.id || 'unknown');
        return job;
      } catch (error: any) {
        span.recordException(error);
        throw error;
      }
    });
  }
}
