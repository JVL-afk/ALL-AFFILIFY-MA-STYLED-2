import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware'; // Use the correct middleware
import { AuthenticatedUser } from '@/lib/types';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Best-in-Class: Dedicated API to fetch all user websites for the "My Websites" dashboard
export const GET = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const client = await clientPromise;
    const db = client.db('affilify');
    const websitesCollection = db.collection('websites');

    // CRITICAL FIX: Ensure the query uses the user's ObjectId for filtering
    // The user._id is a string representation of the ObjectId from the AuthenticatedUser object
    const websites = await websitesCollection.find({ userId: new ObjectId(user._id) }).toArray();

    // Best-in-Class: Map to a clean structure for the frontend
    const cleanWebsites = websites.map(website => ({
        id: website._id.toHexString(),
        title: website.title,
        description: website.description,
        template: website.template,
        status: website.status,
        url: website.url,
        views: website.views || 0,
        clicks: website.clicks || 0,
        conversions: website.conversions || 0,
        revenue: website.revenue || 0,
        createdAt: website.createdAt,
        updatedAt: website.updatedAt
    }));

    return NextResponse.json({
      success: true,
      websites: cleanWebsites,
    });
  } catch (error) {
    console.error('GET /api/websites error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve websites. Institutional-grade error occurred.' },
      { status: 500 }
    );
  }
});

// POST is for creating a website, which is typically handled by /api/websites/create/route.ts
// We will keep this route strictly for retrieval to simplify architecture.
export const POST = (request: NextRequest) => {
    return NextResponse.json({ error: 'Use /api/websites/create for website creation.' }, { status: 405 });
};
