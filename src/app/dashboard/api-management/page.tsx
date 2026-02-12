'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Settings, 
  BarChart3, 
  Shield, 
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  X,
  Search,
  Filter,
  Download,
  Code,
  Terminal,
  FileText,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Book,
  Globe,
  Calendar
} from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  status: 'active' | 'inactive' | 'expired'
  createdDate: Date
  lastUsed?: Date
  expiryDate?: Date
  requestCount: number
  rateLimit: number
}

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  requiredPermissions: string[]
  rateLimit: string
  status: 'active' | 'deprecated'
}

interface ApiUsage {
  date: string
  requests: number
  errors: number
  avgResponseTime: number
}

export default function ApiManagementPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([])
  const [usage, setUsage] = useState<ApiUsage[]>([])
  const [activeTab, setActiveTab] = useState<'keys' | 'endpoints' | 'usage' | 'docs'>('keys')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [stats, setStats] = useState({
    activeKeys: 0,
    requestsToday: 0,
    successRate: 0,
    avgResponseTime: 0
  })

  useEffect(() => {
    loadApiData()
  }, [])

  const loadApiData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/api-management/data')
      if (response.ok) {
        const result = await response.json()
        setApiKeys(result.data.apiKeys || [])
        setStats(result.data.stats || {
          activeKeys: 0,
          requestsToday: 0,
          successRate: 0,
          avgResponseTime: 0
        })
        // Endpoints are static, can be defined here or fetched
        setEndpoints([])
        setUsage([])
      } else {
        setApiKeys([])
        setEndpoints([])
        setUsage([])
      }
    } catch (error) {
      console.error('Error loading API data:', error)
      setApiKeys([])
      setEndpoints([])
      setUsage([])
    } finally {
      setLoading(false)
    }
  }

  const loadApiDataOld = () => {
    const mockKeys: ApiKey[] = [
      {
        id: '1',
        name: 'Production API Key',
        key: 'aff_live_sk_1234567890abcdef',
        permissions: ['websites:read', 'websites:write', 'analytics:read'],
        status: 'active',
        createdDate: new Date(Date.now() - 86400000 * 30),
        lastUsed: new Date(Date.now() - 3600000),
        requestCount: 15420,
        rateLimit: 1000,
      },
      {
        id: '2',
        name: 'Development API Key',
        key: 'aff_test_sk_abcdef1234567890',
        permissions: ['websites:read', 'analytics:read'],
        status: 'active',
        createdDate: new Date(Date.now() - 86400000 * 15),
        lastUsed: new Date(Date.now() - 7200000),
        requestCount: 3250,
        rateLimit: 500,
      },
      {
        id: '3',
        name: 'Legacy Integration',
        key: 'aff_live_sk_legacy123456789',
        permissions: ['websites:read'],
        status: 'inactive',
        createdDate: new Date(Date.now() - 86400000 * 90),
        lastUsed: new Date(Date.now() - 86400000 * 7),
        expiryDate: new Date(Date.now() + 86400000 * 30),
        requestCount: 8750,
        rateLimit: 100,
      },
    ]

    const mockEndpoints: ApiEndpoint[] = [
      {
        method: 'GET',
        path: '/api/websites',
        description: 'Retrieve all websites',
        requiredPermissions: ['websites:read'],
        rateLimit: '100/hour',
        status: 'active',
      },
      {
        method: 'POST',
        path: '/api/websites',
        description: 'Create a new website',
        requiredPermissions: ['websites:write'],
        rateLimit: '50/hour',
        status: 'active',
      },
      {
        method: 'GET',
        path: '/api/websites/{id}',
        description: 'Retrieve a specific website',
        requiredPermissions: ['websites:read'],
        rateLimit: '200/hour',
        status: 'active',
      },
      {
        method: 'PUT',
        path: '/api/websites/{id}',
        description: 'Update a website',
        requiredPermissions: ['websites:write'],
        rateLimit: '50/hour',
        status: 'active',
      },
      {
        method: 'DELETE',
        path: '/api/websites/{id}',
        description: 'Delete a website',
        requiredPermissions: ['websites:delete'],
        rateLimit: '10/hour',
        status: 'active',
      },
      {
        method: 'GET',
        path: '/api/analytics',
        description: 'Retrieve analytics data',
        requiredPermissions: ['analytics:read'],
        rateLimit: '100/hour',
        status: 'active',
      },
      {
        method: 'POST',
        path: '/api/generate',
        description: 'Generate website content using AI',
        requiredPermissions: ['ai:generate'],
        rateLimit: '20/hour',
        status: 'active',
      },
    ]

    const mockUsage: ApiUsage[] = [
      { date: '2024-01-01', requests: 1250, errors: 12, avgResponseTime: 245 },
      { date: '2024-01-02', requests: 1380, errors: 8, avgResponseTime: 230 },
      { date: '2024-01-03', requests: 1420, errors: 15, avgResponseTime: 280 },
      { date: '2024-01-04', requests: 1580, errors: 6, avgResponseTime: 210 },
      { date: '2024-01-05', requests: 1650, errors: 9, avgResponseTime: 225 },
    ]

    setApiKeys(mockKeys)
    setEndpoints(mockEndpoints)
    setUsage(mockUsage)
  }

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId)
    } else {
      newVisible.add(keyId)
    }
    setVisibleKeys(newVisible)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('API key copied to clipboard!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const maskApiKey = (key: string) => {
    return key.substring(0, 12) + '••••••••••••••••' + key.substring(key.length - 4)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'from-green-500 to-emerald-600'
      case 'inactive':
        return 'from-gray-500 to-gray-600'
      case 'expired':
        return 'from-red-500 to-orange-600'
      case 'deprecated':
        return 'from-orange-500 to-yellow-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'from-blue-500 to-cyan-600'
      case 'POST':
        return 'from-green-500 to-emerald-600'
      case 'PUT':
        return 'from-orange-500 to-yellow-600'
      case 'DELETE':
        return 'from-red-500 to-orange-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const filteredKeys = apiKeys.filter(key =>
    key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    key.key.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 p-6">
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
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Key className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-green-400">
                    API Management
                  </h1>
                  <p className="text-green-200/70 text-sm">Manage API keys, monitor usage, and access documentation</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white shadow-lg shadow-green-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </div>
        </motion.div>

        {/* API Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">Active Keys</CardTitle>
              <Key className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{apiKeys.filter(k => k.status === 'active').length}</div>
              <p className="text-xs text-green-300/60 mt-1">
                {apiKeys.length} total keys
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-200">Requests Today</CardTitle>
              <BarChart3 className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.requestsToday.toLocaleString()}</div>
              <p className="text-xs text-cyan-300/60 mt-1">
                API requests today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.successRate}%</div>
              <p className="text-xs text-green-300/60 mt-1">
                Success rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-200">Avg Response</CardTitle>
              <Clock className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.avgResponseTime}ms</div>
              <p className="text-xs text-cyan-300/60 mt-1">
                Average response time
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
          <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
            <CardContent className="p-2">
              <nav className="flex space-x-2">
                {[
                  { id: 'keys', label: 'API Keys', icon: Key },
                  { id: 'endpoints', label: 'Endpoints', icon: Terminal },
                  { id: 'usage', label: 'Usage', icon: BarChart3 },
                  { id: 'docs', label: 'Documentation', icon: Book },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-green-500 to-cyan-600 text-white'
                        : 'text-green-300 hover:bg-green-500/20'
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

        {/* API Keys Tab */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
              <Input
                placeholder="Search API keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/50 border-green-500/30 text-white placeholder:text-green-300/50 h-12"
              />
            </motion.div>

            {/* API Keys List */}
            <div className="space-y-4">
              {filteredKeys.map((apiKey, index) => (
                <motion.div
                  key={apiKey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-green-500/30 hover:border-cyan-500/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-white text-lg">{apiKey.name}</h3>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(apiKey.status)} text-white`}>
                              {apiKey.status}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <code className="text-sm text-green-300 bg-green-500/10 px-3 py-1 rounded border border-green-500/30 font-mono">
                              {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                            </code>
                            <button
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                            >
                              {visibleKeys.has(apiKey.id) ? (
                                <EyeOff className="w-4 h-4 text-green-400" />
                              ) : (
                                <Eye className="w-4 h-4 text-green-400" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(apiKey.key)}
                              className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4 text-cyan-400" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {apiKey.permissions.map((permission) => (
                              <span key={permission} className="px-2 py-1 bg-cyan-500/10 text-cyan-300 text-xs rounded border border-cyan-500/30">
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-green-500/50 text-green-300 hover:bg-green-500/20">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500/50 text-red-300 hover:bg-red-500/20">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                          <div className="flex items-center justify-between mb-1">
                            <Activity className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-green-300/70">Requests</span>
                          </div>
                          <div className="text-lg font-bold text-white">{apiKey.requestCount.toLocaleString()}</div>
                        </div>

                        <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                          <div className="flex items-center justify-between mb-1">
                            <Zap className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs text-cyan-300/70">Rate Limit</span>
                          </div>
                          <div className="text-lg font-bold text-white">{apiKey.rateLimit}/h</div>
                        </div>

                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                          <div className="flex items-center justify-between mb-1">
                            <Clock className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-green-300/70">Last Used</span>
                          </div>
                          <div className="text-sm font-bold text-white">
                            {apiKey.lastUsed ? `${Math.floor((Date.now() - apiKey.lastUsed.getTime()) / 3600000)}h ago` : 'Never'}
                          </div>
                        </div>

                        <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                          <div className="flex items-center justify-between mb-1">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs text-cyan-300/70">Created</span>
                          </div>
                          <div className="text-sm font-bold text-white">
                            {Math.floor((Date.now() - apiKey.createdDate.getTime()) / 86400000)}d ago
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Endpoints Tab */}
        {activeTab === 'endpoints' && (
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-green-500/30 hover:border-cyan-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${getMethodColor(endpoint.method)} text-white`}>
                          {endpoint.method}
                        </div>
                        <code className="text-green-300 font-mono text-sm">{endpoint.path}</code>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(endpoint.status)} text-white`}>
                        {endpoint.status}
                      </div>
                    </div>

                    <p className="text-sm text-green-200/70 mb-3">{endpoint.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-green-200/70">Permissions:</span>
                        <div className="flex gap-1">
                          {endpoint.requiredPermissions.map((perm) => (
                            <span key={perm} className="px-2 py-0.5 bg-green-500/10 text-green-300 text-xs rounded border border-green-500/30">
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-200/70">Rate Limit:</span>
                        <span className="text-white font-semibold">{endpoint.rateLimit}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <span>API Usage Statistics</span>
                </CardTitle>
                <CardDescription className="text-green-200/60">Track your API consumption over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usage.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-white font-medium">{new Date(day.date).toLocaleDateString()}</div>
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-green-200/70">Requests</div>
                            <div className="text-white font-bold">{day.requests.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-green-200/70">Errors</div>
                            <div className="text-white font-bold">{day.errors}</div>
                          </div>
                          <div>
                            <div className="text-xs text-green-200/70">Avg Response</div>
                            <div className="text-white font-bold">{day.avgResponseTime}ms</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-green-400">
                        {index > 0 && day.requests > usage[index - 1].requests ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-cyan-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Book className="w-5 h-5 text-green-400" />
                  <span>Getting Started</span>
                </CardTitle>
                <CardDescription className="text-green-200/60">Quick guide to using the AFFILIFY API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-green-400" />
                      Authentication
                    </h3>
                    <p className="text-sm text-green-200/70 mb-3">
                      Include your API key in the Authorization header of every request:
                    </p>
                    <code className="block bg-black/50 p-3 rounded border border-green-500/30 text-green-300 text-sm font-mono">
                      Authorization: Bearer aff_live_sk_your_api_key_here
                    </code>
                  </div>

                  <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Code className="w-4 h-4 mr-2 text-cyan-400" />
                      Example Request
                    </h3>
                    <p className="text-sm text-cyan-200/70 mb-3">
                      Here's a simple example using cURL:
                    </p>
                    <code className="block bg-black/50 p-3 rounded border border-cyan-500/30 text-cyan-300 text-sm font-mono whitespace-pre">
{`curl -X GET https://api.affilify.eu/v1/websites \\
  -H "Authorization: Bearer aff_live_sk_your_api_key_here" \\
  -H "Content-Type: application/json"`}
                    </code>
                  </div>

                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Terminal className="w-4 h-4 mr-2 text-green-400" />
                      Response Format
                    </h3>
                    <p className="text-sm text-green-200/70 mb-3">
                      All responses are returned in JSON format:
                    </p>
                    <code className="block bg-black/50 p-3 rounded border border-green-500/30 text-green-300 text-sm font-mono whitespace-pre">
{`{
  "success": true,
  "data": {
    "websites": [...]
  },
  "meta": {
    "total": 42,
    "page": 1
  }
}`}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span>Rate Limiting</span>
                </CardTitle>
                <CardDescription className="text-cyan-200/60">Understand API rate limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Rate limits are per API key</div>
                      <div className="text-xs text-cyan-200/70">Each endpoint has its own limit</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Limits reset every hour</div>
                      <div className="text-xs text-cyan-200/70">Check X-RateLimit-Reset header</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">429 status code when exceeded</div>
                      <div className="text-xs text-cyan-200/70">Implement exponential backoff</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Create API Key Modal */}
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
                className="bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 border border-green-500/30 rounded-xl p-6 w-full max-w-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                    Create New API Key
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-green-200 mb-2">Key Name</label>
                    <Input 
                      placeholder="e.g., Production API Key" 
                      className="bg-black/50 border-green-500/30 text-white placeholder:text-green-300/50 h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-green-200 mb-2">Permissions</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['websites:read', 'websites:write', 'analytics:read', 'ai:generate'].map((perm) => (
                        <label key={perm} className="flex items-center space-x-2 p-3 bg-green-500/10 rounded-lg border border-green-500/30 cursor-pointer hover:bg-green-500/20 transition-colors">
                          <input type="checkbox" className="rounded border-green-500/50" />
                          <span className="text-sm text-green-200">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/30 p-5 rounded-lg">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-green-400" />
                      Important Security Notes
                    </h3>
                    <ul className="space-y-2 text-sm text-green-200/70">
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Store your API key securely - it won't be shown again</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Never commit API keys to version control</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Rotate keys regularly for security</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border-green-500/50 text-green-300 hover:bg-green-500/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCreateModal(false)
                      setSuccess('API key created successfully!')
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Create API Key
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


        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription className="text-cyan-200/60">Common API management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 hover:border-cyan-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-green-300 transition-colors">New API Key</div>
                      <div className="text-xs text-green-200/70">Create a new key</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30 hover:border-green-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Book className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-cyan-300 transition-colors">View Docs</div>
                      <div className="text-xs text-cyan-200/70">API documentation</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 hover:border-cyan-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-green-300 transition-colors">Export Logs</div>
                      <div className="text-xs text-green-200/70">Download API logs</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30 hover:border-green-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-cyan-300 transition-colors">Settings</div>
                      <div className="text-xs text-cyan-200/70">Configure API</div>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Health Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span>API Health Status</span>
              </CardTitle>
              <CardDescription className="text-green-200/60">Real-time system status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-200/70">API Status</span>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">Operational</div>
                  <div className="text-xs text-green-200/70">All systems running smoothly</div>
                </div>

                <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-cyan-200/70">Uptime</span>
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">99.98%</div>
                  <div className="text-xs text-cyan-200/70">Last 30 days</div>
                </div>

                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-200/70">Latency</span>
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">45ms</div>
                  <div className="text-xs text-green-200/70">Average response time</div>
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
          <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>API Best Practices</span>
              </CardTitle>
              <CardDescription className="text-cyan-200/60">Tips for optimal API usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Use HTTPS Only</div>
                      <div className="text-xs text-cyan-200/70">Always use secure connections for API calls</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Implement Retry Logic</div>
                      <div className="text-xs text-cyan-200/70">Handle transient errors gracefully</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Cache Responses</div>
                      <div className="text-xs text-cyan-200/70">Reduce API calls with intelligent caching</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Monitor Usage</div>
                      <div className="text-xs text-cyan-200/70">Track API consumption to avoid limits</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Version Your Integrations</div>
                      <div className="text-xs text-cyan-200/70">Specify API version in requests</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Handle Errors Properly</div>
                      <div className="text-xs text-cyan-200/70">Check status codes and error messages</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
