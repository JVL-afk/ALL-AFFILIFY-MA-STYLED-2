
import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, parseToken, getUserById } from '@/lib/auth-edge';

// This is a placeholder for a database call to get user-specific data
// In a real application, you would fetch this from your database
const getUserDataFromDB = async (userId: string) => {
  // Simulate fetching user data
  // In a real app, this would query your MongoDB or other database
  // For now, we'll return static data or mock data based on userId
  if (userId === 'mock-user-basic') {
    return {
      websiteCount: 0, // User has 0 websites
      plan: 'basic',
      maxWebsites: 3,
    };
  } else if (userId === 'mock-user-pro') {
    return {
      websiteCount: 5, // User has 5 websites
      plan: 'pro',
      maxWebsites: 10,
    };
  } else if (userId === 'mock-user-enterprise') {
    return {
      websiteCount: 15, // User has 15 websites
      plan: 'enterprise',
      maxWebsites: Infinity,
    };
  } else {
    // Default for unmocked users or if userId doesn't match mocks
    const user = await getUserById(userId);
    if (user) {
      return {
        websiteCount: user.websitesCreated || 0,
        plan: user.plan || 'basic',
        maxWebsites: user.websiteLimit || 3, // Assuming default limit if not set
      };
    }
    return {
      websiteCount: 0,
      plan: 'basic',
      maxWebsites: 3,
    };
  }
};

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const decodedToken = parseToken(token);
    if (!decodedToken || !decodedToken.userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.userId;
    const userData = await getUserDataFromDB(userId);

    if (!userData) {
      return NextResponse.json({ message: 'User data not found' }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

