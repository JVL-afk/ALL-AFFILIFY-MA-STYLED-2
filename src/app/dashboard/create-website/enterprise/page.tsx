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
  Palette,
  Type,
  Image as ImageIcon,
  BarChart3,
  TestTube,
  Zap,
  Settings,
  Users,
  Shield,
  Infinity,
  Target,
  Briefcase,
  Code,
  Database
} from 'lucide-react'
import Link from 'next/link'

export default function EnterpriseCreateWebsite() {
  const [currentWebsites] = useState(23)
  const [formData, setFormData] = useState({
    websiteName: '',
    niche: '',
    description: '',
    template: 'enterprise-pro',
    customDomain: '',
    analyticsEnabled: true,
    abTestingEnabled: true,
    teamAccess: true,
    whiteLabel: false,
    apiAccess: true,
    customBranding: '',
    targetAudience: '',
    conversionGoals: ''
  })

  const enterpriseTemplates = [
    {
      id: 'enterprise-pro',
      name: 'Enterprise Pro',
      description: 'Ultimate conversion-optimized design',
      category: 'Enterprise',
      preview: '/templates/enterprise-pro-preview.jpg',
      features: ['Maximum Conversion', 'Enterprise Features', 'Team Ready', 'White-label Ready']
    },
    {
      id: 'authority-builder',
      name: 'Authority Builder',
      description: 'Build trust and authority in your niche',
      category: 'Enterprise',
      preview: '/templates/authority-builder-preview.jpg',
      features: ['Authority Building', 'Trust Signals', 'Expert Positioning', 'Social Proof']
    },
    {
      id: 'conversion-master',
      name: 'Conversion Master',
      description: 'Scientifically optimized for conversions',
      category: 'Enterprise',
      preview: '/templates/conversion-master-preview.jpg',
      features: ['CRO Optimized', 'Psychology-Based', 'A/B Test Ready', 'High Converting']
    },
    {
      id: 'multi-product-hub',
      name: 'Multi-Product Hub',
      description: 'Showcase multiple products effectively',
      category: 'Enterprise',
      preview: '/templates/multi-product-hub-preview.jpg',
      features: ['Multi-Product', 'Advanced Filtering', 'Comparison Tools', 'Category Management']
    },
    {
      id: 'review-authority',
      name: 'Review Authority',
      description: 'Professional review and comparison site',
      category: 'Specialized',
      preview: '/templates/review-authority-preview.jpg',
      features: ['Review System', 'Comparison Tables', 'Rating Engine', 'Trust Building']
    },
    {
      id: 'enterprise-custom',
      name: 'Custom Enterprise',
      description: 'Fully customizable enterprise template',
      category: 'Custom',
      preview: '/templates/enterprise-custom-preview.jpg',
      features: ['Fully Customizable', 'Brand Integration', 'Custom Components', 'API Ready']
    }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create New Website</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Website Details Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-gray-900">Enterprise Website Configuration</CardTitle>
                <CardDescription className="text-gray-700">
                  Create your enterprise-grade affiliate website with advanced features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="websiteName" className="text-gray-900">Website Name</Label>
                    <Input
                      id="websiteName"
                      placeholder="e.g., TechReviews Authority Hub"
                      value={formData.websiteName}
                      onChange={(e) => handleInputChange('websiteName', e.target.value)}
                      className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customDomain" className="text-gray-900">Custom Domain</Label>
                    <Input
                      id="customDomain"
                      placeholder="e.g., yourbrand.com"
                      value={formData.customDomain}
                      onChange={(e) => handleInputChange('customDomain', e.target.value)}
                      className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="niche" className="text-gray-900">Primary Niche</Label>
                    <Select value={formData.niche} onValueChange={(value) => handleInputChange('niche', value)}>
                      <SelectTrigger className="bg-white bg-opacity-10 border-white border-opacity-20 text-gray-900">
                        <SelectValue placeholder="Select primary niche" />
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
                        <SelectItem value="business">Business & Finance</SelectItem>
                        <SelectItem value="education">Education & Learning</SelectItem>
                        <SelectItem value="multi-niche">Multi-Niche</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience" className="text-gray-900">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      placeholder="e.g., Tech enthusiasts, professionals"
                      value={formData.targetAudience}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-900">Website Description & Strategy</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your website's purpose, content strategy, target audience, and business goals..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-400 min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conversionGoals" className="text-gray-900">Conversion Goals</Label>
                  <Input
                    id="conversionGoals"
                    placeholder="e.g., Product sales, email signups, affiliate clicks"
                    value={formData.conversionGoals}
                    onChange={(e) => handleInputChange('conversionGoals', e.target.value)}
                    className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-400"
                  />
                </div>

                {/* Enterprise Template Selection */}
                <div className="space-y-4">
                  <Label className="text-gray-900">Choose Enterprise Template</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enterpriseTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.template === template.id
                            ? 'border-purple-500 bg-purple-600/20'
                            : 'border-white border-opacity-20 bg-white bg-opacity-5 hover:border-white/40'
                        }`}
                        onClick={() => handleInputChange('template', template.id)}
                      >
                        <div className="aspect-video bg-gray-700 rounded mb-3 flex items-center justify-center">
                          <Palette className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{template.name}</h4>
                          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-gray-900">
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

                {/* Enterprise Features Configuration */}
                <div className="space-y-4">
                  <Label className="text-gray-900">Enterprise Features Configuration</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white bg-opacity-5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <BarChart3 className="w-5 h-5 text-blue-400" />
                            <div>
                              <h4 className="text-white font-medium">Advanced Analytics</h4>
                              <p className="text-gray-400 text-sm">Enterprise-level insights</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.analyticsEnabled}
                            onChange={(e) => handleInputChange('analyticsEnabled', e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white bg-opacity-5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <TestTube className="w-5 h-5 text-green-400" />
                            <div>
                              <h4 className="text-white font-medium">A/B Testing Suite</h4>
                              <p className="text-gray-400 text-sm">Advanced optimization</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.abTestingEnabled}
                            onChange={(e) => handleInputChange('abTestingEnabled', e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white bg-opacity-5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Users className="w-5 h-5 text-purple-400" />
                            <div>
                              <h4 className="text-white font-medium">Team Collaboration</h4>
                              <p className="text-gray-400 text-sm">Multi-user access</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.teamAccess}
                            onChange={(e) => handleInputChange('teamAccess', e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white bg-opacity-5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Shield className="w-5 h-5 text-yellow-400" />
                            <div>
                              <h4 className="text-white font-medium">White-label Mode</h4>
                              <p className="text-gray-400 text-sm">Remove AFFILIFY branding</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.whiteLabel}
                            onChange={(e) => handleInputChange('whiteLabel', e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white bg-opacity-5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Zap className="w-5 h-5 text-orange-400" />
                            <div>
                              <h4 className="text-white font-medium">API Access</h4>
                              <p className="text-gray-400 text-sm">Custom integrations</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.apiAccess}
                            onChange={(e) => handleInputChange('apiAccess', e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white bg-opacity-5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Briefcase className="w-5 h-5 text-cyan-400" />
                          <div className="flex-1">
                            <h4 className="text-white font-medium">Custom Branding</h4>
                            <Input
                              placeholder="Your brand name"
                              value={formData.customBranding}
                              onChange={(e) => handleInputChange('customBranding', e.target.value)}
                              className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-400 mt-2"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Create Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700"
                  disabled={!formData.websiteName || !formData.niche}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Enterprise Website with AI
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enterprise Status */}
            <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-gray-900">Enterprise Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Websites Created</span>
                  <span className="text-white font-medium">{currentWebsites}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Limit</span>
                  <Badge variant="secondary" className="bg-green-600 text-gray-900">
                    <Infinity className="w-3 h-3 mr-1" />
                    Unlimited
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                    All Enterprise templates
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-purple-400" />
                    Team collaboration
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Shield className="w-4 h-4 mr-2 text-blue-400" />
                    White-label options
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Zap className="w-4 h-4 mr-2 text-orange-400" />
                    Full API access
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Image Library */}
            <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-gray-900">Enterprise Media Library</CardTitle>
                <CardDescription className="text-gray-700">
                  Premium content and assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <ImageIcon className="w-4 h-4 mr-2 text-purple-400" />
                    <span>Unlimited Unsplash access</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                    <span>AI-powered content generation</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Database className="w-4 h-4 mr-2 text-green-400" />
                    <span>Custom asset management</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Code className="w-4 h-4 mr-2 text-orange-400" />
                    <span>Custom component library</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Management */}
            <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-gray-900">Team Management</CardTitle>
                <CardDescription className="text-gray-700">
                  Collaborate with your team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Team Members</span>
                    <span className="text-white font-medium">8 active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Active Projects</span>
                    <span className="text-white font-medium">12</span>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full border-white border-opacity-20 text-white hover:bg-white bg-opacity-10">
                  <Link href="/dashboard/team-collaboration">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Team
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* API & Integrations */}
            <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-gray-900">API & Integrations</CardTitle>
                <CardDescription className="text-gray-700">
                  Connect with external services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild variant="outline" className="w-full border-white border-opacity-20 text-white hover:bg-white bg-opacity-10">
                  <Link href="/dashboard/api-management">
                    <Zap className="w-4 h-4 mr-2" />
                    API Management
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-white border-opacity-20 text-white hover:bg-white bg-opacity-10">
                  <Link href="/dashboard/custom-integrations">
                    <Settings className="w-4 h-4 mr-2" />
                    Custom Integrations
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

