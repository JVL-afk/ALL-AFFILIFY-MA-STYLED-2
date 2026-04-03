import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById } from '@/lib/auth'
import { getDashboardStats } from '@/lib/database'

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

    // Get dashboard statistics
    const stats = await getDashboardStats(user.id)

    // Return the full nested stats object so the frontend can access
    // stats.websites.total, stats.performance.totalViews, stats.recent.websites, etc.
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        websiteCount: stats.websites.total,
        createdAt: user.createdAt,
        lastLoginAt: (user as any).lastLoginAt || user.createdAt
      },
      websites: stats.websites,
      analyses: stats.analyses,
      performance: stats.performance,
      recent: stats.recent,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
