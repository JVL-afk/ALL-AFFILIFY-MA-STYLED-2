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
export const DELETE = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json(
        { error: 'Missing required field: filePath' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const result = await db.collection<UserCodeDocument>('userCode').updateOne(
      { userId: new ObjectId(user._id) },
      { $pull: { files: { path: filePath } } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'File not found or not authorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'File deleted successfully' })
  } catch (error) {
    console.error('Delete file error:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
})

export const PUT = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { oldPath, newPath } = await request.json()

    if (!oldPath || !newPath) {
      return NextResponse.json(
        { error: 'Missing required fields: oldPath, newPath' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const result = await db.collection<UserCodeDocument>('userCode').updateOne(
      { userId: new ObjectId(user._id), 'files.path': oldPath },
      { $set: { 'files.$.path': newPath, lastModified: new Date() } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'File not found or not authorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'File updated successfully' })
  } catch (error) {
    console.error('Update file error:', error)
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: 500 }
    )
  }
})




export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { filePath, content, isFolder } = await request.json()

    if (!filePath || content === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: filePath, content' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Check if the file already exists (for saving existing files)
    const existingFile = await db.collection<UserCodeDocument>('userCode').findOne(
      { userId: new ObjectId(user._id), 'files.path': filePath }
    )

    if (existingFile) {
      // Update existing file
      await db.collection<UserCodeDocument>('userCode').findOneAndUpdate(
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
      return NextResponse.json({
        success: true,
        message: 'File saved successfully',
        lastModified: new Date()
      })
    } else {
      // Create new file or folder
      const newUserCode = await db.collection<UserCodeDocument>('userCode').findOneAndUpdate(
        { userId: new ObjectId(user._id) },
        {
          $push: {
            files: {
              path: filePath,
              content: isFolder ? '' : content,
              lastModified: new Date()
            } as any
          },
          $set: { lastModified: new Date() }
        },
        { returnDocument: 'after' }
      )

      if (!newUserCode) {
        return NextResponse.json(
          { error: 'User code workspace not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: isFolder ? 'Folder created successfully' : 'File created successfully',
        file: newUserCode?.files?.find(f => f.path === filePath)
      })
    }
  } catch (error) {
    console.error('Save/Create file/folder error:', error)
    return NextResponse.json(
      { error: 'Failed to save/create file/folder' },
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

