/**
 * Tenant-Aware Database Client Wrapper
 * Provides a wrapper around MongoDB that automatically injects tenant context (userId)
 * into all queries, preventing accidental bypass of tenant filters.
 *
 * This wrapper enforces tenant isolation at the driver level, not just the middleware level.
 */

import { Db, Collection, Filter, Document, ObjectId } from 'mongodb';
import { logger } from './debug-logger';

/**
 * Represents the tenant context for a request.
 */
export interface TenantContext {
  userId: string | ObjectId;
  userPlan: 'free' | 'pro' | 'enterprise';
  role: 'user' | 'admin';
}

/**
 * Tenant-aware collection wrapper that automatically injects userId into queries.
 */
export class TenantAwareCollection<T extends Document = Document> {
  private collection: Collection<T>;
  private tenantContext: TenantContext;

  constructor(collection: Collection<T>, tenantContext: TenantContext) {
    this.collection = collection;
    this.tenantContext = tenantContext;
  }

  /**
   * Find documents, automatically filtering by userId.
   */
  async find(filter: Filter<T> = {}): Promise<T[]> {
    const enhancedFilter = this.enhanceFilter(filter);
    logger.debug('TenantAwareCollection', 'find', 'Executing find with tenant filter', {
      user_id: this.tenantContext.userId.toString(),
      filter: enhancedFilter,
    });
    return this.collection.find(enhancedFilter).toArray();
  }

  /**
   * Find a single document, automatically filtering by userId.
   */
  async findOne(filter: Filter<T> = {}): Promise<T | null> {
    const enhancedFilter = this.enhanceFilter(filter);
    logger.debug('TenantAwareCollection', 'findOne', 'Executing findOne with tenant filter', {
      user_id: this.tenantContext.userId.toString(),
      filter: enhancedFilter,
    });
    return this.collection.findOne(enhancedFilter);
  }

  /**
   * Insert a single document with userId automatically set.
   */
  async insertOne(document: Omit<T, '_id'>): Promise<ObjectId> {
    const enhancedDoc = this.enhanceDocument(document);
    logger.debug('TenantAwareCollection', 'insertOne', 'Inserting document with tenant context', {
      user_id: this.tenantContext.userId.toString(),
    });
    const result = await this.collection.insertOne(enhancedDoc as T);
    return result.insertedId;
  }

  /**
   * Update a single document, automatically filtering by userId.
   */
  async updateOne(filter: Filter<T>, update: any): Promise<number> {
    const enhancedFilter = this.enhanceFilter(filter);
    logger.debug('TenantAwareCollection', 'updateOne', 'Updating document with tenant filter', {
      user_id: this.tenantContext.userId.toString(),
      filter: enhancedFilter,
    });
    const result = await this.collection.updateOne(enhancedFilter, update);
    return result.modifiedCount;
  }

  /**
   * Delete a single document, automatically filtering by userId.
   */
  async deleteOne(filter: Filter<T>): Promise<number> {
    const enhancedFilter = this.enhanceFilter(filter);
    logger.debug('TenantAwareCollection', 'deleteOne', 'Deleting document with tenant filter', {
      user_id: this.tenantContext.userId.toString(),
      filter: enhancedFilter,
    });
    const result = await this.collection.deleteOne(enhancedFilter);
    return result.deletedCount;
  }

  /**
   * Count documents, automatically filtering by userId.
   */
  async countDocuments(filter: Filter<T> = {}): Promise<number> {
    const enhancedFilter = this.enhanceFilter(filter);
    logger.debug('TenantAwareCollection', 'countDocuments', 'Counting documents with tenant filter', {
      user_id: this.tenantContext.userId.toString(),
      filter: enhancedFilter,
    });
    return this.collection.countDocuments(enhancedFilter);
  }

  /**
   * Enhance a filter by adding userId constraint.
   * This ensures that all queries are scoped to the current tenant.
   */
  private enhanceFilter(filter: Filter<T>): Filter<T> {
    const userIdField = 'userId';
    // Ensure userId is always present in the tenant context
    if (!this.tenantContext.userId) {
      logger.error('TenantAwareCollection', 'enhanceFilter', 'TenantContext missing userId', {
        filter: filter,
      });
      throw new Error('TenantContext missing userId: Cannot perform tenant-aware operation without a valid tenant ID.');
    }
    const userIdValue = this.tenantContext.userId instanceof ObjectId
      ? this.tenantContext.userId
      : new ObjectId(this.tenantContext.userId as string);

    // Create a mutable copy of the filter
    const newFilter = { ...filter };

    // If filter already has userId, verify it matches the tenant context
    if ((newFilter as any)[userIdField]) {
      const filterUserId = (newFilter as any)[userIdField];
      if (filterUserId.toString() !== userIdValue.toString()) {
        logger.error('TenantAwareCollection', 'enhanceFilter', 'Tenant isolation violation detected: Mismatched userId in filter', {
          user_id: this.tenantContext.userId.toString(),
          attemptedUserId: filterUserId.toString(),
        });
        throw new Error('Tenant isolation violation: Cannot query data from a different tenant.');
      }
    } else {
      // If userId is not in the filter, add it implicitly to enforce tenant isolation.
      // This ensures that no query can accidentally bypass the tenant filter.
      (newFilter as any)[userIdField] = userIdValue;
    }

    return newFilter;
  }

  /**
   * Enhance a document by adding userId.
   */
  private enhanceDocument(document: Omit<T, '_id'>): any {
    const userIdValue = this.tenantContext.userId instanceof ObjectId
      ? this.tenantContext.userId
      : new ObjectId(this.tenantContext.userId as string);

    return {
      ...document,
      userId: userIdValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Get the underlying MongoDB collection (use with caution).
   * This bypasses tenant filtering and should only be used for admin operations.
   */
  getUnderlying(): Collection<T> {
    if (this.tenantContext.role !== 'admin') {
      logger.error('TenantAwareCollection', 'getUnderlying', 'Non-admin attempted to access underlying collection', {
        user_id: this.tenantContext.userId.toString(),
        role: this.tenantContext.role,
      });
      throw new Error('Only administrators can access the underlying collection');
    }
    return this.collection;
  }
}

/**
 * Tenant-aware database wrapper that provides tenant-scoped collections.
 */
export class TenantAwareDb {
  private db: Db;
  private tenantContext: TenantContext;

  constructor(db: Db, tenantContext: TenantContext) {
    this.db = db;
    this.tenantContext = tenantContext;
  }

  /**
   * Get a tenant-aware collection.
   */
  collection<T extends Document = Document>(name: string): TenantAwareCollection<T> {
    return new TenantAwareCollection(this.db.collection<T>(name), this.tenantContext);
  }

  /**
   * Get the underlying MongoDB database (use with caution).
   * This bypasses tenant filtering and should only be used for admin operations.
   */
  getUnderlying(): Db {
    if (this.tenantContext.role !== 'admin') {
      logger.error('TenantAwareDb', 'getUnderlying', 'Non-admin attempted to access underlying database', {
        user_id: this.tenantContext.userId.toString(),
        role: this.tenantContext.role,
      });
      throw new Error('Only administrators can access the underlying database');
    }
    return this.db;
  }
}
