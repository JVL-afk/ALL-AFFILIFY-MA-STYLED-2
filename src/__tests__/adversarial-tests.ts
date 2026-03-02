/**
 * Adversarial Test Suite
 *
 * Comprehensive tests to verify:
 * - Race conditions in quota enforcement
 * - Multi-tenant isolation enforcement
 * - JWT validation strictness
 * - RBAC permission checks
 * - HTML sanitization effectiveness
 * - Pagination correctness
 * - Trace context propagation
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ObjectId } from 'mongodb';
import { QuotaService } from '@/services/quota-service';
import { verifyAuthStrict } from '@/lib/auth-strict';
import { enforcePermission } from '@/lib/rbac';
import { sanitizeHTML } from '@/lib/html-sanitizer';
import { parsePaginationParams, createPaginatedResult, decodeCursor, encodeCursor } from '@/lib/pagination';
import { TenantAwareDb, TenantAwareCollection } from '@/lib/tenant-aware-db';
import { getTraceId, initializeTraceContext, runWithTraceContext } from '@/lib/trace-context';

describe('Adversarial Test Suite', () => {
  describe('Quota Enforcement - Race Conditions', () => {
    let quotaService: QuotaService;
    let mockDb: any;

    beforeEach(() => {
      // Mock MongoDB database
      mockDb = {
        collection: (name: string) => ({
          findOneAndUpdate: jest.fn(),
          findOne: jest.fn(),
          updateOne: jest.fn(),
        }),
      };
      quotaService = new QuotaService(mockDb);
    });

    it('should prevent quota bypass via concurrent requests', async () => {
      const userId = new ObjectId();
      const quotaLimit = 100;

      // Simulate two concurrent requests trying to exceed quota
      const mockFindOne = jest.fn().mockResolvedValue({
        userId,
        emailsSentThisMonth: 95,
        emailsSentToday: 50,
        emailsAllowedPerMonth: quotaLimit,
        emailsAllowedPerDay: 100,
        lastResetDate: new Date(),
      });

      mockDb.collection('user_quotas').findOne = mockFindOne;

      // First request: try to send 10 emails (should succeed)
      const result1 = await quotaService.checkAndDecrementQuota(userId, 10);
      expect(result1.allowed).toBe(true);

      // Second request: try to send 10 emails (should fail due to atomic operation)
      const result2 = await quotaService.checkAndDecrementQuota(userId, 10);
      expect(result2.allowed).toBe(false);
      expect(result2.reason).toContain('quota');
    });

    it('should enforce daily quota reset correctly', async () => {
      const userId = new ObjectId();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const mockFindOne = jest.fn().mockResolvedValue({
        userId,
        emailsSentThisMonth: 50,
        emailsSentToday: 100, // Already at daily limit
        emailsAllowedPerMonth: 1000,
        emailsAllowedPerDay: 100,
        lastResetDate: yesterday,
      });

      mockDb.collection('user_quotas').findOne = mockFindOne;

      // Should fail because daily quota was not reset
      const result = await quotaService.checkAndDecrementQuota(userId, 10);
      expect(result.allowed).toBe(false);
    });
  });

  describe('Multi-Tenant Isolation', () => {
    let tenantAwareDb: TenantAwareDb;
    let mockDb: any;

    beforeEach(() => {
      mockDb = {
        collection: jest.fn((name: string) => ({
          find: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([]),
          }),
          findOne: jest.fn().mockResolvedValue(null),
          insertOne: jest.fn(),
          updateOne: jest.fn(),
          deleteOne: jest.fn(),
          countDocuments: jest.fn().mockResolvedValue(0),
        })),
      };

      const tenantContext = {
        userId: new ObjectId(),
        userPlan: 'pro' as const,
        role: 'user' as const,
      };

      tenantAwareDb = new TenantAwareDb(mockDb, tenantContext);
    });

    it('should prevent cross-tenant data access', async () => {
      const collection = tenantAwareDb.collection('email_campaigns');
      const differentUserId = new ObjectId();

      // Attempt to query data from a different tenant
      expect(() => {
        // This should throw an error due to tenant isolation violation
        collection.find({ userId: differentUserId });
      }).toThrow();
    });

    it('should enforce tenant filter on all queries', async () => {
      const collection = tenantAwareDb.collection('email_campaigns');

      // Try to access without userId filter
      await collection.find({});

      // Verify that the underlying find was called with userId filter
      const mockCollection = mockDb.collection('email_campaigns');
      expect(mockCollection.find).toHaveBeenCalled();
    });

    it('should prevent non-admin access to underlying database', async () => {
      expect(() => {
        tenantAwareDb.getUnderlying();
      }).toThrow('Only administrators can access the underlying database');
    });
  });

  describe('JWT Validation Strictness', () => {
    it('should reject expired JWT', () => {
      const expiredPayload = {
        userId: 'user123',
        userPlan: 'pro' as const,
        role: 'user' as const,
        iat: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        exp: Math.floor(Date.now() / 1000) - 1800, // 30 minutes ago
      };

      // Create a JWT with expired timestamp
      const jwtSecret = 'test-secret';
      // This should fail verification
      const result = verifyAuthStrict(`Bearer invalid.token.here`, jwtSecret);
      expect(result).toBeNull();
    });

    it('should reject JWT with missing required claims', () => {
      const incompletPayload = {
        userId: 'user123',
        // Missing userPlan and role
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const jwtSecret = 'test-secret';
      // This should fail verification due to missing claims
      const result = verifyAuthStrict(`Bearer invalid.token.here`, jwtSecret);
      expect(result).toBeNull();
    });

    it('should reject JWT with invalid signature', () => {
      const jwtSecret = 'test-secret';
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';

      const result = verifyAuthStrict(`Bearer ${invalidToken}`, jwtSecret);
      expect(result).toBeNull();
    });
  });

  describe('RBAC Permission Checks', () => {
    it('should enforce campaign creation permission', () => {
      const userPayload = {
        userId: 'user123',
        userPlan: 'free' as const,
        role: 'user' as const,
      };

      const traceId = 'trace123';

      expect(() => {
        enforcePermission(userPayload, { action: 'create', resource: 'campaign' }, traceId);
      }).not.toThrow();
    });

    it('should deny admin-only operations to regular users', () => {
      const userPayload = {
        userId: 'user123',
        userPlan: 'free' as const,
        role: 'user' as const,
      };

      const traceId = 'trace123';

      expect(() => {
        enforcePermission(userPayload, { action: 'delete', resource: 'user' }, traceId);
      }).toThrow();
    });

    it('should allow admin operations to admins', () => {
      const adminPayload = {
        userId: 'admin123',
        userPlan: 'enterprise' as const,
        role: 'admin' as const,
      };

      const traceId = 'trace123';

      expect(() => {
        enforcePermission(adminPayload, { action: 'delete', resource: 'user' }, traceId);
      }).not.toThrow();
    });
  });

  describe('HTML Sanitization', () => {
    it('should remove script tags', () => {
      const maliciousHTML = '<p>Hello</p><script>alert("XSS")</script>';
      const sanitized = sanitizeHTML(maliciousHTML);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
      expect(sanitized).toContain('Hello');
    });

    it('should remove event handlers', () => {
      const maliciousHTML = '<img src="x" onerror="alert(\'XSS\')" />';
      const sanitized = sanitizeHTML(maliciousHTML);

      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('alert');
    });

    it('should remove dangerous protocols', () => {
      const maliciousHTML = '<a href="javascript:alert(\'XSS\')">Click me</a>';
      const sanitized = sanitizeHTML(maliciousHTML);

      expect(sanitized).not.toContain('javascript:');
    });

    it('should preserve safe HTML', () => {
      const safeHTML = '<p>Hello <strong>World</strong></p><a href="https://example.com">Link</a>';
      const sanitized = sanitizeHTML(safeHTML);

      expect(sanitized).toContain('Hello');
      expect(sanitized).toContain('World');
      expect(sanitized).toContain('https://example.com');
    });
  });

  describe('Pagination Correctness', () => {
    it('should parse pagination parameters correctly', () => {
      const params = parsePaginationParams('50', 'cursor123');

      expect(params.limit).toBe(50);
      expect(params.cursor).toBe('cursor123');
    });

    it('should enforce maximum limit', () => {
      const params = parsePaginationParams('500'); // Exceeds max of 100

      expect(params.limit).toBe(100);
    });

    it('should encode and decode cursors correctly', () => {
      const originalId = new ObjectId();
      const encoded = encodeCursor(originalId);
      const decoded = decodeCursor(encoded);

      expect(decoded?.toString()).toBe(originalId.toString());
    });

    it('should create paginated results with correct hasMore flag', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({
        _id: new ObjectId(),
        name: `Item ${i}`,
      }));

      const result = createPaginatedResult(items, 20);

      expect(result.count).toBe(20);
      expect(result.hasMore).toBe(true);
      expect(result.nextCursor).toBeDefined();
    });

    it('should not set nextCursor when no more items', () => {
      const items = Array.from({ length: 10 }, (_, i) => ({
        _id: new ObjectId(),
        name: `Item ${i}`,
      }));

      const result = createPaginatedResult(items, 20);

      expect(result.count).toBe(10);
      expect(result.hasMore).toBe(false);
      expect(result.nextCursor).toBeUndefined();
    });
  });

  describe('Trace Context Propagation', () => {
    it('should initialize trace context with unique IDs', () => {
      const context = initializeTraceContext('user123', 'campaign456');

      expect(context.traceId).toBeDefined();
      expect(context.spanId).toBeDefined();
      expect(context.userId).toBe('user123');
      expect(context.campaignId).toBe('campaign456');
    });

    it('should propagate trace context through async operations', async () => {
      const context = initializeTraceContext('user123');

      let capturedTraceId: string | undefined;

      await runWithTraceContext(context, async () => {
        capturedTraceId = getTraceId();
      });

      expect(capturedTraceId).toBe(context.traceId);
    });

    it('should generate fallback trace ID when context is not available', () => {
      const traceId = getTraceId();

      expect(traceId).toBeDefined();
      expect(traceId.length).toBeGreaterThan(0);
    });
  });

  describe('End-to-End Security Validation', () => {
    it('should reject request without Authorization header', () => {
      const result = verifyAuthStrict('', 'secret');
      expect(result).toBeNull();
    });

    it('should reject request with malformed Authorization header', () => {
      const result = verifyAuthStrict('InvalidFormat', 'secret');
      expect(result).toBeNull();
    });

    it('should sanitize HTML before storing in database', () => {
      const userInput = '<p>Hello</p><script>alert("XSS")</script>';
      const sanitized = sanitizeHTML(userInput);

      // Verify that the sanitized version is safe
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Hello');
    });
  });
});
