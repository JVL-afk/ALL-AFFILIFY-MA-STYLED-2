
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { logger } from '@/lib/debug-logger'
import { EmailCampaignSchema } from '@/types/campaign'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await verifyAuth(request)
    if (!authResult.success) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const user = authResult.user as any
    const { db } = await connectToDatabase()
    
    await db.collection('email_campaigns').deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.id)
    })
    
    logger.info('EmailMarketingAPI', 'DELETE /api/email-marketing/campaigns/[id]', 'Campaign deleted successfully', { campaignId: id, userId: user.id })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    logger.error('EmailMarketingAPI', 'DELETE /api/email-marketing/campaigns/[id]', 'Failed to delete campaign', { campaignId: id, error: (error as Error).message, stack: (error as Error).stack }, error as Error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      logger.warn("EmailMarketingAPI", "GET /api/email-marketing/campaigns/[id]", "Unauthorized access attempt", { campaignId: id })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const user = authResult.user as any
    const { db } = await connectToDatabase()

    const campaign = await db.collection("email_campaigns").findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.id),
    })

    if (!campaign) {
      logger.warn("EmailMarketingAPI", "GET /api/email-marketing/campaigns/[id]", "Campaign not found or unauthorized", { campaignId: id, userId: user.id })
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    logger.info("EmailMarketingAPI", "GET /api/email-marketing/campaigns/[id]", "Campaign retrieved successfully", { campaignId: id, userId: user.id })
    return NextResponse.json({ success: true, data: campaign }, { status: 200 })
  } catch (error) {
    logger.error("EmailMarketingAPI", "GET /api/email-marketing/campaigns/[id]", "Failed to retrieve campaign", { campaignId: params.id, error: (error as Error).message, stack: (error as Error).stack }, error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      logger.warn("EmailMarketingAPI", "PUT /api/email-marketing/campaigns/[id]", "Unauthorized access attempt", { campaignId: id })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = authResult.user as any
    const body = await request.json()
    const validationResult = EmailCampaignSchema.partial().safeParse(body)

    if (!validationResult.success) {
      logger.warn("EmailMarketingAPI", "PUT /api/email-marketing/campaigns/[id]", "Invalid campaign update payload", { errors: validationResult.error.flatten(), campaignId: id, userId: user.id })
      return NextResponse.json({ error: "Invalid request data", details: validationResult.error.flatten() }, { status: 400 })
    }

    const updateData = validationResult.data

    // Ensure status transitions are valid (e.g., cannot go from sent back to draft)
    // This logic can be expanded based on specific business rules
    if (updateData.status) {
      const currentCampaign = await db.collection("email_campaigns").findOne({ _id: new ObjectId(id), userId: new ObjectId(user.id) })
      if (currentCampaign && currentCampaign.status === 'sent' && updateData.status !== 'sent') {
        logger.warn("EmailMarketingAPI", "PUT /api/email-marketing/campaigns/[id]", "Invalid status transition attempt", { campaignId: id, userId: user.id, currentStatus: currentCampaign.status, newStatus: updateData.status })
        return NextResponse.json({ error: "Cannot change status of a sent campaign" }, { status: 400 })
      }
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("email_campaigns").updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(user.id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      logger.warn("EmailMarketingAPI", "PUT /api/email-marketing/campaigns/[id]", "Campaign not found or unauthorized for update", { campaignId: id, userId: user.id })
      return NextResponse.json({ error: "Campaign not found or unauthorized" }, { status: 404 })
    }

    logger.info("EmailMarketingAPI", "PUT /api/email-marketing/campaigns/[id]", "Campaign updated successfully", { campaignId: id, userId: user.id, updatedFields: Object.keys(updateData) })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    logger.error("EmailMarketingAPI", "PUT /api/email-marketing/campaigns/[id]", "Failed to update campaign", { campaignId: params.id, error: (error as Error).message, stack: (error as Error).stack }, error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
