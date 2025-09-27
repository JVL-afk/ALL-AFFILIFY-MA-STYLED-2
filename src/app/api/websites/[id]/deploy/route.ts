import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById } from '@/lib/auth'
import { getWebsiteById, updateWebsite } from '@/lib/database'
import { deployWebsiteToNetlify } from '@/lib/netlify'
import { selectImagesForWebsite } from '@/lib/unsplash'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    // Get website
    const website = await getWebsiteById(id, user.id)
    if (!website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      )
    }

    // Check if deployment is allowed for user's plan
    if (user.plan === 'basic' && website.status === 'published') {
      return NextResponse.json(
        { 
          error: 'Deployment limit reached',
          message: 'Basic plan allows only draft websites. Upgrade to Pro or Enterprise to deploy websites.'
        },
        { status: 403 }
      )
    }

    // Select appropriate images for the website
    let websiteWithImages = { ...website }
    
    try {
      const imageGallery = await selectImagesForWebsite(website)
      
      // Add selected images to website content
      websiteWithImages.content = {
        ...website.content,
        images: imageGallery
      }
    } catch (error) {
      console.error('Error selecting images:', error)
      // Continue without images if Unsplash fails
    }

    // Deploy to Netlify
    let deploymentUrl: string
    
    try {
      deploymentUrl = await deployWebsiteToNetlify(website.id, websiteWithImages)
    } catch (error) {
      console.error('Netlify deployment error:', error)
      return NextResponse.json(
        { error: 'Failed to deploy website' },
        { status: 500 }
      )
    }

    // Update website with deployment URL
    const updateSuccess = await updateWebsite(id, user.id, {
      status: 'published',
      url: deploymentUrl,
      updatedAt: new Date()
    })

    if (!updateSuccess) {
      return NextResponse.json(
        { error: 'Failed to update website status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Website deployed successfully',
      url: deploymentUrl,
      deploymentId: `affilify-${website.id.slice(-8)}`
    })
  } catch (error) {
    console.error('Website deployment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

