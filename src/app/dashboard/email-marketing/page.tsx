'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Mail, 
  Users, 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3, 
  Calendar, 
  Target, 
  Zap, 
  Eye, 
  MousePointer,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Download,
  Copy,
  Sparkles,
  FileText,
  Settings,
  ChevronRight,
  Star,
  Activity,
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface EmailCampaign {
  id: string
  name: string
  subject: string
  status: 'draft' | 'scheduled' | 'sent' | 'active'
  recipients: number
  openRate: number
  clickRate: number
  sentDate?: Date
  scheduledDate?: Date
  type: 'newsletter' | 'promotional' | 'automated'
  revenue?: number
  conversions?: number
}

interface EmailTemplate {
  id: string
  name: string
  category: string
  thumbnail: string
  description: string
  uses: number
}

interface Subscriber {
  id: string
  email: string
  name: string
  status: 'active' | 'unsubscribed' | 'bounced'
  joinedDate: Date
  tags: string[]
}

export default function EmailMarketingPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'analytics' | 'subscribers'>('campaigns')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'scheduled' | 'sent' | 'active'>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    openRate: 0,
    clickRate: 0,
    revenue: 0
  })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/email-marketing/data')
      if (response.ok) {
        const result = await response.json()
        setCampaigns(result.data.campaigns || [])
        setTemplates(result.data.templates || [])
        setSubscribers(result.data.subscribers || [])
        setStats(result.data.stats || {
          totalSubscribers: 0,
          openRate: 0,
          clickRate: 0,
          revenue: 0
        })
      } else {
        setCampaigns([])
        setTemplates([])
        setSubscribers([])
      }
    } catch (error) {
      console.error('Error loading email marketing data:', error)
      setCampaigns([])
      setTemplates([])
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }

  // Removed: loadCampaigns, loadTemplates, loadSubscribers - now using loadAllData

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'from-green-500 to-emerald-600'
      case 'sent':
        return 'from-blue-500 to-cyan-600'
      case 'scheduled':
        return 'from-orange-500 to-yellow-600'
      case 'draft':
        return 'from-gray-500 to-gray-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'sent':
        return <Send className="w-4 h-4" />
      case 'scheduled':
        return <Clock className="w-4 h-4" />
      case 'draft':
        return <Edit className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'newsletter':
        return <Mail className="h-5 w-5" />
      case 'promotional':
        return <Target className="h-5 w-5" />
      case 'automated':
        return <Zap className="h-5 w-5" />
      default:
        return <Mail className="h-5 w-5" />
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-950 to-gray-900 p-6">
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
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-green-400 to-teal-400">
                    Email Marketing
                  </h1>
                  <p className="text-teal-200/70 text-sm">Create, manage, and track your email campaigns</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white shadow-lg shadow-teal-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-teal-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-200">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalSubscribers.toLocaleString()}</div>
              <p className="text-xs text-teal-300/60 mt-1">
                Total active subscribers
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">Open Rate</CardTitle>
              <Eye className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.openRate}%</div>
              <p className="text-xs text-green-300/60 mt-1">
                Average email open rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-teal-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-200">Click Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.clickRate}%</div>
              <p className="text-xs text-teal-300/60 mt-1">
                Average click-through rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-green-300/60 mt-1">
                Total email revenue
              </p>
            </CardContent>
          </Card>
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
          <Card className="bg-black/40 backdrop-blur-sm border-teal-500/30">
            <CardContent className="p-2">
              <nav className="flex space-x-2">
                {[
                  { id: 'campaigns', label: 'Campaigns', icon: Send },
                  { id: 'templates', label: 'Templates', icon: FileText },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'subscribers', label: 'Subscribers', icon: Users },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-teal-500 to-green-600 text-white'
                        : 'text-teal-300 hover:bg-teal-500/20'
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

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/50 border-teal-500/30 text-white placeholder:text-teal-300/50 h-12"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' ? 'bg-teal-500 hover:bg-teal-600' : 'border-teal-500/50 text-teal-300 hover:bg-teal-500/20'}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('active')}
                  className={filterStatus === 'active' ? 'bg-green-500 hover:bg-green-600' : 'border-teal-500/50 text-teal-300 hover:bg-teal-500/20'}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === 'sent' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('sent')}
                  className={filterStatus === 'sent' ? 'bg-blue-500 hover:bg-blue-600' : 'border-teal-500/50 text-teal-300 hover:bg-teal-500/20'}
                >
                  Sent
                </Button>
                <Button
                  variant={filterStatus === 'scheduled' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('scheduled')}
                  className={filterStatus === 'scheduled' ? 'bg-orange-500 hover:bg-orange-600' : 'border-teal-500/50 text-teal-300 hover:bg-teal-500/20'}
                >
                  Scheduled
                </Button>
              </div>
            </motion.div>

            {/* Campaigns List */}
            <div className="space-y-4">
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-teal-500/30 hover:border-green-500/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getStatusColor(campaign.status)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            {getTypeIcon(campaign.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-white text-lg">{campaign.name}</h3>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(campaign.status)} text-white flex items-center space-x-1`}>
                                {getStatusIcon(campaign.status)}
                                <span>{campaign.status}</span>
                              </div>
                            </div>
                            <p className="text-sm text-teal-200/70">{campaign.subject}</p>
                            {campaign.scheduledDate && (
                              <p className="text-xs text-teal-300/60 mt-2 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Scheduled for {campaign.scheduledDate.toLocaleDateString()}
                              </p>
                            )}
                            {campaign.sentDate && (
                              <p className="text-xs text-teal-300/60 mt-2 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Sent {campaign.sentDate.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-teal-500/50 text-teal-300 hover:bg-teal-500/20">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500/50 text-red-300 hover:bg-red-500/20">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="p-3 bg-teal-500/10 rounded-lg border border-teal-500/30">
                          <div className="flex items-center justify-between mb-1">
                            <Users className="w-4 h-4 text-teal-400" />
                            <span className="text-xs text-teal-300/70">Recipients</span>
                          </div>
                          <div className="text-lg font-bold text-white">{campaign.recipients?.toLocaleString() || "0"}</div>
                        </div>

                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                          <div className="flex items-center justify-between mb-1">
                            <Eye className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-green-300/70">Open Rate</span>
                          </div>
                          <div className="text-lg font-bold text-white">{campaign.openRate}%</div>
                        </div>

                        <div className="p-3 bg-teal-500/10 rounded-lg border border-teal-500/30">
                          <div className="flex items-center justify-between mb-1">
                            <MousePointer className="w-4 h-4 text-teal-400" />
                            <span className="text-xs text-teal-300/70">Click Rate</span>
                          </div>
                          <div className="text-lg font-bold text-white">{campaign.clickRate}%</div>
                        </div>

                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                          <div className="flex items-center justify-between mb-1">
                            <Target className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-green-300/70">Conversions</span>
                          </div>
                          <div className="text-lg font-bold text-white">{campaign.conversions || 0}</div>
                        </div>

                        <div className="p-3 bg-teal-500/10 rounded-lg border border-teal-500/30">
                          <div className="flex items-center justify-between mb-1">
                            <DollarSign className="w-4 h-4 text-teal-400" />
                            <span className="text-xs text-teal-300/70">Revenue</span>
                          </div>
                          <div className="text-lg font-bold text-white">${campaign.revenue?.toLocaleString() || "0"}</div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-teal-500/30 hover:border-green-500/50 transition-all h-full">
                  <CardHeader>
                    <div className="w-full h-32 bg-gradient-to-br from-teal-500/20 to-green-500/20 rounded-lg mb-3 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-teal-400" />
                    </div>
                    <CardTitle className="text-white">{template.name}</CardTitle>
                    <CardDescription className="text-teal-200/60">{template.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-teal-200/70 mb-4">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-teal-300/60">{template.uses} uses</span>
                      <Button size="sm" className="bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Card className="bg-black/40 backdrop-blur-sm border-teal-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-teal-400" />
                    <span>Top Performing Campaigns</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {campaigns.slice(0, 3).map((campaign, index) => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 bg-teal-500/10 rounded-lg border border-teal-500/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{campaign.name}</div>
                            <div className="text-xs text-teal-200/70">{campaign.openRate}% open rate</div>
                          </div>
                        </div>
                        <div className="text-white font-bold">${campaign.revenue?.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span>Engagement Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-teal-200/70">Open Rate Trend</span>
                        <span className="text-sm text-green-400 flex items-center">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          +5.2%
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-green-600 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-teal-200/70">Click Rate Trend</span>
                        <span className="text-sm text-green-400 flex items-center">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          +3.8%
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" style={{ width: '58%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-teal-200/70">Conversion Rate</span>
                        <span className="text-sm text-green-400 flex items-center">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          +8.1%
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-teal-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-teal-400" />
                  <span>Subscriber List</span>
                </CardTitle>
                <CardDescription className="text-teal-200/60">Manage your email subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-4 bg-teal-500/10 rounded-lg border border-teal-500/30">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {subscriber.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{subscriber.name}</div>
                          <div className="text-sm text-teal-200/70">{subscriber.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex gap-1">
                          {subscriber.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-teal-500/20 text-teal-300 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          subscriber.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {subscriber.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Best Practices Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-teal-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Star className="w-5 h-5 text-teal-400" />
                <span>Email Marketing Best Practices</span>
              </CardTitle>
              <CardDescription className="text-teal-200/60">Tips to improve your campaign performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Personalize Your Content</div>
                      <div className="text-xs text-teal-200/70">Use subscriber names and segment-specific content</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Compelling Subject Lines</div>
                      <div className="text-xs text-teal-200/70">Keep them short, clear, and action-oriented</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Mobile Optimization</div>
                      <div className="text-xs text-teal-200/70">Ensure emails look great on all devices</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Clear Call-to-Action</div>
                      <div className="text-xs text-teal-200/70">Make it obvious what you want subscribers to do</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Test Before Sending</div>
                      <div className="text-xs text-teal-200/70">Always send test emails to check formatting</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Optimal Send Times</div>
                      <div className="text-xs text-teal-200/70">Schedule emails when your audience is most active</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Segment Your List</div>
                      <div className="text-xs text-teal-200/70">Send targeted content to specific groups</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Track and Analyze</div>
                      <div className="text-xs text-teal-200/70">Monitor metrics to continuously improve</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-green-400" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription className="text-green-200/60">Common tasks for email marketing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/30 hover:border-green-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-teal-300 transition-colors">New Campaign</div>
                      <div className="text-xs text-teal-200/70">Create a new email campaign</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 hover:border-teal-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-green-300 transition-colors">Import Contacts</div>
                      <div className="text-xs text-green-200/70">Add subscribers from CSV</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/30 hover:border-green-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-teal-300 transition-colors">View Reports</div>
                      <div className="text-xs text-teal-200/70">Detailed campaign analytics</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 hover:border-teal-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-green-300 transition-colors">Settings</div>
                      <div className="text-xs text-green-200/70">Configure email preferences</div>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity - Hidden when empty to avoid mock data */}
        {campaigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-teal-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-teal-400" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription className="text-teal-200/60">Latest email marketing updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Real activity would go here */}
                  <div className="text-center py-8 text-teal-200/50">
                    No recent activity to show
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Performance Insights - Hidden when empty to avoid mock data */}
        {campaigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 mb-8"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  <span>AI-Powered Insights</span>
                </CardTitle>
                <CardDescription className="text-green-200/60">Recommendations to improve your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-green-200/50">
                  Insufficient data for AI insights. Start sending campaigns to see recommendations.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Create Campaign Modal */}
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
                className="bg-gradient-to-br from-gray-900 via-teal-950 to-gray-900 border border-teal-500/30 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400">
                    Create New Campaign
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-teal-200 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-teal-200 mb-2">Campaign Name</label>
                    <Input 
                      placeholder="e.g., Summer Sale 2024" 
                      className="bg-black/50 border-teal-500/30 text-white placeholder:text-teal-300/50 h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-teal-200 mb-2">Subject Line</label>
                    <Input 
                      placeholder="e.g., 🔥 Don't Miss Our Summer Sale!" 
                      className="bg-black/50 border-teal-500/30 text-white placeholder:text-teal-300/50 h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-teal-200 mb-2">Campaign Type</label>
                    <select className="w-full p-3 border border-teal-500/30 rounded-lg bg-black/50 text-white h-12">
                      <option value="">Select type</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="promotional">Promotional</option>
                      <option value="automated">Automated</option>
                    </select>
                  </div>
                  
                  <div className="bg-teal-500/10 border border-teal-500/30 p-5 rounded-lg">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-teal-400" />
                      What happens next?
                    </h3>
                    <ul className="space-y-2 text-sm text-teal-200/70">
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Choose a template or design from scratch</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Select your target audience</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Preview and test your email</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Schedule or send immediately</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border-teal-500/50 text-teal-300 hover:bg-teal-500/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCreateModal(false)
                      setSuccess('Campaign created successfully!')
                    }}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Campaign
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
