import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/debug-logger';
import { verifyAuthStrict } from '@/lib/auth-strict';
import { enforcePermission, hasPlanOrHigher } from '@/lib/rbac';
import { parsePaginationParams, buildPaginationFilter, createPaginatedResult, formatPaginationMetadata, validatePaginationParams } from '@/lib/pagination';
import { getTraceId, initializeTraceContext, runWithTraceContext } from '@/lib/trace-context';

/**
 * GET /api/email-marketing/data
 * Retrieve aggregated email marketing data with pagination and plan-based access control.
 */
export async function GET(request: NextRequest) {
  const traceContext = initializeTraceContext();

  return runWithTraceContext(traceContext, async () => {
    try {
      // Extract and verify JWT
      const authHeader = request.headers.get('Authorization');
      if (!authHeader) {
        logger.warn('EmailMarketingAPI', 'GET /data', 'Missing Authorization header', {
          trace_id: traceContext.traceId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const payload = verifyAuthStrict(authHeader, jwtSecret);
      if (!payload) {
        logger.warn('EmailMarketingAPI', 'GET /data', 'JWT verification failed', {
          trace_id: traceContext.traceId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Enforce permission to read analytics (Pro or Enterprise plan required)
      try {
        enforcePermission(payload, { action: 'read', resource: 'campaign_analytics' }, traceContext.traceId);
        if (!hasPlanOrHigher(payload, 'pro')) {
          logger.warn('EmailMarketingAPI', 'GET /data', 'Insufficient plan for analytics access', {
            trace_id: traceContext.traceId,
            user_id: payload.userId,
            userPlan: payload.userPlan,
            service: 'EmailMarketingAPI',
          });
          return NextResponse.json({ error: 'Forbidden: Pro or Enterprise plan required' }, { status: 403 });
        }
      } catch (error) {
        logger.warn('EmailMarketingAPI', 'GET /data', 'Permission denied', {
          trace_id: traceContext.traceId,
          user_id: payload.userId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Parse pagination parameters
      const { searchParams } = new URL(request.url);
      const campaignLimit = searchParams.get('campaignLimit');
      const campaignCursor = searchParams.get('campaignCursor');
      const subscriberLimit = searchParams.get('subscriberLimit');
      const subscriberCursor = searchParams.get('subscriberCursor');

      const campaignPaginationParams = parsePaginationParams(campaignLimit, campaignCursor || undefined);
      const subscriberPaginationParams = parsePaginationParams(subscriberLimit, subscriberCursor || undefined);

      if (!validatePaginationParams(campaignPaginationParams) || !validatePaginationParams(subscriberPaginationParams)) {
        logger.warn('EmailMarketingAPI', 'GET /data', 'Invalid pagination parameters', {
          trace_id: traceContext.traceId,
          user_id: payload.userId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
      }

      const { db } = await connectToDatabase();
      const userId = new ObjectId(payload.userId);

      // Fetch campaigns with pagination
      let campaigns: any[] = [];
      let campaignPaginatedResult: any = { items: [], hasMore: false, count: 0 };

      try {
        const campaignFilter = { userId, ...buildPaginationFilter(campaignPaginationParams.cursor) };
        const campaignsData = await db
          .collection('email_campaigns')
          .find(campaignFilter)
          .sort({ createdAt: -1 })
          .limit(campaignPaginationParams.limit + 1)
          .toArray();

        campaignPaginatedResult = createPaginatedResult(campaignsData, campaignPaginationParams.limit);
        campaigns = campaignPaginatedResult.items.map((campaign: any) => ({
          id: campaign._id.toString(),
          name: campaign.name || '',
          subject: campaign.subject || '',
          status: campaign.status || 'draft',
          recipients: campaign.recipients || 0,
          openCount: campaign.openCount || 0,
          clickCount: campaign.clickCount || 0,
          bounceCount: campaign.bounceCount || 0,
          complaintCount: campaign.complaintCount || 0,
          sentDate: campaign.sentAt || null,
          scheduledDate: campaign.scheduledAt || null,
          type: campaign.type || 'newsletter',
          revenue: campaign.revenue || 0,
          conversions: campaign.conversions || 0,
        }));
      } catch (error) {
        logger.warn('EmailMarketingAPI', 'GET /data', 'Failed to fetch campaigns', {
          trace_id: traceContext.traceId,
          user_id: payload.userId.toString(),
          service: 'EmailMarketingAPI',
          error: error instanceof Error ? error.message : String(error),
        });
      }

      // Calculate aggregate stats
      let stats = {
        totalSubscribers: 0,
        totalCampaigns: 0,
        openRate: 0,
        clickRate: 0,
        revenue: 0,
        totalOpens: 0,
        totalClicks: 0,
      };

      try {
        const allCampaigns = await db.collection('email_campaigns').find({ userId }).toArray();
        stats.totalCampaigns = allCampaigns.length;

        if (allCampaigns.length > 0) {
          const totalOpens = allCampaigns.reduce((sum, c) => sum + (c.openCount || 0), 0);
          const totalClicks = allCampaigns.reduce((sum, c) => sum + (c.clickCount || 0), 0);
          const totalRecipients = allCampaigns.reduce((sum, c) => sum + (c.recipients || 0), 0);

          stats.totalOpens = totalOpens;
          stats.totalClicks = totalClicks;
          stats.openRate = totalRecipients > 0 ? Number(((totalOpens / totalRecipients) * 100).toFixed(1)) : 0;
          stats.clickRate = totalRecipients > 0 ? Number(((totalClicks / totalRecipients) * 100).toFixed(1)) : 0;
          stats.revenue = allCampaigns.reduce((sum, c) => sum + (c.revenue || 0), 0);
        }
      } catch (error) {
        logger.warn('EmailMarketingAPI', 'GET /data', 'Failed to calculate stats', {
          trace_id: traceContext.traceId,
          user_id: payload.userId.toString(),
          service: 'EmailMarketingAPI',
          error: error instanceof Error ? error.message : String(error),
        });
      }

      // Fetch subscribers count
      try {
        const subscribersCount = await db.collection('email_subscribers').countDocuments({ userId, status: 'active' });
        stats.totalSubscribers = subscribersCount;
      } catch (error) {
        logger.warn('EmailMarketingAPI', 'GET /data', 'Failed to fetch subscriber count', {
          trace_id: traceContext.traceId,
          user_id: payload.userId.toString(),
          service: 'EmailMarketingAPI',
          error: error instanceof Error ? error.message : String(error),
        });
      }

      // Fetch templates with pagination
      let templates: any[] = [];
      let templatePaginatedResult: any = { items: [], hasMore: false, count: 0 };

      try {
        const templateFilter = { userId, ...buildPaginationFilter(campaignPaginationParams.cursor) };
        const templatesData = await db
          .collection('email_templates')
          .find(templateFilter)
          .sort({ createdAt: -1 })
          .limit(campaignPaginationParams.limit + 1)
          .toArray();

        templatePaginatedResult = createPaginatedResult(templatesData, campaignPaginationParams.limit);
        templates = templatePaginatedResult.items.map((template: any) => ({
          id: template._id.toString(),
          name: template.name || '',
          category: template.category || '',
          thumbnail: template.thumbnail || '',
          description: template.description || '',
          uses: template.uses || 0,
        }));
      } catch (error) {
        logger.warn('EmailMarketingAPI', 'GET /data', 'Failed to fetch templates', {
          trace_id: traceContext.traceId,
          user_id: payload.userId.toString(),
          service: 'EmailMarketingAPI',
          error: error instanceof Error ? error.message : String(error),
        });
      }

      // Fetch subscribers with pagination
      let subscribers: any[] = [];
      let subscriberPaginatedResult: any = { items: [], hasMore: false, count: 0 };

      try {
        const subscriberFilter = { userId, ...buildPaginationFilter(subscriberPaginationParams.cursor) };
        const subscribersData = await db
          .collection('email_subscribers')
          .find(subscriberFilter)
          .sort({ joinedDate: -1 })
          .limit(subscriberPaginationParams.limit + 1)
          .toArray();

        subscriberPaginatedResult = createPaginatedResult(subscribersData, subscriberPaginationParams.limit);
        subscribers = subscriberPaginatedResult.items.map((sub: any) => ({
          id: sub._id.toString(),
          email: sub.email || '',
          name: sub.name || '',
          status: sub.status || 'active',
          joinedDate: sub.joinedDate || new Date(),
          tags: sub.tags || [],
        }));
      } catch (error) {
        logger.warn('EmailMarketingAPI', 'GET /data', 'Failed to fetch subscribers', {
          trace_id: traceContext.traceId,
          user_id: payload.userId.toString(),
          service: 'EmailMarketingAPI',
          error: error instanceof Error ? error.message : String(error),
        });
      }

      logger.info('EmailMarketingAPI', 'GET /data', 'Email marketing data retrieved successfully', {
        trace_id: traceContext.traceId,
        user_id: payload.userId,
        service: 'EmailMarketingAPI',
        campaignCount: campaigns.length,
        subscriberCount: subscribers.length,
        templateCount: templates.length,
      });

      return NextResponse.json({
        success: true,
        data: {
          campaigns,
          templates,
          subscribers,
          stats,
        },
        pagination: {
          campaigns: formatPaginationMetadata(campaignPaginatedResult),
          templates: formatPaginationMetadata(templatePaginatedResult),
          subscribers: formatPaginationMetadata(subscriberPaginatedResult),
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('EmailMarketingAPI', 'GET /data', 'Error fetching email marketing data', {
        trace_id: traceContext.traceId,
        service: 'EmailMarketingAPI',
        error: errorMessage,
      });
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  });
}
