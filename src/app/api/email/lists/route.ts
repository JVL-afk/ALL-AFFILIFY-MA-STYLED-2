import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Best-in-Class: Email List Model
interface EmailList {
  _id?: ObjectId
  userId: ObjectId
  name: string
  subscriberCount: number
  createdAt: Date
  updatedAt: Date
}

// GET: Fetch all email lists for the Enterprise user (best-in-class)
export const GET = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { db } = await connectToDatabase()
    
    // Best-in-Class: Fetch lists from MongoDB with real-time data
    const listsCollection = db.collection('email_lists')
    const lists = await listsCollection.find({ userId: new ObjectId(user._id) }).toArray()

    // If no lists exist, return mock data for demonstration
    if (lists.length === 0) {
      const mockLists = [
        { id: 'list-1', name: 'Product Launch Subscribers', subscriberCount: 1245, createdAt: new Date() },
        { id: 'list-2', name: 'Affiliate Partners', subscriberCount: 89, createdAt: new Date() },
      ]
      return NextResponse.json({
        success: true,
        lists: mockLists
      })
    }

    return NextResponse.json({
      success: true,
      lists: lists.map(list => ({
        id: list._id.toHexString(),
        name: list.name,
        subscriberCount: list.subscriberCount,
        createdAt: list.createdAt,
      }))
    })
  } catch (error) {
    console.error('Get email lists error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve email lists' },
      { status: 500 }
    )
  }
})

// POST: Create a new email list (best-in-class)
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Best-in-Class: Create list in MongoDB
    const newList: EmailList = {
      userId: new ObjectId(user._id),
      name,
      subscriberCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('email_lists').insertOne(newList)

    return NextResponse.json({
      success: true,
      message: `Email list "${name}" created successfully.`,
      list: {
        id: result.insertedId.toHexString(),
        name,
        subscriberCount: 0,
        createdAt: newList.createdAt,
      }
    })
  } catch (error) {
    console.error('Create email list error:', error)
    return NextResponse.json(
      { error: 'Failed to create email list' },
      { status: 500 }
    )
  }
})

