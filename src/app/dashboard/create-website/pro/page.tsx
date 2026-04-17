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
import { MonetizationCarousel, MonetizationMethod } from '@/components/crm/MonetizationCarousel'
import { MonetizationFormFields } from '@/components/crm/MonetizationFormFields'

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
  const [userPlan, setUserPlan] = useState<'basic' | 'pro' | 'enterprise'>("pro")
  const maxWebsites = 10
  const [affiliateLink, setAffiliateLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null)
  const router = useRouter()

  // Monetization State
  const [selectedMethod, setSelectedMethod] = useState<MonetizationMethod>('affiliateLinks')
  const [monetizationData, setMonetizationData] = useState<any>({
    primaryMethod: 'affiliateLinks',
    affiliateLinks: { productUrl: '', affiliateId: '', affiliateType: 'link', subId: '' },
    displayAds: { enabled: false, adsensePublisherId: '', premiumAdNetworkId: '' },
    digitalProducts: { name: '', description: '', salesPageUrl: '' },
    sponsorships: { enabled: false, pitch: '' },
    secondaryMethods: {
      emailSignup: { enabled: false, espFormActionUrl: '', leadMagnetDownloadUrl: '' },
      customTrackingScript: { enabled: false, headerScript: '', bodyScript: '' }
    }
  })

  // Plan limits
  const planLimits = {
    basic: { websites: 3, name: 'Basic (FREE)' },
    pro: { websites: 10, name: 'Pro ($29)' },
    enterprise: { websites: 999, name: 'Enterprise ($99)' }
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/data");
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setCurrentWebsites(data.websiteCount || 0);
        setUserPlan(data.plan || "pro");
      } else {
        console.error("Failed to fetch user data");
        router.push('/login');
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push('/login');
    }
  };

  useEffect(() => {
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

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    setGeneratedWebsite(null)

    try {
      // Validation
      const linkToValidate = selectedMethod === 'affiliateLinks' 
        ? monetizationData.affiliateLinks.productUrl 
        : affiliateLink;

      if (!linkToValidate.trim()) {
        setError('Please enter a product or affiliate link')
        setLoading(false)
        return
      }

      if (!validateUrl(linkToValidate)) {
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
          productUrl: linkToValidate.trim(),
          monetization: {
            ...monetizationData,
            primaryMethod: selectedMethod
          },
          plan: 'pro',
          niche: 'Pro Affiliate Marketing',
          template: 'premium'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedWebsite(data.website)
        setSuccess('Professional Pro website created successfully!')
        await fetchUserData();
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

  const canCreateWebsite = () => {
    if (!user) return false
    const limit = planLimits[user.plan].websites
    return user.websiteCount < limit
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Website</h1>
          <p className="text-gray-300">Pro Plan - Advanced affiliate website creation</p>
          
          <div className="mt-4 flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              <Crown className="w-4 h-4 mr-2 text-yellow-400" />
              Plan: {planLimits[user.plan].name}
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              Websites: {user.websiteCount} / {planLimits[user.plan].websites}
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
                  <p className="text-gray-200">{error}</p>
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
                  <p className="text-gray-200">{success}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Website Details Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Monetization Strategy</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose how you want to monetize your new website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <MonetizationCarousel 
                  selectedMethod={selectedMethod}
                  onMethodChange={setSelectedMethod}
                  userPlan={userPlan}
                />

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <MonetizationFormFields 
                    method={selectedMethod}
                    userPlan={userPlan}
                    data={monetizationData}
                    onChange={setMonetizationData}
                  />
                </div>

                {/* Create Button */}
                <Button 
                  className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg shadow-blue-500/25"
                  disabled={!canCreateWebsite() || loading}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Your Empire...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Pro Website with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Website Result */}
            {generatedWebsite && (
              <Card className="bg-green-500/10 border-green-500/30 overflow-hidden">
                <CardHeader className="bg-green-500/20">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-green-100 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Pro Website Created Successfully!
                    </CardTitle>
                    <Button size="sm" variant="outline" className="border-green-500/30 text-green-100 hover:bg-green-500/20" asChild>
                      <a href={generatedWebsite.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Site
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-green-200/60 text-xs uppercase tracking-wider">Title</Label>
                    <p className="text-white font-bold text-xl">{generatedWebsite.title}</p>
                  </div>
                  <div>
                    <Label className="text-green-200/60 text-xs uppercase tracking-wider">Live URL</Label>
                    <p className="text-cyan-400 font-mono break-all">{generatedWebsite.url}</p>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => router.push('/dashboard/my-websites')}>
                      Manage Websites
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Pro Plan Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    10 Websites
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Premium Templates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Custom Domain Support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Advanced Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    A/B Testing Tools
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Need More?</CardTitle>
                <CardDescription className="text-purple-200/70">Upgrade to Enterprise for unlimited power</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                  <Link href="/pricing">View Enterprise Plan</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
