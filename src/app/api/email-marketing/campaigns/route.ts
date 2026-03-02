import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { EmailCampaignSchema } from '@/types/campaign';
import { logger } from '@/lib/debug-logger';
import { verifyAuthStrict, VerifiedJWTPayload } from '@/lib/auth-strict';
import { enforcePermission } from '@/lib/rbac';
import { sanitizeHTML } from '@/lib/html-sanitizer';
import { parsePaginationParams, buildPaginationFilter, createPaginatedResult, formatPaginationMetadata, validatePaginationParams } from '@/lib/pagination';
import { configService } from '@/services/config-service';
import { getTraceId, initializeTraceContext, runWithTraceContext } from '@/lib/trace-context';

/**
 * POST /api/email-marketing/campaigns
 * Create a new email campaign with strict validation and sanitization.
 */
export async function POST(request: NextRequest) {
  const traceContext = initializeTraceContext();

  return runWithTraceContext(traceContext, async () => {
    try {
      // Extract and verify JWT with strict validation
      const authHeader = request.headers.get('Authorization');
      if (!authHeader) {
        logger.warn('EmailMarketingAPI', 'POST /campaigns', 'Missing Authorization header', {
          trace_id: traceContext.traceId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Unauthorized: Missing Authorization header' }, { status: 401 });
      }

      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const payload = verifyAuthStrict(authHeader, jwtSecret);
      if (!payload) {
        logger.warn('EmailMarketingAPI', 'POST /campaigns', 'JWT verification failed', {
          trace_id: traceContext.traceId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Unauthorized: Invalid JWT' }, { status: 401 });
      }

      // Enforce permission to create campaigns
      try {
        enforcePermission(payload, { action: 'create', resource: 'campaign' }, traceContext.traceId);
      } catch (error) {
        logger.warn('EmailMarketingAPI', 'POST /campaigns', 'Permission denied', {
          trace_id: traceContext.traceId,
          user_id: payload.userId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
      }

      // Parse and validate request body
      const body = await request.json();
      const validationResult = EmailCampaignSchema.safeParse(body);

      if (!validationResult.success) {
        logger.warn('EmailMarketingAPI', 'POST /campaigns', 'Invalid campaign creation payload', {
          trace_id: traceContext.traceId,
          user_id: payload.userId,
          service: 'EmailMarketingAPI',
          errors: validationResult.error.flatten(),
        });
        return NextResponse.json(
          { error: 'Invalid request data', details: validationResult.error.flatten() },
          { status: 400 }
        );
      }

      const { name, subject, type, htmlContent, textContent, scheduledAt, tags, segmentId } = validationResult.data;

      // Sanitize HTML content if feature is enabled
      let sanitizedHtmlContent = htmlContent || '';
      if (configService.isFeatureEnabled('enableHTMLSanitization')) {
        sanitizedHtmlContent = sanitizeHTML(htmlContent || '', undefined, traceContext.traceId);
      }

      // Connect to database and create campaign
      const { db } = await connectToDatabase();
      const userId = new ObjectId(payload.userId);

      const newCampaign = {
        userId,
        name,
        subject,
        type,
        htmlContent: sanitizedHtmlContent,
        textContent: textContent || '',
        status: scheduledAt ? 'scheduled' : 'draft',
        recipients: 0,
        openCount: 0,
        clickCount: 0,
        bounceCount: 0,
        complaintCount: 0,
        revenue: 0,
        conversions: 0,
        scheduledAt: scheduledAt || null,
        sentAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: tags || [],
        segmentId: segmentId ? new ObjectId(segmentId) : null,
        espProvider: null,
        espMessageId: null,
      };

      const result = await db.collection('email_campaigns').insertOne(newCampaign);

      logger.info('EmailMarketingAPI', 'POST /campaigns', 'Campaign created successfully', {
        trace_id: traceContext.traceId,
        user_id: payload.userId,
        campaign_id: result.insertedId.toString(),
        service: 'EmailMarketingAPI',
        details: { name, subject, type },
      });

      return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('EmailMarketingAPI', 'POST /campaigns', 'Failed to create campaign', {
        trace_id: traceContext.traceId,
        service: 'EmailMarketingAPI',
        error: errorMessage,
      });
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  });
}

/**
 * GET /api/email-marketing/campaigns
 * Retrieve campaigns with pagination and strict authorization.
 */
export async function GET(request: NextRequest) {
  const traceContext = initializeTraceContext();

  return runWithTraceContext(traceContext, async () => {
    try {
      // Extract and verify JWT
      const authHeader = request.headers.get('Authorization');
      if (!authHeader) {
        logger.warn('EmailMarketingAPI', 'GET /campaigns', 'Missing Authorization header', {
          trace_id: traceContext.traceId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const payload = verifyAuthStrict(authHeader, jwtSecret);
      if (!payload) {
        logger.warn('EmailMarketingAPI', 'GET /campaigns', 'JWT verification failed', {
          trace_id: traceContext.traceId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Enforce permission to read campaigns
      try {
        enforcePermission(payload, { action: 'read', resource: 'campaign' }, traceContext.traceId);
      } catch (error) {
        logger.warn('EmailMarketingAPI', 'GET /campaigns', 'Permission denied', {
          trace_id: traceContext.traceId,
          user_id: payload.userId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Parse pagination parameters
      const { searchParams } = new URL(request.url);
      const limit = searchParams.get('limit');
      const cursor = searchParams.get('cursor');

      const paginationParams = parsePaginationParams(limit, cursor || undefined);
      if (!validatePaginationParams(paginationParams)) {
        logger.warn('EmailMarketingAPI', 'GET /campaigns', 'Invalid pagination parameters', {
          trace_id: traceContext.traceId,
          user_id: payload.userId,
          service: 'EmailMarketingAPI',
          limit: paginationParams.limit,
          cursor: paginationParams.cursor,
        });
        return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
      }

      // Build query with tenant filter and pagination
      const userId = new ObjectId(payload.userId);
      const paginationFilter = buildPaginationFilter(paginationParams.cursor);
      const filter = { userId, ...paginationFilter };

      // Connect to database and fetch campaigns
      const { db } = await connectToDatabase();
      const campaigns = await db
        .collection('email_campaigns')
        .find(filter)
        .sort({ _id: -1 })
        .limit(paginationParams.limit + 1) // Fetch one extra to determine if there are more
        .toArray();

      const paginatedResult = createPaginatedResult(campaigns, paginationParams.limit);

      logger.info('EmailMarketingAPI', 'GET /campaigns', 'Campaigns retrieved successfully', {
        trace_id: traceContext.traceId,
        user_id: payload.userId,
        service: 'EmailMarketingAPI',
        count: paginatedResult.count,
        hasMore: paginatedResult.hasMore,
      });

      return NextResponse.json({
        success: true,
        data: paginatedResult.items,
        pagination: formatPaginationMetadata(paginatedResult),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('EmailMarketingAPI', 'GET /campaigns', 'Failed to retrieve campaigns', {
        trace_id: traceContext.traceId,
        service: 'EmailMarketingAPI',
        error: errorMessage,
      });
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  });
}
