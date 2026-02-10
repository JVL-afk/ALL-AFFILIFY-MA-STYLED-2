
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscribers } = await req.json();

    if (!Array.isArray(subscribers) || subscribers.length === 0) {
      return NextResponse.json({ error: 'No subscribers provided' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const userId = session.user.id;

    const formattedSubscribers = subscribers.map((sub: any) => ({
      userId: new ObjectId(userId),
      email: sub.email,
      name: sub.name || '',
      status: 'active',
      joinedDate: new Date(),
      tags: sub.tags || ['imported'],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Use bulkWrite for efficiency
    const result = await db.collection('email_subscribers').insertMany(formattedSubscribers);

    return NextResponse.json({ 
      success: true, 
      count: result.insertedCount,
      message: `Successfully imported ${result.insertedCount} subscribers`
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
