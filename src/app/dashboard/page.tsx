import { redirect } from 'next/navigation';
import { verifyAuth, AuthenticatedUser } from '@/lib/auth';
import { NextRequest } from 'next/server';

// This is a Server Component, but we need to create a mock NextRequest
// to pass to verifyAuth, which expects a NextRequest object.
// In a real Next.js App Router environment, this is usually handled by a middleware or a route handler,
// but for a page component, we can construct a request object.
// However, the cleanest way is to pass the request object if it were available,
// but since it's not directly available in a Server Component page, we must rely on the cookies
// being available in the header context.

// The `verifyAuth` function in `src/lib/auth.ts` takes a NextRequest.
// We can't directly get the request object in a Server Component in the same way as a Route Handler.
// The `cookies()` function from `next/headers` is the correct way to access the request context.

import { cookies } from 'next/headers';

export default async function DashboardPage() {
  // Create a mock NextRequest object to pass to verifyAuth
  // This is a common pattern to adapt utility functions written for Route Handlers
  // to work in Server Components.
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  
  // Create a minimal mock request object that verifyAuth can use
  const mockRequest = {
    cookies: {
      get: (name: string) => token,
    },
  } as unknown as NextRequest;

  const authResult = await verifyAuth(mockRequest);

  if (!authResult.success || !authResult.user) {
    // Redirect to login if not authenticated
    redirect('/login');
  }

  const user = authResult.user as AuthenticatedUser;

  // CRITICAL FIX: Redirect based on plan
  const userPlan = user.plan.toLowerCase();
  
  if (userPlan === 'basic') {
    redirect('/dashboard/basic');
  } else if (userPlan === 'pro') {
    redirect('/dashboard/pro');
  } else if (userPlan === 'enterprise') {
    redirect('/dashboard/enterprise');
  }

  // Fallback to basic if plan is undefined or unknown
  redirect('/dashboard/basic');
}
