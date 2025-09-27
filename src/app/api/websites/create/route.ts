import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById, incrementUserWebsites } from '@/lib/auth'
import { generateWebsiteContent } from '@/lib/ai'
import { saveWebsite } from '@/lib/database'
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

    // Check website limit
    if (user.websiteLimit !== -1 && user.websitesCreated >= user.websiteLimit) {
      return NextResponse.json(
        { 
          error: 'Website limit reached',
          message: `You have reached your limit of ${user.websiteLimit} websites. Upgrade your plan to create more.`
        },
        { status: 403 }
      )
    }

    // Get request data
    const { productUrl, niche, targetAudience, template, tone, features } = await request.json()

    // Validation
    if (!productUrl || !niche || !targetAudience || !template) {
      return NextResponse.json(
        { error: 'Missing required fields: productUrl, niche, targetAudience, template' },
        { status: 400 }
      )
    }

    if (!validateUrl(productUrl)) {
      return NextResponse.json(
        { error: 'Invalid product URL' },
        { status: 400 }
      )
    }

    // Generate website content using AI
    const websiteData = await generateWebsiteContent({
      productUrl,
      niche,
      targetAudience,
      template,
      tone: tone || 'professional',
      features: features || []
    })

    // Save website to database
    const savedWebsite = await saveWebsite(user.id, websiteData)
    if (!savedWebsite) {
      return NextResponse.json(
        { error: 'Failed to save website' },
        { status: 500 }
      )
    }

    // Increment user's website count
    await incrementUserWebsites(user.id)

    return NextResponse.json({
      success: true,
      message: 'Website created successfully',
      website: {
        id: savedWebsite.id,
        title: savedWebsite.title,
        description: savedWebsite.description,
        template: savedWebsite.template,
        status: savedWebsite.status,
        createdAt: savedWebsite.createdAt
      }
    })
  } catch (error) {
    console.error('Website creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

