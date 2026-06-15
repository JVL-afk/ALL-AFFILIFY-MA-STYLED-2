const { ObjectId } = require('mongodb');

// Mock MongoDB
const mockDb = {
  collection: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  toArray: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
};

jest.mock('@/lib/mongodb', () => ({
  connectToDatabase: jest.fn().mockResolvedValue({ db: mockDb }),
}));

// Mock Auth
jest.mock('@/lib/auth', () => ({
  verifyAuth: jest.fn().mockResolvedValue({
    success: true,
    user: { id: '507f1f77bcf86cd799439011', plan: 'enterprise' },
  }),
}));

// Mock RBAC
jest.mock('@/lib/rbac', () => ({
  hasPlanOrHigher: jest.fn().mockReturnValue(true),
  enforcePermission: jest.fn().mockImplementation((user, permission) => {
    if (!user || user.plan !== 'enterprise') {
      throw new Error('Unauthorized');
    }
  }),
}));

// Mock Observability
jest.mock('@/services/observability', () => ({
  ObservabilityService: {
    getInstance: jest.fn().mockReturnValue({
      withSpan: jest.fn().mockImplementation((name, cb) => cb({
        setAttributes: jest.fn(),
        setAttribute: jest.fn(),
        recordException: jest.fn(),
        setStatus: jest.fn(),
      })),
    }),
  },
  SpanStatusCode: {
    ERROR: 'ERROR',
    OK: 'OK',
  },
}));

// Mock Trace Context
jest.mock('@/lib/trace-context', () => ({
  getTraceId: jest.fn().mockReturnValue('test-trace-id'),
  initializeTraceContext: jest.fn().mockImplementation((ctx, cb) => cb()),
}));

// Mock HTML Sanitizer
jest.mock('@/lib/html-sanitizer', () => ({
  sanitizeHTML: jest.fn().mockImplementation((html) => {
    if (html.includes('javascript:')) return '#';
    return html;
  }),
}));

// Mock TenantAwareDb
jest.mock('@/lib/tenant-aware-db', () => ({
  TenantAwareDb: jest.fn().mockImplementation(() => ({
    collection: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    toArray: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  })),
}));

global.mockDb = mockDb;
