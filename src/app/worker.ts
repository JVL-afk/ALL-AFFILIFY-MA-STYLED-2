import { reportWorker } from '../workers/report-worker';
import { ObservabilityService } from '../services/observability';

const observability = ObservabilityService.getInstance();

console.log('Starting report worker...');

reportWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

reportWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down worker...');
  await reportWorker.close();
  process.exit(0);
});
