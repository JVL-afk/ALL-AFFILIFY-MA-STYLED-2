'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Globe, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Eye, 
  Users, 
  TrendingUp, 
  DollarSign,
  BarChart3,
  Settings,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Target,
  Activity,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  MoreVertical,
  Download,
  RefreshCw,
  Star,
  Code,
  Palette,
  Layout,
  Smartphone,
  Monitor,
  X,
  ChevronRight,
  Calendar,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react'

interface Website {
  id: string
  name: string
  url: string
  description: string
  status: 'active' | 'paused' | 'draft'
  createdAt: Date
  updatedAt: Date
  stats: {
    visitors: number
    pageViews: number
    conversions: number
    revenue: number
    conversionRate: number
  }
  performance: {
    uptime: number
    loadTime: number
    seoScore: number
  }
  thumbnail?: string
}

interface WebsiteStats {
  totalWebsites: number
  activeWebsites: number
  totalVisitors: number
  totalRevenue: number
  avgConversionRate: number
}

export default function MyWebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [stats, setStats] = useState<WebsiteStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'draft'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadWebsites()
    loadStats()
  }, [])

  const loadWebsites = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/websites')
      if (response.ok) {
        const data = await response.json()
        setWebsites(data.websites || [])
      }
    } catch (error) {
      console.error('Error loading websites:', error)
      setError('Failed to load websites')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/websites/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const deleteWebsite = async (websiteId: string) => {
    if (!confirm('Are you sure you want to delete this website?')) return

    try {
      const response = await fetch(`/api/websites/${websiteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSuccess('Website deleted successfully')
        await loadWebsites()
        await loadStats()
      } else {
        setError('Failed to delete website')
      }
    } catch (error) {
      setError('Failed to delete website')
    }
  }

  const toggleWebsiteStatus = async (websiteId: string, newStatus: 'active' | 'paused') => {
    try {
      const response = await fetch(`/api/websites/${websiteId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setSuccess(`Website ${newStatus === 'active' ? 'activated' : 'paused'} successfully`)
        await loadWebsites()
      } else {
        setError('Failed to update website status')
      }
    } catch (error) {
      setError('Failed to update website status')
    }
  }

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'from-green-500 to-emerald-600'
      case 'paused':
        return 'from-yellow-500 to-orange-600'
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
      case 'paused':
        return <Clock className="w-4 h-4" />
      case 'draft':
        return <Edit className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         website.url.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || website.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-950 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-200 text-lg">Loading Your Websites...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-950 to-gray-900 p-6">
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
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
                    My Websites
                  </h1>
                  <p className="text-cyan-200/70 text-sm">Manage and monitor your affiliate websites</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => router.push('/dashboard/create-website')}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg shadow-cyan-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Website
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Total Websites</CardTitle>
                <Globe className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalWebsites}</div>
                <p className="text-xs text-cyan-300/60 mt-1">
                  {stats.activeWebsites} active
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-200">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalVisitors?.toLocaleString() || "0"}</div>
                <p className="text-xs text-blue-300/60 mt-1">
                  All websites
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">${stats.totalRevenue?.toLocaleString() || "0"}</div>
                <p className="text-xs text-cyan-300/60 mt-1">
                  Combined earnings
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-200">Avg. Conv. Rate</CardTitle>
                <Target className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.avgConversionRate?.toFixed(2) || "0.00"}%</div>
                <p className="text-xs text-blue-300/60 mt-1">
                  Across all sites
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Active Sites</CardTitle>
                <Activity className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.activeWebsites}</div>
                <p className="text-xs text-cyan-300/60 mt-1">
                  Live now
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

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <Input
              placeholder="Search websites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/50 border-cyan-500/30 text-white placeholder:text-cyan-300/50 h-12"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              className={filterStatus === 'all' ? 'bg-cyan-500 hover:bg-cyan-600' : 'border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20'}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'active' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('active')}
              className={filterStatus === 'active' ? 'bg-green-500 hover:bg-green-600' : 'border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20'}
            >
              Active
            </Button>
            <Button
              variant={filterStatus === 'paused' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('paused')}
              className={filterStatus === 'paused' ? 'bg-yellow-500 hover:bg-yellow-600' : 'border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20'}
            >
              Paused
            </Button>
            <Button
              variant={filterStatus === 'draft' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('draft')}
              className={filterStatus === 'draft' ? 'bg-gray-500 hover:bg-gray-600' : 'border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20'}
            >
              Draft
            </Button>
          </div>
        </motion.div>

        {/* Websites Grid */}
        {filteredWebsites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.map((website, index) => (
              <motion.div
                key={website.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30 hover:border-blue-500/50 transition-all h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-1 flex items-center space-x-2">
                          <Globe className="w-5 h-5 text-cyan-400" />
                          <span>{website.name}</span>
                        </CardTitle>
                        <CardDescription className="text-cyan-200/60 text-sm truncate">
                          {website.url}
                        </CardDescription>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(website.status)} text-white flex items-center space-x-1`}>
                        {getStatusIcon(website.status)}
                        <span>{website.status}</span>
                      </div>
                    </div>

                    {website.description && (
                      <p className="text-sm text-cyan-200/70 line-clamp-2">{website.description}</p>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                        <div className="flex items-center justify-between mb-1">
                          <Users className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs text-cyan-300/70">Visitors</span>
                        </div>
                        <div className="text-lg font-bold text-white">{website.stats.visitors?.toLocaleString() || "0"}</div>
                      </div>

                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                        <div className="flex items-center justify-between mb-1">
                          <Eye className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-blue-300/70">Views</span>
                        </div>
                        <div className="text-lg font-bold text-white">{website.stats.pageViews?.toLocaleString() || "0"}</div>
                      </div>

                      <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                        <div className="flex items-center justify-between mb-1">
                          <Target className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs text-cyan-300/70">Conv.</span>
                        </div>
                        <div className="text-lg font-bold text-white">{website.stats.conversions || 0}</div>
                      </div>

                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                        <div className="flex items-center justify-between mb-1">
                          <DollarSign className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-blue-300/70">Revenue</span>
                        </div>
                        <div className="text-lg font-bold text-white">${website.stats.revenue?.toLocaleString() || "0"}</div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cyan-200/70">Uptime</span>
                        <span className="text-white font-semibold">{website.performance.uptime}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                          style={{ width: `${website.performance.uptime}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cyan-200/70">SEO Score</span>
                        <span className="text-white font-semibold">{website.performance.seoScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"
                          style={{ width: `${website.performance.seoScore}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cyan-200/70">Load Time</span>
                        <span className="text-white font-semibold">{website.performance.loadTime}s</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(website.url, '_blank')}
                        className="flex-1 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Visit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyUrl(website.url, website.id)}
                        className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                      >
                        {copiedId === website.id ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedWebsite(website)}
                        className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteWebsite(website.id)}
                        className="border-red-500/50 text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Websites Yet</h3>
            <p className="text-cyan-200/70 mb-6 max-w-md mx-auto">
              Create your first affiliate website and start earning commissions today!
            </p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg shadow-cyan-500/30"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Website
            </Button>
          </motion.div>
        )}

        {/* Create Website Modal */}
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
                className="bg-gradient-to-br from-gray-900 via-cyan-950 to-gray-900 border border-cyan-500/30 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    Create New Website
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-cyan-200 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-2">Website Name</label>
                    <Input 
                      placeholder="e.g., Tech Gadgets Review" 
                      className="bg-black/50 border-cyan-500/30 text-white placeholder:text-cyan-300/50 h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-2">Description</label>
                    <Input 
                      placeholder="Brief description of your website" 
                      className="bg-black/50 border-cyan-500/30 text-white placeholder:text-cyan-300/50 h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-2">Niche</label>
                    <select className="w-full p-3 border border-cyan-500/30 rounded-lg bg-black/50 text-white h-12">
                      <option value="">Select a niche</option>
                      <option value="tech">Technology</option>
                      <option value="health">Health & Fitness</option>
                      <option value="finance">Finance</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="travel">Travel</option>
                      <option value="food">Food & Cooking</option>
                    </select>
                  </div>
                  
                  <div className="bg-cyan-500/10 border border-cyan-500/30 p-5 rounded-lg">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
                      What happens next?
                    </h3>
                    <ul className="space-y-2 text-sm text-cyan-200/70">
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>AI will generate a professional website structure</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Content will be optimized for your niche</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Affiliate links will be automatically integrated</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Your website will be deployed and ready to use</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCreateModal(false)
                      setSuccess('Website creation started! This may take a few minutes.')
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Website
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


        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription className="text-cyan-200/60">Common tasks for managing your websites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 hover:border-cyan-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-cyan-300 transition-colors">Edit Code</div>
                      <div className="text-xs text-cyan-200/70">Customize your website's code</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30 hover:border-blue-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-cyan-300 transition-colors">Change Theme</div>
                      <div className="text-xs text-cyan-200/70">Update colors and styling</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 hover:border-cyan-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-cyan-300 transition-colors">View Analytics</div>
                      <div className="text-xs text-cyan-200/70">Check performance metrics</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30 hover:border-blue-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-cyan-300 transition-colors">Settings</div>
                      <div className="text-xs text-cyan-200/70">Configure website options</div>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription className="text-blue-200/60">Latest updates across your websites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">Website "Tech Gadgets" went live</div>
                    <div className="text-xs text-cyan-200/70 mt-1">2 hours ago</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">Traffic increased by 45% on "Fitness Pro"</div>
                    <div className="text-xs text-blue-200/70 mt-1">5 hours ago</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">New conversion on "Travel Guide" - $127.50</div>
                    <div className="text-xs text-cyan-200/70 mt-1">1 day ago</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">Code updated on "Home Decor"</div>
                    <div className="text-xs text-blue-200/70 mt-1">2 days ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>Performance Insights</span>
              </CardTitle>
              <CardDescription className="text-cyan-200/60">Key metrics and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1">Top Performer</div>
                      <div className="text-sm text-green-200/70">
                        "Tech Gadgets" has the highest conversion rate at 4.2%. Consider applying similar strategies to other sites.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1">Needs Attention</div>
                      <div className="text-sm text-yellow-200/70">
                        "Home Decor" has a high bounce rate (68%). Consider improving page load speed and content quality.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1">Growth Opportunity</div>
                      <div className="text-sm text-blue-200/70">
                        "Fitness Pro" is gaining traction. Invest in more content to capitalize on the momentum.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1">AI Recommendation</div>
                      <div className="text-sm text-cyan-200/70">
                        Add comparison tables to "Travel Guide" to increase engagement and conversions by an estimated 25%.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Star className="w-5 h-5 text-blue-400" />
                <span>Website Management Best Practices</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Regular Updates</div>
                      <div className="text-xs text-cyan-200/70">Keep your content fresh and up-to-date to maintain rankings</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Monitor Performance</div>
                      <div className="text-xs text-cyan-200/70">Check analytics weekly to identify trends and opportunities</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Optimize for Mobile</div>
                      <div className="text-xs text-cyan-200/70">Ensure your websites look great on all devices</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Test Affiliate Links</div>
                      <div className="text-xs text-cyan-200/70">Verify all links work correctly to avoid lost commissions</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">SEO Optimization</div>
                      <div className="text-xs text-cyan-200/70">Use keywords strategically and build quality backlinks</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Fast Loading</div>
                      <div className="text-xs text-cyan-200/70">Optimize images and code for quick page loads</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Build Trust</div>
                      <div className="text-xs text-cyan-200/70">Add reviews, testimonials, and transparent disclosures</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">A/B Testing</div>
                      <div className="text-xs text-cyan-200/70">Experiment with different layouts and CTAs</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-cyan-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Need help managing your websites?</div>
                    <div className="text-sm text-cyan-200/70 mt-1">
                      Check out our documentation or contact support for assistance.
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20">
                    View Docs
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white">
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
