
import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const user = authResult.user as any
    const { db } = await connectToDatabase()
    
    await db.collection('email_campaigns').deleteOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(user.id)
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
