import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { AuthenticatedUser } from '@/lib/types'
import { generateWebsiteContent } from '@/lib/ai'
import { saveWebsite } from '@/lib/database'
import { validateUrl } from '@/lib/utils'
import { incrementUserWebsites } from '@/lib/auth'

export const POST = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    // Best-in-Class: Check website limit
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

    // Save website to database (CRITICAL FIX: Pass user._id as string, database.ts will convert to ObjectId)
    const savedWebsite = await saveWebsite(user._id.toString(), websiteData)
    if (!savedWebsite) {
      return NextResponse.json(
        { error: 'Failed to save website' },
        { status: 500 }
      )
    }

    // Increment user's website count
    await incrementUserWebsites(user._id.toString())

    return NextResponse.json({
      success: true,
      message: 'Website created successfully',
      website: {
        id: savedWebsite._id.toHexString(),
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
      { error: 'Failed to create website', details: error.message || error.toString() },
      { status: 500 }
    )
  }
})

