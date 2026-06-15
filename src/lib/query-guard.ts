/**
 * Query Guard - Tenant-Aware Database Query Wrapper
 * 
 * INVARIANT: Every query must include a tenantId filter
 * INVARIANT: No direct collection access (no escape hatch)
 * INVARIANT: All queries are logged with traceId
 */

import { Collection, Filter, UpdateFilter } from 'mongodb';

export interface TenantAwareCollectionOptions {
  tenantId: string;
  traceId: string;
}

/**
 * Wraps a MongoDB collection to enforce tenant isolation
 * All queries automatically include tenantId filter
 */
export class TenantAwareCollection<T extends { tenantId?: string }> {
  constructor(
    private collection: Collection<T>,
    private options: TenantAwareCollectionOptions
  ) {}

  /**
   * Find documents (with automatic tenantId filter)
   */
  async find(filter: Filter<T> = {}): Promise<T[]> {
    const guardedFilter = { ...filter, tenantId: this.options.tenantId };
    console.log(
      `[QUERY_GUARD] find() - TenantId: ${this.options.tenantId}, Filter: ${JSON.stringify(guardedFilter)}, TraceId: ${this.options.traceId}`
    );
    return this.collection.find(guardedFilter as Filter<T>).toArray();
  }

  /**
   * Find one document (with automatic tenantId filter)
   */
  async findOne(filter: Filter<T> = {}): Promise<T | null> {
    const guardedFilter = { ...filter, tenantId: this.options.tenantId };
    console.log(
      `[QUERY_GUARD] findOne() - TenantId: ${this.options.tenantId}, Filter: ${JSON.stringify(guardedFilter)}, TraceId: ${this.options.traceId}`
    );
    return this.collection.findOne(guardedFilter as Filter<T>);
  }

  /**
   * Update one document (with automatic tenantId filter)
   */
  async updateOne(filter: Filter<T>, update: UpdateFilter<T>): Promise<{ modifiedCount: number }> {
    const guardedFilter = { ...filter, tenantId: this.options.tenantId };
    console.log(
      `[QUERY_GUARD] updateOne() - TenantId: ${this.options.tenantId}, Filter: ${JSON.stringify(guardedFilter)}, TraceId: ${this.options.traceId}`
    );
    const result = await this.collection.updateOne(guardedFilter as Filter<T>, update);
    return { modifiedCount: result.modifiedCount };
  }

  /**
   * Delete one document (with automatic tenantId filter)
   */
  async deleteOne(filter: Filter<T>): Promise<{ deletedCount: number }> {
    const guardedFilter = { ...filter, tenantId: this.options.tenantId };
    console.log(
      `[QUERY_GUARD] deleteOne() - TenantId: ${this.options.tenantId}, Filter: ${JSON.stringify(guardedFilter)}, TraceId: ${this.options.traceId}`
    );
    const result = await this.collection.deleteOne(guardedFilter as Filter<T>);
    return { deletedCount: result.deletedCount };
  }

  /**
   * Count documents (with automatic tenantId filter)
   */
  async countDocuments(filter: Filter<T> = {}): Promise<number> {
    const guardedFilter = { ...filter, tenantId: this.options.tenantId };
    console.log(
      `[QUERY_GUARD] countDocuments() - TenantId: ${this.options.tenantId}, Filter: ${JSON.stringify(guardedFilter)}, TraceId: ${this.options.traceId}`
    );
    return this.collection.countDocuments(guardedFilter as Filter<T>);
  }

  /**
   * Aggregate documents (with automatic tenantId filter in pipeline)
   */
  async aggregate(pipeline: any[]): Promise<T[]> {
    const guardedPipeline = [{ $match: { tenantId: this.options.tenantId } }, ...pipeline];
    console.log(
      `[QUERY_GUARD] aggregate() - TenantId: ${this.options.tenantId}, Pipeline: ${JSON.stringify(guardedPipeline)}, TraceId: ${this.options.traceId}`
    );
    return this.collection.aggregate(guardedPipeline).toArray();
  }
}

/**
 * Create a tenant-aware collection wrapper
 */
export function createTenantAwareCollection<T extends { tenantId?: string }>(
  collection: Collection<T>,
  tenantId: string,
  traceId: string
): TenantAwareCollection<T> {
  return new TenantAwareCollection(collection, { tenantId, traceId });
}
