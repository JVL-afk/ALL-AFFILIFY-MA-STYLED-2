'use client'

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
  Shield,
  Users,
  Database,
  Code,
  Infinity
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EnterpriseCreateWebsite() {
  const [currentWebsites, setCurrentWebsites] = useState(0)
  const [userPlan, setUserPlan] = useState("enterprise") // Default to enterprise, fetch actual plan

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/data"); // Assuming an API endpoint for user data
        if (response.ok) {
          const data = await response.json();
          setCurrentWebsites(data.websiteCount || 0); // Assuming websiteCount is part of user data
          setUserPlan(data.plan || "enterprise"); // Assuming plan is part of user data
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);
  const [affiliateLink, setAffiliateLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null)
  const router = useRouter()

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

      // Call the generate-from-link API
      const response = await fetch('/api/ai/generate-from-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productUrl: affiliateLink.trim(),
          plan: 'enterprise' // Specify enterprise plan for maximum features
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedWebsite(data.website)
        setSuccess('Enterprise-grade affiliate website created successfully!')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Website</h1>
            <p className="text-gray-700">Enterprise Plan - Unlimited professional website creation</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-blue-600 text-gray-900">
              <Crown className="w-3 h-3 mr-1" />
              Enterprise: {currentWebsites} websites
            </Badge>
            <Badge variant="secondary" className="bg-green-600 text-gray-900">
              <Infinity className="w-3 h-3 mr-1" />
              Unlimited
            </Badge>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Card className="bg-red-600/20 border-red-600/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-red-400 font-medium">Error</h3>
                  <p className="text-gray-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="bg-green-600/20 border-green-600/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-green-400 font-medium">Success</h3>
                  <p className="text-gray-700">{success}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Website Details Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-400" />
                  Enterprise Website Creator
                </CardTitle>
                <CardDescription className="text-gray-700">
                  Paste your affiliate link and our AI will create an enterprise-grade website with all premium features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="affiliateLink" className="text-gray-900">Affiliate Link</Label>
                  <Input
                    id="affiliateLink"
                    placeholder="https://amazon.com/product-link or any affiliate URL"
                    value={affiliateLink}
                    onChange={(e) => {
                      setAffiliateLink(e.target.value)
                      setError('')
                    }}
                    className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30 text-gray-900 placeholder-gray-400"
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-700">
                    Works with Amazon, ClickBank, ShareASale, and any product URL
                  </p>
                </div>

                {/* Enterprise Features */}
                <Card className="bg-blue-600/20 border-blue-400/30">
                  <CardContent className="p-4">
                    <h3 className="text-blue-100 font-medium mb-3 flex items-center">
                      <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                      Enterprise Features Included
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Enterprise templates
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Custom domain support
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Advanced SEO optimization
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Enterprise analytics
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Team collaboration
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        API access
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        White labeling
                      </div>
                      <div className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Advanced reporting
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Create Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                  disabled={!affiliateLink || loading}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Enterprise Website...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Create Enterprise Website
                    </>
                  )}
                </Button>

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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Status */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Enterprise Plan Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Websites Created</span>
                  <span className="text-gray-900 font-medium">{currentWebsites}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Website Limit</span>
                  <span className="text-gray-900 font-medium flex items-center">
                    <Infinity className="w-4 h-4 mr-1" />
                    Unlimited
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <Shield className="w-4 h-4 mr-2 text-blue-400" />
                    Enterprise templates
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-blue-400" />
                    Team collaboration enabled
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Database className="w-4 h-4 mr-2 text-blue-400" />
                    Advanced data analytics
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Code className="w-4 h-4 mr-2 text-blue-400" />
                    API access enabled
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Benefits */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Enterprise Benefits</CardTitle>
                <CardDescription className="text-gray-700">
                  Your exclusive enterprise features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>Unlimited websites</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-blue-400" />
                    <span>Team collaboration</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Shield className="w-4 h-4 mr-2 text-blue-400" />
                    <span>White labeling</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Code className="w-4 h-4 mr-2 text-blue-400" />
                    <span>API access</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Link href="/dashboard/team-collaboration">
                    Manage Team Access
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Enterprise Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-4">
                  Need help? As an Enterprise customer, you have access to priority support.
                </p>
                <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20">
                  <Link href="/dashboard/support">
                    Contact Enterprise Support
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
