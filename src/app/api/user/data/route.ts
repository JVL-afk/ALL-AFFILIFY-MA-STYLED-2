
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-edge'; // Assuming verifyAuth is available for Edge Runtime

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
    return {
      websiteCount: 0,
      plan: 'basic',
      maxWebsites: 3,
    };
  }
};

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req); // Use verifyAuth to get user ID

    if (!authResult.isValid || !authResult.payload?.userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const userId = authResult.payload.userId;
    const userData = await getUserDataFromDB(userId);

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

