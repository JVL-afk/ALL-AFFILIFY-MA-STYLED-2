'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Globe, 
  Crown,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Palette,
  Type,
  Image as ImageIcon,
  BarChart3,
  TestTube,
  Zap,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export default function ProCreateWebsite() {
  const [currentWebsites] = useState(4)
  const maxWebsites = 10
  const [formData, setFormData] = useState({
    websiteName: '',
    niche: '',
    description: '',
    template: 'premium-modern',
    customDomain: '',
    analyticsEnabled: true,
    abTestingEnabled: false
  })

  const proTemplates = [
    {
      id: 'premium-modern',
      name: 'Premium Modern',
      description: 'Advanced modern design with animations',
      category: 'Premium',
      preview: '/templates/premium-modern-preview.jpg',
      features: ['Animations', 'Advanced SEO', 'Mobile Optimized', 'Fast Loading']
    },
    {
      id: 'conversion-pro',
      name: 'Conversion Pro',
      description: 'Optimized for maximum conversions',
      category: 'Conversion',
      preview: '/templates/conversion-pro-preview.jpg',
      features: ['High Converting', 'A/B Test Ready', 'CRO Optimized', 'Trust Signals']
    },
    {
      id: 'premium-classic',
      name: 'Premium Classic',
      description: 'Professional with advanced features',
      category: 'Premium',
      preview: '/templates/premium-classic-preview.jpg',
      features: ['Professional', 'Authority Building', 'Trust Elements', 'Clean Design']
    },
    {
      id: 'modern-bold',
      name: 'Modern Bold',
      description: 'Eye-catching with premium elements',
      category: 'Premium',
      preview: '/templates/modern-bold-preview.jpg',
      features: ['High Impact', 'Premium Styling', 'Engaging', 'Conversion Focused']
    },
    {
      id: 'review-master',
      name: 'Review Master',
      description: 'Perfect for product reviews',
      category: 'Specialized',
      preview: '/templates/review-master-preview.jpg',
      features: ['Review Focused', 'Comparison Tables', 'Rating Systems', 'Trust Building']
    },
    {
      id: 'affiliate-hub',
      name: 'Affiliate Hub',
      description: 'Multi-product affiliate showcase',
      category: 'Specialized',
      preview: '/templates/affiliate-hub-preview.jpg',
      features: ['Multi-Product', 'Category Pages', 'Search Function', 'Advanced Layout']
    }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canCreateWebsite = currentWebsites < maxWebsites

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Website</h1>
            <p className="text-gray-700">Pro Plan - Advanced affiliate website creation</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-purple-600 text-gray-900">
              <Crown className="w-3 h-3 mr-1" />
              Pro Plan: {currentWebsites}/{maxWebsites} websites
            </Badge>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/pricing">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Enterprise
              </Link>
            </Button>
          </div>
        </div>

        {!canCreateWebsite && (
          <Card className="bg-red-600/20 border-red-600/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-red-400 font-medium">Website Limit Reached</h3>
                  <p className="text-gray-700">You've reached your Pro plan limit of {maxWebsites} websites. Upgrade to Enterprise for unlimited websites!</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 ml-auto">
                  <Link href="/pricing">Upgrade Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Website Details Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Website Details</CardTitle>
                <CardDescription className="text-gray-700">
                  Create your professional affiliate website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="websiteName" className="text-gray-900">Website Name</Label>
                    <Input
                      id="websiteName"
                      placeholder="e.g., Ultimate Gaming Gear Reviews"
                      value={formData.websiteName}
                      onChange={(e) => handleInputChange('websiteName', e.target.value)}
                      className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30 text-gray-900 placeholder-gray-400"
                      disabled={!canCreateWebsite}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customDomain" className="text-gray-900">Custom Domain (Optional)</Label>
                    <Input
                      id="customDomain"
                      placeholder="e.g., yourdomain.com"
                      value={formData.customDomain}
                      onChange={(e) => handleInputChange('customDomain', e.target.value)}
                      className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30 text-gray-900 placeholder-gray-400"
                      disabled={!canCreateWebsite}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niche" className="text-gray-900">Niche/Category</Label>
                  <Select value={formData.niche} onValueChange={(value) => handleInputChange('niche', value)} disabled={!canCreateWebsite}>
                    <SelectTrigger className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30 text-gray-900">
                      <SelectValue placeholder="Select your niche" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology & Electronics</SelectItem>
                      <SelectItem value="fitness">Health & Fitness</SelectItem>
                      <SelectItem value="home-garden">Home & Garden</SelectItem>
                      <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                      <SelectItem value="sports">Sports & Outdoors</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="food">Food & Kitchen</SelectItem>
                      <SelectItem value="pets">Pets & Animals</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-900">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your website's focus, target audience, and the products you'll promote..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30 text-gray-900 placeholder-gray-400 min-h-[120px]"
                    disabled={!canCreateWebsite}
                  />
                </div>

                {/* Pro Template Selection */}
                <div className="space-y-4">
                  <Label className="text-gray-900">Choose Premium Template</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.template === template.id
                            ? 'border-purple-500 bg-purple-600/20'
                            : 'border-white border-opacity-30 bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-5 hover:border-white/40'
                        } ${!canCreateWebsite ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => canCreateWebsite && handleInputChange('template', template.id)}
                      >
                        <div className="aspect-video bg-gray-700 rounded mb-3 flex items-center justify-center">
                          <Palette className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-gray-900 font-medium">{template.name}</h4>
                          <Badge variant="secondary" className="text-xs bg-purple-600 text-gray-900">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {template.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs bg-gray-700 text-gray-700">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Features */}
                <div className="space-y-4">
                  <Label className="text-gray-900">Pro Features</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <BarChart3 className="w-5 h-5 text-blue-400" />
                            <div>
                              <h4 className="text-gray-900 font-medium">Advanced Analytics</h4>
                              <p className="text-gray-400 text-sm">Detailed visitor insights</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.analyticsEnabled}
                            onChange={(e) => handleInputChange('analyticsEnabled', e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded"
                            disabled={!canCreateWebsite}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <TestTube className="w-5 h-5 text-green-400" />
                            <div>
                              <h4 className="text-gray-900 font-medium">A/B Testing Ready</h4>
                              <p className="text-gray-400 text-sm">Optimize conversions</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.abTestingEnabled}
                            onChange={(e) => handleInputChange('abTestingEnabled', e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded"
                            disabled={!canCreateWebsite}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Enterprise Notice */}
                <Card className="bg-blue-600/20 border-blue-600/30">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-blue-400 font-medium mb-1">Unlock Enterprise Features</h4>
                        <p className="text-gray-700 text-sm mb-3">
                          Get unlimited websites, team collaboration, white-label options, and API access with Enterprise plan.
                        </p>
                        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Link href="/pricing">
                            View Enterprise Features
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Create Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                  disabled={!canCreateWebsite || !formData.websiteName || !formData.niche}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {canCreateWebsite ? 'Create Pro Website with AI' : 'Upgrade to Create More Websites'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Limits */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Pro Plan Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Websites</span>
                  <span className="text-gray-900 font-medium">{currentWebsites}/{maxWebsites}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${(currentWebsites / maxWebsites) * 100}%` }}
                  ></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <Crown className="w-4 h-4 mr-2 text-purple-400" />
                    Premium & Conversion templates
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Globe className="w-4 h-4 mr-2 text-blue-400" />
                    Custom domains
                  </div>
                  <div className="flex items-center text-gray-700">
                    <BarChart3 className="w-4 h-4 mr-2 text-green-400" />
                    Advanced analytics
                  </div>
                  <div className="flex items-center text-gray-700">
                    <TestTube className="w-4 h-4 mr-2 text-orange-400" />
                    A/B testing
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Unsplash Integration */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Pro Image Library</CardTitle>
                <CardDescription className="text-gray-700">
                  Access to premium stock photos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <ImageIcon className="w-4 h-4 mr-2 text-purple-400" />
                    <span>Unsplash integration</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                    <span>AI-powered image selection</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Settings className="w-4 h-4 mr-2 text-green-400" />
                    <span>Automatic optimization</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Your websites will automatically include high-quality, relevant images from our premium library.
                </p>
              </CardContent>
            </Card>

            {/* Enterprise Benefits */}
            <Card className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Upgrade to Enterprise</CardTitle>
                <CardDescription className="text-gray-700">
                  Unlimited websites and team features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Globe className="w-4 h-4 mr-2 text-blue-400" />
                    <span>Unlimited websites</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>Team collaboration</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Zap className="w-4 h-4 mr-2 text-purple-400" />
                    <span>API access</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Settings className="w-4 h-4 mr-2 text-green-400" />
                    <span>White-label options</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link href="/pricing">
                    Upgrade to Enterprise - $99/month
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

