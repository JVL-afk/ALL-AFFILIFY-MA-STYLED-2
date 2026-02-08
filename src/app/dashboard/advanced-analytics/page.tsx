'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  MousePointer, 
  Eye, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw,
  BarChart3,
  Activity,
  Target,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUp,
  ArrowDown,
  Percent,
  Zap,
  Award,
  TrendingDown as TrendDown,
  ChevronRight,
  Info,
  Star,
  ShoppingCart,
  CreditCard,
  UserCheck,
  MessageCircle
} from 'lucide-react'

interface AnalyticsData {
  revenue: { month: string; amount: number; }[]
  traffic: { date: string; visitors: number; pageViews: number; }[]
  conversions: { source: string; conversions: number; rate: number; }[]
  demographics: { age: string; percentage: number; }[]
  devices: { device: string; users: number; }[]
  topPages: { page: string; views: number; bounceRate: number; }[]
}

interface MetricCard {
  title: string
  value: string
  change: number
  icon: any
  color: string
}

export default function AdvancedAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [metrics, setMetrics] = useState<MetricCard[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/analytics/advanced')
      if (response.ok) {
        const result = await response.json()
        
        // If no data available, use empty arrays
        const mockData: AnalyticsData = {
        revenue: result.data.revenue || [],
        traffic: result.data.traffic || [],
        conversions: result.data.conversions || [],
        demographics: result.data.demographics || [],
        devices: result.data.devices || [],
        topPages: result.data.topPages || [],
      }
      
      setAnalyticsData(mockData)
      
      // Set metrics from API response
      if (result.data.metrics) {
        const iconMap: any = {
          'DollarSign': DollarSign,
          'Users': Users,
          'Target': Target,
          'Eye': Eye,
          'Clock': Clock,
          'Activity': Activity
        }
        
        const metricsWithIcons = result.data.metrics.map((m: any) => ({
          ...m,
          icon: iconMap[m.icon] || DollarSign
        }))
        
        setMetrics(metricsWithIcons)
      }
      } else {
        // If API fails, set empty data
        setAnalyticsData({
          revenue: [],
          traffic: [],
          conversions: [],
          demographics: [],
          devices: [],
          topPages: []
        })
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200 text-lg">Loading Advanced Analytics...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
                    Advanced Analytics
                  </h1>
                  <p className="text-blue-200/70 text-sm">Comprehensive insights into your affiliate performance</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button 
                variant="outline" 
                onClick={fetchAnalyticsData}
                className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            const isPositive = metric.change >= 0

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30 hover:border-purple-500/50 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-medium text-blue-200/70">{metric.title}</CardTitle>
                      <div className={`w-8 h-8 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                    <div className={`flex items-center text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      <span>{Math.abs(metric.change)}% vs last period</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Revenue Trend - Large Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-xl flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span>Revenue Trend</span>
                  </CardTitle>
                  <CardDescription className="text-blue-200/60">Monthly revenue performance over the last 6 months</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-300 border border-blue-500/30">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +12.5% Growth
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={analyticsData?.revenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value) => [`$${value}`, 'Revenue']} 
                  />
                  <Area type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Traffic & Device Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span>Traffic Overview</span>
                </CardTitle>
                <CardDescription className="text-purple-200/60">Daily visitors and page views</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData?.traffic}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="visitors" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} />
                    <Line type="monotone" dataKey="pageViews" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-purple-200">Visitors</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-200">Page Views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Device Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-blue-400" />
                  <span>Device Distribution</span>
                </CardTitle>
                <CardDescription className="text-blue-200/60">User distribution by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData?.devices}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, users }: any) => {
                        const total = analyticsData?.devices.reduce((sum, d) => sum + d.users, 0) || 1
                        const percentage = ((users / total) * 100).toFixed(1)
                        return `${device}: ${percentage}%`
                      }}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="users"
                    >
                      {analyticsData?.devices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {analyticsData?.devices.map((device, index) => {
                    const Icon = device.device === 'Desktop' ? Monitor : device.device === 'Mobile' ? Smartphone : Tablet
                    return (
                      <div key={index} className="flex flex-col items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                        <Icon className="w-6 h-6 text-blue-400 mb-2" />
                        <span className="text-white font-semibold">{device.users.toLocaleString()}</span>
                        <span className="text-xs text-blue-200/60">{device.device}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Conversion Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span>Conversion Sources</span>
              </CardTitle>
              <CardDescription className="text-purple-200/60">Performance breakdown by traffic source</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={analyticsData?.conversions}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="source" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Bar dataKey="conversions" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                {analyticsData?.conversions.map((source, index) => (
                  <div key={index} className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <div className="text-xs text-purple-200/70 mb-1">{source.source}</div>
                    <div className="text-lg font-bold text-white">{source.conversions}</div>
                    <div className="text-xs text-purple-300 flex items-center">
                      <Percent className="w-3 h-3 mr-1" />
                      {source.rate}% rate
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demographics & Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Demographics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Age Demographics</span>
                </CardTitle>
                <CardDescription className="text-blue-200/60">Audience age distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData?.demographics.map((demo, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-200">{demo.age} years</span>
                        <span className="text-sm font-semibold text-white">{demo.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${demo.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span>Quick Insights</span>
                </CardTitle>
                <CardDescription className="text-purple-200/60">Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-purple-200/70">Avg. Order Value</div>
                        <div className="text-xl font-bold text-white">$127.50</div>
                      </div>
                    </div>
                    <div className="text-green-400 flex items-center text-sm">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      8.3%
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-blue-200/70">Total Transactions</div>
                        <div className="text-xl font-bold text-white">1,467</div>
                      </div>
                    </div>
                    <div className="text-green-400 flex items-center text-sm">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      12.1%
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-purple-200/70">Return Visitors</div>
                        <div className="text-xl font-bold text-white">38.2%</div>
                      </div>
                    </div>
                    <div className="text-green-400 flex items-center text-sm">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      4.7%
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-blue-200/70">Customer Satisfaction</div>
                        <div className="text-xl font-bold text-white">4.8/5.0</div>
                      </div>
                    </div>
                    <div className="text-green-400 flex items-center text-sm">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      0.3
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Performing Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-400" />
                <span>Top Performing Pages</span>
              </CardTitle>
              <CardDescription className="text-blue-200/60">Pages with highest traffic and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData?.topPages.map((page, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{page.page}</h4>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-blue-200/70 flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {page.views?.toLocaleString() || "0"} views
                          </span>
                          <span className={`flex items-center ${page.bounceRate < 30 ? 'text-green-400' : page.bounceRate < 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                            <Activity className="w-4 h-4 mr-1" />
                            {page.bounceRate}% bounce
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-blue-400" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real-Time Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <span>Real-Time Activity</span>
              </CardTitle>
              <CardDescription className="text-purple-200/60">Live visitor actions and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">New purchase from New York, USA</div>
                    <div className="text-xs text-green-200/60">Wireless Headphones - $89.99</div>
                  </div>
                  <div className="text-xs text-green-300">Just now</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">New visitor from London, UK</div>
                    <div className="text-xs text-blue-200/60">Viewing: Smartphone Cases</div>
                  </div>
                  <div className="text-xs text-blue-300">2m ago</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Email signup from Tokyo, Japan</div>
                    <div className="text-xs text-purple-200/60">Newsletter subscription</div>
                  </div>
                  <div className="text-xs text-purple-300">5m ago</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">New purchase from Sydney, Australia</div>
                    <div className="text-xs text-green-200/60">Laptop Stand - $49.99</div>
                  </div>
                  <div className="text-xs text-green-300">7m ago</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm">Cart addition from Berlin, Germany</div>
                    <div className="text-xs text-blue-200/60">Bluetooth Speaker added to cart</div>
                  </div>
                  <div className="text-xs text-blue-300">10m ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Geographic Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>Geographic Performance</span>
              </CardTitle>
              <CardDescription className="text-blue-200/60">Revenue and traffic by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">🇺🇸</span>
                    <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">Top</span>
                  </div>
                  <div className="text-white font-semibold mb-1">United States</div>
                  <div className="text-2xl font-bold text-white mb-2">$12,450</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-200/70">15,280 visitors</span>
                    <span className="text-green-400 flex items-center">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      12%
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">🇬🇧</span>
                    <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">#2</span>
                  </div>
                  <div className="text-white font-semibold mb-1">United Kingdom</div>
                  <div className="text-2xl font-bold text-white mb-2">$8,920</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-200/70">11,450 visitors</span>
                    <span className="text-green-400 flex items-center">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      8%
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">🇨🇦</span>
                    <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">#3</span>
                  </div>
                  <div className="text-white font-semibold mb-1">Canada</div>
                  <div className="text-2xl font-bold text-white mb-2">$6,780</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-200/70">8,920 visitors</span>
                    <span className="text-green-400 flex items-center">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      15%
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">🇦🇺</span>
                    <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">#4</span>
                  </div>
                  <div className="text-white font-semibold mb-1">Australia</div>
                  <div className="text-2xl font-bold text-white mb-2">$5,650</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-200/70">7,340 visitors</span>
                    <span className="text-green-400 flex items-center">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      10%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hourly Performance Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span>Peak Performance Hours</span>
              </CardTitle>
              <CardDescription className="text-purple-200/60">Best times for traffic and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {[...Array(24)].map((_, hour) => {
                  const intensity = Math.random()
                  const bgColor = intensity > 0.7 ? 'bg-purple-500' : intensity > 0.4 ? 'bg-blue-500' : 'bg-gray-700'
                  return (
                    <div key={hour} className="text-center">
                      <div className={`h-16 ${bgColor} rounded-lg flex items-center justify-center mb-1`}>
                        <span className="text-white text-xs font-semibold">
                          {(intensity * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-xs text-blue-200/70">{hour}:00</div>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm text-purple-200">High Activity (70%+)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-blue-200">Medium Activity (40-70%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-700 rounded"></div>
                  <span className="text-sm text-gray-300">Low Activity (&lt;40%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-400" />
                <span>Performance Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">+18.7%</div>
                  <div className="text-blue-200/70">Overall Growth</div>
                  <div className="text-sm text-blue-300/60 mt-1">Compared to last period</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">$127.5K</div>
                  <div className="text-purple-200/70">Total Revenue</div>
                  <div className="text-sm text-purple-300/60 mt-1">Last 6 months</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">94.3%</div>
                  <div className="text-blue-200/70">Success Rate</div>
                  <div className="text-sm text-blue-300/60 mt-1">Conversion efficiency</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

        {/* Additional Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-8 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <span>AI-Powered Insights</span>
              </CardTitle>
              <CardDescription className="text-blue-200/60">Automated recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1">Strong Performance Detected</div>
                      <div className="text-sm text-green-200/70">
                        Your conversion rate has increased by 12.5% this month. The "Wireless Headphones" product page is driving most of this growth.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1">Optimization Opportunity</div>
                      <div className="text-sm text-yellow-200/70">
                        Mobile bounce rate is 8% higher than desktop. Consider optimizing mobile page load speed and navigation.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1">Traffic Source Insight</div>
                      <div className="text-sm text-blue-200/70">
                        Email marketing has the highest conversion rate (4.1%). Consider increasing budget allocation to this channel.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1">Peak Time Recommendation</div>
                      <div className="text-sm text-purple-200/70">
                        Your highest conversion rates occur between 2PM-5PM EST. Schedule promotional campaigns during these hours for maximum impact.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comparison Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>Period Comparison</span>
              </CardTitle>
              <CardDescription className="text-purple-200/60">Compare performance across different time periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <div className="text-purple-200/70 text-sm mb-2">This Month vs Last Month</div>
                  <div className="text-3xl font-bold text-white mb-1">+18.7%</div>
                  <div className="flex items-center text-sm text-green-400">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    Significant improvement
                  </div>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="text-blue-200/70 text-sm mb-2">This Quarter vs Last Quarter</div>
                  <div className="text-3xl font-bold text-white mb-1">+24.3%</div>
                  <div className="flex items-center text-sm text-green-400">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    Strong growth trend
                  </div>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <div className="text-purple-200/70 text-sm mb-2">Year over Year</div>
                  <div className="text-3xl font-bold text-white mb-1">+156%</div>
                  <div className="flex items-center text-sm text-green-400">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    Exceptional performance
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
