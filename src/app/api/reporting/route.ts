import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Best-in-Class: Report Model with MongoDB Aggregation Pipeline support
interface SavedReport {
  _id?: ObjectId
  userId: ObjectId
  name: string
  description: string
  pipeline: any[]
  schedule?: 'daily' | 'weekly' | 'monthly'
  createdAt: Date
  updatedAt: Date
}

// GET: Fetch all saved reports for the Enterprise user (best-in-class)
export const GET = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { db } = await connectToDatabase()
    
    // Best-in-Class: Fetch reports from MongoDB with real-time data
    const reports = await db.collection('savedReports')
      .find({ userId: new ObjectId(user._id) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      reports: reports.map(report => ({
        id: report._id.toHexString(),
        name: report.name,
        description: report.description,
        pipeline: report.pipeline,
        schedule: report.schedule,
        createdAt: report.createdAt
      }))
    })
  } catch (error) {
    console.error('Get reports error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve reports' },
      { status: 500 }
    )
  }
})

// POST: Save a new report for the Enterprise user (best-in-class)
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { name, description, pipeline, schedule } = await request.json()

    if (!name || !pipeline) {
      return NextResponse.json(
        { error: 'Missing required fields: name, pipeline' },
        { status: 400 }
      )
    }

    // Best-in-Class: Validate pipeline is an array
    if (!Array.isArray(pipeline)) {
      return NextResponse.json(
        { error: 'Pipeline must be an array of aggregation stages' },
        { status: 400 }
      )
    }

    // Best-in-Class: Validate schedule if provided
    if (schedule && !['daily', 'weekly', 'monthly'].includes(schedule)) {
      return NextResponse.json(
        { error: 'Schedule must be one of: daily, weekly, monthly' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    const newReport: SavedReport = {
      userId: new ObjectId(user._id),
      name,
      description: description || '',
      pipeline,
      schedule,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('savedReports').insertOne(newReport)
    
    if (!result.insertedId) {
      return NextResponse.json(
        { error: 'Failed to save report' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Report saved successfully',
      report: {
        id: result.insertedId.toHexString(),
        name: newReport.name,
        description: newReport.description,
        pipeline: newReport.pipeline,
        schedule: newReport.schedule,
        createdAt: newReport.createdAt,
      }
    })
  } catch (error) {
    console.error('Save report error:', error)
    return NextResponse.json(
      { error: 'Failed to save report' },
      { status: 500 }
    )
  }
})

