import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById, incrementUserAnalyses } from '@/lib/auth'
import { analyzeWebsite } from '@/lib/ai'
import { saveAnalysis } from '@/lib/database'
import { validateUrl } from '@/lib/utils'

export async function POST(request: NextRequest) {
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

    // Check analysis limit
    if (user.analysisLimit !== -1 && user.analysesUsed >= user.analysisLimit) {
      return NextResponse.json(
        { 
          error: 'Analysis limit reached',
          message: `You have reached your limit of ${user.analysisLimit} analyses. Upgrade your plan to perform more analyses.`
        },
        { status: 403 }
      )
    }

    // Get request data
    const { url, analysisType, includeCompetitors } = await request.json()

    // Validation
    if (!url || !analysisType) {
      return NextResponse.json(
        { error: 'Missing required fields: url, analysisType' },
        { status: 400 }
      )
    }

    if (!validateUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      )
    }

    // Check if competitor analysis is requested and user has access
    if (includeCompetitors && user.plan === 'basic') {
      return NextResponse.json(
        { 
          error: 'Competitor analysis requires Pro or Enterprise plan',
          message: 'Upgrade your plan to access competitor analysis features.'
        },
        { status: 403 }
      )
    }

    // Perform website analysis using AI
    const analysisData = await analyzeWebsite(url, analysisType)

    // If competitor analysis is not available for this plan, remove it
    if (!includeCompetitors || user.plan === 'basic') {
      delete analysisData.competitors
    }

    // Save analysis to database
    const savedAnalysis = await saveAnalysis(user.id, analysisData)
    if (!savedAnalysis) {
      return NextResponse.json(
        { error: 'Failed to save analysis' },
        { status: 500 }
      )
    }

    // Increment user's analysis count
    await incrementUserAnalyses(user.id)

    return NextResponse.json({
      success: true,
      message: 'Website analysis completed',
      analysis: analysisData
    })
  } catch (error) {
    console.error('Website analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

