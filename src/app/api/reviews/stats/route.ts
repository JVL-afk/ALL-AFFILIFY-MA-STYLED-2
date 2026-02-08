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

    // Calculate real stats from database
    const { db } = await connectToDatabase()
    const userId = new ObjectId(user._id)

    let stats = {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      monthlyTrend: [] as Array<{ month: string; count: number; rating: number }>
    }

    try {
      const reviews = await db.collection('reviews')
        .find({ userId })
        .toArray()
      
      stats.total = reviews.length
      stats.approved = reviews.filter(r => r.status === 'approved').length
      stats.pending = reviews.filter(r => r.status === 'pending').length
      stats.rejected = reviews.filter(r => r.status === 'rejected').length
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0)
        stats.averageRating = Number((totalRating / reviews.length).toFixed(1))
        
        // Calculate rating distribution
        reviews.forEach(r => {
          const rating = r.rating || 0
          if (rating >= 1 && rating <= 5) {
            stats.ratingDistribution[rating as 1|2|3|4|5]++
          }
        })
      }
    } catch (error) {
      console.log('Reviews collection not found, returning empty stats')
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

