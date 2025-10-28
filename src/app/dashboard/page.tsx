import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.plan) {
    // Redirect to login if not authenticated or plan is missing
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

// The original content of the dashboard page has been moved to plan-specific pages.
// This page now only serves as a plan-based router.
