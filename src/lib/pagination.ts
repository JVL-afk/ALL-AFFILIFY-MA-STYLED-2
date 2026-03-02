/**
 * Pagination Utility Module
 * Provides cursor-based pagination for efficient data retrieval.
 *
 * Cursor-based pagination is more efficient than offset-based pagination for large datasets
 * and prevents issues with data changing between requests.
 */

import { ObjectId } from 'mongodb';
import { logger } from './debug-logger';

/**
 * Represents pagination parameters from a request.
 */
export interface PaginationParams {
  limit: number; // Number of items per page (default: 20, max: 100)
  cursor?: string; // Cursor for the next page (base64-encoded ObjectId)
}

/**
 * Represents paginated results.
 */
export interface PaginatedResult<T> {
  items: T[];
  nextCursor?: string; // Cursor for the next page (if more items exist)
  hasMore: boolean; // Whether more items exist
  count: number; // Number of items returned
}

/**
 * Default pagination limit.
 */
const DEFAULT_LIMIT = 20;

/**
 * Maximum pagination limit.
 */
const MAX_LIMIT = 100;

/**
 * Parse pagination parameters from query string.
 *
 * @param limit - The limit parameter (string)
 * @param cursor - The cursor parameter (string)
 * @returns Parsed pagination parameters
 */
export function parsePaginationParams(limit?: string, cursor?: string): PaginationParams {
  let parsedLimit = DEFAULT_LIMIT;

  if (limit) {
    const parsedValue = parseInt(limit, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      parsedLimit = Math.min(parsedValue, MAX_LIMIT);
    }
  }

  return {
    limit: parsedLimit,
    cursor,
  };
}

/**
 * Encode an ObjectId as a cursor (base64).
 *
 * @param id - The ObjectId to encode
 * @returns Base64-encoded cursor
 */
export function encodeCursor(id: ObjectId | string): string {
  const idString = id instanceof ObjectId ? id.toString() : id;
  return Buffer.from(idString).toString('base64');
}

/**
 * Decode a cursor (base64) to an ObjectId.
 *
 * @param cursor - The base64-encoded cursor
 * @returns Decoded ObjectId or null if invalid
 */
export function decodeCursor(cursor: string): ObjectId | null {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
    return new ObjectId(decoded);
  } catch (error) {
    logger.warn('PaginationModule', 'decodeCursor', 'Invalid cursor provided', {
      cursor,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Build a MongoDB query filter for cursor-based pagination.
 *
 * @param cursor - The cursor (optional)
 * @param sortField - The field to sort by (default: '_id')
 * @returns MongoDB filter for pagination
 */
export function buildPaginationFilter(cursor?: string, sortField: string = '_id'): any {
  if (!cursor) {
    return {};
  }

  const decodedId = decodeCursor(cursor);
  if (!decodedId) {
    return {};
  }

  // Return documents after the cursor
  return { [sortField]: { $gt: decodedId } };
}

/**
 * Create a paginated result from a list of items.
 *
 * @param items - The items to paginate
 * @param limit - The limit parameter
 * @returns Paginated result
 */
export function createPaginatedResult<T extends { _id: ObjectId }>(
  items: T[],
  limit: number
): PaginatedResult<T> {
  // Fetch one extra item to determine if there are more
  const hasMore = items.length > limit;
  const paginatedItems = items.slice(0, limit);

  const result: PaginatedResult<T> = {
    items: paginatedItems,
    hasMore,
    count: paginatedItems.length,
  };

  // If there are more items, set the next cursor
  if (hasMore && paginatedItems.length > 0) {
    const lastItem = paginatedItems[paginatedItems.length - 1];
    result.nextCursor = encodeCursor(lastItem._id);
  }

  return result;
}

/**
 * Validate pagination parameters.
 *
 * @param params - The pagination parameters to validate
 * @returns true if valid, false otherwise
 */
export function validatePaginationParams(params: PaginationParams): boolean {
  if (params.limit < 1 || params.limit > MAX_LIMIT) {
    logger.warn('PaginationModule', 'validatePaginationParams', 'Invalid limit', {
      limit: params.limit,
      maxLimit: MAX_LIMIT,
    });
    return false;
  }

  if (params.cursor) {
    const decodedId = decodeCursor(params.cursor);
    if (!decodedId) {
      logger.warn('PaginationModule', 'validatePaginationParams', 'Invalid cursor', {
        cursor: params.cursor,
      });
      return false;
    }
  }

  return true;
}

/**
 * Format pagination metadata for API responses.
 *
 * @param result - The paginated result
 * @returns Formatted pagination metadata
 */
export function formatPaginationMetadata<T>(result: PaginatedResult<T>): any {
  return {
    count: result.count,
    hasMore: result.hasMore,
    nextCursor: result.nextCursor,
  };
}
