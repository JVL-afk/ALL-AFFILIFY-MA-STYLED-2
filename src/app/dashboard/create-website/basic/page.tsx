'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Crown,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Palette,
  Type,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'

export default function BasicCreateWebsite() {
  const [currentWebsites] = useState(1)
  const maxWebsites = 3
  const [formData, setFormData] = useState({
    websiteName: '',
    niche: '',
    description: '',
    template: 'modern'
  })

  const basicTemplates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design',
      preview: '/templates/modern-preview.jpg',
      features: ['Responsive', 'Fast Loading', 'SEO Optimized']
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional and professional layout',
      preview: '/templates/classic-preview.jpg',
      features: ['Professional', 'Clean Layout', 'Easy Navigation']
    },
    {
      id: 'bold',
      name: 'Bold',
      description: 'Eye-catching and vibrant design',
      preview: '/templates/bold-preview.jpg',
      features: ['High Impact', 'Colorful', 'Engaging']
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canCreateWebsite = currentWebsites < maxWebsites

  return (
    <div className="min-h-screen bg-orange-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Website</h1>
            <p className="text-gray-700">Basic Plan - Simple affiliate website creation</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-gray-700 text-gray-900">
              Basic Plan: {currentWebsites}/{maxWebsites} websites
            </Badge>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/pricing">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade for More
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
                  <p className="text-gray-700">You've reached your Basic plan limit of {maxWebsites} websites. Upgrade to Pro for 10 websites!</p>
                </div>
                <Button asChild className="bg-purple-600 hover:bg-purple-700 ml-auto">
                  <Link href="/pricing">Upgrade Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Website Details Form */}
          <div className="lg:col-span-2">
            <Card className="bg-orange-500 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Website Details</CardTitle>
                <CardDescription className="text-gray-700">
                  Tell us about your affiliate website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="websiteName" className="text-gray-900">Website Name</Label>
                  <Input
                    id="websiteName"
                    placeholder="e.g., Best Basketball Hoops"
                    value={formData.websiteName}
                    onChange={(e) => handleInputChange('websiteName', e.target.value)}
                    className="bg-orange-500 bg-opacity-20 border-white border-opacity-30 text-gray-900 placeholder-gray-400"
                    disabled={!canCreateWebsite}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niche" className="text-gray-900">Niche/Category</Label>
                  <Input
                    id="niche"
                    placeholder="e.g., Sports Equipment, Home & Garden"
                    value={formData.niche}
                    onChange={(e) => handleInputChange('niche', e.target.value)}
                    className="bg-orange-500 bg-opacity-20 border-white border-opacity-30 text-gray-900 placeholder-gray-400"
                    disabled={!canCreateWebsite}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-900">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what products you'll be promoting..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-orange-500 bg-opacity-20 border-white border-opacity-30 text-gray-900 placeholder-gray-400 min-h-[100px]"
                    disabled={!canCreateWebsite}
                  />
                </div>

                {/* Basic Template Selection */}
                <div className="space-y-4">
                  <Label className="text-gray-900">Choose Template (Basic Plan)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {basicTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.template === template.id
                            ? 'border-purple-500 bg-purple-600/20'
                            : 'border-white border-opacity-30 bg-orange-500 bg-opacity-5 hover:border-white/40'
                        } ${!canCreateWebsite ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => canCreateWebsite && handleInputChange('template', template.id)}
                      >
                        <div className="aspect-video bg-gray-700 rounded mb-3 flex items-center justify-center">
                          <Palette className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="text-gray-900 font-medium mb-1">{template.name}</h4>
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

                {/* Upgrade Notice */}
                <Card className="bg-purple-600/20 border-purple-600/30">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Crown className="w-5 h-5 text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="text-purple-400 font-medium mb-1">Unlock More Templates</h4>
                        <p className="text-gray-700 text-sm mb-3">
                          Upgrade to Pro for Premium & Conversion Pro templates, plus advanced features like custom domains and analytics.
                        </p>
                        <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Link href="/pricing">
                            View Pro Features
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
                  {canCreateWebsite ? 'Create Website with AI' : 'Upgrade to Create More Websites'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Limits */}
            <Card className="bg-orange-500 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Basic Plan Limits</CardTitle>
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
                    <Globe className="w-4 h-4 mr-2" />
                    Basic templates only
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Type className="w-4 h-4 mr-2" />
                    AI content generation
                  </div>
                  <div className="flex items-center text-gray-700">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Basic image library
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Benefits */}
            <Card className="bg-orange-500 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Upgrade to Pro</CardTitle>
                <CardDescription className="text-gray-700">
                  Get more websites and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>10 websites (vs 3)</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Palette className="w-4 h-4 mr-2 text-purple-400" />
                    <span>Premium templates</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Globe className="w-4 h-4 mr-2 text-blue-400" />
                    <span>Custom domains</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Sparkles className="w-4 h-4 mr-2 text-green-400" />
                    <span>Advanced analytics</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Link href="/pricing">
                    Upgrade to Pro - $29/month
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-orange-500 bg-opacity-20 border-white border-opacity-30">
              <CardHeader>
                <CardTitle className="text-gray-900">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-4">
                  Check our documentation for website creation tips and best practices.
                </p>
                <Button asChild variant="outline" className="w-full border-white border-opacity-30 text-gray-900 hover:bg-orange-500 bg-opacity-20">
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

