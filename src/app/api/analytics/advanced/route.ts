import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)

    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = authResult.user as any

    // Only allow enterprise users
    if (user.plan !== 'enterprise') {
      return NextResponse.json(
        { error: 'Enterprise plan required' },
        { status: 403 }
      )
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(user.id)

    // Get all user websites
    const websites = await db.collection('websites')
      .find({ userId })
      .toArray()

    // Calculate real metrics from actual data
    const totalRevenue = websites.reduce((sum, site) => sum + (site.revenue || 0), 0)
    const totalVisitors = websites.reduce((sum, site) => sum + (site.views || 0), 0)
    const totalClicks = websites.reduce((sum, site) => sum + (site.clicks || 0), 0)
    const totalConversions = websites.reduce((sum, site) => sum + (site.conversions || 0), 0)
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
    
    // Calculate page views (assuming views are page views for now)
    const totalPageViews = totalVisitors

    // For time-series data, we need to aggregate by date
    // Since we don't have historical data yet, we'll return empty arrays
    // In a real implementation, you'd store analytics events with timestamps

    const metrics = [
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString()}`,
        change: 0, // Would need historical data to calculate
        icon: 'DollarSign',
        color: 'from-green-500 to-emerald-600'
      },
      {
        title: 'Total Visitors',
        value: totalVisitors.toLocaleString(),
        change: 0,
        icon: 'Users',
        color: 'from-blue-500 to-indigo-600'
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate.toFixed(2)}%`,
        change: 0,
        icon: 'Target',
        color: 'from-purple-500 to-pink-600'
      },
      {
        title: 'Page Views',
        value: totalPageViews.toLocaleString(),
        change: 0,
        icon: 'Eye',
        color: 'from-orange-500 to-red-600'
      },
      {
        title: 'Avg. Session',
        value: '0m 0s', // Would need session tracking
        change: 0,
        icon: 'Clock',
        color: 'from-yellow-500 to-orange-600'
      },
      {
        title: 'Bounce Rate',
        value: '0%', // Would need bounce tracking
        change: 0,
        icon: 'Activity',
        color: 'from-red-500 to-pink-600'
      }
    ]

    // Top performing pages from actual websites
    const topPages = websites
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 4)
      .map(site => ({
        page: site.url || site.title,
        views: site.views || 0,
        bounceRate: 0 // Would need bounce tracking
      }))

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        revenue: [], // Would need time-series data
        traffic: [], // Would need time-series data
        conversions: [], // Would need source tracking
        demographics: [], // Would need demographic tracking
        devices: [], // Would need device tracking
        topPages,
        hasData: websites.length > 0
      }
    })
  } catch (error) {
    console.error('Error fetching advanced analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
