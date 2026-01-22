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
  Zap,
  Shield,
  Infinity,
  Target,
  Briefcase,
  Feather, // New: Content Studio Icon
  Search, // New: SEO Auditor Icon
  Brain // New: Ideation Lab Icon
} from 'lucide-react'
import Link from 'next/link'

export default function EnterpriseDashboard() {
  const [stats, setStats] = useState({
    websites: 23,
    totalViews: 284750,
    totalClicks: 18947,
    conversionRate: 6.7,
    revenue: 47892,
    teamMembers: 8,
    activeTests: 12
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Dashboard</h1>
            <p className="text-gray-700">Complete affiliate marketing command center</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-blue-600 text-gray-900">
              <Crown className="w-3 h-3 mr-1" />
              Enterprise Plan
            </Badge>
            <Button asChild className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
              <Link href="/dashboard/team-collaboration">
                <Users className="w-4 h-4 mr-2" />
                Manage Team
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Websites</CardTitle>
              <Infinity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.websites}</div>
              <p className="text-xs text-gray-400">Unlimited</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalViews?.toLocaleString() || "0"}</div>
              <p className="text-xs text-gray-400">+24% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalClicks?.toLocaleString() || "0"}</div>
              <p className="text-xs text-gray-400">+19% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Conversion</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</div>
              <p className="text-xs text-gray-400">+0.8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${stats.revenue?.toLocaleString() || "0"}</div>
              <p className="text-xs text-gray-400">+31% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Team</CardTitle>
              <Users className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.teamMembers}</div>
              <p className="text-xs text-gray-400">Active members</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">A/B Tests</CardTitle>
              <TestTube className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.activeTests}</div>
              <p className="text-xs text-gray-400">Running tests</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Website Management</CardTitle>
              <CardDescription className="text-gray-700">
                Enterprise-level creation & management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/dashboard/create-website/enterprise">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Website
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/my-websites">
                  <Globe className="w-4 h-4 mr-2" />
                  Manage All Sites
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
              <CardTitle className="text-gray-900">Analytics & Testing</CardTitle>
              <CardDescription className="text-gray-700">
                Advanced insights & optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/advanced-analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Advanced Analytics
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/ab-testing">
                  <TestTube className="w-4 h-4 mr-2" />
                  A/B Testing Suite
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Team & Collaboration</CardTitle>
              <CardDescription className="text-gray-700">
                Manage your team & workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/team-collaboration">
                  <Users className="w-4 h-4 mr-2" />
                  Team Management
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/api-management">
                  <Zap className="w-4 h-4 mr-2" />
                  API Management
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Enterprise Features</CardTitle>
              <CardDescription className="text-gray-700">
                White-label & custom solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/custom-integrations">
                  <Shield className="w-4 h-4 mr-2" />
                  White-label Setup
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/advanced-reporting">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Custom Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Content Brain Features */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Affiliate Content Brain</CardTitle>
              <CardDescription className="text-gray-700">
                Ghostwriter OS integrated for content mastery.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-gray-900">
                <Link href="/dashboard/content-studio">
                  <Feather className="w-4 h-4 mr-2" />
                  Content Studio
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/seo-auditor">
                  <Search className="w-4 h-4 mr-2" />
                  SEO Auditor & Lab
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                <Link href="/dashboard/ideation-lab">
                  <Brain className="w-4 h-4 mr-2" />
                  Campaign Ideation Lab
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Team Activity Feed</CardTitle>
              <CardDescription className="text-gray-700">
                Real-time updates from your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-5 rounded-lg">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <p className="text-gray-900"><span className="font-medium">Alice</span> deployed a new website: <span className="font-medium">"Top 10 Gadgets"</span></p>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-5 rounded-lg">
                  <TestTube className="w-5 h-5 text-pink-400" />
                  <p className="text-gray-900"><span className="font-medium">Bob</span> started an A/B test on <span className="font-medium">"Best Coffee Makers"</span></p>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-5 rounded-lg">
                  <Briefcase className="w-5 h-5 text-yellow-400" />
                  <p className="text-gray-900"><span className="font-medium">Charlie</span> generated a Q3 Revenue Report</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">API Usage</CardTitle>
              <CardDescription className="text-gray-700">
                Monitor your custom API key usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for a chart */}
              <div className="h-64 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-10 rounded-lg flex items-center justify-center">
                <Zap className="w-16 h-16 text-gray-700" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
