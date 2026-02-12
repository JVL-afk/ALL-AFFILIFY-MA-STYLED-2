import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById } from '../../../lib/auth'

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

    // Fetch real A/B tests from database
    const { connectToDatabase } = await import('@/lib/mongodb')
    const { ObjectId } = await import('mongodb')
    const { db } = await connectToDatabase()
    
    let tests: any[] = []
    try {
      const testsData = await db.collection('ab_tests')
        .find({ userId: new ObjectId(user._id) })
        .toArray()
      
      tests = testsData.map(test => ({
        id: test._id.toString(),
        name: test.name || '',
        description: test.description || '',
        websiteId: test.websiteId?.toString() || '',
        websiteName: test.websiteName || '',
        status: test.status || 'draft',
        type: test.type || 'headline',
        variants: test.variants || [],
        metrics: test.metrics || {
          primaryGoal: 'conversions',
          confidenceLevel: 0,
          statisticalSignificance: false
        },
        schedule: test.schedule || {
          startDate: '',
          duration: 14
        },
        createdAt: test.createdAt || new Date().toISOString(),
        updatedAt: test.updatedAt || new Date().toISOString()
      }))
    } catch (error) {
      console.log('A/B tests collection not found or error:', error)
    }

    return NextResponse.json({
      success: true,
      tests
    })
  } catch (error) {
    console.error('A/B tests API error:', error)
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
    const { name, description, websiteId, type, variants, primaryGoal, duration } = body

    // Validate required fields
    if (!name || !websiteId || !type || !variants || !primaryGoal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new A/B test in database
    const { connectToDatabase } = await import('@/lib/mongodb')
    const { ObjectId } = await import('mongodb')
    const { db } = await connectToDatabase()
    
    const newTestData = {
      userId: new ObjectId(user._id),
      name,
      description: description || '',
      websiteId,
      websiteName: 'Website Name',
      status: 'draft',
      type,
      variants: variants.map((variant: any, index: number) => ({
        ...variant,
        id: variant.id || `variant${index}`,
        conversions: 0,
        visitors: 0,
        conversionRate: 0
      })),
      metrics: {
        primaryGoal,
        confidenceLevel: 0,
        statisticalSignificance: false
      },
      schedule: {
        startDate: new Date().toISOString(),
        duration: duration || 14
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await db.collection('ab_tests').insertOne(newTestData)
    
    const newTest = {
      id: result.insertedId.toString(),
      name,
      description: description || '',
      websiteId,
      websiteName: 'Website Name',
      status: 'draft',
      type,
      variants: newTestData.variants,
      metrics: newTestData.metrics,
      schedule: newTestData.schedule,
      createdAt: newTestData.createdAt,
      updatedAt: newTestData.updatedAt
    }

    return NextResponse.json({
      success: true,
      test: newTest,
      message: 'A/B test created successfully! Configure variants and start testing.'
    })
  } catch (error) {
    console.error('Create A/B test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

