'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TestTube, 
  Plus, 
  Play, 
  Pause, 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer,
  Eye,
  Target,
  Crown,
  Sparkles,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Type,
  Layout,
  Palette,
  Image,
  Globe,
  TrendingDown,
  Activity,
  Award,
  Percent,
  ArrowRight,
  Info,
  X,
  ChevronRight,
  Split,
  LineChart
} from 'lucide-react'

interface ABTest {
  id: string
  name: string
  description: string
  websiteId: string
  websiteName: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  type: 'headline' | 'cta' | 'layout' | 'color' | 'image' | 'full-page'
  variants: {
    id: string
    name: string
    description: string
    traffic: number // percentage
    conversions: number
    visitors: number
    conversionRate: number
    isControl: boolean
  }[]
  metrics: {
    primaryGoal: 'clicks' | 'conversions' | 'revenue' | 'signups'
    confidenceLevel: number
    statisticalSignificance: boolean
    winner?: string
  }
  schedule: {
    startDate: string
    endDate?: string
    duration: number // days
  }
  createdAt: string
  updatedAt: string
}

interface ABTestStats {
  totalTests: number
  runningTests: number
  completedTests: number
  totalVisitors: number
  averageUplift: number
  significantWins: number
}

export default function ABTestingPage() {
  const [tests, setTests] = useState<ABTest[]>([])
  const [stats, setStats] = useState<ABTestStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hasEnterpriseAccess, setHasEnterpriseAccess] = useState(false)

  useEffect(() => {
    checkEnterpriseAccess()
    if (hasEnterpriseAccess) {
      loadTests()
      loadStats()
    }
  }, [])

  const checkEnterpriseAccess = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setHasEnterpriseAccess(data.user.plan === 'enterprise')
      }
    } catch (error) {
      console.error('Error checking access:', error)
    }
  }

  const loadTests = async () => {
    try {
      const response = await fetch('/api/ab-tests')
      if (response.ok) {
        const data = await response.json()
        setTests(data.tests)
      }
    } catch (error) {
      console.error('Error loading tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/ab-tests/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const startTest = async (testId: string) => {
    try {
      const response = await fetch(`/api/ab-tests/${testId}/start`, {
        method: 'POST'
      })

      if (response.ok) {
        setSuccess('A/B test started successfully')
        await loadTests()
        await loadStats()
      }
    } catch (error) {
      setError('Failed to start test')
    }
  }

  const pauseTest = async (testId: string) => {
    try {
      const response = await fetch(`/api/ab-tests/${testId}/pause`, {
        method: 'POST'
      })

      if (response.ok) {
        setSuccess('A/B test paused')
        await loadTests()
      }
    } catch (error) {
      setError('Failed to pause test')
    }
  }

  const completeTest = async (testId: string, winnerId: string) => {
    try {
      const response = await fetch(`/api/ab-tests/${testId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId })
      })

      if (response.ok) {
        setSuccess('A/B test completed and winner applied')
        await loadTests()
        await loadStats()
      }
    } catch (error) {
      setError('Failed to complete test')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'from-green-500 to-emerald-600'
      case 'paused':
        return 'from-yellow-500 to-orange-600'
      case 'completed':
        return 'from-blue-500 to-indigo-600'
      case 'draft':
        return 'from-gray-500 to-gray-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4" />
      case 'paused':
        return <Pause className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'draft':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'headline':
        return <Type className="w-4 h-4" />
      case 'cta':
        return <MousePointer className="w-4 h-4" />
      case 'layout':
        return <Layout className="w-4 h-4" />
      case 'color':
        return <Palette className="w-4 h-4" />
      case 'image':
        return <Image className="w-4 h-4" />
      case 'full-page':
        return <Globe className="w-4 h-4" />
      default:
        return <TestTube className="w-4 h-4" />
    }
  }

  // Enterprise access gate
  if (!hasEnterpriseAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
              <Split className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-orange-400 to-blue-400 mb-4">
              Enterprise Feature
            </h1>
            <p className="text-blue-200/70 text-lg mb-8 max-w-2xl mx-auto">
              A/B Testing is available exclusively for Enterprise plan users. 
              Upgrade to access advanced split testing, statistical analysis, and conversion optimization.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Advanced Split Testing</h3>
                    <p className="text-blue-200/60 text-sm">Test multiple variants simultaneously with intelligent traffic distribution</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Statistical Significance</h3>
                    <p className="text-orange-200/60 text-sm">Real-time confidence levels and significance analysis</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Conversion Optimization</h3>
                    <p className="text-blue-200/60 text-sm">Track clicks, conversions, revenue, and custom goals</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Automated Winner Selection</h3>
                    <p className="text-orange-200/60 text-sm">AI-powered winner detection and automatic deployment</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LineChart className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Real-Time Monitoring</h3>
                    <p className="text-blue-200/60 text-sm">Live performance tracking and instant insights</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Multi-Variant Testing</h3>
                    <p className="text-orange-200/60 text-sm">Test headlines, CTAs, layouts, colors, and full pages</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <a 
                href="/pricing?upgrade=enterprise&feature=A/B Testing"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Enterprise
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200">Loading A/B Tests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Split className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-orange-400 to-blue-400">
                      A/B Testing
                    </h1>
                    <div className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <Crown className="w-3 h-3 mr-1" />
                      Enterprise
                    </div>
                  </div>
                  <p className="text-blue-200/70 text-sm">Data-driven optimization through split testing</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Test
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30 col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-200">Total Tests</CardTitle>
                <TestTube className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalTests}</div>
                <p className="text-xs text-blue-300/60 mt-1">
                  {stats.runningTests} active
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30 col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-200">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.completedTests}</div>
                <p className="text-xs text-orange-300/60 mt-1">
                  {stats.significantWins} significant
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30 col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-200">Visitors</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalVisitors?.toLocaleString() || "0"}</div>
                <p className="text-xs text-blue-300/60 mt-1">
                  All tests
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30 col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-200">Avg. Uplift</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">+{(stats?.averageUplift?.toFixed(1) || "0.0")}%</div>
                <p className="text-xs text-orange-300/60 mt-1">
                  Conversion gain
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30 col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-200">Running</CardTitle>
                <Activity className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.runningTests}</div>
                <p className="text-xs text-blue-300/60 mt-1">
                  Live now
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30 col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-200">Win Rate</CardTitle>
                <Award className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {stats.completedTests > 0 ? Math.round((stats.significantWins / stats.completedTests) * 100) : 0}%
                </div>
                <p className="text-xs text-orange-300/60 mt-1">
                  Success rate
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm flex items-center justify-between"
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-red-200">{error}</span>
              </div>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm flex items-center justify-between"
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-green-200">{success}</span>
              </div>
              <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-300">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tests List */}
        <div className="space-y-6">
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getStatusColor(test.status)} rounded-lg flex items-center justify-center`}>
                          {getStatusIcon(test.status)}
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl">{test.name}</CardTitle>
                          <CardDescription className="text-blue-200/60">{test.description}</CardDescription>
                        </div>
                      </div>

                      {/* Test Metadata */}
                      <div className="flex flex-wrap gap-3 text-sm text-blue-200/70 mt-3">
                        <div className="flex items-center space-x-1 bg-blue-500/10 px-3 py-1 rounded-full">
                          {getTypeIcon(test.type)}
                          <span>{test.type.charAt(0).toUpperCase() + test.type.slice(1)}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-orange-500/10 px-3 py-1 rounded-full">
                          <Globe className="w-4 h-4" />
                          <span>{test.websiteName}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-blue-500/10 px-3 py-1 rounded-full">
                          <Target className="w-4 h-4" />
                          <span>{test.metrics.primaryGoal}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-orange-500/10 px-3 py-1 rounded-full">
                          <Calendar className="w-4 h-4" />
                          <span>{test.schedule.duration} days</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {test.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => startTest(test.id)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      )}
                      
                      {test.status === 'running' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => pauseTest(test.id)}
                            className="border-orange-500/50 text-orange-300 hover:bg-orange-500/20"
                          >
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </Button>
                          {test.metrics.statisticalSignificance && (
                            <Button
                              size="sm"
                              onClick={() => {
                                const winner = test.variants.reduce((prev, current) => 
                                  prev.conversionRate > current.conversionRate ? prev : current
                                )
                                completeTest(test.id, winner.id)
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          )}
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTest(test)}
                        className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Results
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Variants Performance - Split Screen Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {test.variants.map((variant, vIndex) => {
                      const isWinner = test.metrics.winner === variant.id
                      const controlVariant = test.variants.find(v => v.isControl)
                      const uplift = controlVariant && !variant.isControl
                        ? ((variant.conversionRate / controlVariant.conversionRate - 1) * 100)
                        : 0

                      return (
                        <motion.div
                          key={variant.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: vIndex * 0.1 }}
                          className={`relative p-5 rounded-lg border-2 ${
                            isWinner
                              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500'
                              : variant.isControl
                              ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500'
                              : 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/50'
                          }`}
                        >
                          {/* Variant Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-white text-lg">{variant.name}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                {variant.isControl && (
                                  <span className="text-xs bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full border border-blue-500/50">
                                    Control
                                  </span>
                                )}
                                {isWinner && (
                                  <span className="text-xs bg-green-500/30 text-green-200 px-2 py-0.5 rounded-full border border-green-500/50 flex items-center">
                                    <Award className="w-3 h-3 mr-1" />
                                    Winner
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-white">{variant.traffic}%</div>
                              <div className="text-xs text-blue-200/60">Traffic</div>
                            </div>
                          </div>

                          {/* Metrics */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-blue-200/70 flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                Visitors
                              </span>
                              <span className="font-semibold text-white">{variant.visitors?.toLocaleString() || "0"}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-blue-200/70 flex items-center">
                                <Target className="w-4 h-4 mr-1" />
                                Conversions
                              </span>
                              <span className="font-semibold text-white">{variant.conversions?.toLocaleString() || "0"}</span>
                            </div>
                            
                            <div className="pt-2 border-t border-white/10">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-blue-200/70 flex items-center">
                                  <Percent className="w-4 h-4 mr-1" />
                                  Conv. Rate
                                </span>
                                <span className="font-bold text-white text-lg">{(variant?.conversionRate?.toFixed(2) || "0.00")}%</span>
                              </div>
                            </div>
                            
                            {!variant.isControl && controlVariant && (
                              <div className="pt-2 border-t border-white/10">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-blue-200/70 flex items-center">
                                    {uplift >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                    Uplift
                                  </span>
                                  <span className={`font-bold text-lg ${
                                    uplift >= 0 ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {uplift >= 0 ? '+' : ''}{uplift.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Statistical Significance Banner */}
                  {test.status === 'running' && (
                    <div className={`p-4 rounded-lg border-2 ${
                      test.metrics.statisticalSignificance
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-yellow-500/20 border-yellow-500/50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Zap className={`w-5 h-5 ${test.metrics.statisticalSignificance ? 'text-green-400' : 'text-yellow-400'}`} />
                          <div>
                            <div className="text-white font-semibold">
                              Statistical Confidence: {test.metrics.confidenceLevel}%
                            </div>
                            <div className={`text-sm ${test.metrics.statisticalSignificance ? 'text-green-200/70' : 'text-yellow-200/70'}`}>
                              {test.metrics.statisticalSignificance 
                                ? 'Results are statistically significant - ready to declare winner'
                                : 'Continue testing to reach statistical significance'}
                            </div>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-semibold ${
                          test.metrics.statisticalSignificance
                            ? 'bg-green-500/30 text-green-200 border border-green-500/50'
                            : 'bg-yellow-500/30 text-yellow-200 border border-yellow-500/50'
                        }`}>
                          {test.metrics.statisticalSignificance ? 'Significant' : 'Need More Data'}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {tests.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TestTube className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No A/B Tests Yet</h3>
            <p className="text-blue-200/70 mb-6 max-w-md mx-auto">
              Start optimizing your websites with data-driven split testing. Create your first test to begin.
            </p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white shadow-lg shadow-blue-500/30"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Test
            </Button>
          </motion.div>
        )}

        {/* Create Test Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 border border-blue-500/30 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
                    Create A/B Test
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-blue-200 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Test Name</label>
                    <Input 
                      placeholder="e.g., Homepage Headline Test" 
                      className="bg-black/50 border-blue-500/30 text-white placeholder:text-blue-300/50 h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Description</label>
                    <Input 
                      placeholder="Brief description of what you're testing" 
                      className="bg-black/50 border-blue-500/30 text-white placeholder:text-blue-300/50 h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Test Type</label>
                    <select className="w-full p-3 border border-blue-500/30 rounded-lg bg-black/50 text-white">
                      <option value="headline">Headline Test</option>
                      <option value="cta">Call-to-Action Test</option>
                      <option value="layout">Layout Test</option>
                      <option value="color">Color Test</option>
                      <option value="image">Image Test</option>
                      <option value="full-page">Full Page Test</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Primary Goal</label>
                    <select className="w-full p-3 border border-blue-500/30 rounded-lg bg-black/50 text-white">
                      <option value="clicks">Clicks</option>
                      <option value="conversions">Conversions</option>
                      <option value="revenue">Revenue</option>
                      <option value="signups">Sign-ups</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Test Duration (days)</label>
                    <Input 
                      type="number" 
                      placeholder="14" 
                      min="1" 
                      max="90" 
                      className="bg-black/50 border-blue-500/30 text-white h-12"
                    />
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 p-5 rounded-lg">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-blue-400" />
                      Variants Configuration
                    </h3>
                    <p className="text-sm text-blue-200/70 mb-4">
                      You'll configure your test variants after creating the test.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="text-white font-medium">Control (Original Version)</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-orange-500/10 rounded-lg">
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                        <span className="text-white font-medium">Variant A (New Version)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/30 p-5 rounded-lg">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
                      Best Practices
                    </h3>
                    <ul className="space-y-2 text-sm text-orange-200/70">
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Run tests for at least 7-14 days to account for weekly patterns</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Aim for 95% confidence level before declaring a winner</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Test one element at a time for clearer insights</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Ensure sufficient traffic volume (minimum 100 conversions per variant)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Split traffic evenly between variants (50/50 for two variants)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Document your hypothesis before starting the test</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Monitor results daily but avoid stopping tests prematurely</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Consider seasonality and external factors that may affect results</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Run follow-up tests to validate significant findings</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCreateModal(false)
                      setSuccess('A/B test created successfully! Configure variants and start testing.')
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Test
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}







