import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Best-in-Class: Custom Reporting with MongoDB Aggregation Pipeline
// This API route is for Enterprise users only to run custom MongoDB aggregation queries
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { aggregationPipeline, collection = 'websites' } = await request.json()

    if (!aggregationPipeline || !Array.isArray(aggregationPipeline)) {
      return NextResponse.json(
        { error: 'Invalid or missing aggregationPipeline' },
        { status: 400 }
      )
    }

    // Best-in-Class: Validate collection name (whitelist approach)
    const allowedCollections = ['websites', 'analytics', 'ab_tests', 'email_campaigns']
    if (!allowedCollections.includes(collection)) {
      return NextResponse.json(
        { error: `Collection must be one of: ${allowedCollections.join(', ')}` },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Best-in-Class: Security - Enforce user-specific filtering
    // Prepend a $match stage to ensure only the current user's data is accessed
    const enforcedMatch = { $match: { userId: new ObjectId(user._id) } }
    const safePipeline = [enforcedMatch, ...aggregationPipeline]

    // Best-in-Class: Execute the aggregation with error handling
    try {
      const results = await db.collection(collection).aggregate(safePipeline).toArray()

      return NextResponse.json({
        success: true,
        results,
        count: results.length
      })
    } catch (aggregationError) {
      console.error('Aggregation pipeline error:', aggregationError)
      return NextResponse.json(
        { error: 'Invalid aggregation pipeline or database error' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Custom reporting error:', error)
    return NextResponse.json(
      { error: 'Failed to execute custom report' },
      { status: 500 }
    )
  }
})

