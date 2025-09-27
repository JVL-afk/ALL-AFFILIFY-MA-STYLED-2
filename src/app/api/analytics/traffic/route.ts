import { NextRequest, NextResponse } from 'next/server';
import { googleAnalytics } from '@/lib/google-analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '30daysAgo';
    const endDate = searchParams.get('endDate') || 'today';

    const data = await googleAnalytics.getTrafficData(startDate, endDate);
    
    const trafficData = data.rows.map(row => {
      const date = row.dimensionValues[0]?.value || '';
      const formattedDate = date.length === 8 
        ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
        : date;
      
      return {
        date: formattedDate,
        sessions: parseInt(row.metricValues[0]?.value || '0'),
        users: parseInt(row.metricValues[1]?.value || '0'),
        pageViews: parseInt(row.metricValues[2]?.value || '0'),
        bounceRate: parseFloat(row.metricValues[3]?.value || '0'),
        avgSessionDuration: parseFloat(row.metricValues[4]?.value || '0'),
      };
    });

    // Calculate totals
    const totals = {
      sessions: trafficData.reduce((sum, day) => sum + day.sessions, 0),
      users: trafficData.reduce((sum, day) => sum + day.users, 0),
      pageViews: trafficData.reduce((sum, day) => sum + day.pageViews, 0),
      avgBounceRate: trafficData.length > 0 
        ? trafficData.reduce((sum, day) => sum + day.bounceRate, 0) / trafficData.length 
        : 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        traffic: trafficData,
        totals,
        period: { startDate, endDate },
      },
    });
  } catch (error) {
    console.error('Error fetching traffic analytics:', error);
    
    // Return mock data on error
    const mockTrafficData = [
      { date: '2024-09-01', sessions: 1250, users: 980, pageViews: 3200, bounceRate: 0.45, avgSessionDuration: 180 },
      { date: '2024-09-02', sessions: 1380, users: 1120, pageViews: 3450, bounceRate: 0.42, avgSessionDuration: 195 },
      { date: '2024-09-03', sessions: 1420, users: 1180, pageViews: 3680, bounceRate: 0.38, avgSessionDuration: 210 },
      { date: '2024-09-04', sessions: 1580, users: 1320, pageViews: 4100, bounceRate: 0.35, avgSessionDuration: 225 },
    ];

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch traffic analytics data',
      data: {
        traffic: mockTrafficData,
        totals: {
          sessions: 5630,
          users: 4600,
          pageViews: 14430,
          avgBounceRate: 0.40,
        },
        period: { startDate: '30daysAgo', endDate: 'today' },
      },
    });
  }
}

