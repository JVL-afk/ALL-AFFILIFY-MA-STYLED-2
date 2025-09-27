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

    // Mock reviews data for now
    const reviews = [
      {
        id: '1',
        customerName: 'John Smith',
        customerEmail: 'john@example.com',
        rating: 5,
        title: 'Amazing product!',
        content: 'This product exceeded my expectations. Highly recommended!',
        productId: 'prod1',
        productName: 'Sample Product',
        websiteId: 'web1',
        websiteName: 'My Website',
        status: 'approved',
        isVisible: true,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'manual',
        metadata: {
          verified: true,
          helpfulVotes: 5,
          reportedCount: 0
        }
      }
    ]

    return NextResponse.json({
      success: true,
      reviews
    })
  } catch (error) {
    console.error('Reviews API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { customerName, customerEmail, rating, title, content, productId, websiteId } = body

    // Validate required fields
    if (!customerName || !rating || !content || !productId || !websiteId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new review (mock implementation)
    const newReview = {
      id: Date.now().toString(),
      customerName,
      customerEmail: customerEmail || '',
      rating,
      title: title || '',
      content,
      productId,
      productName: 'Product Name',
      websiteId,
      websiteName: 'Website Name',
      status: 'pending',
      isVisible: false,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'manual',
      metadata: {
        verified: false,
        helpfulVotes: 0,
        reportedCount: 0
      }
    }

    return NextResponse.json({
      success: true,
      review: newReview,
      message: 'Review created successfully'
    })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

