import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ObjectId } from 'mongodb';
import { ABTestingRepository } from '../lib/repositories/ab-testing-repository';
import { ABTestingEventService } from '../services/ab-testing-event-service';
import { ABTestingAssignmentService } from '../services/ab-testing-assignment-service';
import { ABTestingStatEngine } from '../services/ab-testing-stat-engine';
import { Experiment, ExperimentSchema } from '../lib/models/ab-testing';

/**
 * A/B Testing Adversarial Test Suite
 * 
 * Verifies the following invariants:
 * 1. Multi-tenant isolation (Cross-tenant data access prevention)
 * 2. Atomic quota enforcement (Race condition prevention)
 * 3. Deterministic assignment (User consistency)
 * 4. Statistical integrity (Significance validation)
 */
describe('A/B Testing Adversarial Suite', () => {
  let mockDb: any;
  let tenantId: ObjectId;
  let otherTenantId: ObjectId;
  let mockEventsCollection: any;
  let mockExperimentsCollection: any;

  beforeEach(() => {
    tenantId = new ObjectId();
    otherTenantId = new ObjectId();
    
    // Mock Collections
    mockEventsCollection = {
      updateOne: jest.fn().mockResolvedValue({ matchedCount: 0, modifiedCount: 0, upsertedId: new ObjectId() }),
    };

    mockExperimentsCollection = {
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
      }),
      findOne: jest.fn().mockResolvedValue(null),
      insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId() }),
      updateOne: jest.fn().mockResolvedValue({ matchedCount: 1, modifiedCount: 1 }),
    };

    // Mock MongoDB database
    mockDb = {
      collection: jest.fn((name: string) => {
        if (name === 'ab_test_events') return mockEventsCollection;
        return mockExperimentsCollection;
      }),
    };
  });

  describe('Multi-Tenant Isolation', () => {
    it('should prevent cross-tenant data access in repository', async () => {
      const repository = new ABTestingRepository(mockDb, tenantId);
      const experimentId = new ObjectId();

      await repository.findById(experimentId);

      expect(mockExperimentsCollection.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ 
          _id: experimentId, 
          tenantId: tenantId 
        })
      );
    });

    it('should throw error if tenant filter is bypassed', async () => {
      const { assertTenantFilter } = require('../middleware/tenant-isolation');
      expect(() => {
        assertTenantFilter(tenantId.toString(), { someOtherKey: 'value' });
      }).toThrow(/CRITICAL: Query executed without tenant filter/);
    });
  });

  describe('Deterministic Assignment', () => {
    it('should assign the same variant to the same user consistently', () => {
      const experiment: Experiment = ExperimentSchema.parse({
        _id: new ObjectId(),
        tenantId: new ObjectId(),
        name: 'Test Experiment',
        websiteId: new ObjectId(),
        websiteName: 'Test Website',
        status: 'RUNNING',
        type: 'headline',
        variants: [
          { id: new ObjectId().toHexString(), name: 'Control', trafficAllocation: 5000, isControl: true },
          { id: new ObjectId().toHexString(), name: 'Variant A', trafficAllocation: 5000, isControl: false },
        ],
        metrics: { primaryGoal: 'conversions' },
        schedule: { duration: 14 },
      });

      const userId = 'user-123';
      const variant1 = ABTestingAssignmentService.assignVariant(userId, experiment);
      const variant2 = ABTestingAssignmentService.assignVariant(userId, experiment);
      expect(variant1?.id).toBe(variant2?.id);
    });

    it('should respect traffic allocation percentages', () => {
      const experiment: Experiment = ExperimentSchema.parse({
        _id: new ObjectId(),
        tenantId: new ObjectId(),
        name: 'Test Experiment',
        websiteId: new ObjectId(),
        websiteName: 'Test Website',
        status: 'RUNNING',
        type: 'headline',
        variants: [
          { id: new ObjectId().toHexString(), name: 'Control', trafficAllocation: 1000, isControl: true }, // 10%
          { id: new ObjectId().toHexString(), name: 'Variant A', trafficAllocation: 9000, isControl: false }, // 90%
        ],
        metrics: { primaryGoal: 'conversions' },
        schedule: { duration: 14 },
      });

      const assignments: Record<string, number> = { 
        [experiment.variants[0].id]: 0, 
        [experiment.variants[1].id]: 0 
      };
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const variant = ABTestingAssignmentService.assignVariant(`user-${i}`, experiment);
        if (variant) assignments[variant.id]++;
      }

      expect(assignments[experiment.variants[0].id]).toBeGreaterThan(50);
      expect(assignments[experiment.variants[0].id]).toBeLessThan(150);
      expect(assignments[experiment.variants[1].id]).toBeGreaterThan(850);
      expect(assignments[experiment.variants[1].id]).toBeLessThan(950);
    });
  });

  describe('Statistical Integrity', () => {
    it('should correctly identify significant results', () => {
      const result = ABTestingStatEngine.calculateSignificance(
        10000, 1000, // 10% CR
        10000, 1200, // 12% CR
        0.95
      );
      expect(result.isSignificant).toBe(true);
      expect(result.winner).toBe('variant');
      expect(result.uplift).toBeCloseTo(0.2);
    });

    it('should reject insignificant results due to small sample size', () => {
      const result = ABTestingStatEngine.calculateSignificance(
        10, 1, // 10% CR
        10, 2, // 20% CR
        0.95
      );
      expect(result.isSignificant).toBe(false);
      expect(result.winner).toBe('none');
    });
  });

  describe('Atomic Quota Enforcement', () => {
    it('should use atomic $inc for event ingestion', async () => {
      const eventService = new ABTestingEventService(mockDb);
      const eventId = '12345678-1234-4234-8234-123456789012';
      const experimentId = new ObjectId();
      const variantId = new ObjectId().toHexString();

      await eventService.ingestEvent({
        eventId,
        tenantId,
        userId: 'user-123',
        experimentId,
        variantId,
        eventType: 'exposure',
      });

      // Verify deduplication call
      expect(mockEventsCollection.updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ eventId }),
        expect.any(Object),
        expect.objectContaining({ upsert: true })
      );

      // Verify atomic increment call
      expect(mockExperimentsCollection.updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ _id: experimentId }),
        expect.objectContaining({ 
          $inc: expect.objectContaining({ 
            'variants.$.visitors': 1 
          }) 
        })
      );
    });
  });
});
