import { Worker, Job, ConnectionOptions } from 'bullmq';
import IORedis from 'ioredis';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ReportGenerator } from '../services/report-generator';
import { uploadReport } from '../services/storage-service';
import { EmailSendingService } from '../services/email-sending-service';
import { ObservabilityService } from '../services/observability';
import { initializeTraceContext, runWithTraceContext } from '@/lib/trace-context';
import * as path from 'path';
import * as fs from 'fs';

// Cast to ConnectionOptions to resolve the structural mismatch between the
// top-level ioredis and bullmq's bundled ioredis copy.
const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
}) as unknown as ConnectionOptions;

const observability = ObservabilityService.getInstance();
const reportGenerator = new ReportGenerator();
export const reportWorker = new Worker('report-generation', async (job: Job) => {
  const { reportId, userId, traceId: _traceId } = job.data;

  // initializeTraceContext accepts (userId?, campaignId?, subscriberId?) — pass userId as string
  const traceContext = initializeTraceContext(userId as string);

  return runWithTraceContext(traceContext, async () => {
    return observability.withSpan('report_worker.process', async (span) => {
      span.setAttributes({ reportId, userId, jobId: job.id });

      const { db } = await connectToDatabase();
      // EmailSendingService requires a Db instance
      const emailService = new EmailSendingService(db);
      
      try {
        // Update status to processing
        await db.collection('reports').updateOne(
          { _id: new ObjectId(reportId) },
          { $set: { status: 'processing', updatedAt: new Date() } }
        );

        const report = await db.collection('reports').findOne({ _id: new ObjectId(reportId) });
        if (!report) throw new Error('Report not found');

        // Fetch data for report
        const websites = await db.collection('websites').find({ userId: new ObjectId(userId) }).toArray();
        
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        
        const fileName = `report-${reportId}.${report.format.toLowerCase()}`;
        const filePath = path.join(tempDir, fileName);

        // Generate report
        if (report.format === 'PDF') {
          await reportGenerator.generatePdfReport(websites, filePath);
        } else if (report.format === 'Excel') {
          await reportGenerator.generateExcelReport(websites, filePath);
        } else {
          await reportGenerator.generateCsvReport(websites, filePath);
        }

        // Upload to S3
        const fileUrl = await uploadReport(filePath, fileName);
        
        // Update report record
        await db.collection('reports').updateOne(
          { _id: new ObjectId(reportId) },
          { 
            $set: { 
              status: 'completed', 
              fileUrl, 
              lastGenerated: new Date(),
              updatedAt: new Date() 
            } 
          }
        );

        // Send email
        if (report.recipients && report.recipients.length > 0) {
          await emailService.sendReportByEmail(report.recipients, fileUrl, report.name);
        }

        // Cleanup
        fs.unlinkSync(filePath);
        
        return { success: true, fileUrl };
      } catch (error: any) {
        span.recordException(error);
        await db.collection('reports').updateOne(
          { _id: new ObjectId(reportId) },
          { $set: { status: 'failed', updatedAt: new Date() } }
        );
        throw error;
      }
    });
  });
}, { connection: redisConnection });
