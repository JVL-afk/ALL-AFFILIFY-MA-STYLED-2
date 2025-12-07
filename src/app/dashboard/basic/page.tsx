'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from 'next-auth/react' // Assuming a client-side session context is available for user info
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  BarChart3, 
  Crown,
  Plus,
  Settings,
  TrendingUp,
  Users,
  Eye,
  MousePointer
} from 'lucide-react'
import Link from 'next/link'


interface DashboardStats {
  websiteCount: number;
  websiteLimit: number;
  totalViews: number;
  totalClicks: number;
  totalRevenue: number;
  conversionRate: string;
  recentWebsites: any[];
}

export default function BasicDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Assuming the user object is available via a client-side context (e.g., useSession)
  // Since the user is authenticated, we can rely on a dedicated API route for data.
  
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const data = await response.json();
      setStats({
        websiteCount: data.websites.total,
        websiteLimit: 3, // Basic plan limit is 3
        totalViews: data.performance.totalViews,
        totalClicks: data.performance.totalClicks,
        totalRevenue: data.performance.totalRevenue,
        conversionRate: data.performance.conversionRate,
        recentWebsites: data.recent.websites,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // CRITICAL FIX: Set to zero/null data instead of mock data on failure
      setStats({
        websiteCount: 0,
        websiteLimit: 3,
        totalViews: 0,
        totalClicks: 0,
        totalRevenue: 0,
        conversionRate: '0.00',
        recentWebsites: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Basic Dashboard</h1>
            <p className="text-gray-700">Manage your affiliate marketing websites</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-gray-700 text-gray-900">
              Basic Plan
            </Badge>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/pricing">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Websites</CardTitle>
              <Globe className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.websiteCount}/{stats.websiteLimit}</div>
              <p className="text-xs text-gray-400">
                {stats.websiteLimit - stats.websiteCount} remaining
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalViews?.toLocaleString() || "0"}</div>
              <p className="text-xs text-gray-400">
                {/* Removed mock data for monthly change */}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalClicks?.toLocaleString() || "0"}</div>
              <p className="text-xs text-gray-400">
                {/* Removed mock data for monthly change */}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</div>
              <p className="text-xs text-gray-400">
                {/* Removed mock data for monthly change */}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
              <CardDescription className="text-gray-700">
                Get started with your affiliate marketing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/dashboard/create-website/basic">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Website
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/my-websites">
                  <Globe className="w-4 h-4 mr-2" />
                  Manage Websites
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/analyze-website">
                  <BarChart3 className="w-4 h-4 mr-2" />
                    Basic Analytics
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="https://discord.gg/cdePwUQB" target="_blank" rel="noopener noreferrer">
                  <Users className="w-4 h-4 mr-2" />
                  Join Discord Server
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Upgrade Benefits</CardTitle>
              <CardDescription className="text-gray-700">
                Unlock more features with Pro plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                <span>10 websites (vs 3 current)</span>
              </div>
              <div className="flex items-center text-gray-700">
                <BarChart3 className="w-4 h-4 mr-2 text-blue-400" />
                <span>Advanced analytics</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Globe className="w-4 h-4 mr-2 text-green-400" />
                <span>Custom domains</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Settings className="w-4 h-4 mr-2 text-purple-400" />
                <span>Priority support</span>
              </div>
              <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mt-4">
                <Link href="/pricing">
                  Upgrade to Pro - $29/month
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Activity</CardTitle>
            <CardDescription className="text-gray-700">
              Your latest affiliate marketing activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentWebsites.length > 0 ? (
                stats.recentWebsites.map((website) => (
                  <div key={website.id} className="flex items-center justify-between p-3 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-gray-900 font-medium">{website.title}</p>
                        <p className="text-gray-400 text-sm">Created {new Date(website.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={website.status === 'published' ? 'bg-green-600 text-gray-900' : 'bg-yellow-600 text-gray-900'}>{website.status}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Create your first website to see activity</p>
                  <Button asChild className="mt-4 bg-purple-600 hover:bg-purple-700">
                    <Link href="/dashboard/create-website/basic">
                      Create Website
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
