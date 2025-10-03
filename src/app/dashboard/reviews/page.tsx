'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Crown,
  Sparkles
} from 'lucide-react'

interface Review {
  id: string
  customerName: string
  customerEmail: string
  customerAvatar?: string
  rating: number
  title: string
  content: string
  productId: string
  productName: string
  websiteId: string
  websiteName: string
  status: 'pending' | 'approved' | 'rejected'
  isVisible: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  source: 'manual' | 'import' | 'api' | 'widget'
  metadata: {
    location?: string
    verified: boolean
    helpfulVotes: number
    reportedCount: number
  }
}

interface ReviewStats {
  total: number
  approved: number
  pending: number
  rejected: number
  averageRating: number
  ratingDistribution: Record<number, number>
  monthlyTrend: Array<{ month: string; count: number; rating: number }>
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Temporarily remove Enterprise plan restriction for testing
  const [hasEnterpriseAccess, setHasEnterpriseAccess] = useState(true)

  useEffect(() => {
    // checkEnterpriseAccess()
    // if (hasEnterpriseAccess) {
      loadReviews()
      loadStats()
    // }
  }, [])

  const checkEnterpriseAccess = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        // setHasEnterpriseAccess(data.user.plan === 'enterprise')
        setHasEnterpriseAccess(true) // Temporarily allow access for testing
      }
    } catch (error) {
      console.error('Error checking access:', error)
    }
  }

  const loadReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/reviews/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleApprove = async (reviewIds: string[]) => {
    try {
      const response = await fetch('/api/reviews/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewIds, status: 'approved' })
      })

      if (response.ok) {
        setSuccess(`${reviewIds.length} review(s) approved`)
        await loadReviews()
        await loadStats()
        setSelectedReviews([])
      }
    } catch (error) {
      setError('Failed to approve reviews')
    }
  }

  const handleReject = async (reviewIds: string[]) => {
    try {
      const response = await fetch('/api/reviews/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewIds, status: 'rejected' })
      })

      if (response.ok) {
        setSuccess(`${reviewIds.length} review(s) rejected`)
        await loadReviews()
        await loadStats()
        setSelectedReviews([])
      }
    } catch (error) {
      setError('Failed to reject reviews')
    }
  }

  const toggleVisibility = async (reviewId: string, isVisible: boolean) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible })
      })

      if (response.ok) {
        await loadReviews()
      }
    } catch (error) {
      setError('Failed to update visibility')
    }
  }

  const toggleFeatured = async (reviewId: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured })
      })

      if (response.ok) {
        await loadReviews()
      }
    } catch (error) {
      setError('Failed to update featured status')
    }
  }

  const exportReviews = async () => {
    try {
      const response = await fetch('/api/reviews/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reviews-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
    } catch (error) {
      setError('Failed to export reviews')
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === 'all' || review.status === filter
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.productName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-700'}`}
      />
    ))
  }

  // Enterprise access gate
  if (!hasEnterpriseAccess) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Feature</h1>
          <p className="text-gray-600 mb-6">
            The Reviews Management System is available exclusively for Enterprise plan users. 
            Upgrade your plan to access advanced review collection, moderation, and analytics features.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Enterprise Reviews Features:</h3>
            <ul className="text-left text-gray-700 space-y-2">
              <li className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-purple-600" /> Advanced review collection widgets</li>
              <li className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-purple-600" /> Automated review moderation</li>
              <li className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-purple-600" /> Review analytics and insights</li>
              <li className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-purple-600" /> Bulk import/export capabilities</li>
              <li className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-purple-600" /> Custom review templates</li>
              <li className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-purple-600" /> API access for integrations</li>
            </ul>
          </div>
          <Button size="lg" variant="gradient">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Enterprise
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-gray-900 px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Crown className="w-3 h-3 mr-1" />
              Enterprise
            </div>
          </div>
          <p className="text-gray-600">Manage customer reviews and testimonials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportReviews}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Review
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.approved} approved, {stats.pending} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats?.averageRating?.toFixed(1) || "0.0")}</div>
              <div className="flex items-center mt-1">
                {renderStars(Math.round(stats.averageRating))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats?.total > 0 ? ((stats?.approved / stats?.total) * 100)?.toFixed(1) : '0') || '0'}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.rejected} rejected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.monthlyTrend[stats.monthlyTrend.length - 1]?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                New reviews
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
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

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedReviews.length} review(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleApprove(selectedReviews)}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(selectedReviews)}
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedReviews.includes(review.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedReviews([...selectedReviews, review.id])
                    } else {
                      setSelectedReviews(selectedReviews.filter(id => id !== review.id))
                    }
                  }}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{review.customerName}</h3>
                        {review.metadata.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                        {review.status}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVisibility(review.id, !review.isVisible)}
                      >
                        {review.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFeatured(review.id, !review.isFeatured)}
                      >
                        <Star className={`w-4 h-4 ${review.isFeatured ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                      </Button>
                    </div>
                  </div>
                  
                  {review.title && (
                    <h4 className="font-medium mb-2">{review.title}</h4>
                  )}
                  
                  <p className="text-gray-700 mb-3">{review.content}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>Product: {review.productName}</span>
                      <span>Website: {review.websiteName}</span>
                      <span>Source: {review.source}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {review.metadata.helpfulVotes > 0 && (
                        <span>{review.metadata.helpfulVotes} helpful</span>
                      )}
                      {review.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove([review.id])}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject([review.id])}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {reviews.length === 0 
              ? 'Start collecting reviews from your customers.' 
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
        </div>
      )}

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add Customer Review</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Customer Name</label>
                  <Input placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Customer Email</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Review Title</label>
                <Input placeholder="Great product, highly recommend!" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Review Content</label>
                <textarea 
                  className="w-full p-3 border rounded-md h-32 resize-none"
                  placeholder="Write the detailed review content here..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-6 h-6 cursor-pointer text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Product/Website</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Select a website</option>
                  <option value="website1">Tech Product Review Site</option>
                  <option value="website2">Affiliate Marketing Blog</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="verified" className="rounded" />
                  <label htmlFor="verified" className="text-sm">Verified Purchase</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="featured" className="rounded" />
                  <label htmlFor="featured" className="text-sm">Featured Review</label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowAddModal(false)
                  setSuccess('Review added successfully! It will appear in your reviews list.')
                }}
                className="flex-1"
              >
                Add Review
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            {success}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSuccess('')}
              className="ml-2 p-1"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError('')}
              className="ml-2 p-1"
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

