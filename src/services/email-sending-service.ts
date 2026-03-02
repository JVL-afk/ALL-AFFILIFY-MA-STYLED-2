import { Db, ObjectId } from 'mongodb';
import { sendGridAdapter } from '@/services/sendgrid-adapter';
import { QuotaService } from '@/services/quota-service';
import { logger } from '@/lib/debug-logger';
import { sanitizeHTML } from '@/lib/html-sanitizer';
import { configService } from '@/services/config-service';

/**
 * Email Sending Service
 * 
 * Orchestrates email sending with:
 * - Quota enforcement (atomic)
 * - SendGrid integration with circuit breaker
 * - Campaign tracking
 * - Multi-tenant isolation
 */

export interface SendCampaignRequest {
  campaignId: string;
  userId: string;
  recipients: string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface SendResult {
  campaignId: string;
  totalRecipients: number;
  successfulSends: number;
  failedSends: number;
  errors: Array<{ recipient: string; error: string }>;
}

export class EmailSendingService {
  private db: Db;
  private quotaService: QuotaService;

  constructor(db: Db) {
    this.db = db;
    this.quotaService = new QuotaService(db);
  }

  /**
   * Send a campaign to multiple recipients with quota enforcement.
   */
  async sendCampaign(request: SendCampaignRequest): Promise<SendResult> {
    const userId = new ObjectId(request.userId);
    const campaignId = new ObjectId(request.campaignId);
    const traceId = crypto.randomUUID();

    logger.info('EmailSendingService', 'sendCampaign', 'Starting campaign send', {
      trace_id: traceId,
      campaignId: request.campaignId,
      user_id: request.userId,
      recipientCount: request.recipients.length,
    });

    // Sanitize HTML content if feature is enabled
    let sanitizedHtmlContent = request.htmlContent;
    if (configService.isFeatureEnabled('enableHTMLSanitization')) {
      sanitizedHtmlContent = sanitizeHTML(request.htmlContent, undefined, traceId);
    }

    const result: SendResult = {
      campaignId: request.campaignId,
      totalRecipients: request.recipients.length,
      successfulSends: 0,
      failedSends: 0,
      errors: [],
    };

    // Check quota for the entire campaign
    const quotaCheck = await this.quotaService.checkAndDecrementQuota(userId, request.recipients.length);

    if (!quotaCheck.allowed) {
      logger.error('EmailSendingService', 'sendCampaign', 'Quota check failed', {
        campaignId: request.campaignId,
        userId: request.userId,
        reason: quotaCheck.reason,
        remaining: quotaCheck.remaining,
      });

      return {
        ...result,
        failedSends: request.recipients.length,
        errors: [
          {
            recipient: 'all',
            error: `Quota exceeded: ${quotaCheck.reason}. Remaining: ${quotaCheck.remaining}`,
          },
        ],
      };
    }

    // Send emails to each recipient
    for (const recipient of request.recipients) {
      try {
        const sendResult = await sendGridAdapter.sendEmail({
          to: recipient,
          subject: request.subject,
          html: sanitizedHtmlContent,
          text: request.textContent,
        });

        if (sendResult.success) {
          result.successfulSends++;

          // Log successful send
          await this.db.collection('email_events').insertOne({
            campaignId,
            userId,
            recipient,
            eventType: 'sent',
            messageId: sendResult.messageId,
            timestamp: new Date(),
          });

          logger.debug('EmailSendingService', 'sendCampaign', 'Email sent successfully', {
            campaignId: request.campaignId,
            recipient,
            messageId: sendResult.messageId,
          });
        } else {
          result.failedSends++;
          result.errors.push({
            recipient,
            error: sendResult.error || 'Unknown error',
          });

          logger.warn('EmailSendingService', 'sendCampaign', 'Email send failed', {
            campaignId: request.campaignId,
            recipient,
            error: sendResult.error,
          });
        }
      } catch (error) {
        result.failedSends++;
        const errorMessage = (error as Error).message;
        result.errors.push({
          recipient,
          error: errorMessage,
        });

        logger.error('EmailSendingService', 'sendCampaign', 'Exception during email send', {
          campaignId: request.campaignId,
          recipient,
          error: errorMessage,
        });
      }
    }

    // Update campaign with send results
    await this.db.collection('email_campaigns').updateOne(
      { _id: campaignId, userId },
      {
        $set: {
          status: 'sent',
          sentAt: new Date(),
          sentCount: result.successfulSends,
          updatedAt: new Date(),
        },
      }
    );

    logger.info('EmailSendingService', 'sendCampaign', 'Campaign send completed', {
      campaignId: request.campaignId,
      userId: request.userId,
      successfulSends: result.successfulSends,
      failedSends: result.failedSends,
    });

    return result;
  }

  /**
   * Get user's remaining quota.
   */
  async getUserQuota(userId: ObjectId): Promise<{ monthly: number; daily: number }> {
    return this.quotaService.getRemainingQuota(userId);
  }

  /**
   * Initialize user quota for a new user.
   */
  async initializeUserQuota(userId: ObjectId, planType: 'free' | 'pro' | 'enterprise'): Promise<void> {
    await this.quotaService.initializeUserQuota(userId, planType);
  }
}
