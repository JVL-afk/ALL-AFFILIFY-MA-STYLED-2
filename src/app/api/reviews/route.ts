import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

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

    // Fetch real reviews from database
    const { db } = await connectToDatabase()
    const userId = new ObjectId(user._id)

    let reviews: any[] = []
    try {
      const reviewsData = await db.collection('reviews')
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray()
      
      reviews = reviewsData.map(review => ({
        id: review._id.toString(),
        customerName: review.customerName || '',
        customerEmail: review.customerEmail || '',
        rating: review.rating || 0,
        title: review.title || '',
        content: review.content || '',
        productId: review.productId || '',
        productName: review.productName || '',
        websiteId: review.websiteId || '',
        websiteName: review.websiteName || '',
        status: review.status || 'pending',
        isVisible: review.isVisible || false,
        isFeatured: review.isFeatured || false,
        createdAt: review.createdAt || new Date().toISOString(),
        updatedAt: review.updatedAt || new Date().toISOString(),
        source: review.source || 'manual',
        metadata: review.metadata || {
          verified: false,
          helpfulVotes: 0,
          reportedCount: 0
        }
      }))
    } catch (error) {
      console.log('Reviews collection not found, returning empty array')
    }

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

