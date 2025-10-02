'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { 
  Globe, 
  Eye, 
  MousePointer, 
  DollarSign, 
  Calendar,
  ExternalLink,
  Edit,
  Trash2,
  Rocket,
  Copy,
  MoreVertical,
  Plus,
  Filter,
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react'

interface Website {
  id: string
  title: string
  description: string
  template: string
  status: 'draft' | 'published' | 'archived'
  url?: string
  views: number
  clicks: number
  conversions: number
  revenue: number
  createdAt: string
  updatedAt: string
}

export default function MyWebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadWebsites()
  }, [])

  const loadWebsites = async () => {
    try {
      const response = await fetch('/api/websites')
      if (response.ok) {
        const data = await response.json()
        setWebsites(data.websites)
      } else {
        setError('Failed to load websites')
      }
    } catch (error) {
      console.error('Error loading websites:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDeploy = async (websiteId: string) => {
    setDeploying(websiteId)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/websites/${websiteId}/deploy`, {
        method: 'POST'
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Website deployed successfully! Live at: ${data.url}`)
        await loadWebsites() // Refresh the list
      } else {
        setError(data.error || 'Failed to deploy website')
      }
    } catch (error) {
      console.error('Deployment error:', error)
      setError('An unexpected error occurred during deployment')
    } finally {
      setDeploying(null)
    }
  }

  const handleDelete = async (websiteId: string) => {
    if (!confirm('Are you sure you want to delete this website? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/websites/${websiteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSuccess('Website deleted successfully')
        await loadWebsites() // Refresh the list
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete website')
      }
    } catch (error) {
      console.error('Delete error:', error)
      setError('An unexpected error occurred')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('URL copied to clipboard!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const filteredWebsites = websites.filter(website => {
    const matchesFilter = filter === 'all' || website.status === filter
    const matchesSearch = website.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         website.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4" />
      case 'draft':
        return <Clock className="w-4 h-4" />
      case 'archived':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const totalStats = websites.reduce((acc, website) => ({
    views: acc.views + website.views,
    clicks: acc.clicks + website.clicks,
    revenue: acc.revenue + website.revenue
  }), { views: 0, clicks: 0, revenue: 0 })

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Websites</h1>
          <p className="text-gray-600">Manage and track your affiliate websites</p>
        </div>
        <Link href="/dashboard/create-website">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Website
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{websites.length}</div>
            <p className="text-xs text-muted-foreground">
              {websites.filter(w => w.status === 'published').length} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.views?.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground">
              Across all websites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.clicks?.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground">
              {totalStats.views > 0 ? ((totalStats.clicks / totalStats.views) * 100).toFixed(2) : '0.00'}% CTR
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ${totalStats.clicks > 0 ? (totalStats.revenue / totalStats.clicks).toFixed(2) : '0.00'} per click
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
        
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search websites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Websites Grid */}
      {filteredWebsites.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {websites.length === 0 ? 'No websites yet' : 'No websites match your filters'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {websites.length === 0 
              ? 'Get started by creating your first affiliate website.' 
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {websites.length === 0 && (
            <div className="mt-6">
              <Link href="/dashboard/create-website">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Website
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map((website) => (
            <Card key={website.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{website.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {website.description}
                    </CardDescription>
                  </div>
                  <div className="ml-2">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(website.status)}`}>
                    {getStatusIcon(website.status)}
                    <span>{website.status}</span>
                  </div>
                  <span className="text-xs text-gray-500">{website.template}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">{website.views?.toLocaleString() || "0"}</div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{website.clicks?.toLocaleString() || "0"}</div>
                    <div className="text-xs text-gray-500">Clicks</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">${website.revenue.toFixed(0)}</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
                
                {website.url && (
                  <div className="mb-4 p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 truncate flex-1">{website.url}</span>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(website.url!)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(website.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {website.status === 'draft' && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleDeploy(website.id)}
                      disabled={deploying === website.id}
                      className="flex-1"
                    >
                      {deploying === website.id ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-3 h-3 mr-1" />
                          Deploy
                        </>
                      )}
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(website.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  Created {new Date(website.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

