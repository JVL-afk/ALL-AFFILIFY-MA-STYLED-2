import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Deployment } from '@/lib/models/UserCode'
import { GitHubService } from '@/lib/github-service'
import { AIErrorExplainer } from '@/lib/ai-error-explainer'

const NETLIFY_TOKEN = process.env.NETLIFY_ACCESS_TOKEN || 'nfp_hmio4j7N2WeEMji3c8PbAsiaiw64QD7D85e1'
const GITHUB_TOKEN = process.env.GITHUB_PAT || 'ghp_sxvhlCXj5Bm0cXMpK7e1QWRElrfj6A1GwZaj'
const GITHUB_REPO = 'JVL-afk/ALL-AFFILIFY-MA-STYLED-2'

// POST: Deploy user's code to Netlify
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { db } = await connectToDatabase()
    
    // Get user's code
    const userCode = await db.collection('userCode')
      .findOne({ userId: new ObjectId(user._id) })

    if (!userCode) {
      return NextResponse.json(
        { error: 'No code found to deploy' },
        { status: 404 }
      )
    }

   // Create deployment record (remove type annotation)
const deploymentId = `deploy-${Date.now()}`
const deployment = {
  id: deploymentId,
  timestamp: new Date(),
  commitHash: '',
  status: 'pending' as const,
  buildLogs: 'Starting deployment...'
}

    // Add deployment to database
    await db.collection('userCode').updateOne(
      { userId: new ObjectId(user._id) },
      {
        $push: { deployments: deployment as any },
        $set: { lastDeployed: new Date() }
      }
    )

    // Start async deployment process
    deployToNetlify(user._id.toString(), userCode, deploymentId)

    return NextResponse.json({
      success: true,
      message: 'Deployment started',
      deploymentId: deploymentId
    })
  } catch (error) {
    console.error('Deploy error:', error)
    return NextResponse.json(
      { error: 'Failed to start deployment' },
      { status: 500 }
    )
  }
})

// GET: Get deployment status
export const GET = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { searchParams } = new URL(request.url)
    const deploymentId = searchParams.get('deploymentId')

    const { db } = await connectToDatabase()
    
    const userCode = await db.collection('userCode')
      .findOne({ userId: new ObjectId(user._id) })

    if (!userCode) {
      return NextResponse.json(
        { error: 'No deployments found' },
        { status: 404 }
      )
    }

    if (deploymentId) {
      const deployment = userCode.deployments.find((d: Deployment) => d.id === deploymentId)
      return NextResponse.json({
        success: true,
        deployment
      })
    }

    return NextResponse.json({
      success: true,
      deployments: userCode.deployments
    })
  } catch (error) {
    console.error('Get deployment status error:', error)
    return NextResponse.json(
      { error: 'Failed to get deployment status' },
      { status: 500 }
    )
  }
})

// Async function to deploy to Netlify
async function deployToNetlify(userId: string, userCode: any, deploymentId: string) {
  try {
    const { db } = await connectToDatabase()
    
    // Update status to building
    await db.collection('userCode').updateOne(
      { userId: new ObjectId(userId), 'deployments.id': deploymentId },
      {
        $set: {
          'deployments.$.status': 'building',
          'deployments.$.buildLogs': 'Pushing code to GitHub...'
        }
      }
    )

    // Step 1: Push code to GitHub
    const branchName = `user-${userId}`
    const commitHash = await pushToGitHub(userCode.files, branchName)

    // Update commit hash
    await db.collection('userCode').updateOne(
      { userId: new ObjectId(userId), 'deployments.id': deploymentId },
      {
        $set: {
          'deployments.$.commitHash': commitHash,
          'deployments.$.buildLogs': 'Code pushed to GitHub. Triggering Netlify build...'
        }
      }
    )

    // Step 2: Trigger Netlify build
    const netlifyResponse = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NETLIFY_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `affilify-user-${userId}`,
        repo: {
          provider: 'github',
          repo: GITHUB_REPO,
          branch: branchName,
          private: false
        }
      })
    })

    if (!netlifyResponse.ok) {
      throw new Error(`Netlify API error: ${netlifyResponse.statusText}`)
    }

    const netlifyData = await netlifyResponse.json()
    const siteId = netlifyData.id
    const liveUrl = netlifyData.ssl_url || netlifyData.url

    // Update deployment as successful
    await db.collection('userCode').updateOne(
      { userId: new ObjectId(userId), 'deployments.id': deploymentId },
      {
        $set: {
          'deployments.$.status': 'success',
          'deployments.$.liveUrl': liveUrl,
          'deployments.$.buildLogs': `Deployment successful! Your app is live at ${liveUrl}`,
          netlifyAppId: siteId
        }
      }
    )
  } catch (error: any) {
    console.error('Netlify deployment error:', error)
    
    // Use AI to explain the error
    let aiExplanation = null
    try {
      aiExplanation = await AIErrorExplainer.explainBuildError(error.message)
    } catch (aiError) {
      console.error('AI explanation failed:', aiError)
    }

    // Update deployment as failed with AI insights
    const { db } = await connectToDatabase()
    await db.collection('userCode').updateOne(
      { userId: new ObjectId(userId), 'deployments.id': deploymentId },
      {
        $set: {
          'deployments.$.status': 'failed',
          'deployments.$.errorDetails': error.message,
          'deployments.$.buildLogs': aiExplanation 
            ? `Deployment failed: ${error.message}\n\n🤖 AI Analysis:\n${aiExplanation.explanation}\n\n🛠️ Suggested Fixes:\n${aiExplanation.suggestedFixes.map((fix, i) => `${i + 1}. ${fix}`).join('\n')}`
            : `Deployment failed: ${error.message}`
        }
      }
    )
  }
}

// Helper function to push code to GitHub
async function pushToGitHub(files: any[], branchName: string): Promise<string> {
  try {
    const fileUpdates = files.map(file => ({
      path: file.path,
      content: file.content
    }))

    const commitSha = await GitHubService.pushFiles(
      branchName,
      fileUpdates,
      `Update user code - ${new Date().toISOString()}`
    )

    return commitSha
  } catch (error: any) {
    console.error('Push to GitHub error:', error)
    throw new Error(`Failed to push to GitHub: ${error.message}`)
  }
}

