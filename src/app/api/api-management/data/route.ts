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

    // Get API keys from database
    let apiKeys: any[] = []
    let totalRequests = 0
    let successRate = 100
    let avgResponseTime = 0

    try {
      const keys = await db.collection('api_keys')
        .find({ userId })
        .toArray()
      
      apiKeys = keys.map(key => ({
        id: key._id.toString(),
        name: key.name || 'Unnamed Key',
        key: key.key || '',
        status: key.status || 'active',
        scopes: key.scopes || [],
        requests: key.requests || 0,
        rateLimit: key.rateLimit || 1000,
        lastUsed: key.lastUsed || null,
        createdAt: key.createdAt || new Date()
      }))

      // Calculate aggregate stats
      totalRequests = apiKeys.reduce((sum, key) => sum + (key.requests || 0), 0)
    } catch (error) {
      console.log('API keys collection not found')
    }

    // Get API usage statistics
    try {
      const usageStats = await db.collection('api_usage')
        .find({ userId })
        .sort({ timestamp: -1 })
        .limit(1000)
        .toArray()

      if (usageStats.length > 0) {
        const successfulRequests = usageStats.filter(s => s.status === 'success').length
        successRate = Number(((successfulRequests / usageStats.length) * 100).toFixed(1))
        
        const totalResponseTime = usageStats.reduce((sum, s) => sum + (s.responseTime || 0), 0)
        avgResponseTime = Math.round(totalResponseTime / usageStats.length)
      }
    } catch (error) {
      console.log('API usage collection not found')
    }

    const activeKeys = apiKeys.filter(k => k.status === 'active').length

    return NextResponse.json({
      success: true,
      data: {
        apiKeys,
        stats: {
          activeKeys,
          totalKeys: apiKeys.length,
          requestsToday: 0, // Would need time-based filtering
          successRate,
          avgResponseTime
        }
      }
    })
  } catch (error) {
    console.error('Error fetching API management data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
