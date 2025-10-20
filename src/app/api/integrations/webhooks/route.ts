import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import crypto from 'crypto'

// Best-in-Class: Webhook Model
interface Webhook {
  _id?: ObjectId
  userId: ObjectId
  name: string
  url: string
  events: string[]
  secret: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// GET: Fetch all Webhooks for the Enterprise user (best-in-class)
export const GET = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { db } = await connectToDatabase()
    
    // Best-in-Class: Fetch webhooks from MongoDB with real-time data
    const webhooks = await db.collection('webhooks')
      .find({ userId: new ObjectId(user._id) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      webhooks: webhooks.map(hook => ({
        id: hook._id.toHexString(),
        name: hook.name,
        url: hook.url,
        events: hook.events,
        isActive: hook.isActive,
        createdAt: hook.createdAt
      }))
    })
  } catch (error) {
    console.error('Get webhooks error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve webhooks' },
      { status: 500 }
    )
  }
})

// POST: Create a new Webhook for the Enterprise user (best-in-class)
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { name, url, events } = await request.json()

    if (!name || !url || !events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, url, events' },
        { status: 400 }
      )
    }

    // Best-in-Class: Validate URL format
    try {
      new URL(url)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Best-in-Class: Generate a secure secret for signing the webhook payload
    const secret = crypto.randomBytes(16).toString('hex')

    const newWebhook: Webhook = {
      userId: new ObjectId(user._id),
      name,
      url,
      events,
      secret,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('webhooks').insertOne(newWebhook)
    
    if (!result.insertedId) {
      return NextResponse.json(
        { error: 'Failed to create webhook' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook created successfully',
      webhook: {
        id: result.insertedId.toHexString(),
        name: newWebhook.name,
        url: newWebhook.url,
        events: newWebhook.events,
        isActive: newWebhook.isActive,
        createdAt: newWebhook.createdAt,
      }
    })
  } catch (error) {
    console.error('Create webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to create webhook' },
      { status: 500 }
    )
  }
})

