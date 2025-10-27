'use client'

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  plan: string;
  websiteCount: number;
  createdAt: string;
  lastLoginAt: string;
}

interface Stats {
  totalClicks: number;
  totalRevenue: number;
  // totalWebsiteGenerations, totalConversions, conversionRate are now deprecated
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
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

// The rest of the original DashboardPage component is now moved to a new file, e.g., DashboardContent.tsx, 
// but for the sake of a fast fix, we just need to implement the redirect.
// We will create the plan-specific pages later. For now, this fixes the immediate routing bug.

// The original content of this page will be moved to /dashboard/basic/page.tsx
// For now, we will comment out the original content to prevent errors.

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 flex items-center justify-center">
      <div className="text-gray-900 text-xl">Redirecting...</div>
    </div>
  );
}

// Below is the original content which will be moved to /dashboard/basic/page.tsx
/*
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
        setStats(data.stats);
      } else {
        // Use mock data for demo
        setUserInfo({
          id: '1',
          email: 'demo@affilify.com',
          name: 'Demo User',
          plan: 'Pro',
          websiteCount: 5,
          createdAt: '2024-01-01',
          lastLoginAt: new Date().toISOString()
        });
        setStats({
          totalClicks: 2847,
          totalRevenue: 1250.75,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use mock data for demo
      setUserInfo({
        id: '1',
        email: 'demo@affilify.com',
        name: 'Demo User',
        plan: 'Pro',
        websiteCount: 5,
        createdAt: '2024-01-01',
        lastLoginAt: new Date().toISOString()
      });
        setStats({
          totalClicks: 2847,
          totalRevenue: 1250.75,
        });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      {/* Navbar */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-lg">⚡</span>
                </div>
                <span className="text-gray-900 text-xl font-bold">AFFILIFY</span>
              </Link>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {userInfo?.name}</span>
              <span className="bg-orange-600 text-gray-900 px-3 py-1 rounded-full text-sm">{userInfo?.plan} Plan</span>
              <Link href="/api/auth/logout" className="text-gray-700 hover:text-gray-900">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Your Affiliate Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto">
            Manage your{' '}
            <span className="text-blue-400 font-semibold">AI-powered websites</span> and track your{' '}
            <span className="text-green-400 font-semibold">performance metrics</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-30 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats?.websiteCount}</div>
            <div className="text-gray-700">Websites Created</div>
          </div>
          <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-30 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats?.totalClicks?.toLocaleString() || "0"}</div>
            <div className="text-gray-700">Total Clicks</div>
          </div>
          <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-30 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">${(stats?.totalRevenue?.toFixed(2) || "00.00")}</div>
            <div className="text-gray-700">Revenue Generated</div>
          </div>
          <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-30 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats?.conversionRate}</div>
            <div className="text-gray-700">Conversion Rate</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Create Website */}
          <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-30 text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Website</h3>
            <p className="text-gray-700 mb-6">
              Generate a professional affiliate website with AI-powered content and design.
            </p>
            <Link href="/dashboard/create-website">
              <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-gray-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-110">
                Create Website
              </button>
            </Link>
          </div>

          {/* Analyze Website */}
          <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-30 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Analyze Website</h3>
            <p className="text-gray-700 mb-6">
              Get detailed insights and optimization recommendations for any website.
            </p>
            <Link href="/dashboard/analyze-website">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-gray-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-110">
                Analyze Website
              </button>
            </Link>
          </div>

          {/* My Websites */}
          <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-30 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">My Websites</h3>
            <p className="text-gray-700 mb-6">
              View and manage all your created affiliate websites in one place.
            </p>
            <Link href="/dashboard/my-websites">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-gray-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-110">
                View Websites
              </button>
            </Link>
          </div>
        </div>

        {/* Plan-specific Features */}
        {userInfo?.plan !== 'Basic' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Advanced Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/dashboard/advanced-analytics" className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-white border-opacity-30 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-15 transition-all">
                <h3 className="text-lg font-bold text-gray-900 mb-2">📈 Advanced Analytics</h3>
                <p className="text-gray-700 text-sm">Deep insights into your website performance</p>
              </Link>
              <Link href="/dashboard/reviews" className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-white border-opacity-30 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-15 transition-all">
                <h3 className="text-lg font-bold text-gray-900 mb-2">⭐ Reviews Management</h3>
                <p className="text-gray-700 text-sm">Manage and display customer reviews</p>
              </Link>
              <Link href="/dashboard/ab-testing" className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-white border-opacity-30 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-15 transition-all">
                <h3 className="text-lg font-bold text-gray-900 mb-2">🧪 A/B Testing</h3>
                <p className="text-gray-700 text-sm">Optimize your conversion rates</p>
              </Link>
            </div>
          </div>
        )}

        {/* Upgrade CTA for Basic Plan */}
        {userInfo?.plan === 'Basic' && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-30 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlock More Features</h2>
              <p className="text-gray-700 mb-6">
                Upgrade to Pro or Enterprise to access advanced analytics, A/B testing, and more!
              </p>
              <Link href="/pricing">
                <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-gray-900 font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-110">
                  Upgrade Now
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
