'use client'

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Use client-side session hook

export default function DashboardPage() {
  // Since this page is client-side and only handles redirecting, 
  // we need to fetch the session client-side.
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session || !session.user) {
    // This should ideally be handled by middleware, but as a fallback
    redirect('/login');
  }

  // CRITICAL FIX: Redirect based on plan
  const userPlan = session.user.plan.toLowerCase();
  
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


