"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Globe,
  Crown,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Palette,
  Type,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  ExternalLink,
  Star,
  Zap,
  Target,
  Wand2,
  CreditCard,
  BarChart3,
  TestTube
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  plan: 'basic' | 'pro' | 'enterprise'
  websiteCount: number
}

export default function ProCreateWebsite() {
  const [user, setUser] = useState<User | null>(null)
  const [currentWebsites, setCurrentWebsites] = useState(0)
  const [userPlan, setUserPlan] = useState("pro") // Default to pro, fetch actual plan
  const maxWebsites = 10
  const [affiliateLink, setAffiliateLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null)
  const router = useRouter()

  // Plan limits
  const planLimits = {
    basic: { websites: 3, name: 'Basic (FREE)' },
    pro: { websites: 10, name: 'Pro ($29)' },
    enterprise: { websites: 999, name: 'Enterprise ($99)' }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/data"); // Assuming an API endpoint for user data
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setCurrentWebsites(data.websiteCount || 0); // Assuming websiteCount is part of user data
          setUserPlan(data.plan || "pro"); // Assuming plan is part of user data
        } else {
          console.error("Failed to fetch user data");
          router.push('/login'); // Redirect to login if user data cannot be fetched
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push('/login'); // Redirect to login on error
      }
    };
    fetchUserData();
  }, []);

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleUpgrade = async (plan: 'enterprise') => {
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

      // Call the generate-from-link API with Pro plan features
      const response = await fetch('/api/ai/generate-from-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productUrl: affiliateLink.trim(),
          plan: 'pro' // Include plan for enhanced features
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedWebsite(data.website)
        setSuccess('Professional Pro website created successfully!')
        await fetchUserData(); // Reload user data to update website count
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
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Website</h1>
          <p className="text-gray-900/80">Pro plan - Advanced affiliate website creation</p>
          
          {/* Plan Status */}
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white border-opacity-30">
              <Crown className="w-4 h-4 inline mr-2 text-purple-400" />
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
                  Pro Website Creation
                </CardTitle>
                <CardDescription className="text-gray-900/70">
                  Create your professional affiliate website with Pro features
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

                {/* Pro Features */}
                <Card className="bg-purple-600/20 border-purple-400/30">
                  <CardContent className="p-4">
                    <h3 className="text-purple-100 font-medium mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-400" />
                      Pro Features Included
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Premium templates
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Custom domain support
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Enhanced SEO
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Advanced analytics
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Generate Button */}
                <div className="space-y-4">
                  {canCreateWebsite() ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || !affiliateLink.trim()}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-gray-900 font-semibold py-3 text-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating Pro Website...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-2" />
                          Generate Pro Website ({getRemainingWebsites()} remaining)
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
                          You've reached your Pro plan limit of {planLimits[user.plan].websites} websites. Upgrade to Enterprise for unlimited websites!
                        </p>
                      </div>
                      <Button
                        onClick={() => handleUpgrade('enterprise')}
                        disabled={upgradeLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-gray-900 font-semibold py-3 text-lg"
                      >
                        {upgradeLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Upgrading...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5 mr-2" />
                            Upgrade to Enterprise ($99/month)
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Generated Website Result */}
                {generatedWebsite && (
                  <div className="mt-6 p-6 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-green-100 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Pro Website Created Successfully!
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Limits */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Pro Plan Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Websites</span>
                  <span className="text-gray-900 font-medium">{user.websiteCount}/{planLimits[user.plan].websites}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${(user.websiteCount / planLimits[user.plan].websites) * 100}%` }}
                  ></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <Palette className="w-4 h-4 mr-2 text-purple-400" />
                    Premium templates
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Type className="w-4 h-4 mr-2 text-purple-400" />
                    Enhanced AI content
                  </div>
                  <div className="flex items-center text-gray-700">
                    <ImageIcon className="w-4 h-4 mr-2 text-purple-400" />
                    Premium image library
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Benefits */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Upgrade to Enterprise</CardTitle>
                <CardDescription className="text-gray-700">
                  Get unlimited websites and advanced features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>Unlimited websites</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Palette className="w-4 h-4 mr-2 text-blue-400" />
                    <span>Enterprise templates</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Globe className="w-4 h-4 mr-2 text-blue-400" />
                    <span>Team collaboration</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                    <span>Advanced analytics</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Link href="/pricing">
                    Upgrade to Enterprise - $99/month
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-4">
                  Check our documentation for website creation tips and best practices.
                </p>
                <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                  <Link href="/docs">
                    View Documentation
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

