import { NextRequest, NextResponse } from 'next/server';
import { googleAnalytics } from '@/lib/google-analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '30daysAgo';
    const endDate = searchParams.get('endDate') || 'today';

    const data = await googleAnalytics.getConversionData(startDate, endDate);
    
    const conversionsData = data.rows.map(row => {
      const source = row.dimensionValues[0]?.value || 'Unknown';
      const medium = row.dimensionValues[1]?.value || 'Unknown';
      
      return {
        source: `${source} / ${medium}`,
        conversions: parseInt(row.metricValues[0]?.value || '0'),
        conversionRate: parseFloat(row.metricValues[1]?.value || '0') * 100, // Convert to percentage
        revenue: parseFloat(row.metricValues[2]?.value || '0'),
      };
    });

    // Calculate totals
    const totals = {
      conversions: conversionsData.reduce((sum, item) => sum + item.conversions, 0),
      revenue: conversionsData.reduce((sum, item) => sum + item.revenue, 0),
      avgConversionRate: conversionsData.length > 0 
        ? conversionsData.reduce((sum, item) => sum + item.conversionRate, 0) / conversionsData.length 
        : 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        conversions: conversionsData,
        totals,
        period: { startDate, endDate },
      },
    });
  } catch (error) {
    console.error('Error fetching conversion analytics:', error);
    
    // Return mock data on error
    const mockConversionsData = [
      { source: 'google / organic', conversions: 45, conversionRate: 3.5, revenue: 2250 },
      { source: 'facebook / social', conversions: 32, conversionRate: 2.8, revenue: 1600 },
      { source: 'direct / none', conversions: 28, conversionRate: 4.2, revenue: 1400 },
      { source: 'twitter / social', conversions: 15, conversionRate: 2.1, revenue: 750 },
      { source: 'linkedin / social', conversions: 12, conversionRate: 3.8, revenue: 600 },
    ];

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch conversion analytics data',
      data: {
        conversions: mockConversionsData,
        totals: {
          conversions: 132,
          revenue: 6600,
          avgConversionRate: 3.28,
        },
        period: { startDate: '30daysAgo', endDate: 'today' },
      },
    });
  }
}

