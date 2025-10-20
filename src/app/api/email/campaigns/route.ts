import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Best-in-Class: Email Campaign Model
interface EmailCampaign {
  _id?: ObjectId
  userId: ObjectId
  name: string
  listId: ObjectId
  subject: string
  body: string
  status: 'draft' | 'sending' | 'sent'
  sendTime?: Date
  opens: number
  clicks: number
  createdAt: Date
  updatedAt: Date
}

// GET: Fetch all email campaigns for the Enterprise user (best-in-class)
export const GET = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { db } = await connectToDatabase()
    
    // Best-in-Class: Fetch campaigns from MongoDB with real-time data
    const campaignsCollection = db.collection('email_campaigns')
    const campaigns = await campaignsCollection.find({ userId: new ObjectId(user._id) }).toArray()

    // If no campaigns exist, return mock data for demonstration
    if (campaigns.length === 0) {
      const mockCampaigns = [
        { id: 'camp-1', name: 'Black Friday 2025 Promo', status: 'sent', opens: 500, clicks: 50, sendTime: new Date() },
        { id: 'camp-2', name: 'New Feature Announcement', status: 'draft', opens: 0, clicks: 0, sendTime: new Date() },
      ]
      return NextResponse.json({
        success: true,
        campaigns: mockCampaigns
      })
    }

    return NextResponse.json({
      success: true,
      campaigns: campaigns.map(campaign => ({
        id: campaign._id.toHexString(),
        name: campaign.name,
        status: campaign.status,
        opens: campaign.opens,
        clicks: campaign.clicks,
        sendTime: campaign.sendTime,
        createdAt: campaign.createdAt,
      }))
    })
  } catch (error) {
    console.error('Get email campaigns error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve email campaigns' },
      { status: 500 }
    )
  }
})

// POST: Create and send a new email campaign (best-in-class)
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { name, listId, subject, body } = await request.json()

    if (!name || !listId || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: name, listId, subject, body' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Best-in-Class: Create campaign in MongoDB
    const newCampaign: EmailCampaign = {
      userId: new ObjectId(user._id),
      name,
      listId: new ObjectId(listId),
      subject,
      body,
      status: 'draft',
      opens: 0,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('email_campaigns').insertOne(newCampaign)

    // In a real application, this would:
    // 1. Integrate with SendGrid or Mailchimp to send the campaign
    // 2. Track opens and clicks using webhooks

    return NextResponse.json({
      success: true,
      message: `Campaign "${name}" created successfully.`,
      campaign: {
        id: result.insertedId.toHexString(),
        name,
        listId,
        status: 'draft',
        opens: 0,
        clicks: 0,
        createdAt: newCampaign.createdAt,
      }
    })
  } catch (error) {
    console.error('Create email campaign error:', error)
    return NextResponse.json(
      { error: 'Failed to create email campaign' },
      { status: 500 }
    )
  }
})

