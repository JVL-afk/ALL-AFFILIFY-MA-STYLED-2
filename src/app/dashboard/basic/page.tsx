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
  MousePointer
} from 'lucide-react'
import Link from 'next/link'

export default function BasicDashboard() {
  const [stats, setStats] = useState({
    websites: 1,
    maxWebsites: 3,
    totalViews: 1247,
    totalClicks: 89,
    conversionRate: 7.1
  })

  return (
    <div className="min-h-screen bg-orange-500">
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
          <Card className="bg-orange-500 bg-opacity-20 border-white border-opacity-30">
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

          <Card className="bg-orange-500 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalViews?.toLocaleString() || "0"}</div>
              <p className="text-xs text-gray-400">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-orange-500 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalClicks}</div>
              <p className="text-xs text-gray-400">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-orange-500 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</div>
              <p className="text-xs text-gray-400">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-orange-500 bg-opacity-20 border-white border-opacity-30">
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
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-orange-500 bg-opacity-20">
                <Link href="/dashboard/my-websites">
                  <Globe className="w-4 h-4 mr-2" />
                  Manage Websites
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-orange-500 bg-opacity-20">
                <Link href="/dashboard/analyze-website">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Basic Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-orange-500 bg-opacity-20 border-white border-opacity-30">
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
        <Card className="bg-orange-500 bg-opacity-20 border-white border-opacity-30">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Activity</CardTitle>
            <CardDescription className="text-gray-700">
              Your latest affiliate marketing activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-500 bg-opacity-5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-gray-900 font-medium">Basketball Hoop Website</p>
                    <p className="text-gray-400 text-sm">Created 2 days ago</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-600 text-gray-900">Active</Badge>
              </div>
              
              <div className="text-center py-8">
                <p className="text-gray-400">Create more websites to see additional activity</p>
                <Button asChild className="mt-4 bg-purple-600 hover:bg-purple-700">
                  <Link href="/dashboard/create-website/basic">
                    Create Website
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

