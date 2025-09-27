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

    // Mock A/B tests data
    const tests = [
      {
        id: '1',
        name: 'Homepage Headline Test',
        description: 'Testing different headlines for better conversion',
        websiteId: 'web1',
        websiteName: 'My Website',
        status: 'running',
        type: 'headline',
        variants: [
          {
            id: 'control',
            name: 'Original Headline',
            description: 'Current headline',
            traffic: 50,
            conversions: 25,
            visitors: 500,
            conversionRate: 5.0,
            isControl: true
          },
          {
            id: 'variant1',
            name: 'New Headline',
            description: 'Improved headline',
            traffic: 50,
            conversions: 35,
            visitors: 500,
            conversionRate: 7.0,
            isControl: false
          }
        ],
        metrics: {
          primaryGoal: 'conversions',
          confidenceLevel: 95,
          statisticalSignificance: true,
          winner: 'variant1'
        },
        schedule: {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 14
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

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

    // Create new A/B test (mock implementation)
    const newTest = {
      id: Date.now().toString(),
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
        startDate: '',
        duration: duration || 14
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      test: newTest,
      message: 'A/B test created successfully'
    })
  } catch (error) {
    console.error('Create A/B test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

