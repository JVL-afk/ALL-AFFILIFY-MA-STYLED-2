import { NextRequest, NextResponse } from 'next/server';
import { googleAnalytics } from '@/lib/google-analytics';

export async function GET(request: NextRequest) {
  try {
    const data = await googleAnalytics.getRealtimeData();
    
    return NextResponse.json({
      success: true,
      data: {
        activeUsers: parseInt(data.activeUsers),
        pageViews: parseInt(data.pageViews),
       topCountries: data.rows
  ?.filter(row => row.dimensionValues?.[0]?.name === 'country')  // ✅ Added ?. before filter
  .slice(0, 5)
  .map(row => ({
    country: row.dimensionValues?.[0]?.value || 'Unknown',
    visits: parseInt(row.metricValues?.[0]?.value || '0')
  })) || []  // ✅ Added fallback
        deviceBreakdown: data.rows
          .filter(row => row.dimensionValues[0]?.name === 'deviceCategory')
          .map(row => ({
            device: row.dimensionValues[0]?.value || 'Unknown',
            users: parseInt(row.metricValues[0]?.value || '0'),
          })),
      },
    });
  } catch (error) {
    console.error('Error fetching realtime analytics:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch realtime analytics data',
      data: {
        activeUsers: 127,
        pageViews: 342,
        topCountries: [
          { country: 'United States', users: 45 },
          { country: 'Romania', users: 32 },
          { country: 'Germany', users: 28 },
          { country: 'United Kingdom', users: 22 },
        ],
        deviceBreakdown: [
          { device: 'desktop', users: 78 },
          { device: 'mobile', users: 49 },
        ],
      },
    });
  }
}

