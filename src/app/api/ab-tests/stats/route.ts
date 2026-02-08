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

    // Calculate real A/B testing stats from database
    const { connectToDatabase } = await import('@/lib/mongodb')
    const { ObjectId } = await import('mongodb')
    const { db } = await connectToDatabase()
    
    let stats = {
      totalTests: 0,
      runningTests: 0,
      completedTests: 0,
      totalVisitors: 0,
      averageUplift: 0,
      significantWins: 0
    }
    
    try {
      const testsData = await db.collection('ab_tests')
        .find({ userId: new ObjectId(user._id) })
        .toArray()
      
      stats.totalTests = testsData.length
      stats.runningTests = testsData.filter(t => t.status === 'running').length
      stats.completedTests = testsData.filter(t => t.status === 'completed').length
      
      // Calculate total visitors and average uplift
      let totalUplift = 0
      let testsWithUplift = 0
      
      testsData.forEach(test => {
        if (test.variants && Array.isArray(test.variants)) {
          test.variants.forEach((variant: any) => {
            stats.totalVisitors += variant.visitors || 0
          })
          
          // Calculate uplift if there's a control and variant
          const control = test.variants.find((v: any) => v.isControl)
          const variants = test.variants.filter((v: any) => !v.isControl)
          
          if (control && variants.length > 0) {
            variants.forEach((variant: any) => {
              if (control.conversionRate > 0) {
                const uplift = ((variant.conversionRate - control.conversionRate) / control.conversionRate) * 100
                if (uplift > 0) {
                  totalUplift += uplift
                  testsWithUplift++
                  if (test.metrics?.statisticalSignificance) {
                    stats.significantWins++
                  }
                }
              }
            })
          }
        }
      })
      
      stats.averageUplift = testsWithUplift > 0 ? Number((totalUplift / testsWithUplift).toFixed(1)) : 0
    } catch (error) {
      console.log('Error calculating A/B test stats:', error)
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('A/B tests stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

