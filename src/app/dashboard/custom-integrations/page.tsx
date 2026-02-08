'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plug,
  Plus,
  Settings,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Zap,
  Database,
  Mail,
  BarChart3,
  ShoppingCart,
  Globe,
  Code,
  Webhook,
  X,
  Search,
  Filter,
  Download,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Activity,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Link,
  Clock,
  Calendar
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  category: 'analytics' | 'email' | 'ecommerce' | 'social' | 'automation' | 'custom'
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  icon: string
  provider: string
  connectedDate?: Date
  lastSync?: Date
  settings: Record<string, any>
}

interface WebhookEndpoint {
  id: string
  name: string
  url: string
  events: string[]
  status: 'active' | 'inactive'
  secret: string
  createdDate: Date
  lastTriggered?: Date
  deliveryCount: number
}

export default function CustomIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([])
  const [activeTab, setActiveTab] = useState<'integrations' | 'webhooks' | 'custom' | 'marketplace'>('integrations')
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadIntegrationsData()
  }, [])

  const loadIntegrationsData = async () => {
    try {
      const response = await fetch('/api/integrations/data')
      if (response.ok) {
        const result = await response.json()
        setIntegrations(result.data.integrations || [])
        setWebhooks(result.data.webhooks || [])
      } else {
        setIntegrations([])
        setWebhooks([])
      }
    } catch (error) {
      console.error('Error loading integrations data:', error)
      setIntegrations([])
      setWebhooks([])
    }
  }

  const loadIntegrationsDataOld = () => {
    const mockIntegrations: Integration[] = [
      {
        id: '1',
        name: 'Google Analytics',
        description: 'Track website performance and user behavior',
        category: 'analytics',
        status: 'connected',
        icon: '📊',
        provider: 'Google',
        connectedDate: new Date(Date.now() - 86400000 * 15),
        lastSync: new Date(Date.now() - 3600000),
        settings: { trackingId: 'GA-123456789', enhanced: true },
      },
      {
        id: '2',
        name: 'Mailchimp',
        description: 'Email marketing and automation',
        category: 'email',
        status: 'connected',
        icon: '📧',
        provider: 'Mailchimp',
        connectedDate: new Date(Date.now() - 86400000 * 10),
        lastSync: new Date(Date.now() - 7200000),
        settings: { listId: 'abc123', apiKey: 'hidden' },
      },
      {
        id: '3',
        name: 'Shopify',
        description: 'E-commerce platform integration',
        category: 'ecommerce',
        status: 'error',
        icon: '🛒',
        provider: 'Shopify',
        connectedDate: new Date(Date.now() - 86400000 * 5),
        lastSync: new Date(Date.now() - 86400000),
        settings: { storeUrl: 'mystore.shopify.com', webhookUrl: 'configured' },
      },
      {
        id: '4',
        name: 'Facebook Pixel',
        description: 'Track conversions and optimize ads',
        category: 'analytics',
        status: 'disconnected',
        icon: '📘',
        provider: 'Meta',
        settings: {},
      },
      {
        id: '5',
        name: 'Zapier',
        description: 'Automate workflows between apps',
        category: 'automation',
        status: 'connected',
        icon: '⚡',
        provider: 'Zapier',
        connectedDate: new Date(Date.now() - 86400000 * 20),
        lastSync: new Date(Date.now() - 1800000),
        settings: { webhookUrl: 'configured', activeZaps: 3 },
      },
    ]

    const mockWebhooks: WebhookEndpoint[] = [
      {
        id: '1',
        name: 'Website Created Webhook',
        url: 'https://myapp.com/webhooks/website-created',
        events: ['website.created', 'website.published'],
        status: 'active',
        secret: 'whsec_1234567890abcdef',
        createdDate: new Date(Date.now() - 86400000 * 7),
        lastTriggered: new Date(Date.now() - 3600000),
        deliveryCount: 45,
      },
      {
        id: '2',
        name: 'Analytics Webhook',
        url: 'https://analytics.myapp.com/affilify-data',
        events: ['analytics.daily', 'conversion.tracked'],
        status: 'active',
        secret: 'whsec_abcdef1234567890',
        createdDate: new Date(Date.now() - 86400000 * 12),
        lastTriggered: new Date(Date.now() - 7200000),
        deliveryCount: 128,
      },
      {
        id: '3',
        name: 'Payment Webhook',
        url: 'https://billing.myapp.com/affilify-payments',
        events: ['payment.succeeded', 'subscription.updated'],
        status: 'inactive',
        secret: 'whsec_fedcba0987654321',
        createdDate: new Date(Date.now() - 86400000 * 3),
        deliveryCount: 12,
      },
    ]

    setIntegrations(mockIntegrations)
    setWebhooks(mockWebhooks)
  }

  const toggleSecretVisibility = (id: string) => {
    const newVisible = new Set(visibleSecrets)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisibleSecrets(newVisible)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copied to clipboard!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const maskSecret = (secret: string) => {
    return secret.substring(0, 10) + '••••••••••••' + secret.substring(secret.length - 4)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return 'from-green-500 to-emerald-600'
      case 'disconnected':
      case 'inactive':
        return 'from-gray-500 to-gray-600'
      case 'error':
        return 'from-red-500 to-orange-600'
      case 'pending':
        return 'from-orange-500 to-yellow-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analytics':
        return <BarChart3 className="h-5 w-5" />
      case 'email':
        return <Mail className="h-5 w-5" />
      case 'ecommerce':
        return <ShoppingCart className="h-5 w-5" />
      case 'social':
        return <Globe className="h-5 w-5" />
      case 'automation':
        return <Zap className="h-5 w-5" />
      case 'custom':
        return <Code className="h-5 w-5" />
      default:
        return <Plug className="h-5 w-5" />
    }
  }

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 p-6">
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
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Plug className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-orange-400 to-purple-400">
                    Custom Integrations
                  </h1>
                  <p className="text-purple-200/70 text-sm">Connect AFFILIFY with your favorite tools and services</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowConnectModal(true)}
              className="bg-gradient-to-r from-purple-500 to-orange-600 hover:from-purple-600 hover:to-orange-700 text-white shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </motion.div>

        {/* Integration Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Connected</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{integrations.filter(i => i.status === 'connected').length}</div>
              <p className="text-xs text-purple-300/60 mt-1">
                {integrations.length} total integrations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-200">Active Webhooks</CardTitle>
              <Webhook className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{webhooks.filter(w => w.status === 'active').length}</div>
              <p className="text-xs text-orange-300/60 mt-1">
                {webhooks.reduce((sum, w) => sum + w.deliveryCount, 0)} total deliveries
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Data Synced</CardTitle>
              <Database className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">98.5%</div>
              <p className="text-xs text-purple-300/60 mt-1 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1 text-green-400" />
                Success rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-200">Last Sync</CardTitle>
              <Activity className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">2m ago</div>
              <p className="text-xs text-orange-300/60 mt-1">
                All systems operational
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
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardContent className="p-2">
              <nav className="flex space-x-2">
                {[
                  { id: 'integrations', label: 'Integrations', icon: Plug },
                  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
                  { id: 'custom', label: 'Custom', icon: Code },
                  { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-orange-600 text-white'
                        : 'text-purple-300 hover:bg-purple-500/20'
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

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/50 h-12"
              />
            </motion.div>

            {/* Integrations List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIntegrations.map((integration, index) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 hover:border-orange-500/50 transition-all h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="text-4xl">{integration.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-white text-lg">{integration.name}</h3>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(integration.status)} text-white`}>
                                {integration.status}
                              </div>
                            </div>
                            <p className="text-sm text-purple-200/70 mb-2">{integration.description}</p>
                            <div className="flex items-center space-x-2">
                              <div className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded border border-purple-500/30 flex items-center">
                                {getCategoryIcon(integration.category)}
                                <span className="ml-1">{integration.category}</span>
                              </div>
                              <div className="text-xs text-purple-200/70">{integration.provider}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {integration.status === 'connected' && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                            <div className="flex items-center justify-between mb-1">
                              <Calendar className="w-4 h-4 text-purple-400" />
                              <span className="text-xs text-purple-300/70">Connected</span>
                            </div>
                            <div className="text-sm font-bold text-white">
                              {integration.connectedDate ? `${Math.floor((Date.now() - integration.connectedDate.getTime()) / 86400000)}d ago` : 'N/A'}
                            </div>
                          </div>

                          <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                            <div className="flex items-center justify-between mb-1">
                              <Clock className="w-4 h-4 text-orange-400" />
                              <span className="text-xs text-orange-300/70">Last Sync</span>
                            </div>
                            <div className="text-sm font-bold text-white">
                              {integration.lastSync ? `${Math.floor((Date.now() - integration.lastSync.getTime()) / 3600000)}h ago` : 'Never'}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {integration.status === 'connected' ? (
                          <>
                            <Button size="sm" variant="outline" className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 border-orange-500/50 text-orange-300 hover:bg-orange-500/20">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Sync Now
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-orange-600 hover:from-purple-600 hover:to-orange-700 text-white">
                            <Link className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <div className="space-y-4">
            {webhooks.map((webhook, index) => (
              <motion.div
                key={webhook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 hover:border-orange-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-white text-lg">{webhook.name}</h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(webhook.status)} text-white`}>
                            {webhook.status}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <code className="text-sm text-purple-300 bg-purple-500/10 px-3 py-1 rounded border border-purple-500/30 font-mono flex-1">
                            {webhook.url}
                          </code>
                          <button
                            onClick={() => copyToClipboard(webhook.url)}
                            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4 text-purple-400" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-sm text-purple-200/70">Secret:</span>
                          <code className="text-sm text-orange-300 bg-orange-500/10 px-3 py-1 rounded border border-orange-500/30 font-mono">
                            {visibleSecrets.has(webhook.id) ? webhook.secret : maskSecret(webhook.secret)}
                          </code>
                          <button
                            onClick={() => toggleSecretVisibility(webhook.id)}
                            className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
                          >
                            {visibleSecrets.has(webhook.id) ? (
                              <EyeOff className="w-4 h-4 text-orange-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-orange-400" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(webhook.secret)}
                            className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4 text-orange-400" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {webhook.events.map((event) => (
                            <span key={event} className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded border border-purple-500/30">
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500/50 text-red-300 hover:bg-red-500/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                        <div className="flex items-center justify-between mb-1">
                          <Activity className="w-4 h-4 text-purple-400" />
                          <span className="text-xs text-purple-300/70">Deliveries</span>
                        </div>
                        <div className="text-lg font-bold text-white">{webhook.deliveryCount}</div>
                      </div>

                      <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                        <div className="flex items-center justify-between mb-1">
                          <Clock className="w-4 h-4 text-orange-400" />
                          <span className="text-xs text-orange-300/70">Last Triggered</span>
                        </div>
                        <div className="text-sm font-bold text-white">
                          {webhook.lastTriggered ? `${Math.floor((Date.now() - webhook.lastTriggered.getTime()) / 3600000)}h ago` : 'Never'}
                        </div>
                      </div>

                      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                        <div className="flex items-center justify-between mb-1">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="text-xs text-purple-300/70">Created</span>
                        </div>
                        <div className="text-sm font-bold text-white">
                          {Math.floor((Date.now() - webhook.createdDate.getTime()) / 86400000)}d ago
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Button
              onClick={() => setShowConnectModal(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-orange-600 hover:from-purple-600 hover:to-orange-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Webhook
            </Button>
          </div>
        )}

        {/* Custom Tab */}
        {activeTab === 'custom' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Code className="w-5 h-5 text-purple-400" />
                  <span>Custom Integration Builder</span>
                </CardTitle>
                <CardDescription className="text-purple-200/60">Build your own custom integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                      Getting Started
                    </h3>
                    <p className="text-sm text-purple-200/70 mb-3">
                      Create custom integrations using our API and webhook system:
                    </p>
                    <ul className="space-y-2 text-sm text-purple-200/70">
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Use our REST API to programmatically manage your data</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Set up webhooks to receive real-time event notifications</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Build custom workflows tailored to your needs</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Code className="w-4 h-4 mr-2 text-orange-400" />
                      Example Code
                    </h3>
                    <p className="text-sm text-orange-200/70 mb-3">
                      Here's a simple example to get you started:
                    </p>
                    <code className="block bg-black/50 p-3 rounded border border-orange-500/30 text-orange-300 text-sm font-mono whitespace-pre">
{`// Initialize AFFILIFY client
const affilify = new AFFILIFY({
  apiKey: 'your_api_key_here'
});

// Create a new website
const website = await affilify.websites.create({
  name: 'My Affiliate Site',
  niche: 'tech',
  product: 'iPhone 15 Pro'
});

console.log(website.id);`}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[
              { name: 'Stripe', icon: '💳', category: 'Payment', description: 'Accept payments and manage subscriptions' },
              { name: 'Slack', icon: '💬', category: 'Communication', description: 'Team notifications and alerts' },
              { name: 'Airtable', icon: '📊', category: 'Database', description: 'Sync data with Airtable bases' },
              { name: 'Notion', icon: '📝', category: 'Productivity', description: 'Document and knowledge management' },
              { name: 'Discord', icon: '🎮', category: 'Community', description: 'Community engagement and notifications' },
              { name: 'Telegram', icon: '✈️', category: 'Messaging', description: 'Bot notifications and alerts' },
            ].map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 hover:border-orange-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3">{app.icon}</div>
                    <h3 className="font-semibold text-white text-lg mb-1">{app.name}</h3>
                    <div className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded border border-purple-500/30 inline-block mb-2">
                      {app.category}
                    </div>
                    <p className="text-sm text-purple-200/70 mb-4">{app.description}</p>
                    <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-orange-600 hover:from-purple-600 hover:to-orange-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Install
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-orange-400" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription className="text-orange-200/60">Common integration tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30 hover:border-orange-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-purple-300 transition-colors">Add Integration</div>
                      <div className="text-xs text-purple-200/70">Connect new service</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30 hover:border-purple-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Webhook className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-orange-300 transition-colors">Create Webhook</div>
                      <div className="text-xs text-orange-200/70">Set up event listener</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30 hover:border-orange-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-purple-300 transition-colors">Export Data</div>
                      <div className="text-xs text-purple-200/70">Download sync logs</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30 hover:border-purple-500/50 transition-all text-left group">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-1 group-hover:text-orange-300 transition-colors">Settings</div>
                      <div className="text-xs text-orange-200/70">Configure integrations</div>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Integration Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <span>Integration Health</span>
              </CardTitle>
              <CardDescription className="text-purple-200/60">Monitor integration performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-200/70">System Status</span>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">Operational</div>
                  <div className="text-xs text-purple-200/70">All integrations running</div>
                </div>

                <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-200/70">Sync Success</span>
                    <CheckCircle className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">98.5%</div>
                  <div className="text-xs text-orange-200/70">Last 30 days</div>
                </div>

                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-purple-200/70">Avg Latency</span>
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">120ms</div>
                  <div className="text-xs text-purple-200/70">Response time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Connect Modal */}
        <AnimatePresence>
          {showConnectModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowConnectModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 border border-purple-500/30 rounded-xl p-6 w-full max-w-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400">
                    Add New Integration
                  </h2>
                  <button
                    onClick={() => setShowConnectModal(false)}
                    className="text-purple-200 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Integration Name</label>
                    <Input
                      placeholder="e.g., Google Analytics"
                      className="bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/50 h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Analytics', 'Email', 'E-commerce', 'Social', 'Automation', 'Custom'].map((cat) => (
                        <label key={cat} className="flex items-center space-x-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30 cursor-pointer hover:bg-purple-500/20 transition-colors">
                          <input type="radio" name="category" className="text-purple-500" />
                          <span className="text-sm text-purple-200">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/30 p-5 rounded-lg">
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                      Integration Tips
                    </h3>
                    <ul className="space-y-2 text-sm text-purple-200/70">
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Ensure you have the necessary API credentials</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Test the connection before saving</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Configure webhooks for real-time updates</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowConnectModal(false)}
                    className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowConnectModal(false)
                      setSuccess('Integration added successfully!')
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-orange-600 hover:from-purple-600 hover:to-orange-700 text-white"
                  >
                    <Plug className="w-4 h-4 mr-2" />
                    Connect Integration
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


        {/* Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-sm border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                <span>Integration Best Practices</span>
              </CardTitle>
              <CardDescription className="text-orange-200/60">Tips for optimal integration usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Secure Your Credentials</div>
                      <div className="text-xs text-orange-200/70">Never share API keys or secrets publicly</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Monitor Sync Status</div>
                      <div className="text-xs text-orange-200/70">Regularly check integration health</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Test Before Production</div>
                      <div className="text-xs text-orange-200/70">Verify integrations in development first</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Use Webhooks Wisely</div>
                      <div className="text-xs text-orange-200/70">Subscribe only to necessary events</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Handle Errors Gracefully</div>
                      <div className="text-xs text-orange-200/70">Implement retry logic for failed syncs</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-medium text-sm">Keep Documentation Handy</div>
                      <div className="text-xs text-orange-200/70">Refer to API docs for troubleshooting</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
