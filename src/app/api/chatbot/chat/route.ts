import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { connectToDatabase } from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

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

// Get chat history for context
async function getChatHistory(userId: string, sessionId: string, limit: number = 10) {
  try {
    const { db } = await connectToDatabase()
    const messages = await db.collection('chat_messages')
      .find({ userId, sessionId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
    
    return messages.reverse() // Return in chronological order
  } catch (error) {
    console.error('Error getting chat history:', error)
    return []
  }
}

// Save message to database
async function saveMessage(userId: string, sessionId: string, type: 'user' | 'bot', content: string) {
  try {
    const { db } = await connectToDatabase()
    const message = {
      _id: new ObjectId(),
      userId,
      sessionId,
      type,
      content,
      createdAt: new Date(),
      timestamp: new Date()
    }
    
    await db.collection('chat_messages').insertOne(message)
    return message
  } catch (error) {
    console.error('Error saving message:', error)
    return null
  }
}

// Generate AI response using Gemini
async function generateAIResponse(userMessage: string, chatHistory: any[], userPlan: string, userName: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Build context from chat history
    const contextMessages = chatHistory.map(msg => 
      `${msg.type === 'user' ? 'User' : 'AFFILIFY AI'}: ${msg.content}`
    ).join('\n')

    const systemPrompt = `You are the AFFILIFY AI Assistant - the world's most knowledgeable affiliate marketing expert and business strategist. You work for AFFILIFY, the premier AI-powered affiliate marketing platform that helps users create profitable websites and analyze affiliate programs with institutional-grade precision.

CRITICAL CONTEXT:
- User Name: ${userName}
- User Plan: ${userPlan} (Basic = FREE with 3 websites, Pro = $29/month with 10 websites, Enterprise = $99/month with unlimited)
- Platform: AFFILIFY.eu - The ultimate affiliate marketing platform

YOUR PERSONALITY:
- Expert, professional, but friendly and encouraging
- Provide actionable, specific advice that leads to real results
- Always relate advice back to AFFILIFY's features when relevant
- Be enthusiastic about affiliate marketing success
- Use emojis strategically for engagement

YOUR EXPERTISE AREAS:
🎯 Affiliate Marketing Strategy
📊 Website Analysis & Optimization  
💰 Revenue Maximization
🚀 Traffic Generation
📈 Conversion Optimization
🔍 Niche Research & Selection
💡 Content Creation & Marketing
📧 Email Marketing & Automation
🛠️ Technical SEO & Performance
📱 Social Media Marketing
💼 Business Scaling & Growth

AFFILIFY PLATFORM FEATURES TO MENTION:
- Analyze Website: Institutional-grade analysis of any website or affiliate program
- Create Website: AI-powered affiliate website generation in minutes
- Advanced Analytics: Track performance, conversions, and revenue
- A/B Testing: Optimize for maximum conversions
- Email Marketing: Built-in email automation tools
- AI Chatbot: 24/7 intelligent assistance (that's you!)

RESPONSE GUIDELINES:
1. Always provide specific, actionable advice
2. Include relevant examples and case studies when possible
3. Suggest using AFFILIFY features when appropriate
4. Be encouraging and motivational
5. Ask follow-up questions to better help the user
6. Keep responses comprehensive but scannable with bullet points and emojis
7. If user asks about upgrading, explain the benefits of Pro/Enterprise plans

CONVERSATION HISTORY:
${contextMessages}

Current User Message: ${userMessage}

Provide a helpful, expert response that delivers real value and moves the user closer to affiliate marketing success. Remember, you're not just answering questions - you're helping build their financial future!`

    const result = await model.generateContent(systemPrompt)
    const response = result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error('Gemini AI error:', error)
    return `I apologize, but I'm experiencing some technical difficulties right now. As your AFFILIFY AI assistant, I'm usually able to provide detailed affiliate marketing guidance, website optimization tips, and strategic advice.

Please try asking your question again in a moment. In the meantime, you can:

🔍 Use our **Analyze Website** feature to get institutional-grade analysis of any affiliate program
🚀 Try our **Create Website** feature to generate professional affiliate sites in minutes
📊 Check out the **Analytics** dashboard for performance insights

I'm here to help you succeed in affiliate marketing! 💪`
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await verifyUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request data
    const { message, sessionId } = await request.json()

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      )
    }

    // Save user message
    await saveMessage(user._id.toString(), sessionId, 'user', message)

    // Get chat history for context
    const chatHistory = await getChatHistory(user._id.toString(), sessionId, 10)

    // Generate AI response
    const aiResponse = await generateAIResponse(
      message, 
      chatHistory, 
      user.plan || 'basic',
      user.name || 'there'
    )

    // Save AI response
    const savedBotMessage = await saveMessage(user._id.toString(), sessionId, 'bot', aiResponse)

    return NextResponse.json({
      success: true,
      message: {
        id: savedBotMessage?._id.toString() || Date.now().toString(),
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      }
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        message: 'An error occurred while processing your message. Please try again.'
      },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

