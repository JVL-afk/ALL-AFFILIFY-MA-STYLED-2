'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Brain, 
  Palette, 
  Globe, 
  BarChart3, 
  Users, 
  Shield, 
  Rocket,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Target,
  Lightbulb,
  Settings,
  Code,
  Smartphone,
  Search,
  Mail,
  CreditCard,
  Lock,
  Clock,
  Award,
  Headphones,
  Layers,
  Database,
  Cloud,
  Wifi,
  Monitor,
  PieChart,
  LineChart,
  Activity,
  Filter,
  Sliders,
  Eye,
  MousePointer,
  Repeat,
  Share2,
  Download,
  Upload,
  RefreshCw,
  Maximize,
  Minimize,
  MoreHorizontal
} from 'lucide-react'

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState('ai-powered')
  const [activeFeature, setActiveFeature] = useState(0)

  const categories = [
    { id: 'ai-powered', label: 'AI-Powered', icon: Brain },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'enterprise', label: 'Enterprise', icon: Shield }
  ]

  const features = {
    'ai-powered': [
      {
        title: 'AI Website Generator',
        description: 'Create stunning affiliate websites in minutes using advanced AI that understands your niche and target audience.',
        icon: Brain,
        benefits: [
          'Generate complete websites from just a product URL',
          'AI-powered content creation for headlines, descriptions, and CTAs',
          'Automatic SEO optimization with meta tags and structured data',
          'Smart image selection and optimization',
          'Conversion-focused layout generation'
        ],
        demo: '/demos/ai-generator.mp4',
        plans: ['Basic', 'Pro', 'Enterprise']
      },
      {
        title: 'Smart Content Optimization',
        description: 'AI continuously analyzes and optimizes your content for maximum conversions and search engine visibility.',
        icon: Target,
        benefits: [
          'Real-time content performance analysis',
          'Automatic A/B testing of headlines and CTAs',
          'SEO keyword optimization suggestions',
          'Conversion rate improvement recommendations',
          'Content freshness monitoring and updates'
        ],
        demo: '/demos/content-optimization.mp4',
        plans: ['Pro', 'Enterprise']
      },
      {
        title: 'Intelligent Analytics',
        description: 'Get AI-powered insights into your website performance with predictive analytics and actionable recommendations.',
        icon: Activity,
        benefits: [
          'Predictive revenue forecasting',
          'User behavior pattern analysis',
          'Conversion funnel optimization',
          'Traffic source performance insights',
          'Automated reporting and alerts'
        ],
        demo: '/demos/ai-analytics.mp4',
        plans: ['Pro', 'Enterprise']
      }
    ],
    'templates': [
      {
        title: 'Professional Templates',
        description: 'Choose from a library of conversion-optimized templates designed by marketing experts.',
        icon: Palette,
        benefits: [
          '50+ professionally designed templates',
          'Mobile-responsive and fast-loading',
          'Conversion-optimized layouts',
          'Easy customization with drag-and-drop',
          'Regular template updates and new releases'
        ],
        demo: '/demos/templates.mp4',
        plans: ['Basic', 'Pro', 'Enterprise']
      },
      {
        title: 'Custom Branding',
        description: 'Fully customize your websites with your own branding, colors, fonts, and styling.',
        icon: Layers,
        benefits: [
          'Upload custom logos and brand assets',
          'Custom color schemes and typography',
          'White-label options for agencies',
          'CSS customization capabilities',
          'Brand consistency across all websites'
        ],
        demo: '/demos/branding.mp4',
        plans: ['Pro', 'Enterprise']
      },
      {
        title: 'Template Marketplace',
        description: 'Access exclusive premium templates and even sell your own custom designs.',
        icon: Star,
        benefits: [
          'Exclusive premium template access',
          'Community-created template library',
          'Template rating and review system',
          'Monetize your own template designs',
          'Regular featured template showcases'
        ],
        demo: '/demos/marketplace.mp4',
        plans: ['Enterprise']
      }
    ],
    'analytics': [
      {
        title: 'Real-Time Analytics',
        description: 'Monitor your website performance with comprehensive real-time analytics and reporting.',
        icon: BarChart3,
        benefits: [
          'Real-time visitor tracking and behavior analysis',
          'Conversion tracking and funnel analysis',
          'Revenue attribution and commission tracking',
          'Traffic source analysis and optimization',
          'Custom dashboard creation and sharing'
        ],
        demo: '/demos/analytics.mp4',
        plans: ['Basic', 'Pro', 'Enterprise']
      },
      {
        title: 'Advanced Reporting',
        description: 'Generate detailed reports with custom metrics, automated scheduling, and white-label options.',
        icon: PieChart,
        benefits: [
          'Custom report builder with drag-and-drop',
          'Automated report scheduling and delivery',
          'White-label reports for client presentations',
          'Data export in multiple formats',
          'Historical data analysis and trending'
        ],
        demo: '/demos/reporting.mp4',
        plans: ['Pro', 'Enterprise']
      },
      {
        title: 'Competitor Analysis',
        description: 'Track competitor performance and identify opportunities with advanced competitive intelligence.',
        icon: Eye,
        benefits: [
          'Competitor website monitoring and alerts',
          'Performance benchmarking and comparison',
          'Keyword gap analysis and opportunities',
          'Pricing and promotion tracking',
          'Market share analysis and insights'
        ],
        demo: '/demos/competitor-analysis.mp4',
        plans: ['Enterprise']
      }
    ],
    'automation': [
      {
        title: 'Automated Deployment',
        description: 'Deploy your websites automatically to multiple platforms with one-click publishing.',
        icon: Rocket,
        benefits: [
          'One-click deployment to multiple hosting platforms',
          'Automatic SSL certificate setup and management',
          'CDN integration for global performance',
          'Automated backups and version control',
          'Custom domain connection and management'
        ],
        demo: '/demos/deployment.mp4',
        plans: ['Basic', 'Pro', 'Enterprise']
      },
      {
        title: 'Content Automation',
        description: 'Automate content updates, product imports, and social media posting.',
        icon: RefreshCw,
        benefits: [
          'Automated product data synchronization',
          'Content scheduling and publishing',
          'Social media cross-posting automation',
          'Email marketing campaign automation',
          'Inventory and pricing update automation'
        ],
        demo: '/demos/content-automation.mp4',
        plans: ['Pro', 'Enterprise']
      },
      {
        title: 'Workflow Automation',
        description: 'Create custom workflows to automate repetitive tasks and optimize your processes.',
        icon: Settings,
        benefits: [
          'Visual workflow builder with drag-and-drop',
          'Trigger-based automation rules',
          'Integration with third-party tools and APIs',
          'Conditional logic and branching workflows',
          'Performance monitoring and optimization'
        ],
        demo: '/demos/workflows.mp4',
        plans: ['Enterprise']
      }
    ],
    'collaboration': [
      {
        title: 'Team Management',
        description: 'Collaborate with team members and clients with advanced user management and permissions.',
        icon: Users,
        benefits: [
          'Multi-user access with role-based permissions',
          'Team collaboration tools and commenting',
          'Client access and approval workflows',
          'Activity logging and audit trails',
          'Team performance tracking and reporting'
        ],
        demo: '/demos/team-management.mp4',
        plans: ['Pro', 'Enterprise']
      },
      {
        title: 'Client Portal',
        description: 'Provide clients with a dedicated portal to view progress, approve changes, and access reports.',
        icon: Monitor,
        benefits: [
          'Branded client portal with custom domain',
          'Real-time project progress tracking',
          'Client approval and feedback system',
          'Automated client reporting and notifications',
          'Secure file sharing and communication'
        ],
        demo: '/demos/client-portal.mp4',
        plans: ['Enterprise']
      },
      {
        title: 'Agency Tools',
        description: 'Scale your agency with white-label solutions, client management, and billing automation.',
        icon: Award,
        benefits: [
          'Complete white-label platform customization',
          'Client billing and subscription management',
          'Multi-tenant architecture for client separation',
          'Agency-specific analytics and reporting',
          'Reseller program and commission tracking'
        ],
        demo: '/demos/agency-tools.mp4',
        plans: ['Enterprise']
      }
    ],
    'enterprise': [
      {
        title: 'Advanced Security',
        description: 'Enterprise-grade security with SSO, compliance, and advanced threat protection.',
        icon: Shield,
        benefits: [
          'Single Sign-On (SSO) integration',
          'GDPR and CCPA compliance tools',
          'Advanced threat detection and prevention',
          'Data encryption and secure storage',
          'Regular security audits and certifications'
        ],
        demo: '/demos/security.mp4',
        plans: ['Enterprise']
      },
      {
        title: 'Custom Integrations',
        description: 'Connect with any tool or platform using our robust API and custom integration services.',
        icon: Code,
        benefits: [
          'RESTful API with comprehensive documentation',
          'Webhook support for real-time data sync',
          'Custom integration development services',
          'Third-party app marketplace and directory',
          'Developer tools and SDK availability'
        ],
        demo: '/demos/integrations.mp4',
        plans: ['Enterprise']
      },
      {
        title: 'Dedicated Support',
        description: 'Get priority support with dedicated account management and 24/7 technical assistance.',
        icon: Headphones,
        benefits: [
          'Dedicated customer success manager',
          '24/7 priority technical support',
          'Custom training and onboarding sessions',
          'Regular strategy consultation calls',
          'Direct access to engineering team'
        ],
        demo: '/demos/support.mp4',
        plans: ['Enterprise']
      }
    ]
  }

  const stats = [
    { label: 'Features Available', value: '100+', icon: Star },
    { label: 'Templates', value: '50+', icon: Palette },
    { label: 'Integrations', value: '25+', icon: Code },
    { label: 'Uptime', value: '99.9%', icon: Shield }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Affiliate Marketer',
      company: 'Digital Success Co.',
      quote: 'AFFILIFY transformed my business. I went from spending weeks creating websites to launching them in minutes.',
      rating: 5,
      image: '/testimonials/sarah.jpg'
    },
    {
      name: 'Mike Chen',
      role: 'Marketing Director',
      company: 'Growth Agency',
      quote: 'The AI-powered features are incredible. Our conversion rates improved by 40% after switching to AFFILIFY.',
      rating: 5,
      image: '/testimonials/mike.jpg'
    },
    {
      name: 'Emily Rodriguez',
      role: 'E-commerce Manager',
      company: 'Online Retail Pro',
      quote: 'The analytics and reporting features give us insights we never had before. Game-changing platform.',
      rating: 5,
      image: '/testimonials/emily.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
              Powerful{' '}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Features
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              Discover the comprehensive suite of AI-powered tools and features that make 
              AFFILIFY the ultimate platform for affiliate marketing success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
                Explore Features
              </button>
              <button className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-200 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Feature Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive feature set organized by category to find exactly what you need.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <category.icon className="w-5 h-5" />
                {category.label}
              </button>
            ))}
          </div>

          {/* Feature Details */}
          <div className="grid lg:grid-cols-3 gap-8">
            {features[activeCategory]?.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                    <div className="flex gap-1 mt-1">
                      {feature.plans.map((plan) => (
                        <span
                          key={plan}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            plan === 'Basic' ? 'bg-green-100 text-green-700' :
                            plan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {plan}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-3 mb-6">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                    Try Feature
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                    <Play className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See It In Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the power of AFFILIFY with our interactive demos and live previews.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">Interactive Demo</h3>
                <p className="text-xl mb-6 opacity-90">
                  Try our AI website generator right now. Enter a product URL and watch 
                  as we create a complete affiliate website in real-time.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    <span>No signup required</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    <span>Full feature access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    <span>Real-time generation</span>
                  </div>
                </div>
                <button className="mt-6 bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
                  Start Demo
                </button>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">Product URL</span>
                  </div>
                  <input
                    type="text"
                    placeholder="https://amazon.com/product/..."
                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold">
                  Generate Website
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from real users who have transformed their affiliate marketing with AFFILIFY.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-purple-600">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of successful affiliate marketers who are already using 
            AFFILIFY to build and scale their businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200 flex items-center gap-2 justify-center">
              <ArrowRight className="w-5 h-5" />
              View Pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

