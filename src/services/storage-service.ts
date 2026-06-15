import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import { ObservabilityService } from './observability';
import { getTraceId } from '@/lib/trace-context';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function uploadReport(filePath: string, fileName: string): Promise<string> {
  const observability = ObservabilityService.getInstance();
  const traceId = getTraceId();

  return observability.withSpan('storage.upload_report', async (span) => {
    span.setAttributes({ fileName, traceId });
    try {
      const fileContent = fs.readFileSync(filePath);
      const bucketName = process.env.AWS_S3_BUCKET || 'affilify-reports';
      const key = `reports/${Date.now()}-${fileName}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
      }));

      const url = `https://${bucketName}.s3.amazonaws.com/${key}`;
      span.setAttribute('url', url);
      return url;
    } catch (error: any) {
      span.recordException(error);
      throw error;
    }
  });
}
