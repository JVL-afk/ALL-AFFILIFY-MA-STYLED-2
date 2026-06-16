import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { connectToDatabase } from '@/lib/mongodb';
import { TenantAwareDb } from '@/lib/tenant-aware-db';
import { MessageRatingSchema } from '@/lib/validation/chat-schemas';
import { logger } from '@/lib/production-logger';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  return requireAuth(req, async (_req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const sessionId = searchParams.get('sessionId');

      if (!sessionId) {
        return NextResponse.json({ success: false, error: 'Missing sessionId' }, { status: 400 });
      }

      const { db } = await connectToDatabase();
      const tenantDb = new TenantAwareDb(db, { userId: user.id, userPlan: (user.plan === 'basic' ? 'free' : user.plan) as 'free' | 'pro' | 'enterprise', role: (user.role || 'user') as 'user' | 'admin' });
      const messagesCol = tenantDb.collection('chat_messages');

      const messages = await messagesCol.find({ sessionId: new ObjectId(sessionId) });
      
      return NextResponse.json({
        success: true,
        messages: messages.map(m => ({
          id: m._id.toString(),
          type: m.type,
          content: m.content,
          timestamp: m.timestamp,
          rating: m.rating
        }))
      });
    } catch (error: any) {
      logger.error('Messages GET Error', { error: error.message });
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  });
}

export async function POST(req: NextRequest) {
  return requireAuth(req, async (_req, user) => {
    try {
      const body = await req.json();
      const validation = MessageRatingSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
      }

      const { messageId, rating } = validation.data;
      const { db } = await connectToDatabase();
      const tenantDb = new TenantAwareDb(db, { userId: user.id, userPlan: (user.plan === 'basic' ? 'free' : user.plan) as 'free' | 'pro' | 'enterprise', role: (user.role || 'user') as 'user' | 'admin' });
      const messagesCol = tenantDb.collection('chat_messages');

      await messagesCol.updateOne(
        { _id: new ObjectId(messageId) },
        { $set: { rating, ratedAt: new Date(), updatedAt: new Date() } }
      );

      return NextResponse.json({ success: true });
    } catch (error: any) {
      logger.error('Messages POST Error', { error: error.message });
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  });
}
