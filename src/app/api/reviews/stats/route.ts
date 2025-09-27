import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user
    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has Enterprise plan
    if (user.plan !== 'enterprise') {
      return NextResponse.json(
        { error: 'Enterprise plan required' },
        { status: 403 }
      )
    }

    // Mock stats data
    const stats = {
      total: 25,
      approved: 20,
      pending: 3,
      rejected: 2,
      averageRating: 4.3,
      ratingDistribution: {
        5: 12,
        4: 8,
        3: 3,
        2: 1,
        1: 1
      },
      monthlyTrend: [
        { month: 'Jan', count: 5, rating: 4.2 },
        { month: 'Feb', count: 8, rating: 4.1 },
        { month: 'Mar', count: 12, rating: 4.3 }
      ]
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Reviews stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

