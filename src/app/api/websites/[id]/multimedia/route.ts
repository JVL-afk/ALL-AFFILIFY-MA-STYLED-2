import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

/**
 * PUT handler to update website multimedia data
 * Updates video scripts, voice preferences, and avatar selections
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: websiteId } = await params;
    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const userId = decoded.userId || decoded.id;

    // Parse request body
    const body = await request.json();
    const { videoScript, avatarId, voiceId } = body;

    // Connect to database
    const { db } = await connectToDatabase();

    // Update website with multimedia data
    const result = await db.collection('websites').findOneAndUpdate(
      {
        _id: new ObjectId(websiteId),
        userId: new ObjectId(userId),
      },
      {
        $set: {
          'multimedia.videoScript': videoScript,
          'multimedia.avatarId': avatarId,
          'multimedia.voiceId': voiceId,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      website: result,
    });
  } catch (error) {
    console.error('Error updating multimedia:', error);
    return NextResponse.json(
      {
        error: 'Failed to update multimedia',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler to retrieve website multimedia data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: websiteId } = await params;
    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const userId = decoded.userId || decoded.id;

    // Connect to database
    const { db } = await connectToDatabase();

    // Fetch website multimedia data
    const website = await db.collection('websites').findOne({
      _id: new ObjectId(websiteId),
      userId: new ObjectId(userId),
    });

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      multimedia: website.multimedia || {},
    });
  } catch (error) {
    console.error('Error fetching multimedia:', error);
    return NextResponse.json(
      { error: 'Failed to fetch multimedia' },
      { status: 500 }
    );
  }
}
