import { BetaAnalyticsDataClient } from '@google-analytics/data';

interface AnalyticsMetric {
  name: string;
  value: string;
}

interface AnalyticsDimension {
  name: string;
  value: string;
}

interface AnalyticsRow {
  dimensionValues: AnalyticsDimension[];
  metricValues: AnalyticsMetric[];
}

interface AnalyticsResponse {
  rows: AnalyticsRow[];
  totals: AnalyticsMetric[][];
}

class GoogleAnalyticsService {
  private client: BetaAnalyticsDataClient;
  private propertyId: string;

  constructor() {
    // Use mock data if credentials are not configured
    if (!process.env.GOOGLE_ANALYTICS_PROPERTY_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn('Google Analytics credentials not configured, using mock data');
      this.propertyId = 'properties/mock';
      return;
    }

    this.propertyId = `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`;
    
    // Initialize the Google Analytics Data API client
    this.client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });
  }

  async getRealtimeData() {
    if (!this.client) {
      return this.getMockRealtimeData();
    }
    
    try {
      const [response] = await this.client.runRealtimeReport({
        property: this.propertyId,
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
        ],
        dimensions: [
          { name: 'country' },
          { name: 'deviceCategory' },
        ],
      });

      return {
        activeUsers: response.totals?.[0]?.metricValues?.[0]?.value || '0',
        pageViews: response.totals?.[0]?.metricValues?.[1]?.value || '0',
        rows: response.rows || [],
      };
    } catch (error) {
      console.error('Error fetching realtime data:', error);
      return this.getMockRealtimeData();
    }
  }

  async getTrafficData(startDate: string, endDate: string) {
    if (!this.client) {
      return this.getMockTrafficData();
    }
    
    try {
      const [response] = await this.client.runReport({
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'sessions' },
          { name: 'users' },
          { name: 'pageviews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
        ],
        dimensions: [
          { name: 'date' },
        ],
        orderBys: [
          {
            dimension: { dimensionName: 'date' },
            desc: false,
          },
        ],
      });

      return {
        rows: response.rows || [],
        totals: response.totals || [],
      };
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      return this.getMockTrafficData();
    }
  }

  async getConversionData(startDate: string, endDate: string) {
    if (!this.client) {
      return this.getMockConversionData();
    }
    
    try {
      const [response] = await this.client.runReport({
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'conversions' },
          { name: 'conversionRate' },
          { name: 'totalRevenue' },
        ],
        dimensions: [
          { name: 'sessionSource' },
          { name: 'sessionMedium' },
        ],
      });

      return {
        rows: response.rows || [],
        totals: response.totals || [],
      };
    } catch (error) {
      console.error('Error fetching conversion data:', error);
      return this.getMockConversionData();
    }
  }

  async getDemographicsData(startDate: string, endDate: string) {
    if (!this.client) {
      return this.getMockDemographicsData();
    }
    
    try {
      const [response] = await this.client.runReport({
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'users' },
        ],
        dimensions: [
          { name: 'userAgeBracket' },
          { name: 'userGender' },
          { name: 'country' },
        ],
      });

      return {
        rows: response.rows || [],
        totals: response.totals || [],
      };
    } catch (error) {
      console.error('Error fetching demographics data:', error);
      return this.getMockDemographicsData();
    }
  }

  async getTopPagesData(startDate: string, endDate: string) {
    if (!this.client) {
      return this.getMockTopPagesData();
    }
    
    try {
      const [response] = await this.client.runReport({
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
        ],
        dimensions: [
          { name: 'pagePath' },
          { name: 'pageTitle' },
        ],
        orderBys: [
          {
            metric: { metricName: 'screenPageViews' },
            desc: true,
          },
        ],
        limit: 10,
      });

      return {
        rows: response.rows || [],
        totals: response.totals || [],
      };
    } catch (error) {
      console.error('Error fetching top pages data:', error);
      return this.getMockTopPagesData();
    }
  }

  // Mock data fallbacks for when API is not configured or fails
  private getMockRealtimeData() {
    return {
      activeUsers: '127',
      pageViews: '342',
      rows: [
        {
          dimensionValues: [{ name: 'country', value: 'United States' }],
          metricValues: [{ name: 'activeUsers', value: '45' }],
        },
        {
          dimensionValues: [{ name: 'country', value: 'Romania' }],
          metricValues: [{ name: 'activeUsers', value: '32' }],
        },
      ],
    };
  }

  private getMockTrafficData() {
    return {
      rows: [
        {
          dimensionValues: [{ name: 'date', value: '20240901' }],
          metricValues: [
            { name: 'sessions', value: '1250' },
            { name: 'users', value: '980' },
            { name: 'pageviews', value: '3200' },
          ],
        },
        {
          dimensionValues: [{ name: 'date', value: '20240902' }],
          metricValues: [
            { name: 'sessions', value: '1380' },
            { name: 'users', value: '1120' },
            { name: 'pageviews', value: '3450' },
          ],
        },
      ],
      totals: [],
    };
  }

  private getMockConversionData() {
    return {
      rows: [
        {
          dimensionValues: [
            { name: 'sessionSource', value: 'google' },
            { name: 'sessionMedium', value: 'organic' },
          ],
          metricValues: [
            { name: 'conversions', value: '45' },
            { name: 'conversionRate', value: '0.035' },
          ],
        },
      ],
      totals: [],
    };
  }

  private getMockDemographicsData() {
    return {
      rows: [
        {
          dimensionValues: [{ name: 'userAgeBracket', value: '25-34' }],
          metricValues: [{ name: 'users', value: '450' }],
        },
        {
          dimensionValues: [{ name: 'userAgeBracket', value: '35-44' }],
          metricValues: [{ name: 'users', value: '320' }],
        },
      ],
      totals: [],
    };
  }

  private getMockTopPagesData() {
    return {
      rows: [
        {
          dimensionValues: [
            { name: 'pagePath', value: '/' },
            { name: 'pageTitle', value: 'Home Page' },
          ],
          metricValues: [
            { name: 'screenPageViews', value: '1250' },
            { name: 'bounceRate', value: '0.45' },
          ],
        },
      ],
      totals: [],
    };
  }
}

export const googleAnalytics = new GoogleAnalyticsService();
export default GoogleAnalyticsService;

