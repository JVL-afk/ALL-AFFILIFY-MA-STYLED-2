'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts'
import {
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Target,
  Clock,
  Activity,
  Download,
  RefreshCw,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Lock,
} from 'lucide-react'

interface AnalyticsData {
  revenue: { month: string; amount: number }[]
  traffic: { date: string; visitors: number; pageViews: number }[]
  conversions: { source: string; conversions: number; rate: number }[]
  demographics: { age: string; percentage: number }[]
  devices: { device: string; users: number }[]
  topPages: { page: string; views: number; bounceRate: number }[]
}

interface MetricCard {
  title: string
  value: string
  change: number
  icon: any
  color: string
}

const EMPTY_DATA: AnalyticsData = {
  revenue: [],
  traffic: [],
  conversions: [],
  demographics: [],
  devices: [],
  topPages: [],
}

const ICON_MAP: Record<string, any> = {
  DollarSign,
  Users,
  Target,
  Eye,
  Clock,
  Activity,
}

export default function AdvancedAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(EMPTY_DATA)
  const [metrics, setMetrics] = useState<MetricCard[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    fetchAnalyticsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    setAccessDenied(false)
    try {
      const response = await fetch(`/api/analytics/advanced?timeRange=${timeRange}`)

      // Handle plan gate — show upgrade prompt instead of a blank/broken page
      if (response.status === 403) {
        setAccessDenied(true)
        return
      }

      const result = await response.json()

      if (response.ok && result.success && result.data) {
        const d = result.data
        setAnalyticsData({
          revenue: d.revenue ?? [],
          traffic: d.traffic ?? [],
          conversions: d.conversions ?? [],
          demographics: d.demographics ?? [],
          devices: d.devices ?? [],
          topPages: d.topPages ?? [],
        })

        if (Array.isArray(d.metrics)) {
          setMetrics(
            d.metrics.map((m: any) => ({
              ...m,
              icon: ICON_MAP[m.icon] ?? DollarSign,
            }))
          )
        }
      } else {
        setAnalyticsData(EMPTY_DATA)
        setMetrics([])
      }
    } catch (err) {
      console.error('Failed to fetch analytics data:', err)
      setAnalyticsData(EMPTY_DATA)
      setMetrics([])
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

  // Plan gate UI
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Pro or Enterprise Required</h2>
          <p className="text-blue-200/70 mb-8">
            Advanced Analytics is available on the Pro and Enterprise plans. Upgrade to unlock full performance insights.
          </p>
          <Button
            onClick={() => window.location.href = '/dashboard/billing'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
          >
            Upgrade Your Plan
          </Button>
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
            <div className="flex items-center space-x-3">
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
        {metrics.length > 0 && (
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
        )}

        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span>Revenue Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData.revenue.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={analyticsData.revenue}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="amount" stroke="#3B82F6" fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-blue-200/50">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No revenue data yet. Start tracking to see trends here.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Traffic & Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>Traffic Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.traffic.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analyticsData.traffic}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="visitors" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="pageViews" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-blue-200/50 text-sm text-center">
                    <div>
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p>No traffic data yet.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-green-400" />
                  <span>Top Pages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.topPages.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData.topPages} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis dataKey="page" type="category" stroke="#6B7280" width={100} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                      <Bar dataKey="views" fill="#10B981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-blue-200/50 text-sm text-center">
                    <div>
                      <Eye className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p>No page data yet.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Conversions & Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  <span>Conversion Sources</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.conversions.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData.conversions}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="source" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                      <Bar dataKey="conversions" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-blue-200/50 text-sm text-center">
                    <div>
                      <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p>No conversion data yet.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-pink-400" />
                  <span>Demographics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.demographics.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={analyticsData.demographics}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="percentage"
                        label={(props: any) => {
                          const { cx, cy, midAngle, innerRadius, outerRadius, payload } = props
                          const RADIAN = Math.PI / 180
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                          const x = cx + radius * Math.cos(-midAngle * RADIAN)
                          const y = cy + radius * Math.sin(-midAngle * RADIAN)
                          return (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11}>
                              {`${payload?.age ?? ""}: ${payload?.percentage ?? ""}%`}
                            </text>
                          )
                        }}
                      >
                        {analyticsData.demographics.map((_entry, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-blue-200/50 text-sm text-center">
                    <div>
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p>No demographic data yet.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
