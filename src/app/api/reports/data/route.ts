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

    // Get user websites for calculating metrics
    const websites = await db.collection('websites')
      .find({ userId })
      .toArray()

    const totalRevenue = websites.reduce((sum, site) => sum + (site.revenue || 0), 0)
    const totalVisitors = websites.reduce((sum, site) => sum + (site.views || 0), 0)
    const totalPageViews = totalVisitors // Assuming views are page views
    const totalClicks = websites.reduce((sum, site) => sum + (site.clicks || 0), 0)
    const totalConversions = websites.reduce((sum, site) => sum + (site.conversions || 0), 0)
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

    // Get saved reports
    let reports: any[] = []
    try {
      const reportsList = await db.collection('reports')
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray()
      
      reports = reportsList.map(report => ({
        id: report._id.toString(),
        name: report.name || '',
        description: report.description || '',
        type: report.type || 'custom',
        status: report.status || 'draft',
        format: report.format || 'PDF',
        schedule: report.schedule || 'manual',
        recipients: report.recipients || [],
        lastGenerated: report.lastGenerated || null,
        nextScheduled: report.nextScheduled || null,
        createdAt: report.createdAt || new Date()
      }))
    } catch (error) {
      console.log('Reports collection not found')
    }

    return NextResponse.json({
      success: true,
      data: {
        reports,
        metrics: {
          totalRevenue,
          websiteVisitors: totalVisitors,
          pageViews: totalPageViews,
          conversionRate: Number(conversionRate.toFixed(2))
        },
        stats: {
          systemStatus: 'Operational',
          uptime: 100, // Would need uptime tracking
          queueTime: 0 // Would need queue monitoring
        }
      }
    })
  } catch (error) {
    console.error('Error fetching reports data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
