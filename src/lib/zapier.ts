interface ZapierWebhookData {
  event: string;
  timestamp: string;
  data: Record<string, any>;
}

interface WebsiteCreatedData {
  userId: string;
  userName: string;
  userEmail: string;
  websiteName: string;
  websiteUrl: string;
  websiteType: string;
  userPlan: string;
}

interface UserSignupData {
  userId: string;
  userName: string;
  userEmail: string;
  signupDate: string;
  referralSource?: string;
}

interface SubscriptionData {
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  planPrice: number;
  subscriptionDate: string;
  paymentMethod: string;
}

interface AnalysisCompletedData {
  userId: string;
  userName: string;
  websiteUrl: string;
  analysisType: string;
  analysisResults: Record<string, any>;
  completedAt: string;
}

class ZapierService {
  private webhookUrl: string;
  private enabled: boolean;

  constructor() {
    this.webhookUrl = process.env.ZAPIER_WEBHOOK_URL || '';
    this.enabled = !!this.webhookUrl;
  }

  /**
   * Send data to Zapier webhook
   */
  private async sendWebhook(data: ZapierWebhookData): Promise<boolean> {
    if (!this.enabled) {
      console.log('Zapier webhook (mock):', data.event, data.data);
      return true; // Return success for mock mode
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Zapier webhook sent successfully:', data.event);
        return true;
      } else {
        console.error('Zapier webhook failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Zapier webhook error:', error);
      return false;
    }
  }

  /**
   * Trigger when a new user signs up
   */
  async triggerUserSignup(userData: UserSignupData): Promise<boolean> {
    const webhookData: ZapierWebhookData = {
      event: 'user_signup',
      timestamp: new Date().toISOString(),
      data: {
        user_id: userData.userId,
        user_name: userData.userName,
        user_email: userData.userEmail,
        signup_date: userData.signupDate,
        referral_source: userData.referralSource || 'direct',
        platform: 'AFFILIFY',
      },
    };

    return this.sendWebhook(webhookData);
  }

  /**
   * Trigger when a user creates a website
   */
  async triggerWebsiteCreated(websiteData: WebsiteCreatedData): Promise<boolean> {
    const webhookData: ZapierWebhookData = {
      event: 'website_created',
      timestamp: new Date().toISOString(),
      data: {
        user_id: websiteData.userId,
        user_name: websiteData.userName,
        user_email: websiteData.userEmail,
        website_name: websiteData.websiteName,
        website_url: websiteData.websiteUrl,
        website_type: websiteData.websiteType,
        user_plan: websiteData.userPlan,
        platform: 'AFFILIFY',
      },
    };

    return this.sendWebhook(webhookData);
  }

  /**
   * Trigger when a user subscribes to a plan
   */
  async triggerSubscription(subscriptionData: SubscriptionData): Promise<boolean> {
    const webhookData: ZapierWebhookData = {
      event: 'subscription_created',
      timestamp: new Date().toISOString(),
      data: {
        user_id: subscriptionData.userId,
        user_name: subscriptionData.userName,
        user_email: subscriptionData.userEmail,
        plan_name: subscriptionData.planName,
        plan_price: subscriptionData.planPrice,
        subscription_date: subscriptionData.subscriptionDate,
        payment_method: subscriptionData.paymentMethod,
        platform: 'AFFILIFY',
      },
    };

    return this.sendWebhook(webhookData);
  }

  /**
   * Trigger when website analysis is completed
   */
  async triggerAnalysisCompleted(analysisData: AnalysisCompletedData): Promise<boolean> {
    const webhookData: ZapierWebhookData = {
      event: 'analysis_completed',
      timestamp: new Date().toISOString(),
      data: {
        user_id: analysisData.userId,
        user_name: analysisData.userName,
        website_url: analysisData.websiteUrl,
        analysis_type: analysisData.analysisType,
        analysis_results: analysisData.analysisResults,
        completed_at: analysisData.completedAt,
        platform: 'AFFILIFY',
      },
    };

    return this.sendWebhook(webhookData);
  }

  /**
   * Trigger custom event
   */
  async triggerCustomEvent(eventName: string, eventData: Record<string, any>): Promise<boolean> {
    const webhookData: ZapierWebhookData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      data: {
        ...eventData,
        platform: 'AFFILIFY',
      },
    };

    return this.sendWebhook(webhookData);
  }

  /**
   * Test webhook connection
   */
  async testWebhook(): Promise<boolean> {
    const testData: ZapierWebhookData = {
      event: 'webhook_test',
      timestamp: new Date().toISOString(),
      data: {
        message: 'This is a test webhook from AFFILIFY platform',
        test_id: Math.random().toString(36).substring(7),
        platform: 'AFFILIFY',
      },
    };

    return this.sendWebhook(testData);
  }

  /**
   * Get webhook configuration
   */
  getConfig(): { webhookUrl: string; enabled: boolean } {
    return {
      webhookUrl: this.enabled ? this.webhookUrl : 'Not configured',
      enabled: this.enabled,
    };
  }

  /**
   * Update webhook URL (for runtime configuration)
   */
  updateWebhookUrl(newUrl: string): void {
    this.webhookUrl = newUrl;
    this.enabled = !!newUrl;
  }

  /**
   * Batch send multiple events
   */
  async sendBatchEvents(events: Array<{
    event: string;
    data: Record<string, any>;
  }>): Promise<boolean[]> {
    const promises = events.map(event => {
      const webhookData: ZapierWebhookData = {
        event: event.event,
        timestamp: new Date().toISOString(),
        data: {
          ...event.data,
          platform: 'AFFILIFY',
        },
      };
      return this.sendWebhook(webhookData);
    });

    return Promise.all(promises);
  }
}

export const zapierService = new ZapierService();
export default ZapierService;

