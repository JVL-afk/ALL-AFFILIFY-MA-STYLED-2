'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Book, 
  Code, 
  Zap, 
  Settings, 
  Users, 
  HelpCircle,
  Search,
  ChevronRight,
  ChevronDown,
  Copy,
  ExternalLink,
  Play,
  Download,
  Star,
  Clock,
  Tag,
  Filter,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Terminal,
  Globe,
  Database,
  Shield,
  Smartphone,
  Monitor,
  Layers,
  FileText,
  Video,
  Image,
  Link,
  Mail,
  Phone,
  MessageCircle,
  Github,
  Slack
} from 'lucide-react'

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<string[]>(['getting-started'])

  const navigation = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      items: [
        { id: 'quick-start', title: 'Quick Start Guide', type: 'guide' },
        { id: 'installation', title: 'Installation', type: 'guide' },
        { id: 'first-website', title: 'Create Your First Website', type: 'tutorial' },
        { id: 'dashboard-overview', title: 'Dashboard Overview', type: 'guide' }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      icon: Star,
      items: [
        { id: 'ai-generator', title: 'AI Website Generator', type: 'guide' },
        { id: 'templates', title: 'Templates & Themes', type: 'guide' },
        { id: 'analytics', title: 'Analytics & Reporting', type: 'guide' },
        { id: 'automation', title: 'Automation Tools', type: 'guide' },
        { id: 'collaboration', title: 'Team Collaboration', type: 'guide' }
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Code,
      items: [
        { id: 'authentication', title: 'Authentication', type: 'api' },
        { id: 'websites', title: 'Websites API', type: 'api' },
        { id: 'analytics-api', title: 'Analytics API', type: 'api' },
        { id: 'webhooks', title: 'Webhooks', type: 'api' },
        { id: 'rate-limits', title: 'Rate Limits', type: 'api' }
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Settings,
      items: [
        { id: 'stripe', title: 'Stripe Integration', type: 'integration' },
        { id: 'google-analytics', title: 'Google Analytics', type: 'integration' },
        { id: 'mailchimp', title: 'Mailchimp', type: 'integration' },
        { id: 'zapier', title: 'Zapier', type: 'integration' },
        { id: 'custom-integrations', title: 'Custom Integrations', type: 'integration' }
      ]
    },
    {
      id: 'tutorials',
      title: 'Tutorials',
      icon: Play,
      items: [
        { id: 'beginner-guide', title: 'Complete Beginner Guide', type: 'tutorial' },
        { id: 'advanced-optimization', title: 'Advanced Optimization', type: 'tutorial' },
        { id: 'scaling-business', title: 'Scaling Your Business', type: 'tutorial' },
        { id: 'case-studies', title: 'Case Studies', type: 'tutorial' }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      icon: HelpCircle,
      items: [
        { id: 'faq', title: 'Frequently Asked Questions', type: 'support' },
        { id: 'troubleshooting', title: 'Troubleshooting', type: 'support' },
        { id: 'contact', title: 'Contact Support', type: 'support' },
        { id: 'community', title: 'Community Forum', type: 'support' }
      ]
    }
  ]

  const popularDocs = [
    {
      title: 'Quick Start Guide',
      description: 'Get up and running with AFFILIFY in under 5 minutes',
      type: 'guide',
      readTime: '3 min',
      category: 'Getting Started'
    },
    {
      title: 'AI Website Generator',
      description: 'Learn how to create stunning websites using our AI technology',
      type: 'guide',
      readTime: '8 min',
      category: 'Features'
    },
    {
      title: 'Websites API',
      description: 'Complete API reference for managing websites programmatically',
      type: 'api',
      readTime: '12 min',
      category: 'API Reference'
    },
    {
      title: 'Complete Beginner Guide',
      description: 'Step-by-step tutorial for affiliate marketing beginners',
      type: 'tutorial',
      readTime: '25 min',
      category: 'Tutorials'
    }
  ]

  const recentUpdates = [
    {
      title: 'New Analytics Dashboard',
      description: 'Updated documentation for the new analytics features',
      date: '2 days ago',
      type: 'update'
    },
    {
      title: 'API v2.0 Release',
      description: 'Complete API reference updated for version 2.0',
      date: '1 week ago',
      type: 'new'
    },
    {
      title: 'Stripe Integration Guide',
      description: 'New integration guide for Stripe payment processing',
      date: '2 weeks ago',
      type: 'new'
    }
  ]

  const codeExample = `// Initialize AFFILIFY API client
const affilify = new AffiligyAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.affilify.com/v2'
});

// Create a new website
const website = await affilify.websites.create({
  productUrl: 'https://amazon.com/product/...',
  niche: 'technology',
  template: 'modern',
  targetAudience: 'tech enthusiasts'
});

console.log('Website created:', website.url);`

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return Book
      case 'tutorial': return Play
      case 'api': return Code
      case 'integration': return Settings
      case 'support': return HelpCircle
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-700'
      case 'tutorial': return 'bg-green-100 text-green-700'
      case 'api': return 'bg-purple-100 text-purple-700'
      case 'integration': return 'bg-orange-100 text-orange-700'
      case 'support': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Documentation</h1>
              <p className="text-lg text-gray-600">
                Everything you need to know about using AFFILIFY
              </p>
            </div>
            <div className="flex gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                Get Started
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                API Reference
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              <nav className="space-y-2">
                {navigation.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleExpanded(section.id)}
                      className="flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <section.icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{section.title}</span>
                      </div>
                      {expandedItems.includes(section.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedItems.includes(section.id) && (
                      <div className="ml-8 mt-2 space-y-1">
                        {section.items.map((item) => {
                          const Icon = getTypeIcon(item.type)
                          return (
                            <button
                              key={item.id}
                              onClick={() => setActiveSection(item.id)}
                              className={`flex items-center gap-2 w-full p-2 text-left rounded-md transition-colors ${
                                activeSection === item.id
                                  ? 'bg-purple-50 text-purple-700'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-sm">{item.title}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Popular Documentation */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Documentation</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {popularDocs.map((doc, index) => (
                  <motion.div
                    key={doc.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(doc.type)}`}>
                          {(() => {
                            const Icon = getTypeIcon(doc.type)
                            return <Icon className="w-5 h-5" />
                          })()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{doc.category}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {doc.readTime}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm">{doc.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Start Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Quick Start Guide</h2>
              </div>

              <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-6">
                  Get up and running with AFFILIFY in just a few minutes. Follow these simple steps 
                  to create your first affiliate website.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-purple-600 font-bold text-lg">1</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sign Up</h3>
                    <p className="text-gray-600 text-sm">Create your free AFFILIFY account</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-purple-600 font-bold text-lg">2</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Add Product</h3>
                    <p className="text-gray-600 text-sm">Enter a product URL you want to promote</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-purple-600 font-bold text-lg">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Generate</h3>
                    <p className="text-gray-600 text-sm">Let AI create your website automatically</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Code Example</h4>
                  <div className="bg-gray-900 rounded-lg p-4 relative">
                    <button className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{codeExample}</code>
                    </pre>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                    Start Building
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Watch Tutorial
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Updates</h2>
              <div className="space-y-4">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-lg ${
                      update.type === 'new' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {update.type === 'new' ? (
                        <Star className={`w-5 h-5 ${update.type === 'new' ? 'text-green-600' : 'text-blue-600'}`} />
                      ) : (
                        <Info className={`w-5 h-5 ${update.type === 'new' ? 'text-green-600' : 'text-blue-600'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{update.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          update.type === 'new' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {update.type === 'new' ? 'New' : 'Updated'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{update.description}</p>
                      <span className="text-xs text-gray-500">{update.date}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Need Help?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you succeed.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <MessageCircle className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm opacity-90 mb-4">Get instant help from our support team</p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200">
                Start Chat
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Mail className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm opacity-90 mb-4">Send us a detailed message</p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200">
                Send Email
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Users className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm opacity-90 mb-4">Connect with other users</p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200">
                Join Forum
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

