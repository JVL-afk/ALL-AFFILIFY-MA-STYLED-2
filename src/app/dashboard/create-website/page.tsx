'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  CreditCard,
  Sparkles,
  Brain,
  Palette,
  Layout,
  Code,
  Rocket,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  Clock,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Settings,
  Check,
  X,
  Info,
  ChevronRight,
  Star,
  Zap as ZapIcon
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  plan: 'basic' | 'pro' | 'enterprise'
  websiteCount: number
}

interface GenerationStep {
  id: number
  title: string
  description: string
  status: 'pending' | 'active' | 'complete'
  icon: any
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
  const [currentStep, setCurrentStep] = useState(0)
  const [showSteps, setShowSteps] = useState(false)
  const router = useRouter()

  // Plan limits
  const planLimits = {
    basic: { websites: 3, name: 'Basic', price: 'FREE' },
    pro: { websites: 10, name: 'Pro', price: '$29' },
    enterprise: { websites: 999, name: 'Enterprise', price: '$99' }
  }

  // Generation steps for visual feedback
  const generationSteps: GenerationStep[] = [
    {
      id: 1,
      title: 'AI Analysis',
      description: 'Analyzing product and target audience',
      status: 'pending',
      icon: Brain
    },
    {
      id: 2,
      title: 'Content Generation',
      description: 'Creating SEO-optimized content',
      status: 'pending',
      icon: FileText
    },
    {
      id: 3,
      title: 'Design Selection',
      description: 'Choosing optimal template and layout',
      status: 'pending',
      icon: Palette
    },
    {
      id: 4,
      title: 'Website Assembly',
      description: 'Building your affiliate website',
      status: 'pending',
      icon: Code
    },
    {
      id: 5,
      title: 'Deployment',
      description: 'Publishing to live URL',
      status: 'pending',
      icon: Rocket
    }
  ]

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

