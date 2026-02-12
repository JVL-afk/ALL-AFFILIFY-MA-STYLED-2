import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById } from '../../../../../lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.plan !== 'enterprise') {
      return NextResponse.json(
        { error: 'Enterprise plan required' },
        { status: 403 }
      )
    }

    const { connectToDatabase } = await import('@/lib/mongodb')
    const { ObjectId } = await import('mongodb')
    const { db } = await connectToDatabase()

    const testId = new ObjectId(id)
    
    const result = await db.collection('ab_tests').updateOne(
      { _id: testId, userId: new ObjectId(user._id) },
      {
        $set: {
          status: 'running',
          'schedule.startDate': new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'A/B test started successfully'
    })
  } catch (error) {
    console.error('Start A/B test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
