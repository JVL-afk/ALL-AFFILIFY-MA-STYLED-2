'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Zap, 
  Globe, 
  Target, 
  Wand2, 
  CheckCircle, 
  Loader2,
  ArrowRight,
  Crown,
  AlertCircle,
  ExternalLink,
  CreditCard
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  plan: 'basic' | 'pro' | 'enterprise'
  websiteCount: number
}

export default function CreateWebsitePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [affiliateLink, setAffiliateLink] = useState("")
  const [affiliateId, setAffiliateId] = useState("")
  const [affiliateType, setAffiliateType] = useState("link") // "link" or "id"
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null)
  const router = useRouter()

  // Plan limits
  const planLimits = {
    basic: { websites: 3, name: 'Basic (FREE)' },
    pro: { websites: 10, name: 'Pro ($29)' },
    enterprise: { websites: 999, name: 'Enterprise ($99)' }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      router.push('/login')
    }
  }

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleUpgrade = async (plan: 'pro' | 'enterprise') => {
    setUpgradeLoading(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl
      } else {
        setError(data.message || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      setError('An error occurred while processing your upgrade')
    } finally {
      setUpgradeLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    setGeneratedWebsite(null)

    try {
      // Validation
      if (!affiliateLink.trim()) {
        setError('Please enter an affiliate link')
        setLoading(false)
        return
      }

      if (!validateUrl(affiliateLink)) {
        setError('Please enter a valid URL (include https://)')
        setLoading(false)
        return
      }

      // Call the generate-from-link API
      const response = await fetch('/api/ai/generate-from-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productUrl: affiliateLink.trim(),
          affiliateId: affiliateId.trim(),
          affiliateType: affiliateType
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedWebsite(data.website)
        setSuccess('Professional affiliate website created successfully!')
        // Reload user data to update website count
        await loadUserData()
      } else {
        if (data.upgradeRequired) {
          setError(data.message)
        } else {
          setError(data.message || 'Failed to create website')
        }
      }
    } catch (error) {
      console.error('Website creation error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canCreateWebsite = () => {
    if (!user) return false
    const limit = planLimits[user.plan].websites
    return user.websiteCount < limit
  }

  const getRemainingWebsites = () => {
    if (!user) return 0
    const limit = planLimits[user.plan].websites
    return Math.max(0, limit - user.websiteCount)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Website</h1>
        <p className="text-gray-900/80">Basic plan - Simple affiliate website creation</p>
        
        {/* Plan Status */}
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white border-opacity-30">
            <span className="text-gray-900/80">Current Plan: </span>
            <span className="text-gray-900 font-semibold">{planLimits[user.plan].name}</span>
          </div>
          <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white border-opacity-30">
            <span className="text-gray-900/80">Websites: </span>
            <span className="text-gray-900 font-semibold">
              {user.websiteCount} / {planLimits[user.plan].websites === 999 ? '∞' : planLimits[user.plan].websites}
            </span>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
          <span className="text-red-100">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm flex items-center">
          <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
          <span className="text-green-100">{success}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Website Form */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-sm border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Website Details
              </CardTitle>
              <CardDescription className="text-gray-900/70">
                Tell us about your affiliate website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Affiliate Link *
                </label>
                <Input
                  type="url"
                  placeholder="https://amazon.com/product-link or any affiliate URL"
                  value={affiliateLink}
                  onChange={(e) => {
                    setAffiliateLink(e.target.value)
                    setError('')
                  }}
                  className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30 text-gray-900 placeholder:text-gray-900/50"
                  disabled={loading}
                />
                <p className="text-sm text-gray-900/60">
                  Works with Amazon, ClickBank, ShareASale, and any product URL
                </p>
              </div>

              {/* Affiliate ID/Type Toggle */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Affiliate Integration
                </label>
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setAffiliateType("link")}
                    className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${affiliateType === "link" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                  >
                    Full Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setAffiliateType("id")}
                    className={`-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${affiliateType === "id" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                  >
                    Affiliate ID
                  </button>
                </div>
              </div>

              {affiliateType === "id" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Affiliate ID *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., your-affiliate-id"
                    value={affiliateId}
                    onChange={(e) => setAffiliateId(e.target.value)}
                    className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30 text-gray-900 placeholder:text-gray-900/50"
                    disabled={loading}
                  />
                </div>
              )}

              {/* Generate Button */}
              <div className="space-y-4">
                {canCreateWebsite() ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !affiliateLink.trim()}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-gray-900 font-semibold py-3 text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Professional Website...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Generate Website ({getRemainingWebsites()} remaining)
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900/20 border border-orange-500/30 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Crown className="w-5 h-5 text-orange-400 mr-2" />
                        <span className="text-orange-100 font-medium">Website Limit Reached</span>
                      </div>
                      <p className="text-orange-200 text-sm">
                        You've created {user.websiteCount} websites on your {planLimits[user.plan].name} plan. 
                        Upgrade to create more professional websites.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        onClick={() => handleUpgrade('pro')}
                        disabled={upgradeLoading}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-gray-900"
                      >
                        {upgradeLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CreditCard className="w-4 h-4 mr-2" />
                        )}
                        Upgrade to Pro ($29)
                      </Button>
                      
                      <Button
                        onClick={() => handleUpgrade('enterprise')}
                        disabled={upgradeLoading}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-gray-900"
                      >
                        {upgradeLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Crown className="w-4 h-4 mr-2" />
                        )}
                        Upgrade to Enterprise ($99)
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Generated Website Result */}
              {generatedWebsite && (
                <div className="mt-6 p-6 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-green-100 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Website Created Successfully!
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-green-200 font-medium">Title: </span>
                      <span className="text-green-100">{generatedWebsite.title}</span>
                    </div>
                    
                    <div>
                      <span className="text-green-200 font-medium">URL: </span>
                      <a 
                        href={generatedWebsite.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-100 hover:text-gray-900 underline inline-flex items-center"
                      >
                        {generatedWebsite.url}
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={() => window.open(generatedWebsite.previewUrl, '_blank')}
                        variant="outline"
                        className="border-green-400 text-green-100 hover:bg-green-500/20"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Preview Website
                      </Button>
                      
                      <Button
                        onClick={() => router.push('/dashboard/my-websites')}
                        className="bg-green-600 hover:bg-green-700 text-gray-900"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Manage Websites
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Features & Pricing */}
        <div className="space-y-6">
          {/* Features */}
          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-sm border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Basic Plan Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-gray-900/80">
                <Globe className="w-4 h-4 mr-2 text-gray-900" />
                Websites: {user.websiteCount}/{planLimits[user.plan].websites}
              </div>
              <div className="flex items-center text-gray-900/80">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Basic templates only
              </div>
              <div className="flex items-center text-gray-900/80">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                AI content generation
              </div>
              <div className="flex items-center text-gray-900/80">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Basic image library
              </div>
            </CardContent>
          </Card>

          {/* Upgrade to Pro */}
          <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-sm border-white border-opacity-30">
            <CardHeader>
              <CardTitle className="text-gray-900">Upgrade to Pro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-gray-900/80">
                <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                10 websites (vs. 3)
              </div>
              <div className="flex items-center text-gray-900/80">
                <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                Premium templates
              </div>
              <div className="flex items-center text-gray-900/80">
                <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                Custom domain support
              </div>
              <div className="flex items-center text-gray-900/80">
                <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                Advanced analytics
              </div>
              
              <Button
                onClick={() => handleUpgrade('pro')}
                disabled={upgradeLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-gray-900"
              >
                {upgradeLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                Upgrade to Pro - $29/month
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

