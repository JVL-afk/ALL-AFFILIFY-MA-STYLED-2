import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/debug-logger';
import { EmailSendingService } from '@/services/email-sending-service';
import { verifyAuthStrict } from '@/lib/auth-strict';
import { enforcePermission } from '@/lib/rbac';
import { configService } from '@/services/config-service';
import { z } from 'zod';
import { initializeTraceContext, runWithTraceContext } from '@/lib/trace-context';

/**
 * Send Email Campaign Endpoint
 *
 * POST /api/email-marketing/send
 *
 * Sends a campaign to multiple recipients with:
 * - Strict JWT authentication and RBAC authorization
 * - Multi-tenant isolation
 * - Atomic quota enforcement
 * - Circuit breaker protection
 * - Dynamic recipient limit enforcement
 * - HTML sanitization
 * - Structured logging with trace context
 */

const SendCampaignSchema = z.object({
  campaignId: z.string().min(1, 'Campaign ID is required'),
  recipients: z
    .array(z.string().email('Invalid email address'))
    .min(1, 'At least one recipient is required')
    .max(10000, 'Maximum 10,000 recipients per request'),
});

type SendCampaignRequest = z.infer<typeof SendCampaignSchema>;

export async function POST(request: NextRequest) {
  const traceContext = initializeTraceContext();

  return runWithTraceContext(traceContext, async () => {
    try {
      // Extract and verify JWT with strict validation
      const authHeader = request.headers.get('Authorization');
      if (!authHeader) {
        logger.warn('EmailMarketingAPI', 'POST /send', 'Missing Authorization header', {
          trace_id: traceContext.traceId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Unauthorized: Missing Authorization header' }, { status: 401 });
      }

      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const payload = verifyAuthStrict(authHeader, jwtSecret);
      if (!payload) {
        logger.warn('EmailMarketingAPI', 'POST /send', 'JWT verification failed', {
          trace_id: traceContext.traceId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Unauthorized: Invalid JWT' }, { status: 401 });
      }

      // Enforce permission to send campaigns
      try {
        enforcePermission(payload, { action: 'send', resource: 'campaign' }, traceContext.traceId);
      } catch (error) {
        logger.warn('EmailMarketingAPI', 'POST /send', 'Permission denied', {
          trace_id: traceContext.traceId,
          user_id: payload.userId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
      }

      // Parse and validate request body
      const body = await request.json();
      const validationResult = SendCampaignSchema.safeParse(body);

      if (!validationResult.success) {
        logger.warn('EmailMarketingAPI', 'POST /send', 'Invalid send campaign payload', {
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

      const { campaignId, recipients } = validationResult.data;
      const userId = new ObjectId(payload.userId);
      const campaignObjectId = new ObjectId(campaignId);

      // Enforce dynamic recipient limit based on plan
      const planLimits = configService.getPlanLimits(payload.userPlan);
      if (recipients.length > planLimits.maxRecipientsPerSend) {
        logger.warn('EmailMarketingAPI', 'POST /send', 'Recipient limit exceeded for plan', {
          trace_id: traceContext.traceId,
          user_id: payload.userId,
          userPlan: payload.userPlan,
          recipientCount: recipients.length,
          maxAllowed: planLimits.maxRecipientsPerSend,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json(
          {
            error: `Too many recipients. Your ${payload.userPlan} plan allows maximum ${planLimits.maxRecipientsPerSend} recipients per send.`,
          },
          { status: 400 }
        );
      }

      // Connect to database
      const { db } = await connectToDatabase();

      // Fetch campaign to verify ownership and get content
      const campaign = await db.collection('email_campaigns').findOne({
        _id: campaignObjectId,
        userId,
      });

      if (!campaign) {
        logger.warn('EmailMarketingAPI', 'POST /send', 'Campaign not found or unauthorized', {
          trace_id: traceContext.traceId,
          user_id: payload.userId,
          campaign_id: campaignId,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }

      // Verify campaign is in a sendable state
      if (campaign.status === 'sent') {
        logger.warn('EmailMarketingAPI', 'POST /send', 'Cannot resend already sent campaign', {
          trace_id: traceContext.traceId,
          user_id: payload.userId,
          campaign_id: campaignId,
          status: campaign.status,
          service: 'EmailMarketingAPI',
        });
        return NextResponse.json({ error: 'Campaign has already been sent' }, { status: 400 });
      }

      // Initialize email sending service
      const emailSendingService = new EmailSendingService(db);

      // Send campaign with quota enforcement
      const sendResult = await emailSendingService.sendCampaign({
        campaignId,
        userId: payload.userId,
        recipients,
        subject: campaign.subject,
        htmlContent: campaign.htmlContent,
        textContent: campaign.textContent,
      });

      logger.info('EmailMarketingAPI', 'POST /send', 'Campaign sent successfully', {
        trace_id: traceContext.traceId,
        user_id: payload.userId,
        campaign_id: campaignId,
        successfulSends: sendResult.successfulSends,
        failedSends: sendResult.failedSends,
        service: 'EmailMarketingAPI',
      });

      return NextResponse.json(
        {
          success: true,
          data: sendResult,
        },
        { status: 200 }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('EmailMarketingAPI', 'POST /send', 'Failed to send campaign', {
        trace_id: traceContext.traceId,
        service: 'EmailMarketingAPI',
        error: errorMessage,
      });
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  });
}
