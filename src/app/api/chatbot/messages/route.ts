import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

interface UserData {
  _id: ObjectId
  email: string
  plan: string
  name: string
}

// Verify user authentication
async function verifyUser(request: NextRequest): Promise<UserData | null> {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return null

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'affilify_jwt_2025_romania_student_success_portocaliu_orange_power_gaming_affiliate_marketing_revolution_secure_token_generation_system') as any
    
    const { db } = await connectToDatabase()
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) })
    
    return user as UserData
  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

// GET - Retrieve messages for a specific chat session
export async function GET(request: NextRequest) {
  try {
    const user = await verifyUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Verify session belongs to user
    const session = await db.collection('chat_sessions').findOne({
      _id: new ObjectId(sessionId),
      userId: user._id.toString()
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Chat session not found' },
        { status: 404 }
      )
    }

    // Get messages for the session
    const messages = await db.collection('chat_messages')
      .find({ 
        sessionId,
        userId: user._id.toString()
      })
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit)
      .toArray()

    const formattedMessages = messages.map(msg => ({
      id: msg._id.toString(),
      type: msg.type,
      content: msg.content,
      timestamp: msg.timestamp || msg.createdAt,
      rating: msg.rating || null
    }))

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
      sessionInfo: {
        id: session._id.toString(),
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }
    })

  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve messages' },
      { status: 500 }
    )
  }
}

// POST - Rate a message (thumbs up/down)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { messageId, rating } = await request.json()

    if (!messageId || !rating || !['up', 'down'].includes(rating)) {
      return NextResponse.json(
        { error: 'Valid messageId and rating (up/down) are required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Update message rating
    const result = await db.collection('chat_messages').updateOne(
      { 
        _id: new ObjectId(messageId),
        userId: user._id.toString()
      },
      { 
        $set: { 
          rating,
          ratedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Message rating updated successfully'
    })

  } catch (error) {
    console.error('Rate message error:', error)
    return NextResponse.json(
      { error: 'Failed to rate message' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

