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
  BarChart3,
  TestTube,
  Users,
  Shield,
  Infinity,
  Code,
  Database
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  plan: 'basic' | 'pro' | 'enterprise'
  websiteCount: number
}

export default function EnterpriseCreateWebsite() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [affiliateLink, setAffiliateLink] = useState('')
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

      // Call the generate-from-link API with Enterprise plan features
      const response = await fetch('/api/ai/generate-from-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productUrl: affiliateLink.trim(),
          plan: 'enterprise' // Include plan for enhanced features
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedWebsite(data.website)
        setSuccess('Enterprise-grade website created successfully!')
        // Reload user data to update website count
        await loadUserData()
      } else {
        setError(data.message || 'Failed to create website')
      }
    } catch (error) {
      console.error('Website creation error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
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
          <p className="text-gray-900/80">Enterprise plan - Unlimited professional website creation</p>
          
          {/* Plan Status */}
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white border-opacity-30">
              <Crown className="w-4 h-4 inline mr-2 text-blue-400" />
              <span className="text-gray-900/80">Current Plan: </span>
              <span className="text-gray-900 font-semibold">{planLimits[user.plan].name}</span>
            </div>
            <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white border-opacity-30">
              <Infinity className="w-4 h-4 inline mr-2 text-green-400" />
              <span className="text-gray-900/80">Websites: </span>
              <span className="text-gray-900 font-semibold">
                {user.websiteCount} / Unlimited
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
                  Enterprise Website Creation
                </CardTitle>
                <CardDescription className="text-gray-900/70">
                  Create your enterprise-grade affiliate website with unlimited features
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
                    Enterprise plan includes all premium features, unlimited websites, team collaboration, and white-label options
                  </p>
                </div>

                {/* Enterprise Features Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-10 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                      <div>
                        <h4 className="text-gray-900 font-medium">Enterprise Analytics</h4>
                        <p className="text-gray-900/60 text-sm">Advanced insights & reporting</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-10 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-400" />
                      <div>
                        <h4 className="text-gray-900 font-medium">Team Collaboration</h4>
                        <p className="text-gray-900/60 text-sm">Multi-user access & management</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-10 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-yellow-400" />
                      <div>
                        <h4 className="text-gray-900 font-medium">White-label Options</h4>
                        <p className="text-gray-900/60 text-sm">Custom branding & domains</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-10 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Code className="w-5 h-5 text-green-400" />
                      <div>
                        <h4 className="text-gray-900 font-medium">API Access</h4>
                        <p className="text-gray-900/60 text-sm">Full API integration</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="space-y-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !affiliateLink.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-gray-900 font-semibold py-3 text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Enterprise Website...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Generate Enterprise Website
                      </>
                    )}
                  </Button>
                </div>

                {/* Generated Website Result */}
                {generatedWebsite && (
                  <div className="mt-6 p-6 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-green-100 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Enterprise Website Created Successfully!
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

          {/* Sidebar - Enterprise Features */}
          <div className="space-y-6">
            {/* Enterprise Features */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-sm border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Enterprise Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-900/80">
                  <Infinity className="w-4 h-4 mr-2 text-green-400" />
                  Unlimited websites
                </div>
                <div className="flex items-center text-gray-900/80">
                  <Crown className="w-4 h-4 mr-2 text-blue-400" />
                  Enterprise templates
                </div>
                <div className="flex items-center text-gray-900/80">
                  <Users className="w-4 h-4 mr-2 text-purple-400" />
                  Team collaboration
                </div>
                <div className="flex items-center text-gray-900/80">
                  <Shield className="w-4 h-4 mr-2 text-yellow-400" />
                  White-label options
                </div>
                <div className="flex items-center text-gray-900/80">
                  <Code className="w-4 h-4 mr-2 text-green-400" />
                  Full API access
                </div>
                <div className="flex items-center text-gray-900/80">
                  <BarChart3 className="w-4 h-4 mr-2 text-blue-400" />
                  Enterprise analytics
                </div>
                <div className="flex items-center text-gray-900/80">
                  <TestTube className="w-4 h-4 mr-2 text-green-400" />
                  Advanced A/B testing
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Benefits */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-sm border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Enterprise Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-900/80">
                  🚀 Unlimited website creation
                </div>
                <div className="text-sm text-gray-900/80">
                  👥 Multi-user team collaboration
                </div>
                <div className="text-sm text-gray-900/80">
                  🎨 Custom branding & white-label
                </div>
                <div className="text-sm text-gray-900/80">
                  📊 Advanced analytics & reporting
                </div>
                <div className="text-sm text-gray-900/80">
                  🔌 Full API integration
                </div>
                <div className="text-sm text-gray-900/80">
                  🛡️ Priority support & SLA
                </div>
                <div className="text-sm text-gray-900/80">
                  🧪 Advanced A/B testing suite
                </div>
              </CardContent>
            </Card>

            {/* Current Usage */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-sm border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Current Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900/80">Websites Created</span>
                  <span className="text-gray-900 font-semibold">{user.websiteCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900/80">Plan Limit</span>
                  <span className="text-gray-900 font-semibold flex items-center">
                    <Infinity className="w-4 h-4 mr-1 text-green-400" />
                    Unlimited
                  </span>
                </div>
                <div className="text-sm text-gray-900/60 mt-4">
                  Create as many professional affiliate websites as you need with your Enterprise plan.
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 backdrop-blur-sm border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Enterprise Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900/80 text-sm mb-4">
                  Get priority support and dedicated account management with your Enterprise plan.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20"
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
