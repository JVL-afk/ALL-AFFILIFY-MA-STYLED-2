import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { AuthenticatedUser } from '@/lib/types';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// API endpoint to get website statistics for the My Websites dashboard
export const GET = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const client = await clientPromise;
    const db = client.db('affilify');
    const websitesCollection = db.collection('websites');

    // Get all websites for the user
    const websites = await websitesCollection.find({ userId: new ObjectId(user._id) }).toArray();

    // Calculate aggregate statistics
    const totalWebsites = websites.length;
    const activeWebsites = websites.filter(w => w.status === 'active').length;
    
    // Sum up all visitors, revenue, and calculate average conversion rate
    let totalVisitors = 0;
    let totalRevenue = 0;
    let totalConversions = 0;
    let totalPageViews = 0;

    websites.forEach(website => {
      totalVisitors += website.views || 0;
      totalRevenue += website.revenue || 0;
      totalConversions += website.conversions || 0;
      totalPageViews += website.pageViews || website.views || 0;
    });

    // Calculate average conversion rate
    const avgConversionRate = totalPageViews > 0 
      ? ((totalConversions / totalPageViews) * 100) 
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalWebsites,
        activeWebsites,
        totalVisitors,
        totalRevenue,
        avgConversionRate: parseFloat(avgConversionRate.toFixed(2))
      }
    });
  } catch (error) {
    console.error('GET /api/websites/stats error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve website statistics' },
      { status: 500 }
    );
  }
});
