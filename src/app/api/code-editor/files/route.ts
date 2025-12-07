import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { UserCodeDocument, FileContent } from '@/lib/models/UserCode'

// GET: Fetch all files for the Enterprise user's app
export const GET = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { db } = await connectToDatabase()
    
    // Check if user already has a code workspace
    let userCode = await db.collection<UserCodeDocument>('userCode')
      .findOne({ userId: new ObjectId(user._id) })

    // If no workspace exists, initialize one with default dashboard files
    if (!userCode) {
      const defaultFiles = await getDefaultDashboardFiles()
      
      const newUserCode: UserCodeDocument = {
        userId: new ObjectId(user._id),
        appId: `affilify-app-${user._id}`,
        files: defaultFiles,
        deployments: [],
        lastModified: new Date(),
        createdAt: new Date(),
        githubBranch: `user-${user._id}`
      }

      const result = await db.collection('userCode').insertOne(newUserCode)
      userCode = { ...newUserCode, _id: result.insertedId }
    }

    return NextResponse.json({
      success: true,
      files: userCode.files,
      appId: userCode.appId,
      lastModified: userCode.lastModified
    })
  } catch (error) {
    console.error('Get user code error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve user code' },
      { status: 500 }
    )
  }
})

// POST: Save file changes
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { filePath, content } = await request.json()

    if (!filePath || content === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: filePath, content' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Update or add the file
    const result = await db.collection('userCode').findOneAndUpdate(
      { userId: new ObjectId(user._id) },
      {
        $set: {
          'files.$[elem].content': content,
          'files.$[elem].lastModified': new Date(),
          lastModified: new Date()
        }
      },
      {
        arrayFilters: [{ 'elem.path': filePath }],
        returnDocument: 'after'
      }
    )

    // If file doesn't exist, add it
if (!result) {
  await db.collection('userCode').updateOne(
    { userId: new ObjectId(user._id) },
    {
      $push: {
        files: {
          path: filePath,
          content: content,
          lastModified: new Date()
        } as any  // ✅ Cast to any
      } as any,  // ✅ Also cast the entire $push
      $set: { lastModified: new Date() }
    }
  )
}

    return NextResponse.json({
      success: true,
      message: 'File saved successfully',
      lastModified: new Date()
    })
  } catch (error) {
    console.error('Save file error:', error)
    return NextResponse.json(
      { error: 'Failed to save file' },
      { status: 500 }
    )
  }
})

// Helper function to get default dashboard files
async function getDefaultDashboardFiles(): Promise<FileContent[]> {
  // Load the extracted dashboard files
  const defaultFiles = require('@/lib/default-dashboard-files.json')
  
  return defaultFiles.map((file: any) => ({
    path: file.path,
    content: file.content,
    lastModified: new Date(file.lastModified)
  }))
}

