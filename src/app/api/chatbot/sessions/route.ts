import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { connectToDatabase } from '@/lib/mongodb';
import { TenantAwareDb } from '@/lib/tenant-aware-db';
import { SessionCreateSchema } from '@/lib/validation/chat-schemas';
import { logger } from '@/lib/production-logger';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  return requireAuth(req, async (_req, user) => {
    try {
      const { db } = await connectToDatabase();
      const tenantDb = new TenantAwareDb(db, { userId: user.id, userPlan: (user.plan === 'basic' ? 'free' : user.plan) as 'free' | 'pro' | 'enterprise', role: (user.role || 'user') as 'user' | 'admin' });
      const sessionsCol = tenantDb.collection('chat_sessions');

      const sessions = await sessionsCol.find({});
      
      return NextResponse.json({
        success: true,
        sessions: sessions.map(s => ({
          id: s._id.toString(),
          title: s.title,
          lastMessageAt: s.lastMessageAt,
          createdAt: s.createdAt
        }))
      });
    } catch (error: any) {
      logger.error('Sessions GET Error', { error: error.message });
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  });
}

export async function POST(req: NextRequest) {
  return requireAuth(req, async (_req, user) => {
    try {
      const body = await req.json();
      const validation = SessionCreateSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
      }

      const { db } = await connectToDatabase();
      const tenantDb = new TenantAwareDb(db, { userId: user.id, userPlan: (user.plan === 'basic' ? 'free' : user.plan) as 'free' | 'pro' | 'enterprise', role: (user.role || 'user') as 'user' | 'admin' });
      const sessionsCol = tenantDb.collection('chat_sessions');

      const sessionId = await sessionsCol.insertOne({
        title: validation.data.title || 'New Conversation',
        lastMessageAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        session: {
          id: sessionId.toString(),
          title: validation.data.title || 'New Conversation'
        }
      });
    } catch (error: any) {
      logger.error('Sessions POST Error', { error: error.message });
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  });
}
