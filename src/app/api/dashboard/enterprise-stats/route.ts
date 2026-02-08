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

    // Get real website statistics
    const websites = await db.collection('websites')
      .find({ userId })
      .toArray()

    const websiteCount = websites.length

    // Calculate aggregate statistics from real data
    const totalViews = websites.reduce((sum, site) => sum + (site.views || 0), 0)
    const totalClicks = websites.reduce((sum, site) => sum + (site.clicks || 0), 0)
    const totalConversions = websites.reduce((sum, site) => sum + (site.conversions || 0), 0)
    const totalRevenue = websites.reduce((sum, site) => sum + (site.revenue || 0), 0)

    // Calculate conversion rate
    const conversionRate = totalClicks > 0 
      ? Number(((totalConversions / totalClicks) * 100).toFixed(2))
      : 0

    // Get team members count (from team_members collection if it exists)
    let teamMembersCount = 1 // At least the owner
    try {
      const teamMembers = await db.collection('team_members')
        .find({ 
          userId,
          status: { $in: ['active', 'pending'] }
        })
        .toArray()
      teamMembersCount = teamMembers.length + 1 // +1 for owner
    } catch (error) {
      // Collection might not exist yet
      console.log('Team members collection not found, using default count')
    }

    // Get active A/B tests count (from ab_tests collection if it exists)
    let activeTestsCount = 0
    try {
      activeTestsCount = await db.collection('ab_tests')
        .countDocuments({ 
          userId,
          status: 'running'
        })
    } catch (error) {
      // Collection might not exist yet
      console.log('A/B tests collection not found, using default count')
    }

    // Get team activity (recent activities from activity_log if it exists)
    let recentActivities: any[] = []
    try {
      recentActivities = await db.collection('activity_log')
        .find({ userId })
        .sort({ timestamp: -1 })
        .limit(5)
        .toArray()
    } catch (error) {
      // Collection might not exist yet
      console.log('Activity log collection not found, using empty array')
    }

    return NextResponse.json({
      success: true,
      stats: {
        websites: websiteCount,
        totalViews,
        totalClicks,
        conversionRate,
        revenue: totalRevenue,
        teamMembers: teamMembersCount,
        activeTests: activeTestsCount,
        recentActivities: recentActivities.map(activity => ({
          id: activity._id.toString(),
          user: activity.user || 'Unknown',
          action: activity.action || '',
          target: activity.target || '',
          timestamp: activity.timestamp || new Date()
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching enterprise stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
