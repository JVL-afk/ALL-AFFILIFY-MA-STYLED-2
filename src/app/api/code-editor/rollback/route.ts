import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { GitHubService } from '@/lib/github-service'

// POST: Rollback to a specific deployment
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { deploymentId } = await request.json()

    if (!deploymentId) {
      return NextResponse.json(
        { error: 'Missing deploymentId' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Get user's code and find the deployment
    const userCode = await db.collection('userCode')
      .findOne({ userId: new ObjectId(user._id) })

    if (!userCode) {
      return NextResponse.json(
        { error: 'No code found' },
        { status: 404 }
      )
    }

    const deployment = userCode.deployments.find((d: any) => d.id === deploymentId)

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    if (deployment.status !== 'success') {
      return NextResponse.json(
        { error: 'Can only rollback to successful deployments' },
        { status: 400 }
      )
    }

    // Rollback to the commit
    const branchName = userCode.githubBranch || `user-${user._id}`
    
    try {
      await GitHubService.rollbackToCommit(branchName, deployment.commitHash)

      // Create a new deployment record for the rollback
      const rollbackDeployment = {
        id: `rollback-${Date.now()}`,
        timestamp: new Date(),
        commitHash: deployment.commitHash,
        status: 'success',
        buildLogs: `Rolled back to deployment from ${new Date(deployment.timestamp).toLocaleString()}`,
        liveUrl: deployment.liveUrl
      }

      await db.collection('userCode').updateOne(
        { userId: new ObjectId(user._id) },
        {
          $push: { deployments: rollbackDeployment }
        }
      )

      return NextResponse.json({
        success: true,
        message: 'Rollback successful',
        deployment: rollbackDeployment
      })
    } catch (error: any) {
      return NextResponse.json(
        { error: `Rollback failed: ${error.message}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Rollback error:', error)
    return NextResponse.json(
      { error: 'Failed to rollback' },
      { status: 500 }
    )
  }
})

