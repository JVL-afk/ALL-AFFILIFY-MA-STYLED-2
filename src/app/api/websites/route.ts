import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById } from '@/lib/auth'
import { getUserWebsites } from '@/lib/database'

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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    // Get user's websites
    const websites = await getUserWebsites(user.id, limit)

    return NextResponse.json({
      success: true,
      websites: websites.map(website => ({
        id: website.id,
        title: website.title,
        description: website.description,
        template: website.template,
        status: website.status,
        url: website.url,
        views: website.views,
        clicks: website.clicks,
        conversions: website.conversions,
        revenue: website.revenue,
        createdAt: website.createdAt,
        updatedAt: website.updatedAt
      }))
    })
  } catch (error) {
    console.error('Get websites error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

