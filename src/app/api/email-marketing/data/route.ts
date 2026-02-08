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

    // Check if user has Pro or Enterprise plan
    if (user.plan !== 'pro' && user.plan !== 'enterprise') {
      return NextResponse.json(
        { error: 'Pro or Enterprise plan required' },
        { status: 403 }
      )
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(user.id)

    // Fetch real email campaigns from database
    let campaigns: any[] = []
    let stats = {
      totalSubscribers: 0,
      openRate: 0,
      clickRate: 0,
      revenue: 0
    }

    try {
      const campaignsData = await db.collection('email_campaigns')
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray()
      
      campaigns = campaignsData.map(campaign => ({
        id: campaign._id.toString(),
        name: campaign.name || '',
        subject: campaign.subject || '',
        status: campaign.status || 'draft',
        recipients: campaign.recipients || 0,
        openRate: campaign.openRate || 0,
        clickRate: campaign.clickRate || 0,
        sentDate: campaign.sentDate || null,
        scheduledDate: campaign.scheduledDate || null,
        type: campaign.type || 'newsletter',
        revenue: campaign.revenue || 0,
        conversions: campaign.conversions || 0
      }))

      // Calculate aggregate stats
      if (campaigns.length > 0) {
        const totalOpens = campaigns.reduce((sum, c) => sum + (c.openRate || 0), 0)
        const totalClicks = campaigns.reduce((sum, c) => sum + (c.clickRate || 0), 0)
        stats.openRate = Number((totalOpens / campaigns.length).toFixed(1))
        stats.clickRate = Number((totalClicks / campaigns.length).toFixed(1))
        stats.revenue = campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0)
      }
    } catch (error) {
      console.log('Email campaigns collection not found')
    }

    // Fetch subscribers count
    try {
      const subscribersCount = await db.collection('email_subscribers')
        .countDocuments({ userId, status: 'active' })
      stats.totalSubscribers = subscribersCount
    } catch (error) {
      console.log('Email subscribers collection not found')
    }

    // Fetch templates (these can be static or from database)
    const templates: any[] = []

    // Fetch subscribers
    let subscribers: any[] = []
    try {
      const subscribersData = await db.collection('email_subscribers')
        .find({ userId })
        .sort({ joinedDate: -1 })
        .limit(100)
        .toArray()
      
      subscribers = subscribersData.map(sub => ({
        id: sub._id.toString(),
        email: sub.email || '',
        name: sub.name || '',
        status: sub.status || 'active',
        joinedDate: sub.joinedDate || new Date(),
        tags: sub.tags || []
      }))
    } catch (error) {
      console.log('Email subscribers collection not found')
    }

    return NextResponse.json({
      success: true,
      data: {
        campaigns,
        templates,
        subscribers,
        stats
      }
    })
  } catch (error) {
    console.error('Error fetching email marketing data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
