import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  return requireAuth(request, async (_req, user) => {
    // Restrict to pro and enterprise plans only
    if (user.plan !== 'pro' && user.plan !== 'enterprise') {
      return NextResponse.json(
        { success: false, error: 'Pro or Enterprise plan required to access Advanced Analytics.' },
        { status: 403 }
      )
    }

    try {
      const { searchParams } = new URL(request.url)
      const timeRange = searchParams.get('timeRange') || '30d'

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
      const totalPageViews = totalVisitors

      const metrics = [
        {
          title: 'Total Revenue',
          value: `$${totalRevenue.toLocaleString()}`,
          change: 0,
          icon: 'DollarSign',
          color: 'from-green-500 to-emerald-600',
        },
        {
          title: 'Total Visitors',
          value: totalVisitors.toLocaleString(),
          change: 0,
          icon: 'Users',
          color: 'from-blue-500 to-indigo-600',
        },
        {
          title: 'Conversion Rate',
          value: `${conversionRate.toFixed(2)}%`,
          change: 0,
          icon: 'Target',
          color: 'from-purple-500 to-pink-600',
        },
        {
          title: 'Page Views',
          value: totalPageViews.toLocaleString(),
          change: 0,
          icon: 'Eye',
          color: 'from-orange-500 to-red-600',
        },
        {
          title: 'Avg. Session',
          value: '0m 0s',
          change: 0,
          icon: 'Clock',
          color: 'from-yellow-500 to-orange-600',
        },
        {
          title: 'Bounce Rate',
          value: '0%',
          change: 0,
          icon: 'Activity',
          color: 'from-red-500 to-pink-600',
        },
      ]

      const topPages = websites
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 4)
        .map(site => ({
          page: site.url || site.title || 'Unknown',
          views: site.views || 0,
          bounceRate: 0,
        }))

      return NextResponse.json({
        success: true,
        data: {
          metrics,
          revenue: [],
          traffic: [],
          conversions: [],
          demographics: [],
          devices: [],
          topPages,
          hasData: websites.length > 0,
          timeRange,
        },
      })
    } catch (error) {
      console.error('Error fetching advanced analytics:', error)
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
  })
}
