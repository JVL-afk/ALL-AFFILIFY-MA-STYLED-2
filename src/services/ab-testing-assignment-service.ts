import { Experiment, Variant } from '../lib/models/ab-testing';
import { logger } from '../lib/debug-logger';
import { getTraceId } from '../lib/trace-context';

/**
 * A/B Testing Assignment Service
 * 
 * Implements deterministic variant assignment using MurmurHash3.
 * This ensures that a user always sees the same variant for a given experiment.
 */
export class ABTestingAssignmentService {
  
  /**
   * Assign a variant to a user for a specific experiment.
   * 
   * This operation is deterministic and stateless:
   * 1. Hashes the combination of userId and experimentId.
   * 2. Maps the hash to a bucket (0-10000).
   * 3. Selects the variant based on traffic allocation.
   */
  static assignVariant(userId: string, experiment: Experiment): Variant | null {
    const traceId = getTraceId();

    if (experiment.status !== 'RUNNING') {
      logger.debug('ABTestingAssignmentService', 'assignVariant', 'Experiment not running', {
        experimentId: experiment._id?.toString(),
        status: experiment.status,
        traceId,
      });
      return null;
    }

    // 1. Deterministic Hashing (Simplified MurmurHash3 approach)
    const seed = experiment._id?.toString() || 'default-seed';
    const hash = this.hashString(`${userId}:${seed}`);
    const bucket = Math.abs(hash % 10000); // 0-10000 basis points

    // 2. Bucket-based Variant Selection
    let cumulativeAllocation = 0;
    for (const variant of experiment.variants) {
      cumulativeAllocation += variant.trafficAllocation;
      if (bucket < cumulativeAllocation) {
        logger.info('ABTestingAssignmentService', 'assignVariant', 'Variant assigned', {
          userId,
          experimentId: experiment._id?.toString(),
          variantId: variant.id,
          bucket,
          traceId,
        });
        return variant;
      }
    }

    // 3. Fallback to Control
    const control = experiment.variants.find(v => v.isControl) || experiment.variants[0];
    logger.warn('ABTestingAssignmentService', 'assignVariant', 'Fallback to control', {
      userId,
      experimentId: experiment._id?.toString(),
      traceId,
    });
    return control;
  }

  /**
   * Simple string hashing function (Fowler-Noll-Vo variant).
   */
  private static hashString(str: string): number {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
  }
}
