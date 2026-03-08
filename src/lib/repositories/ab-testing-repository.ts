import { Db, ObjectId, Collection, UpdateResult, InsertOneResult } from 'mongodb';
import { Experiment, ExperimentSchema, ExperimentStatus } from '../models/ab-testing';
import { logger } from '../debug-logger';
import { assertTenantFilter } from '../../middleware/tenant-isolation';
import { getTraceId } from '../trace-context';

/**
 * A/B Testing Repository
 * 
 * Enforces strict tenant isolation and atomic operations for experiment management.
 * All queries must include a tenantId (userId in this context).
 */
export class ABTestingRepository {
  private collection: Collection<any>;
  private tenantId: ObjectId;

  constructor(db: Db, tenantId: string | ObjectId) {
    this.collection = db.collection('ab_tests');
    this.tenantId = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
  }

  /**
   * Find all experiments for the current tenant.
   */
  async findAll(): Promise<Experiment[]> {
    const filter = { tenantId: this.tenantId };
    assertTenantFilter(this.tenantId.toString(), { userId: this.tenantId.toString() });

    const results = await this.collection.find(filter).sort({ createdAt: -1 }).toArray();
    return results.map(doc => ExperimentSchema.parse(doc));
  }

  /**
   * Find a specific experiment by ID, ensuring tenant isolation.
   */
  async findById(id: string | ObjectId): Promise<Experiment | null> {
    const filter = { _id: new ObjectId(id), tenantId: this.tenantId };
    assertTenantFilter(this.tenantId.toString(), { userId: this.tenantId.toString() });

    const result = await this.collection.findOne(filter);
    return result ? ExperimentSchema.parse(result) : null;
  }

  /**
   * Create a new experiment with initial validation.
   */
  async create(experimentData: Partial<Experiment>): Promise<InsertOneResult<any>> {
    const traceId = getTraceId();
    const validatedData = ExperimentSchema.parse({
      ...experimentData,
      tenantId: this.tenantId,
      version: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    logger.info('ABTestingRepository', 'create', 'Creating new experiment', {
      tenantId: this.tenantId.toString(),
      name: validatedData.name,
      traceId,
    });

    return this.collection.insertOne(validatedData);
  }

  /**
   * Update an experiment status atomically using optimistic concurrency control.
   */
  async updateStatus(id: string | ObjectId, status: ExperimentStatus, currentVersion: number): Promise<UpdateResult> {
    const traceId = getTraceId();
    const filter = { 
      _id: new ObjectId(id), 
      tenantId: this.tenantId,
      version: currentVersion 
    };

    const update = {
      $set: { 
        status, 
        updatedAt: new Date() 
      },
      $inc: { version: 1 }
    };

    logger.info('ABTestingRepository', 'updateStatus', 'Updating experiment status', {
      id: id.toString(),
      status,
      currentVersion,
      traceId,
    });

    const result = await this.collection.updateOne(filter, update);

    if (result.matchedCount === 0) {
      logger.warn('ABTestingRepository', 'updateStatus', 'Update failed: version mismatch or not found', {
        id: id.toString(),
        currentVersion,
        traceId,
      });
    }

    return result;
  }

  /**
   * Update experiment variants atomically.
   */
  async updateVariants(id: string | ObjectId, variants: any[], currentVersion: number): Promise<UpdateResult> {
    const traceId = getTraceId();
    const filter = { 
      _id: new ObjectId(id), 
      tenantId: this.tenantId,
      version: currentVersion 
    };

    const update = {
      $set: { 
        variants, 
        updatedAt: new Date() 
      },
      $inc: { version: 1 }
    };

    const result = await this.collection.updateOne(filter, update);
    return result;
  }
}
