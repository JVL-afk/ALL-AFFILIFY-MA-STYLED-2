import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request)
  if (!authResult.success) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const user = authResult.user!
  const { db } = await connectToDatabase()

  try {
    const dna = await db.collection('campaign_dna').findOne({ userId: user._id })
    
    if (!dna) {
      // Return a clean empty DNA instead of mock data
      return NextResponse.json({
        userId: user._id,
        brandVoice: 'expert',
        targetAudience: '',
        uniqueSellingProposition: '',
        promotedProductId: '',
        productName: '',
        productUVP: '',
        productPainPoints: [],
        deepScrapeData: {},
        primaryKeywords: [],
        secondaryKeywords: [],
        competitorAnalysisSummary: '',
        contentHistoryIds: [],
        performanceMetrics: {}
      })
    }

    return NextResponse.json(dna)
  } catch (error) {
    console.error('Error fetching DNA:', error)
    return NextResponse.json({ error: 'Failed to fetch DNA' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request)
  if (!authResult.success) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const user = authResult.user!
  const { db } = await connectToDatabase()

  try {
    const body = await request.json()
    const { _id, ...dnaData } = body

    const result = await db.collection('campaign_dna').updateOne(
      { userId: user._id },
      { 
        $set: { 
          ...dnaData,
          userId: user._id,
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true, message: 'DNA saved successfully' })
  } catch (error) {
    console.error('Error saving DNA:', error)
    return NextResponse.json({ error: 'Failed to save DNA' }, { status: 500 })
  }
}
