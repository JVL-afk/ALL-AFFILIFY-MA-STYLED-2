import { NextRequest, NextResponse } from 'next/server';
import { googleAnalytics } from '@/lib/google-analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '30daysAgo';
    const endDate = searchParams.get('endDate') || 'today';

    const data = await googleAnalytics.getTopPagesData(startDate, endDate);
    
    const topPagesData = data.rows.map(row => {
      const pagePath = row.dimensionValues[0]?.value || '/';
      const pageTitle = row.dimensionValues[1]?.value || 'Unknown Page';
      
      return {
        page: pagePath,
        title: pageTitle,
        views: parseInt(row.metricValues[0]?.value || '0'),
        bounceRate: parseFloat(row.metricValues[1]?.value || '0') * 100, // Convert to percentage
        avgSessionDuration: parseFloat(row.metricValues[2]?.value || '0'),
      };
    }).slice(0, 10); // Top 10 pages

    const totalViews = topPagesData.reduce((sum, page) => sum + page.views, 0);

    return NextResponse.json({
      success: true,
      data: {
        topPages: topPagesData,
        totalViews,
        period: { startDate, endDate },
      },
    });
  } catch (error) {
    console.error('Error fetching top pages analytics:', error);
    
    // Return mock data on error
    const mockTopPagesData = [
      { page: '/', title: 'Home Page', views: 1250, bounceRate: 45.2, avgSessionDuration: 180 },
      { page: '/pricing', title: 'Pricing Plans', views: 890, bounceRate: 38.5, avgSessionDuration: 220 },
      { page: '/dashboard', title: 'Dashboard', views: 650, bounceRate: 25.8, avgSessionDuration: 320 },
      { page: '/create-website', title: 'Create Website', views: 520, bounceRate: 42.1, avgSessionDuration: 280 },
      { page: '/analyze-website', title: 'Analyze Website', views: 480, bounceRate: 35.9, avgSessionDuration: 240 },
      { page: '/docs', title: 'Documentation', views: 380, bounceRate: 55.2, avgSessionDuration: 150 },
      { page: '/login', title: 'Login', views: 320, bounceRate: 68.5, avgSessionDuration: 90 },
      { page: '/signup', title: 'Sign Up', views: 280, bounceRate: 52.3, avgSessionDuration: 120 },
      { page: '/checkout', title: 'Checkout', views: 180, bounceRate: 28.9, avgSessionDuration: 200 },
      { page: '/terms', title: 'Terms of Service', views: 120, bounceRate: 78.2, avgSessionDuration: 60 },
    ];

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch top pages analytics data',
      data: {
        topPages: mockTopPagesData,
        totalViews: 5070,
        period: { startDate: '30daysAgo', endDate: 'today' },
      },
    });
  }
}

