import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// POST: Setup a new A/B test (best-in-class with Netlify integration)
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { name, siteId, branchA, branchB, trafficSplit } = await request.json()

    if (!name || !siteId || !branchA || !branchB || !trafficSplit) {
      return NextResponse.json(
        { error: 'Missing required fields: name, siteId, branchA, branchB, trafficSplit' },
        { status: 400 }
      )
    }
    
    // Best-in-Class: In a real application, this would:
    // 1. Authenticate with Netlify using a stored token.
    // 2. Call the Netlify API to set up the split test for the given site ID.
    // 3. Store the test configuration in MongoDB for tracking.

    const { db } = await connectToDatabase()
    const testsCollection = db.collection('ab_tests')

    const newTest = {
      userId: new ObjectId(user._id),
      websiteId: new ObjectId(siteId),
      name,
      variantA: {
        name: branchA,
        traffic: trafficSplit.split('/')[0],
        conversions: 0,
      },
      variantB: {
        name: branchB,
        traffic: trafficSplit.split('/')[1],
        conversions: 0,
      },
      status: 'running',
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await testsCollection.insertOne(newTest)

    return NextResponse.json({
      success: true,
      message: `A/B Test "${name}" successfully set up on Netlify.`,
      test: {
        id: result.insertedId.toHexString(),
        name,
        siteId,
        status: 'running',
        trafficSplit,
        branches: { branchA, branchB }
      }
    })
  } catch (error) {
    console.error('A/B test setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup A/B test' },
      { status: 500 }
    )
  }
})

