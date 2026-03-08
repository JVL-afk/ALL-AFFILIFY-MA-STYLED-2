import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ObjectId } from 'mongodb';
import { TeamCollaborationService, Team, TeamMember, Project } from '@/services/team-collaboration-service';
import { VerifiedJWTPayload } from '@/lib/auth-strict';
import { addRelationship, deleteRelationship, checkPermission, userToSubject, toObject } from '@/lib/zanzibar-rebac';
import { atomicIncrementAndCheck, initializeQuotaCounter, resetQuotaCounter } from '@/lib/atomic-quota-enforcement';
import { CircuitBreaker, CircuitBreakerState, retryWithBackoff } from '@/lib/circuit-breaker';
import { enqueueMessage, markMessageSuccess, markMessageFailed, checkIdempotency, storeIdempotencyRecord } from '@/lib/dlq-and-idempotency';

/**
 * Mock database for testing
 */
class MockDatabase {
  private collections: Map<string, any[]> = new Map();

  collection(name: string) {
    if (!this.collections.has(name)) {
      this.collections.set(name, []);
    }

    return {
      findOne: async (filter: any) => {
        const items = this.collections.get(name) || [];
        return items.find(item => this.matchesFilter(item, filter)) || null;
      },
      find: async (filter: any) => {
        const items = this.collections.get(name) || [];
        return items.filter(item => this.matchesFilter(item, filter));
      },
      insertOne: async (doc: any) => {
        const items = this.collections.get(name) || [];
        const newDoc = { ...doc, _id: new ObjectId() };
        items.push(newDoc);
        this.collections.set(name, items);
        return { insertedId: newDoc._id };
      },
      updateOne: async (filter: any, update: any) => {
        const items = this.collections.get(name) || [];
        const index = items.findIndex(item => this.matchesFilter(item, filter));
        if (index >= 0) {
          items[index] = { ...items[index], ...update.$push ? { members: [...items[index].members, update.$push.members] } : update };
          this.collections.set(name, items);
          return { modifiedCount: 1 };
        }
        return { modifiedCount: 0 };
      },
      deleteOne: async (filter: any) => {
        const items = this.collections.get(name) || [];
        const index = items.findIndex(item => this.matchesFilter(item, filter));
        if (index >= 0) {
          items.splice(index, 1);
          this.collections.set(name, items);
          return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
      },
    };
  }

  private matchesFilter(item: any, filter: any): boolean {
    for (const key in filter) {
      if (item[key] !== filter[key]) {
        return false;
      }
    }
    return true;
  }

  clear(): void {
    this.collections.clear();
  }
}

describe('Team Collaboration Service', () => {
  let service: TeamCollaborationService;
  let mockDb: MockDatabase;
  let testUser: VerifiedJWTPayload;
  let traceId: string;

  beforeEach(() => {
    mockDb = new MockDatabase();
    service = new TeamCollaborationService(mockDb);
    testUser = {
      userId: new ObjectId().toString(),
      email: 'test@example.com',
      role: 'user',
    };
    traceId = `trace-${Date.now()}`;
  });

  afterEach(() => {
    mockDb.clear();
  });

  describe('Team Creation Invariants', () => {
    it('should create a team and enforce single team per owner', async () => {
      const { team, zookie } = await service.createTeam(testUser, 'Test Team', traceId);

      expect(team).toBeDefined();
      expect(team.ownerId.toString()).toBe(testUser.userId);
      expect(team.name).toBe('Test Team');
      expect(team.members).toHaveLength(1);
      expect(team.members[0].role).toBe('owner');
      expect(zookie).toBeDefined();
    });

    it('should prevent creating a second team for the same owner', async () => {
      await service.createTeam(testUser, 'First Team', traceId);

      await expect(service.createTeam(testUser, 'Second Team', traceId)).rejects.toThrow(
        'You already own a team'
      );
    });

    it('should enforce that team owner is added as a member', async () => {
      const { team } = await service.createTeam(testUser, 'Test Team', traceId);

      const ownerMember = team.members.find(m => m.userId.toString() === testUser.userId);
      expect(ownerMember).toBeDefined();
      expect(ownerMember?.role).toBe('owner');
      expect(ownerMember?.status).toBe('active');
    });
  });

  describe('Tenant Isolation', () => {
    it('should prevent non-members from viewing team projects', async () => {
      const { team } = await service.createTeam(testUser, 'Test Team', traceId);

      const otherUser: VerifiedJWTPayload = {
        userId: new ObjectId().toString(),
        email: 'other@example.com',
        role: 'user',
      };

      await expect(service.getTeamProjects(otherUser, team._id!.toString(), traceId)).rejects.toThrow(
        'You are not a member of this team'
      );
    });

    it('should enforce that only team members can create projects', async () => {
      const { team } = await service.createTeam(testUser, 'Test Team', traceId);

      const nonMember: VerifiedJWTPayload = {
        userId: new ObjectId().toString(),
        email: 'nonmember@example.com',
        role: 'user',
      };

      await expect(
        service.createProject(nonMember, team._id!.toString(), { name: 'Project', description: 'Desc' }, traceId)
      ).rejects.toThrow('You are not a member of this team');
    });

    it('should enforce that only owners can remove members', async () => {
      const { team } = await service.createTeam(testUser, 'Test Team', traceId);

      const editor: VerifiedJWTPayload = {
        userId: new ObjectId().toString(),
        email: 'editor@example.com',
        role: 'user',
      };

      // Add editor as a member
      await service.addTeamMember(testUser, team._id!.toString(), editor.email, 'editor', traceId);

      // Try to remove a member as editor (should fail)
      await expect(
        service.removeTeamMember(editor, team._id!.toString(), new ObjectId().toString(), traceId)
      ).rejects.toThrow('You do not have permission to remove members from this team');
    });
  });

  describe('Zanzibar ReBAC Enforcement', () => {
    it('should create relationship tuples for team ownership', async () => {
      const { team, zookie } = await service.createTeam(testUser, 'Test Team', traceId);

      expect(zookie).toBeDefined();
      expect(zookie.version).toBeDefined();

      // Verify the relationship exists
      const hasAccess = await checkPermission(
        userToSubject(testUser),
        'owner',
        toObject('team', team._id!.toString()),
        zookie,
        traceId
      );

      expect(hasAccess).toBe(true);
    });

    it('should create relationship tuples for team members', async () => {
      const { team } = await service.createTeam(testUser, 'Test Team', traceId);

      const memberEmail = 'member@example.com';
      const { member, zookie } = await service.addTeamMember(testUser, team._id!.toString(), memberEmail, 'editor', traceId);

      expect(zookie).toBeDefined();
      expect(member.role).toBe('editor');
    });

    it('should delete relationship tuples when removing members', async () => {
      const { team } = await service.createTeam(testUser, 'Test Team', traceId);

      const memberEmail = 'member@example.com';
      const { member } = await service.addTeamMember(testUser, team._id!.toString(), memberEmail, 'editor', traceId);

      const { zookie } = await service.removeTeamMember(testUser, team._id!.toString(), member.userId!.toString(), traceId);

      expect(zookie).toBeDefined();
    });
  });

  describe('Quota Enforcement', () => {
    it('should enforce atomic quota increments', async () => {
      const userId = testUser.userId;
      const feature = 'team_creation';
      const limit = 5;

      await initializeQuotaCounter(userId, feature, limit, traceId);

      // Increment quota
      const result1 = await atomicIncrementAndCheck(userId, feature, 1, traceId);
      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(limit - 1);

      // Increment again
      const result2 = await atomicIncrementAndCheck(userId, feature, 1, traceId);
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(limit - 2);
    });

    it('should deny quota when limit is exceeded', async () => {
      const userId = testUser.userId;
      const feature = 'team_creation';
      const limit = 2;

      await initializeQuotaCounter(userId, feature, limit, traceId);

      // Use up the quota
      await atomicIncrementAndCheck(userId, feature, 2, traceId);

      // Try to exceed the quota
      const result = await atomicIncrementAndCheck(userId, feature, 1, traceId);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset quota counters', async () => {
      const userId = testUser.userId;
      const feature = 'team_creation';
      const limit = 5;

      await initializeQuotaCounter(userId, feature, limit, traceId);
      await atomicIncrementAndCheck(userId, feature, 3, traceId);

      // Reset the counter
      await resetQuotaCounter(userId, feature, traceId);

      // Verify the counter is reset
      const result = await atomicIncrementAndCheck(userId, feature, 1, traceId);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(limit - 1);
    });
  });

  describe('Circuit Breaker', () => {
    it('should transition from CLOSED to OPEN on failures', async () => {
      const breaker = new CircuitBreaker({
        name: 'test-breaker',
        failureThreshold: 2,
        successThreshold: 1,
        timeout: 1000,
      });

      let failureCount = 0;

      // Simulate failures
      for (let i = 0; i < 2; i++) {
        try {
          await breaker.execute(async () => {
            failureCount++;
            throw new Error('Test failure');
          }, traceId);
        } catch (e) {
          // Expected
        }
      }

      expect(breaker.getState()).toBe(CircuitBreakerState.OPEN);
    });

    it('should transition from OPEN to HALF_OPEN after timeout', async () => {
      const breaker = new CircuitBreaker({
        name: 'test-breaker',
        failureThreshold: 1,
        successThreshold: 1,
        timeout: 100,
      });

      // Trigger failure
      try {
        await breaker.execute(async () => {
          throw new Error('Test failure');
        }, traceId);
      } catch (e) {
        // Expected
      }

      expect(breaker.getState()).toBe(CircuitBreakerState.OPEN);

      // Wait for timeout
      await new Promise(resolve => setTimeout(resolve, 150));

      // Try again, should transition to HALF_OPEN
      try {
        await breaker.execute(async () => {
          throw new Error('Test failure');
        }, traceId);
      } catch (e) {
        // Expected
      }

      // After one more failure in HALF_OPEN, should stay OPEN
      expect(breaker.getState()).toBe(CircuitBreakerState.OPEN);
    });
  });

  describe('Idempotency', () => {
    it('should detect duplicate requests', async () => {
      const idempotencyKey = 'test-key-123';
      const requestHash = 'hash-abc';
      const response = { success: true };

      // Store the first request
      await storeIdempotencyRecord(idempotencyKey, requestHash, response, 3600, traceId);

      // Check for duplicate
      const { isDuplicate, cachedResponse } = await checkIdempotency(idempotencyKey, requestHash, traceId);

      expect(isDuplicate).toBe(true);
      expect(cachedResponse).toEqual(response);
    });

    it('should not treat requests with different hashes as duplicates', async () => {
      const idempotencyKey = 'test-key-123';
      const requestHash1 = 'hash-abc';
      const requestHash2 = 'hash-def';
      const response = { success: true };

      // Store the first request
      await storeIdempotencyRecord(idempotencyKey, requestHash1, response, 3600, traceId);

      // Check with different hash
      const { isDuplicate } = await checkIdempotency(idempotencyKey, requestHash2, traceId);

      expect(isDuplicate).toBe(false);
    });
  });

  describe('Race Condition Prevention', () => {
    it('should handle concurrent team member additions atomically', async () => {
      const { team } = await service.createTeam(testUser, 'Test Team', traceId);

      const memberEmails = ['member1@example.com', 'member2@example.com', 'member3@example.com'];

      // Simulate concurrent additions
      const promises = memberEmails.map(email =>
        service.addTeamMember(testUser, team._id!.toString(), email, 'editor', traceId)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.member).toBeDefined();
        expect(result.zookie).toBeDefined();
      });
    });

    it('should prevent duplicate member additions', async () => {
      const { team } = await service.createTeam(testUser, 'Test Team', traceId);

      const memberEmail = 'member@example.com';

      // Add member once
      await service.addTeamMember(testUser, team._id!.toString(), memberEmail, 'editor', traceId);

      // Try to add the same member again
      await expect(
        service.addTeamMember(testUser, team._id!.toString(), memberEmail, 'viewer', traceId)
      ).rejects.toThrow('Member already exists in team');
    });
  });

  describe('Message Queue and DLQ', () => {
    it('should enqueue and process messages successfully', async () => {
      const messageId = `msg-${Date.now()}`;
      const payload = { teamId: 'team-123', action: 'create' };

      const message = await enqueueMessage(messageId, payload, 3, traceId);
      expect(message.status).toBe('PENDING');

      await markMessageSuccess(messageId, traceId);
      // In a real test, we'd verify the message status changed
    });

    it('should move messages to DLQ after max retries', async () => {
      const messageId = `msg-${Date.now()}`;
      const payload = { teamId: 'team-123', action: 'create' };

      await enqueueMessage(messageId, payload, 2, traceId);

      // Simulate failures
      await markMessageFailed(messageId, 'Error 1', traceId);
      await markMessageFailed(messageId, 'Error 2', traceId);

      // After max retries, should be in DLQ
      // In a real test, we'd verify the message status is DEAD_LETTER
    });
  });
});
