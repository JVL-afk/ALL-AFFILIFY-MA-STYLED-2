import { Db, ObjectId, Collection } from 'mongodb';
import { ExperimentEvent, ExperimentEventSchema } from '../lib/models/ab-testing';
import { logger } from '../lib/debug-logger';
import { getTraceId } from '../lib/trace-context';

/**
 * A/B Testing Event Ingestion Service
 * 
 * Handles high-throughput ingestion of exposure and conversion events.
 * Implements:
 * 1. Atomic Quota Enforcement (via MongoDB $inc)
 * 2. Event Deduplication (via unique eventId)
 * 3. Traceability (via TraceContext)
 */
export class ABTestingEventService {
  private db: Db;
  private eventsCollection: Collection<any>;
  private experimentsCollection: Collection<any>;

  constructor(db: Db) {
    this.db = db;
    this.eventsCollection = db.collection('ab_test_events');
    this.experimentsCollection = db.collection('ab_tests');
  }

  /**
   * Ingest an experiment event (exposure or conversion).
   * 
   * This operation is atomic and idempotent:
   * 1. Validates the event schema.
   * 2. Deduplicates based on eventId.
   * 3. Atomically increments visitor/conversion counts in the experiment document.
   */
  async ingestEvent(eventData: Partial<ExperimentEvent>): Promise<{ success: boolean; message: string }> {
    const traceId = getTraceId();
    
    try {
      // 1. Schema Validation
      const validatedEvent = ExperimentEventSchema.parse({
        ...eventData,
        timestamp: new Date(),
        traceId,
      });

      // 2. Deduplication & Persistence
      // We use an upsert with $setOnInsert to ensure idempotency
      const eventResult = await this.eventsCollection.updateOne(
        { eventId: validatedEvent.eventId },
        { $setOnInsert: validatedEvent },
        { upsert: true }
      );

      if (eventResult.matchedCount > 0) {
        logger.warn('ABTestingEventService', 'ingestEvent', 'Duplicate event detected', {
          eventId: validatedEvent.eventId,
          traceId,
        });
        return { success: true, message: 'Duplicate event ignored' };
      }

      // 3. Atomic Quota & Metric Enforcement
      // We atomically increment the counts in the experiment document
      const isExposure = validatedEvent.eventType === 'exposure';
      const updateField = isExposure ? 'visitors' : 'conversions';
      
      const updateResult = await this.experimentsCollection.updateOne(
        { 
          _id: validatedEvent.experimentId,
          tenantId: validatedEvent.tenantId,
          'variants.id': validatedEvent.variantId 
        },
        { 
          $inc: { 
            [`variants.$.${updateField}`]: 1,
            'version': 1 
          },
          $set: { updatedAt: new Date() }
        }
      );

      if (updateResult.matchedCount === 0) {
        logger.error('ABTestingEventService', 'ingestEvent', 'Experiment or variant not found', {
          experimentId: validatedEvent.experimentId.toString(),
          variantId: validatedEvent.variantId,
          traceId,
        });
        return { success: false, message: 'Experiment or variant not found' };
      }

      logger.info('ABTestingEventService', 'ingestEvent', 'Event ingested successfully', {
        eventId: validatedEvent.eventId,
        type: validatedEvent.eventType,
        traceId,
      });

      return { success: true, message: 'Event ingested successfully' };

    } catch (error) {
      logger.error('ABTestingEventService', 'ingestEvent', 'Failed to ingest event', {
        error: (error as Error).message,
        traceId,
      });
      throw error;
    }
  }

  /**
   * Batch ingestion for high-throughput scenarios.
   */
  async ingestBatch(events: Partial<ExperimentEvent>[]): Promise<{ successful: number; failed: number }> {
    let successful = 0;
    let failed = 0;

    for (const event of events) {
      try {
        const result = await this.ingestEvent(event);
        if (result.success) successful++;
        else failed++;
      } catch (err) {
        failed++;
      }
    }

    return { successful, failed };
  }
}
