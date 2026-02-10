
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const user = authResult.user as any
    const { name, subject, type } = await request.json()
    
    const { db } = await connectToDatabase()
    const result = await db.collection('email_campaigns').insertOne({
      userId: new ObjectId(user.id),
      name,
      subject,
      type,
      status: 'draft',
      recipients: 0,
      openRate: 0,
      clickRate: 0,
      revenue: 0,
      conversions: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
