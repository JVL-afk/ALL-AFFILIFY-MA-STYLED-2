import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import crypto from 'crypto'

// Best-in-Class: API Key Model
interface ApiKey {
  _id?: ObjectId
  userId: ObjectId
  key: string
  name: string
  permissions: string[]
  createdAt: Date
  lastUsed?: Date | null
}

// GET: Fetch all API keys for the Enterprise user (best-in-class)
export const GET = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { db } = await connectToDatabase()
    
    // Best-in-Class: Fetch API keys from MongoDB with real-time data
    const keys = await db.collection('apiKeys')
      .find({ userId: new ObjectId(user._id) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      keys: keys.map(key => ({
        id: key._id.toHexString(),
        name: key.name,
        key: key.key.substring(0, 10) + '...' + key.key.substring(key.key.length - 4), // Mask for security
        permissions: key.permissions,
        createdAt: key.createdAt,
        lastUsed: key.lastUsed
      }))
    })
  } catch (error) {
    console.error('Get API keys error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve API keys' },
      { status: 500 }
    )
  }
})

// POST: Generate a new API key for the Enterprise user (best-in-class)
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { name, permissions } = await request.json()

    if (!name || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, permissions' },
        { status: 400 }
      )
    }

    // Best-in-Class: Validate permissions
    const validPermissions = ['read', 'write', 'delete', 'admin']
    const invalidPermissions = permissions.filter((p: string) => !validPermissions.includes(p))
    if (invalidPermissions.length > 0) {
      return NextResponse.json(
        { error: `Invalid permissions: ${invalidPermissions.join(', ')}` },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Best-in-Class: Generate a secure, random API key
    const newApiKeyString = `affilify_pk_${crypto.randomBytes(32).toString('hex')}`

    const newKey: ApiKey = {
      userId: new ObjectId(user._id),
      key: newApiKeyString,
      name,
      permissions,
      createdAt: new Date(),
      lastUsed: null
    }

    const result = await db.collection('apiKeys').insertOne(newKey)
    
    if (!result.insertedId) {
      return NextResponse.json(
        { error: 'Failed to generate API key' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'API Key generated successfully',
      key: {
        id: result.insertedId.toHexString(),
        name: newKey.name,
        key: newApiKeyString, // Return full key only on creation
        permissions: newKey.permissions,
        createdAt: newKey.createdAt,
      }
    })
  } catch (error) {
    console.error('Generate API key error:', error)
    return NextResponse.json(
      { error: 'Failed to generate API key' },
      { status: 500 }
    )
  }
})

