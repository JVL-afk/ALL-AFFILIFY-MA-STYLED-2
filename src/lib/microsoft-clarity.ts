interface ClarityConfig {
  projectId: string;
  enabled: boolean;
}

class MicrosoftClarityService {
  private config: ClarityConfig;

  constructor() {
    this.config = {
      projectId: process.env.MICROSOFT_CLARITY_PROJECT_ID || 't5dh7m4sfu',
      enabled: !!process.env.MICROSOFT_CLARITY_PROJECT_ID,
    };
  }

  /**
   * Initialize Microsoft Clarity tracking
   * This should be called in the app layout or main component
   */
  initialize(): void {
    if (!this.config.enabled) {
      console.warn('Microsoft Clarity not configured. Tracking disabled.');
      return;
    }

    if (typeof window === 'undefined') {
      return; // Server-side rendering
    }

    // Check if Clarity is already loaded
    if ((window as any).clarity) {
      return;
    }

    try {
      // Microsoft Clarity tracking code
      (function(c: any, l: any, a: any, r: any, i: any, t: any, y: any) {
        c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", this.config.projectId);

      console.log('Microsoft Clarity initialized with project ID:', this.config.projectId);
    } catch (error) {
      console.error('Failed to initialize Microsoft Clarity:', error);
    }
  }

  /**
   * Track a custom event
   */
  trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (!this.config.enabled || typeof window === 'undefined') {
      console.log('Clarity event (mock):', eventName, properties);
      return;
    }

    try {
      if ((window as any).clarity) {
        (window as any).clarity('event', eventName, properties);
      }
    } catch (error) {
      console.error('Failed to track Clarity event:', error);
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>): void {
    if (!this.config.enabled || typeof window === 'undefined') {
      console.log('Clarity user properties (mock):', properties);
      return;
    }

    try {
      if ((window as any).clarity) {
        (window as any).clarity('set', properties);
      }
    } catch (error) {
      console.error('Failed to set Clarity user properties:', error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string, properties?: Record<string, any>): void {
    if (!this.config.enabled || typeof window === 'undefined') {
      console.log('Clarity page view (mock):', pageName, properties);
      return;
    }

    try {
      if ((window as any).clarity) {
        (window as any).clarity('event', 'page_view', {
          page_name: pageName,
          ...properties,
        });
      }
    } catch (error) {
      console.error('Failed to track Clarity page view:', error);
    }
  }

  /**
   * Track website creation
   */
  trackWebsiteCreated(websiteData: {
    websiteName: string;
    websiteType: string;
    userId: string;
    plan: string;
  }): void {
    this.trackEvent('website_created', {
      website_name: websiteData.websiteName,
      website_type: websiteData.websiteType,
      user_id: websiteData.userId,
      user_plan: websiteData.plan,
    });
  }

  /**
   * Track website analysis
   */
  trackWebsiteAnalyzed(analysisData: {
    websiteUrl: string;
    userId: string;
    analysisType: string;
  }): void {
    this.trackEvent('website_analyzed', {
      website_url: analysisData.websiteUrl,
      user_id: analysisData.userId,
      analysis_type: analysisData.analysisType,
    });
  }

  /**
   * Track user subscription
   */
  trackSubscription(subscriptionData: {
    userId: string;
    planName: string;
    planPrice: number;
    paymentMethod: string;
  }): void {
    this.trackEvent('subscription_created', {
      user_id: subscriptionData.userId,
      plan_name: subscriptionData.planName,
      plan_price: subscriptionData.planPrice,
      payment_method: subscriptionData.paymentMethod,
    });
  }

  /**
   * Track user login
   */
  trackLogin(userData: {
    userId: string;
    userPlan: string;
    loginMethod: string;
  }): void {
    this.trackEvent('user_login', {
      user_id: userData.userId,
      user_plan: userData.userPlan,
      login_method: userData.loginMethod,
    });

    // Set user properties for session
    this.setUserProperties({
      user_id: userData.userId,
      user_plan: userData.userPlan,
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(featureData: {
    featureName: string;
    userId: string;
    userPlan: string;
    context?: string;
  }): void {
    this.trackEvent('feature_used', {
      feature_name: featureData.featureName,
      user_id: featureData.userId,
      user_plan: featureData.userPlan,
      context: featureData.context,
    });
  }

  /**
   * Get the Clarity script tag for server-side rendering
   */
  getScriptTag(): string {
    if (!this.config.enabled) {
      return '';
    }

    return `
      <script type="text/javascript">
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${this.config.projectId}");
      </script>
    `;
  }

  /**
   * Check if Clarity is properly loaded
   */
  isLoaded(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return !!(window as any).clarity;
  }

  /**
   * Get configuration
   */
  getConfig(): ClarityConfig {
    return { ...this.config };
  }
}

export const microsoftClarity = new MicrosoftClarityService();
export default MicrosoftClarityService;

