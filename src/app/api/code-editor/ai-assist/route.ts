import { NextRequest, NextResponse } from 'next/server'
import { requireEnterprise } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { AIErrorExplainer } from '@/lib/ai-error-explainer'

// POST: Get AI suggestions for code improvements
export const POST = requireEnterprise(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { code, filePath } = await request.json()

    if (!code || !filePath) {
      return NextResponse.json(
        { error: 'Missing required fields: code, filePath' },
        { status: 400 }
      )
    }

    const suggestions = await AIErrorExplainer.suggestImprovements(code, filePath)

    return NextResponse.json({
      success: true,
      suggestions
    })
  } catch (error) {
    console.error('AI assist error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI suggestions' },
      { status: 500 }
    )
  }
})

