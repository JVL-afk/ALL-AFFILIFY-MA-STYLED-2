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

// GET - Retrieve user's chat sessions
export async function GET(request: NextRequest) {
  try {
    const user = await verifyUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Get all chat sessions for the user
    const sessions = await db.collection('chat_sessions')
      .find({ userId: user._id.toString() })
      .sort({ updatedAt: -1 })
      .toArray()

    // Get message count for each session
    const sessionsWithCounts = await Promise.all(
      sessions.map(async (session) => {
        const messageCount = await db.collection('chat_messages')
          .countDocuments({ sessionId: session._id.toString() })
        
        const lastMessage = await db.collection('chat_messages')
          .findOne(
            { sessionId: session._id.toString() },
            { sort: { createdAt: -1 } }
          )

        return {
          id: session._id.toString(),
          title: session.title,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          messageCount,
          lastMessage: lastMessage?.content?.substring(0, 100) + (lastMessage?.content?.length > 100 ? '...' : '') || 'No messages yet'
        }
      })
    )

    return NextResponse.json({
      success: true,
      sessions: sessionsWithCounts
    })

  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve chat sessions' },
      { status: 500 }
    )
  }
}

// POST - Create a new chat session
export async function POST(request: NextRequest) {
  try {
    const user = await verifyUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { title } = await request.json()

    const { db } = await connectToDatabase()
    
    const newSession = {
      _id: new ObjectId(),
      userId: user._id.toString(),
      title: title || 'New Chat Session',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.collection('chat_sessions').insertOne(newSession)

    // Create welcome message
    const welcomeMessage = {
      _id: new ObjectId(),
      userId: user._id.toString(),
      sessionId: newSession._id.toString(),
      type: 'bot',
      content: `👋 Hello ${user.name || 'there'}! I'm your AFFILIFY AI Assistant, ready to help you succeed in affiliate marketing!

🚀 **I can help you with:**
• Affiliate program analysis and selection
• Website optimization strategies  
• Traffic generation techniques
• Conversion rate optimization
• Revenue maximization tactics
• Content creation ideas
• SEO and technical guidance

💡 **Quick tip:** Try asking me about analyzing a specific affiliate program or optimizing your website for better conversions!

What would you like to work on today?`,
      createdAt: new Date(),
      timestamp: new Date()
    }

    await db.collection('chat_messages').insertOne(welcomeMessage)

    return NextResponse.json({
      success: true,
      session: {
        id: newSession._id.toString(),
        title: newSession.title,
        createdAt: newSession.createdAt,
        updatedAt: newSession.updatedAt
      }
    })

  } catch (error) {
    console.error('Create session error:', error)
    return NextResponse.json(
      { error: 'Failed to create chat session' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a chat session
export async function DELETE(request: NextRequest) {
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

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Delete the session
    await db.collection('chat_sessions').deleteOne({
      _id: new ObjectId(sessionId),
      userId: user._id.toString()
    })

    // Delete all messages in the session
    await db.collection('chat_messages').deleteMany({
      sessionId,
      userId: user._id.toString()
    })

    return NextResponse.json({
      success: true,
      message: 'Chat session deleted successfully'
    })

  } catch (error) {
    console.error('Delete session error:', error)
    return NextResponse.json(
      { error: 'Failed to delete chat session' },
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
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

