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
import { Report, ReportTemplate, ReportFormat, ReportFrequency } from '@/lib/schemas/report'

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
  const [isLoading, setIsLoading] = useState(false)

  // Form state for new report
  const [newReportName, setNewReportName] = useState('')
  const [newReportDescription, setNewReportDescription] = useState('')
  const [newReportType, setNewReportType] = useState('custom')
  const [newReportFormat, setNewReportFormat] = useState<ReportFormat>('PDF')
  const [newReportFrequency, setNewReportFrequency] = useState<ReportFrequency>('manual')
  const [newReportRecipients, setNewReportRecipients] = useState('')

  useEffect(() => {
    loadReportingData()
  }, [])

  const loadReportingData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/reports/data')
      if (response.ok) {
        const result = await response.json()
        setReports(result.data.reports || [])
        
        const metricsData: MetricData[] = [
          {
            name: 'Total Revenue',
            value: `$${result.data.metrics.totalRevenue?.toLocaleString() || '0'}`,
            change: '+0%',
            trend: 'neutral' as const,
            icon: DollarSign
          },
          {
            name: 'Website Visitors',
            value: result.data.metrics.websiteVisitors?.toLocaleString() || '0',
            change: '+0%',
            trend: 'neutral' as const,
            icon: Users
          },
          {
            name: 'Page Views',
            value: result.data.metrics.pageViews?.toLocaleString() || '0',
            change: '+0%',
            trend: 'neutral' as const,
            icon: Eye
          },
          {
            name: 'Conversion Rate',
            value: `${result.data.metrics.conversionRate || 0}%`,
            change: '+0%',
            trend: 'neutral' as const,
            icon: Target
          }
        ]
        setMetrics(metricsData)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to load reporting data')
      }
    } catch (error) {
      console.error('Error loading reporting data:', error)
      setError('An unexpected error occurred while loading data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateReport = async () => {
    if (!newReportName) {
      setError('Report name is required')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/reports/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newReportName,
          description: newReportDescription,
          type: newReportType,
          format: newReportFormat,
          frequency: newReportFrequency,
          recipients: newReportRecipients.split(',').map(e => e.trim()).filter(e => e),
        }),
      })

      if (response.ok) {
        setSuccess('Report created and queued for generation')
        setShowCreateModal(false)
        loadReportingData()
        // Reset form
        setNewReportName('')
        setNewReportDescription('')
        setNewReportRecipients('')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create report')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-600'
      case 'processing':
        return 'from-blue-500 to-cyan-600'
      case 'pending':
        return 'from-orange-500 to-yellow-600'
      case 'failed':
        return 'from-red-500 to-pink-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (report.description || '').toLowerCase().includes(searchQuery.toLowerCase())
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
                onClick={loadReportingData}
                disabled={isLoading}
              >
                <Activity className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-gray-600 to-blue-700 hover:from-gray-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
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

        {/* Main Content */}
        <Card className="bg-black/40 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-white">My Reports</CardTitle>
                <CardDescription className="text-gray-400">Manage and view your generated reports</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  className="pl-10 bg-gray-900/50 border-gray-700 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-sm">
                    <th className="pb-4 font-medium">Report Name</th>
                    <th className="pb-4 font-medium">Type</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Format</th>
                    <th className="pb-4 font-medium">Last Generated</th>
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-4">
                          <div className="font-medium text-white">{report.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">{report.description}</div>
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-800 text-gray-400">
                            {report.type}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 bg-gradient-to-r ${getStatusColor(report.status)}`} />
                            <span className="text-sm capitalize">{report.status}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center text-sm">
                            <File className="w-4 h-4 mr-2 text-blue-400" />
                            {report.format}
                          </div>
                        </td>
                        <td className="py-4 text-sm">
                          {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {report.fileUrl && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                onClick={() => window.open(report.fileUrl, '_blank')}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <FileText className="w-12 h-12 mb-4 opacity-20" />
                          <p>No reports found matching your search</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Create Report Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Create New Report</h2>
                  <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Report Name</label>
                    <Input
                      placeholder="e.g., Q2 Revenue Analysis"
                      className="bg-gray-800 border-gray-700 text-white"
                      value={newReportName}
                      onChange={(e) => setNewReportName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <Input
                      placeholder="Briefly describe the purpose of this report"
                      className="bg-gray-800 border-gray-700 text-white"
                      value={newReportDescription}
                      onChange={(e) => setNewReportDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Format</label>
                      <select
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md p-2"
                        value={newReportFormat}
                        onChange={(e) => setNewReportFormat(e.target.value as ReportFormat)}
                      >
                        <option value="PDF">PDF Document</option>
                        <option value="Excel">Excel Spreadsheet</option>
                        <option value="CSV">CSV File</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Frequency</label>
                      <select
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-md p-2"
                        value={newReportFrequency}
                        onChange={(e) => setNewReportFrequency(e.target.value as ReportFrequency)}
                      >
                        <option value="manual">Manual (One-time)</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Recipients (comma separated)</label>
                    <Input
                      placeholder="email1@example.com, email2@example.com"
                      className="bg-gray-800 border-gray-700 text-white"
                      value={newReportRecipients}
                      onChange={(e) => setNewReportRecipients(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-gray-600 to-blue-700 hover:from-gray-700 hover:to-blue-800 text-white"
                    onClick={handleCreateReport}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Generate Report'}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
