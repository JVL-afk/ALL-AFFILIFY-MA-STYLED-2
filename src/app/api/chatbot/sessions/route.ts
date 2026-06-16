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
      const tenantDb = new TenantAwareDb(db, {
        userId: user.id,
        userPlan: (user.plan === 'basic' ? 'free' : user.plan) as 'free' | 'pro' | 'enterprise',
        role: (user.role || 'user') as 'user' | 'admin',
      });
      const sessionsCol = tenantDb.collection('chat_sessions');

      // find() returns T[] (array) per TenantAwareCollection signature
      const sessions = await sessionsCol.find({});

      sessions.sort((a: any, b: any) =>
        new Date(b.lastMessageAt || b.createdAt || 0).getTime() -
        new Date(a.lastMessageAt || a.createdAt || 0).getTime()
      );

      return NextResponse.json({
        success: true,
        sessions: sessions.map((s: any) => ({
          id: s._id.toString(),
          title: s.title || 'New Conversation',
          lastMessage: s.lastMessage || '',
          messageCount: s.messageCount || 0,
          lastMessageAt: s.lastMessageAt,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt || s.lastMessageAt,
        })),
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
      const tenantDb = new TenantAwareDb(db, {
        userId: user.id,
        userPlan: (user.plan === 'basic' ? 'free' : user.plan) as 'free' | 'pro' | 'enterprise',
        role: (user.role || 'user') as 'user' | 'admin',
      });
      const sessionsCol = tenantDb.collection('chat_sessions');

      const now = new Date();
      // insertOne returns ObjectId
      const insertedId: ObjectId = await sessionsCol.insertOne({
        title: validation.data.title || 'New Conversation',
        lastMessage: '',
        messageCount: 0,
        createdAt: now,
        lastMessageAt: now,
        updatedAt: now,
      } as any);

      return NextResponse.json({
        success: true,
        session: {
          id: insertedId.toString(),
          title: validation.data.title || 'New Conversation',
          lastMessage: '',
          messageCount: 0,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      });
    } catch (error: any) {
      logger.error('Sessions POST Error', { error: error.message });
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  });
}

export async function DELETE(req: NextRequest) {
  return requireAuth(req, async (_req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const sessionId = searchParams.get('sessionId');

      if (!sessionId) {
        return NextResponse.json({ success: false, error: 'Missing sessionId' }, { status: 400 });
      }

      const { db } = await connectToDatabase();
      const tenantDb = new TenantAwareDb(db, {
        userId: user.id,
        userPlan: (user.plan === 'basic' ? 'free' : user.plan) as 'free' | 'pro' | 'enterprise',
        role: (user.role || 'user') as 'user' | 'admin',
      });

      const sessionsCol = tenantDb.collection('chat_sessions');
      // Delete the session (TenantAwareCollection.deleteOne scopes by userId automatically)
      await sessionsCol.deleteOne({ _id: new ObjectId(sessionId) } as any);

      // For messages cascade delete: use raw db directly (messages are scoped by sessionId, not userId directly)
      // We use the underlying raw collection here since TenantAwareCollection has no deleteMany
      await db.collection('chat_messages').deleteMany({
        sessionId: new ObjectId(sessionId),
      });

      return NextResponse.json({ success: true });
    } catch (error: any) {
      logger.error('Sessions DELETE Error', { error: error.message });
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  });
}
