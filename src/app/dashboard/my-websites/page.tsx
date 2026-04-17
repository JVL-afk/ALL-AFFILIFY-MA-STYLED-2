'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Sparkles,
  DollarSign as MonetizationIcon
} from 'lucide-react'
import { MonetizationEditModal } from '@/components/crm/MonetizationEditModal'

interface Website {
  id: string
  name: string
  title?: string
  url: string
  description: string
  status: 'active' | 'paused' | 'draft' | 'published'
  createdAt: Date
  updatedAt: Date
  monetization?: any
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'draft' | 'published'>('all')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userPlan, setUserPlan] = useState<'basic' | 'pro' | 'enterprise'>('basic')
  const [isMonetizationModalOpen, setIsMonetizationModalOpen] = useState(false)
  const [websiteToEdit, setWebsiteToEdit] = useState<Website | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadWebsites()
    loadStats()
    fetchUserPlan()
  }, [])

  const fetchUserPlan = async () => {
    try {
      const response = await fetch('/api/user/data')
      if (response.ok) {
        const data = await response.json()
        setUserPlan(data.plan || 'basic')
      }
    } catch (error) {
      console.error('Error fetching user plan:', error)
    }
  }

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

  const handleSaveMonetization = async (updatedMonetization: any) => {
    if (!websiteToEdit) return

    try {
      const response = await fetch(`/api/websites/${websiteToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monetization: updatedMonetization })
      })

      if (response.ok) {
        setSuccess('Monetization settings updated successfully')
        await loadWebsites()
      } else {
        setError('Failed to update monetization settings')
      }
    } catch (error) {
      setError('Failed to update monetization settings')
    }
  }

  const filteredWebsites = websites.filter(website => {
    const name = website.name || website.title || ''
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (website.url || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || website.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-200 text-lg">Loading Your Websites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-950 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Total Websites</CardTitle>
                <Globe className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalWebsites}</div>
                <p className="text-xs text-cyan-300/60 mt-1">{stats.activeWebsites} active</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-200">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalVisitors?.toLocaleString() || "0"}</div>
                <p className="text-xs text-blue-300/60 mt-1">All websites</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">${stats.totalRevenue?.toLocaleString() || "0"}</div>
                <p className="text-xs text-cyan-300/60 mt-1">Combined earnings</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Website Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map((website) => (
            <Card key={website.id} className="bg-black/40 backdrop-blur-sm border-cyan-500/30 overflow-hidden group">
              <div className="h-48 bg-gray-800 relative overflow-hidden">
                {website.thumbnail ? (
                  <img src={website.thumbnail} alt={website.name || website.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <Globe className="w-12 h-12 text-cyan-500/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => window.open(website.url, '_blank')}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      setWebsiteToEdit(website)
                      setIsMonetizationModalOpen(true)
                    }}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <MonetizationIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteWebsite(website.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 truncate">{website.name || website.title}</h3>
                <p className="text-cyan-200/60 text-sm line-clamp-2 mb-4">{website.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-cyan-400">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs font-medium">{website.stats?.visitors || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-medium">${website.stats?.revenue || 0}</span>
                    </div>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    {website.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Monetization Edit Modal */}
      {websiteToEdit && (
        <MonetizationEditModal
          isOpen={isMonetizationModalOpen}
          onClose={() => {
            setIsMonetizationModalOpen(false)
            setWebsiteToEdit(null)
          }}
          website={websiteToEdit}
          userPlan={userPlan}
          onSave={handleSaveMonetization}
        />
      )}
    </div>
  )
}
