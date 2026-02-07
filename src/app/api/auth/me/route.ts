import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '../../../../lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)

    if (!authResult.success) {
      return NextResponse.json(
        { 
          error: authResult.error || 'Authentication required',
          details: authResult.details
        },
        { status: 401 }
      )
    }

    const user = authResult.user as any;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        websiteCount: user.websitesCreated, // Map to websiteCount for frontend
        websitesCreated: user.websitesCreated,
        websiteLimit: user.websiteLimit,
        analysesUsed: user.analysesUsed,
        analysisLimit: user.analysisLimit,
        createdAt: user.createdAt,
        isVerified: user.isVerified
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

