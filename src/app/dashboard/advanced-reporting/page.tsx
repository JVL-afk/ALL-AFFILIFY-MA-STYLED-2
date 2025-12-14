'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  MousePointer,
  Share,
  Mail,
  Printer,
  Settings,
  X,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Activity,
  ArrowUp,
  ArrowDown,
  TrendingDown,
  Zap,
  Target,
  File
} from 'lucide-react'

interface Report {
  id: string
  name: string
  type: 'revenue' | 'traffic' | 'conversion' | 'custom'
  description: string
  schedule: 'manual' | 'daily' | 'weekly' | 'monthly'
  format: 'pdf' | 'excel' | 'csv'
  recipients: string[]
  lastGenerated?: Date
  nextScheduled?: Date
  status: 'active' | 'paused' | 'draft'
}

interface ReportTemplate {
  id: string
  name: string
  category: string
  description: string
  metrics: string[]
  preview: string
}

interface MetricData {
  name: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: any
}

export default function AdvancedReportingPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [activeTab, setActiveTab] = useState<'reports' | 'templates' | 'scheduled' | 'analytics'>('reports')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadReportingData()
  }, [])

  const loadReportingData = () => {
    const mockReports: Report[] = [
      {
        id: '1',
        name: 'Monthly Revenue Report',
        type: 'revenue',
        description: 'Comprehensive monthly revenue analysis with trends and forecasts',
        schedule: 'monthly',
        format: 'pdf',
        recipients: ['john@affilify.eu', 'sarah@affilify.eu'],
        lastGenerated: new Date(Date.now() - 86400000 * 2),
        nextScheduled: new Date(Date.now() + 86400000 * 28),
        status: 'active',
      },
      {
        id: '2',
        name: 'Weekly Traffic Summary',
        type: 'traffic',
        description: 'Weekly website traffic and user engagement metrics',
        schedule: 'weekly',
        format: 'excel',
        recipients: ['team@affilify.eu'],
        lastGenerated: new Date(Date.now() - 86400000 * 1),
        nextScheduled: new Date(Date.now() + 86400000 * 6),
        status: 'active',
      },
      {
        id: '3',
        name: 'Conversion Optimization Report',
        type: 'conversion',
        description: 'A/B testing results and conversion rate analysis',
        schedule: 'manual',
        format: 'pdf',
        recipients: ['marketing@affilify.eu'],
        lastGenerated: new Date(Date.now() - 86400000 * 5),
        status: 'draft',
      },
      {
        id: '4',
        name: 'Executive Dashboard',
        type: 'custom',
        description: 'High-level KPIs and business metrics for executives',
        schedule: 'daily',
        format: 'pdf',
        recipients: ['ceo@affilify.eu', 'cfo@affilify.eu'],
        lastGenerated: new Date(Date.now() - 3600000),
        nextScheduled: new Date(Date.now() + 86400000),
        status: 'active',
      },
    ]

    const mockTemplates: ReportTemplate[] = [
      {
        id: '1',
        name: 'Revenue Analysis',
        category: 'Financial',
        description: 'Detailed revenue breakdown with trends and forecasts',
        metrics: ['Total Revenue', 'Revenue by Source', 'Growth Rate', 'Profit Margins'],
        preview: '/previews/revenue-template.jpg',
      },
      {
        id: '2',
        name: 'Traffic Overview',
        category: 'Analytics',
        description: 'Website traffic analysis and user behavior insights',
        metrics: ['Page Views', 'Unique Visitors', 'Bounce Rate', 'Session Duration'],
        preview: '/previews/traffic-template.jpg',
      },
      {
        id: '3',
        name: 'Conversion Funnel',
        category: 'Marketing',
        description: 'Conversion tracking and optimization opportunities',
        metrics: ['Conversion Rate', 'Funnel Drop-offs', 'A/B Test Results', 'ROI'],
        preview: '/previews/conversion-template.jpg',
      },
      {
        id: '4',
        name: 'Executive Summary',
        category: 'Management',
        description: 'High-level business metrics and KPIs',
        metrics: ['Revenue', 'Growth', 'Customer Acquisition', 'Market Share'],
        preview: '/previews/executive-template.jpg',
      },
    ]

    const mockMetrics: MetricData[] = [
      {
        name: 'Total Revenue',
        value: '$45,280',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
      },
      {
        name: 'Website Visitors',
        value: '28,450',
        change: '+8.2%',
        trend: 'up',
        icon: Users,
      },
      {
        name: 'Page Views',
        value: '125,680',
        change: '+15.3%',
        trend: 'up',
        icon: Eye,
      },
      {
        name: 'Conversion Rate',
        value: '3.24%',
        change: '+0.4%',
        trend: 'up',
        icon: MousePointer,
      },
    ]

    setReports(mockReports)
    setTemplates(mockTemplates)
    setMetrics(mockMetrics)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'from-green-500 to-emerald-600'
      case 'paused':
        return 'from-orange-500 to-yellow-600'
      case 'draft':
        return 'from-gray-500 to-gray-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'revenue':
        return 'from-green-500 to-emerald-600'
      case 'traffic':
        return 'from-blue-500 to-cyan-600'
      case 'conversion':
        return 'from-purple-500 to-pink-600'
      case 'custom':
        return 'from-orange-500 to-red-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <File className="w-4 h-4" />
      case 'excel':
        return <File className="w-4 h-4" />
      case 'csv':
        return <File className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-6">
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
                <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-blue-400 to-gray-300">
                    Advanced Reporting
                  </h1>
                  <p className="text-gray-400 text-sm">Generate comprehensive reports and analytics for your affiliate business</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-gray-600 to-blue-700 hover:from-gray-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-black/40 backdrop-blur-sm border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{metric.name}</CardTitle>
                <metric.icon className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{metric.value}</div>
                <p className={`text-xs flex items-center mt-1 ${
                  metric.trend === 'up' ? 'text-green-400' :
                  metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUp className="inline h-3 w-3 mr-1" />
                  ) : metric.trend === 'down' ? (
                    <ArrowDown className="inline h-3 w-3 mr-1" />
                  ) : null}
                  {metric.change} from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

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

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-gray-700">
            <CardContent className="p-2">
              <nav className="flex space-x-2">
                {[
                  { id: 'reports', label: 'My Reports', icon: FileText },
                  { id: 'templates', label: 'Templates', icon: BarChart3 },
                  { id: 'scheduled', label: 'Scheduled', icon: Calendar },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-gray-600 to-blue-700 text-white'
                        : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/50 border-gray-700 text-white placeholder:text-gray-500 h-12"
              />
            </motion.div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-gray-700 hover:border-blue-600 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-white text-lg">{report.name}</h3>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(report.status)} text-white`}>
                              {report.status}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTypeColor(report.type)} text-white`}>
                              {report.type}
                            </div>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{report.description}</p>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <div className="flex items-center space-x-1 text-gray-400">
                              {getFormatIcon(report.format)}
                              <span>{report.format.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>{report.schedule}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Mail className="w-4 h-4" />
                              <span>{report.recipients.length} recipient(s)</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-1">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-gray-400">Last Generated</span>
                          </div>
                          <div className="text-sm font-bold text-white">
                            {report.lastGenerated ? `${Math.floor((Date.now() - report.lastGenerated.getTime()) / 86400000)}d ago` : 'Never'}
                          </div>
                        </div>

                        {report.nextScheduled && (
                          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between mb-1">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              <span className="text-xs text-gray-400">Next Scheduled</span>
                            </div>
                            <div className="text-sm font-bold text-white">
                              {Math.floor((report.nextScheduled.getTime() - Date.now()) / 86400000)}d
                            </div>
                          </div>
                        )}

                        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-1">
                            <Activity className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-gray-400">Status</span>
                          </div>
                          <div className="text-sm font-bold text-white capitalize">{report.status}</div>
                        </div>

                        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-1">
                            <Target className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-gray-400">Type</span>
                          </div>
                          <div className="text-sm font-bold text-white capitalize">{report.type}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-gray-700 hover:border-blue-600 transition-all h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg mb-1">{template.name}</h3>
                        <div className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded border border-blue-500/30 inline-block mb-2">
                          {template.category}
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2">Included Metrics:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.metrics.map((metric, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded border border-gray-700">
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-gray-600 to-blue-700 hover:from-gray-700 hover:to-blue-800 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Scheduled Tab */}
        {activeTab === 'scheduled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span>Scheduled Reports</span>
                </CardTitle>
                <CardDescription className="text-gray-400">Upcoming automated report deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.filter(r => r.nextScheduled).map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-blue-700 rounded-lg flex items-center justify-center">
                          {getFormatIcon(report.format)}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{report.name}</div>
                          <div className="text-sm text-gray-400">{report.schedule} • {report.recipients.length} recipients</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">
                          {report.nextScheduled ? `${Math.floor((report.nextScheduled.getTime() - Date.now()) / 86400000)} days` : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">until next delivery</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span>Report Usage Analytics</span>
                </CardTitle>
                <CardDescription className="text-gray-400">Track report generation and delivery metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Reports Generated</span>
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">142</div>
                    <div className="text-xs text-gray-400 flex items-center">
                      <ArrowUp className="w-3 h-3 mr-1 text-green-400" />
                      +18% this month
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Delivery Success</span>
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">98.5%</div>
                    <div className="text-xs text-gray-400">Last 30 days</div>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Avg Generation Time</span>
                      <Clock className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">3.2s</div>
                    <div className="text-xs text-gray-400 flex items-center">
                      <ArrowDown className="w-3 h-3 mr-1 text-green-400" />
                      -0.5s faster
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span>Report Type Distribution</span>
                </CardTitle>
                <CardDescription className="text-gray-400">Breakdown by report category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'Revenue', count: 45, percentage: 32, color: 'from-green-500 to-emerald-600' },
                    { type: 'Traffic', count: 38, percentage: 27, color: 'from-blue-500 to-cyan-600' },
                    { type: 'Conversion', count: 35, percentage: 25, color: 'from-purple-500 to-pink-600' },
                    { type: 'Custom', count: 24, percentage: 16, color: 'from-orange-500 to-red-600' },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{item.type}</span>
                        <span className="text-white font-semibold">{item.count} reports ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Common reporting tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-600 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-blue-300 transition-colors">Create Report</div>
                      <div className="text-xs text-gray-400">Generate new report</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-600 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-blue-300 transition-colors">Export Data</div>
                      <div className="text-xs text-gray-400">Download reports</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-600 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-blue-300 transition-colors">Schedule Report</div>
                      <div className="text-xs text-gray-400">Automate delivery</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-600 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-blue-300 transition-colors">Settings</div>
                      <div className="text-xs text-gray-400">Configure reports</div>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Report Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <span>Report Performance</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Monitor reporting system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">System Status</span>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">Operational</div>
                  <div className="text-xs text-gray-400">All systems running</div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Uptime</span>
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                  <div className="text-xs text-gray-400">Last 30 days</div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Queue Time</span>
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">0.8s</div>
                  <div className="text-xs text-gray-400">Average wait time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span>Reporting Best Practices</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Tips for effective reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Schedule Regular Reports</div>
                      <div className="text-xs text-gray-400">Automate recurring reports for consistency</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Use Templates</div>
                      <div className="text-xs text-gray-400">Start with proven templates for faster setup</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Focus on Key Metrics</div>
                      <div className="text-xs text-gray-400">Include only relevant data points</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Export in Multiple Formats</div>
                      <div className="text-xs text-gray-400">Provide PDF, Excel, and CSV options</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Add Context</div>
                      <div className="text-xs text-gray-400">Include descriptions and insights</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Review Regularly</div>
                      <div className="text-xs text-gray-400">Update reports as business needs change</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create Report Modal */}
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
                className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-blue-400">
                    Create New Report
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Report Name</label>
                    <Input
                      placeholder="e.g., Monthly Revenue Report"
                      className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Report Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Revenue', 'Traffic', 'Conversion', 'Custom'].map((type) => (
                        <label key={type} className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors">
                          <input type="radio" name="type" className="text-blue-500" />
                          <span className="text-sm text-gray-300">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Schedule</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Manual', 'Daily', 'Weekly', 'Monthly'].map((schedule) => (
                        <label key={schedule} className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors">
                          <input type="radio" name="schedule" className="text-blue-500" />
                          <span className="text-sm text-gray-300">{schedule}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 p-5 rounded-lg">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                      Reporting Tips
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Choose metrics that align with your business goals</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Schedule reports during off-peak hours</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Add multiple recipients for better visibility</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCreateModal(false)
                      setSuccess('Report created successfully!')
                    }}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-blue-700 hover:from-gray-700 hover:to-blue-800 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create Report
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


        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-8 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Download className="w-5 h-5 text-blue-400" />
                <span>Export Options</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Download reports in multiple formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-600 transition-all text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <File className="w-8 h-8 text-red-400" />
                    <div>
                      <div className="text-white font-semibold">PDF Export</div>
                      <div className="text-xs text-gray-400">Professional format</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-600 transition-all text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <File className="w-8 h-8 text-green-400" />
                    <div>
                      <div className="text-white font-semibold">Excel Export</div>
                      <div className="text-xs text-gray-400">Editable spreadsheet</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-600 transition-all text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <File className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-white font-semibold">CSV Export</div>
                      <div className="text-xs text-gray-400">Raw data format</div>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
