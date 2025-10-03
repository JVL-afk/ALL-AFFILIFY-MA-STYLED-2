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
  const [productUrl, setProductUrl] = useState('')
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
      if (!productUrl.trim()) {
        setError('Please enter an affiliate link')
        setLoading(false)
        return
      }

      if (!validateUrl(productUrl)) {
        setError('Please enter a valid URL (include https://)')
        setLoading(false)
        return
      }

      // Call the REAL API
      const response = await fetch('/api/ai/generate-from-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productUrl: productUrl.trim()
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
        <h1 className="text-3xl font-bold text-white mb-2">Create Professional Affiliate Website</h1>
        <p className="text-white/80">Enter any affiliate link and get a conversion-optimized website in seconds</p>
        
        {/* Plan Status */}
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white border-opacity-20">
            <span className="text-white/80">Current Plan: </span>
            <span className="text-white font-semibold">{planLimits[user.plan].name}</span>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white border-opacity-20">
            <span className="text-white/80">Websites: </span>
            <span className="text-white font-semibold">
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
          <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                AI Website Generator
              </CardTitle>
              <CardDescription className="text-white/70">
                Paste any affiliate link and our AI will create a professional website
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
                  value={productUrl}
                  onChange={(e) => {
                    setProductUrl(e.target.value)
                    setError('')
                  }}
                  className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder:text-white/50"
                  disabled={loading}
                />
                <p className="text-sm text-white/60">
                  Works with Amazon, ClickBank, ShareASale, and any product URL
                </p>
              </div>

              {/* Generate Button */}
              <div className="space-y-4">
                {canCreateWebsite() ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !productUrl.trim()}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 text-lg"
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
                    <div className="p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg">
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
                        className="text-green-100 hover:text-white underline inline-flex items-center"
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
          <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-20">
            <CardHeader>
              <CardTitle className="text-gray-900">What You Get</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-white/80">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                AI-powered content generation
              </div>
              <div className="flex items-center text-white/80">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Mobile-responsive design
              </div>
              <div className="flex items-center text-white/80">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                SEO-optimized structure
              </div>
              <div className="flex items-center text-white/80">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Conversion-focused layout
              </div>
              <div className="flex items-center text-white/80">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Professional styling
              </div>
              <div className="flex items-center text-white/80">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Click tracking & analytics
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-20">
            <CardHeader>
              <CardTitle className="text-gray-900">Pricing Plans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-3 rounded-lg border ${user.plan === 'basic' ? 'border-orange-400 bg-orange-500/20' : 'border-white border-opacity-20'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">Basic</span>
                  <span className="text-green-400 font-bold">FREE</span>
                </div>
                <div className="text-sm text-white/70">3 websites</div>
              </div>

              <div className={`p-3 rounded-lg border ${user.plan === 'pro' ? 'border-purple-400 bg-purple-500/20' : 'border-white border-opacity-20'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">Pro</span>
                  <span className="text-white font-bold">$29</span>
                </div>
                <div className="text-sm text-white/70">10 websites + advanced features</div>
              </div>

              <div className={`p-3 rounded-lg border ${user.plan === 'enterprise' ? 'border-blue-400 bg-blue-500/20' : 'border-white border-opacity-20'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">Enterprise</span>
                  <span className="text-white font-bold">$99</span>
                </div>
                <div className="text-sm text-white/70">Unlimited websites + all features</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