  const simulateGenerationSteps = async () => {
    setShowSteps(true)
    for (let i = 0; i < generationSteps.length; i++) {
      setCurrentStep(i)
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    setGeneratedWebsite(null)
    setShowSteps(false)
    setCurrentStep(0)

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

      // Start visual generation steps
      simulateGenerationSteps()

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
      setShowSteps(false)
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

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'from-gray-500 to-gray-600'
      case 'pro': return 'from-purple-500 to-purple-600'
      case 'enterprise': return 'from-blue-500 to-blue-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Wand2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
                    Create New Website
                  </h1>
                  <p className="text-purple-300/70 text-sm">AI-powered affiliate website generation</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-3">
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Crown className={`w-4 h-4 ${user.plan === 'enterprise' ? 'text-blue-400' : user.plan === 'pro' ? 'text-purple-400' : 'text-gray-400'}`} />
                  <span className="text-white text-sm font-medium">{planLimits[user.plan].name} Plan</span>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm">
                    {user.websiteCount} / {planLimits[user.plan].websites === 999 ? '∞' : planLimits[user.plan].websites} Websites
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-300">Website Usage</span>
              <span className="text-sm text-purple-400 font-medium">
                {getRemainingWebsites()} remaining
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(user.websiteCount / planLimits[user.plan].websites) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-2 rounded-full bg-gradient-to-r ${getPlanColor(user.plan)}`}
              />
            </div>
          </div>
        </motion.div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm flex items-center"
            >
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
              <span className="text-red-200">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm flex items-center"
            >
              <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-green-200">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Website Creation Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <LinkIcon className="w-5 h-5 text-purple-400" />
                    <span>Website Configuration</span>
                  </CardTitle>
                  <CardDescription className="text-purple-300/70">
                    Enter your affiliate link to generate a professional website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Affiliate Link Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-purple-200">
                      Affiliate Product Link <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                      <Input
                        type="url"
                        placeholder="https://amazon.com/product-link or any affiliate URL"
                        value={affiliateLink}
                        onChange={(e) => {
                          setAffiliateLink(e.target.value)
                          setError('')
                        }}
                        className="pl-11 bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-500 h-12"
                        disabled={loading}
                      />
                    </div>
                    <p className="text-sm text-purple-300/60 flex items-center space-x-1">
                      <Info className="w-4 h-4" />
                      <span>Compatible with Amazon, ClickBank, ShareASale, and any product URL</span>
                    </p>
                  </div>

                  {/* Affiliate Integration Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-purple-200">
                      Integration Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAffiliateType("link")}
                        className={`relative px-4 py-3 rounded-lg border-2 transition-all ${
                          affiliateType === "link"
                            ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500 text-white"
                            : "bg-black/30 border-purple-500/30 text-purple-300 hover:border-purple-500/50"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <LinkIcon className="w-4 h-4" />
                          <span className="font-medium">Full Link</span>
                        </div>
                        {affiliateType === "link" && (
                          <Check className="absolute top-2 right-2 w-4 h-4 text-purple-400" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAffiliateType("id")}
                        className={`relative px-4 py-3 rounded-lg border-2 transition-all ${
                          affiliateType === "id"
                            ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500 text-white"
                            : "bg-black/30 border-purple-500/30 text-purple-300 hover:border-purple-500/50"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span className="font-medium">Affiliate ID</span>
                        </div>
                        {affiliateType === "id" && (
                          <Check className="absolute top-2 right-2 w-4 h-4 text-purple-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Affiliate ID Input (conditional) */}
                  <AnimatePresence>
                    {affiliateType === "id" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-purple-200">
                          Your Affiliate ID <span className="text-red-400">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g., your-affiliate-id-123"
                          value={affiliateId}
                          onChange={(e) => setAffiliateId(e.target.value)}
                          className="bg-black/50 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-500 h-12"
                          disabled={loading}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Generate Button or Upgrade Prompt */}
                  <div className="pt-4">
                    {canCreateWebsite() ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-6 text-lg rounded-lg shadow-lg shadow-purple-500/30 transition-all"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Generating Website...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Wand2 className="w-5 h-5" />
                            <span>Generate Website</span>
                            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-sm">
                              {getRemainingWebsites()} left
                            </span>
                          </div>
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        {/* Limit Reached Notice */}
                        <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-orange-200 font-semibold mb-1">Website Limit Reached</h4>
                              <p className="text-orange-200/80 text-sm">
                                You've created {user.websiteCount} websites on your {planLimits[user.plan].name} plan. 
                                Upgrade to unlock more professional websites.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Upgrade Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button
                            onClick={() => handleUpgrade('pro')}
                            disabled={upgradeLoading}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-6"
                          >
                            <div className="flex items-center justify-center space-x-2">
                              {upgradeLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CreditCard className="w-4 h-4" />
                              )}
                              <span>Upgrade to Pro</span>
                            </div>
                          </Button>
                          
                          <Button
                            onClick={() => handleUpgrade('enterprise')}
                            disabled={upgradeLoading}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6"
                          >
                            <div className="flex items-center justify-center space-x-2">
                              {upgradeLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Crown className="w-4 h-4" />
                              )}
                              <span>Upgrade to Enterprise</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Generation Steps Progress */}
            <AnimatePresence>
              {showSteps && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <span>AI Generation Progress</span>
                      </CardTitle>
                      <CardDescription className="text-purple-300/70">
                        Your website is being created in real-time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {generationSteps.map((step, index) => {
                          const Icon = step.icon
                          const isActive = index === currentStep
                          const isComplete = index < currentStep
                          
                          return (
                            <motion.div
                              key={step.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all ${
                                isActive
                                  ? 'bg-purple-500/20 border-purple-500'
                                  : isComplete
                                  ? 'bg-green-500/10 border-green-500/50'
                                  : 'bg-black/30 border-purple-500/20'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isActive
                                  ? 'bg-purple-500'
                                  : isComplete
                                  ? 'bg-green-500'
                                  : 'bg-gray-700'
                              }`}>
                                {isComplete ? (
                                  <CheckCircle className="w-6 h-6 text-white" />
                                ) : isActive ? (
                                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                                ) : (
                                  <Icon className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-semibold mb-1 ${
                                  isActive || isComplete ? 'text-white' : 'text-purple-300/50'
                                }`}>
                                  {step.title}
                                </h4>
                                <p className={`text-sm ${
                                  isActive || isComplete ? 'text-purple-200/70' : 'text-purple-300/30'
                                }`}>
                                  {step.description}
                                </p>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generated Website Result */}
            <AnimatePresence>
              {generatedWebsite && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <span>Website Created Successfully!</span>
                      </CardTitle>
                      <CardDescription className="text-green-200/70">
                        Your professional affiliate website is ready to go live
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Website Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black/30 rounded-lg border border-green-500/30">
                          <div className="text-sm text-green-300/70 mb-1">Website Title</div>
                          <div className="text-white font-medium">{generatedWebsite.title}</div>
                        </div>
                        <div className="p-4 bg-black/30 rounded-lg border border-green-500/30">
                          <div className="text-sm text-green-300/70 mb-1">Live URL</div>
                          <a 
                            href={generatedWebsite.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 font-medium inline-flex items-center space-x-1"
                          >
                            <span className="truncate">{generatedWebsite.url}</span>
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          </a>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          onClick={() => window.open(generatedWebsite.previewUrl, '_blank')}
                          variant="outline"
                          className="flex-1 border-green-500/50 text-green-300 hover:bg-green-500/20 py-6"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          Preview Website
                        </Button>
                        
                        <Button
                          onClick={() => router.push('/dashboard/my-websites')}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6"
                        >
                          <ArrowRight className="w-5 h-5 mr-2" />
                          Manage Websites
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Current Plan Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Crown className={`w-5 h-5 ${user.plan === 'enterprise' ? 'text-blue-400' : user.plan === 'pro' ? 'text-purple-400' : 'text-gray-400'}`} />
                    <span>{planLimits[user.plan].name} Plan</span>
                  </CardTitle>
                  <CardDescription className="text-purple-300/70">
                    {planLimits[user.plan].price}/month
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-purple-200">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">Websites</span>
                    </div>
                    <span className="font-semibold">
                      {user.websiteCount}/{planLimits[user.plan].websites === 999 ? '∞' : planLimits[user.plan].websites}
                    </span>
                  </div>
                  
                  <div className="pt-3 border-t border-purple-500/30">
                    <div className="space-y-2">
                      {user.plan === 'basic' && (
                        <>
                          <div className="flex items-center space-x-2 text-sm text-purple-300/70">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Basic templates</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-purple-300/70">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>AI content generation</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-purple-300/70">
                            <X className="w-4 h-4 text-red-400" />
                            <span>Custom domains</span>
                          </div>
                        </>
                      )}
                      {user.plan === 'pro' && (
                        <>
                          <div className="flex items-center space-x-2 text-sm text-purple-300/70">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Premium templates</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-purple-300/70">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Custom domains</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-purple-300/70">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Advanced analytics</span>
                          </div>
                        </>
                      )}
                      {user.plan === 'enterprise' && (
                        <>
                          <div className="flex items-center space-x-2 text-sm text-purple-300/70">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Unlimited websites</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-purple-300/70">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Priority support</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-purple-300/70">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>White-label options</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span>What You Get</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium mb-1">AI-Powered Content</h4>
                      <p className="text-purple-300/60 text-xs">SEO-optimized content that converts</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Layout className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium mb-1">Responsive Design</h4>
                      <p className="text-purple-300/60 text-xs">Perfect on all devices</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium mb-1">Conversion Optimized</h4>
                      <p className="text-purple-300/60 text-xs">Strategic CTA placement</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium mb-1">Lightning Fast</h4>
                      <p className="text-purple-300/60 text-xs">Global CDN distribution</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upgrade CTA (if not enterprise) */}
            {user.plan !== 'enterprise' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className={`bg-gradient-to-br ${user.plan === 'basic' ? 'from-purple-500/20 to-blue-500/20 border-purple-500/50' : 'from-blue-500/20 to-indigo-500/20 border-blue-500/50'}`}>
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span>Upgrade to {user.plan === 'basic' ? 'Pro' : 'Enterprise'}</span>
                    </CardTitle>
                    <CardDescription className="text-purple-200/70">
                      Unlock more features and websites
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.plan === 'basic' ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-purple-200">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>10 websites (vs. 3)</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-purple-200">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>Premium templates</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-purple-200">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>Custom domain support</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-purple-200">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>Advanced analytics</span>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleUpgrade('pro')}
                          disabled={upgradeLoading}
                          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-6"
                        >
                          {upgradeLoading ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          ) : (
                            <CreditCard className="w-5 h-5 mr-2" />
                          )}
                          Upgrade to Pro - $29/month
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-purple-200">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>Unlimited websites</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-purple-200">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>Priority support</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-purple-200">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>White-label options</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-purple-200">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>API access</span>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleUpgrade('enterprise')}
                          disabled={upgradeLoading}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6"
                        >
                          {upgradeLoading ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          ) : (
                            <Crown className="w-5 h-5 mr-2" />
                          )}
                          Upgrade to Enterprise - $99/month
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    <span>Platform Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <div className="text-2xl font-bold text-white mb-1">10K+</div>
                      <div className="text-xs text-purple-300/70">Websites Created</div>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <div className="text-2xl font-bold text-white mb-1">98%</div>
                      <div className="text-xs text-purple-300/70">Success Rate</div>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <div className="text-2xl font-bold text-white mb-1">2min</div>
                      <div className="text-xs text-purple-300/70">Avg. Generation</div>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <div className="text-2xl font-bold text-white mb-1">24/7</div>
                      <div className="text-xs text-purple-300/70">AI Availability</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Help Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Info className="w-5 h-5 text-purple-400" />
                    <span>Need Help?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-purple-300/70 text-sm">
                    Our AI analyzes your product link and creates a professional affiliate website in minutes.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                    onClick={() => router.push('/docs')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Documentation
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

