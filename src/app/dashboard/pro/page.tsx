'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  MousePointer,
  TestTube,
  MessageSquare,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function ProDashboard() {
  const [stats, setStats] = useState({
    websites: 4,
    maxWebsites: 10,
    totalViews: 15847,
    totalClicks: 1289,
    conversionRate: 8.1,
    revenue: 2847
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pro Dashboard</h1>
            <p className="text-gray-700">Advanced affiliate marketing management</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-purple-600 text-gray-900">
              <Crown className="w-3 h-3 mr-1" />
              Pro Plan
            </Badge>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/pricing">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Enterprise
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Websites</CardTitle>
              <Globe className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.websites}/{stats.maxWebsites}</div>
              <p className="text-xs text-gray-400">
                {stats.maxWebsites - stats.websites} remaining
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
                +18% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalClicks}</div>
              <p className="text-xs text-gray-400">
                +15% from last month
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
                +1.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${stats.revenue}</div>
              <p className="text-xs text-gray-400">
                +22% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
              <CardDescription className="text-gray-700">
                Pro-level website management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/dashboard/create-website/pro">
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
                <Link href="/dashboard/advanced-analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Advanced Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Pro Features</CardTitle>
              <CardDescription className="text-gray-700">
                Advanced tools at your disposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/ab-testing">
                  <TestTube className="w-4 h-4 mr-2" />
                  A/B Testing
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/analyze-website">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Website Analysis
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/reviews">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reviews Management
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Enterprise Benefits</CardTitle>
              <CardDescription className="text-gray-700">
                Unlock unlimited potential
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Globe className="w-4 h-4 mr-2 text-blue-400" />
                <span>Unlimited websites</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Users className="w-4 h-4 mr-2 text-green-400" />
                <span>Team collaboration</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                <span>API access</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Settings className="w-4 h-4 mr-2 text-purple-400" />
                <span>White-label options</span>
              </div>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-4">
                <Link href="/pricing">
                  Upgrade to Enterprise - $99/month
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Activity</CardTitle>
              <CardDescription className="text-gray-700">
                Your latest affiliate marketing activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-gray-900 font-medium">Gaming Laptop Review</p>
                      <p className="text-gray-400 text-sm">Created 1 day ago</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-600 text-gray-900">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TestTube className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-gray-900 font-medium">A/B Test: CTA Button</p>
                      <p className="text-gray-400 text-sm">Started 3 days ago</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-orange-600 text-gray-900">Running</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-gray-900 font-medium">Analytics Report</p>
                      <p className="text-gray-400 text-sm">Generated 1 week ago</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-600 text-gray-900">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Performance Insights</CardTitle>
              <CardDescription className="text-gray-700">
                AI-powered recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
                  <h4 className="text-green-400 font-medium mb-2">🎯 Optimization Tip</h4>
                  <p className="text-gray-700 text-sm">Your "Gaming Laptop" page has 15% higher conversion. Consider creating similar content.</p>
                </div>
                
                <div className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                  <h4 className="text-blue-400 font-medium mb-2">📊 Traffic Insight</h4>
                  <p className="text-gray-700 text-sm">Mobile traffic increased 28% this month. Optimize for mobile experience.</p>
                </div>

                <div className="p-4 bg-purple-600/20 border border-purple-600/30 rounded-lg">
                  <h4 className="text-purple-400 font-medium mb-2">🚀 Growth Opportunity</h4>
                  <p className="text-gray-700 text-sm">You're using 4/10 websites. Create 2 more to maximize your Pro plan benefits.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

