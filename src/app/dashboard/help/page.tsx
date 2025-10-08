'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  Video, 
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Book,
  Users,
  Zap,
  Clock
} from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    id: '1',
    category: 'Getting Started',
    question: 'How do I create my first affiliate website?',
    answer: 'To create your first affiliate website, go to the "Create Website" page, enter your affiliate link (from Amazon, ClickBank, etc.), and our AI will generate a professional website for you. The process takes just a few minutes!'
  },
  {
    id: '2',
    category: 'Getting Started',
    question: 'What affiliate programs does AFFILIFY support?',
    answer: 'AFFILIFY works with all major affiliate programs including Amazon Associates, ClickBank, ShareASale, Commission Junction, and any other program that provides affiliate links. Simply paste your affiliate link and we\'ll handle the rest.'
  },
  {
    id: '3',
    category: 'Plans & Billing',
    question: 'What\'s the difference between Basic, Pro, and Enterprise plans?',
    answer: 'Basic (FREE): 3 websites, 10 analyses, basic templates. Pro ($29/month): 10 websites, 50 analyses, premium templates, custom domains. Enterprise ($99/month): Unlimited websites/analyses, advanced features, priority support, team collaboration.'
  },
  {
    id: '4',
    category: 'Plans & Billing',
    question: 'Can I upgrade or downgrade my plan anytime?',
    answer: 'Yes! You can upgrade your plan instantly. Downgrades take effect at the end of your current billing period to ensure you don\'t lose access to features you\'ve paid for.'
  },
  {
    id: '5',
    category: 'Website Analysis',
    question: 'How accurate is the website analysis feature?',
    answer: 'Our analysis uses Google PageSpeed Insights, advanced AI, and institutional-grade algorithms to provide Moody\'s/S&P level accuracy. We analyze performance, SEO, conversion potential, and provide actionable recommendations.'
  },
  {
    id: '6',
    category: 'Website Analysis',
    question: 'What does the analysis score mean?',
    answer: 'Scores range from 0-100: 90-100 (Excellent), 80-89 (Very Good), 70-79 (Good), 60-69 (Fair), 50-59 (Poor), 0-49 (Avoid). The score considers technical performance, SEO, user experience, and conversion potential.'
  },
  {
    id: '7',
    category: 'Technical',
    question: 'How do I publish my website?',
    answer: 'Once your website is created, click "Publish" to get a live URL. Pro and Enterprise users can also connect custom domains. Your website will be hosted on our fast, secure infrastructure.'
  },
  {
    id: '8',
    category: 'Technical',
    question: 'Can I edit my website after it\'s created?',
    answer: 'Yes! You can edit content, update affiliate links, change templates (Pro+), and customize the design. All changes are saved automatically and reflected on your live website immediately.'
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const categories = ['All', 'Getting Started', 'Plans & Billing', 'Website Analysis', 'Technical']

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setContactForm({
          name: '',
          email: '',
          subject: '',
          message: '',
          priority: 'normal'
        })
      }
    } catch (error) {
      console.error('Contact form error:', error)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
        <p className="text-gray-600">Find answers, get support, and learn how to make the most of AFFILIFY</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Book className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Documentation</h3>
            <p className="text-sm text-gray-600">Complete guides and tutorials</p>
            <Button 
              onClick={() => window.location.href = '/docs'}
              variant="outline" 
              size="sm" 
              className="mt-3"
            >
              View Docs
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Video className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-600">Step-by-step video guides</p>
            <Button 
              onClick={() => window.open('https://youtube.com/@affilify', '_blank')}
              variant="outline" 
              size="sm" 
              className="mt-3"
            >
              Watch Videos
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-sm text-gray-600">Connect with other users</p>
            <Button 
              onClick={() => window.open('https://discord.gg/affilify', '_blank')}
              variant="outline" 
              size="sm" 
              className="mt-3"
            >
              Join Discord
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <MessageCircle className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600">Get instant help</p>
            <Button 
              onClick={() => {
                // Integrate with your chat system (Intercom, Zendesk, etc.)
                alert('Chat feature coming soon!')
              }}
              variant="outline" 
              size="sm" 
              className="mt-3"
            >
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="space-y-3">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border rounded-lg">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4">
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQs found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or contact support for help.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Can't find what you're looking for? Send us a message
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Message Sent!</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We'll get back to you within 24 hours.
                  </p>
                  <Button 
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <Input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low - General question</option>
                      <option value="normal">Normal - Need help</option>
                      <option value="high">High - Issue affecting work</option>
                      <option value="urgent">Urgent - Critical problem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Please describe your issue in detail..."
                      className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-600">support@affilify.eu</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-sm text-gray-600">Within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Priority Support</p>
                  <p className="text-sm text-gray-600">Pro & Enterprise plans</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">All Systems Operational</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                All AFFILIFY services are running normally.
              </p>
              <Button 
                onClick={() => window.open('https://status.affilify.eu', '_blank')}
                variant="outline" 
                size="sm"
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Status Page
              </Button>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Helpful Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => window.location.href = '/docs/getting-started'}
                variant="outline"
                className="w-full justify-start"
              >
                <Book className="w-4 h-4 mr-2" />
                Getting Started Guide
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/features'}
                variant="outline"
                className="w-full justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                Feature Overview
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/pricing'}
                variant="outline"
                className="w-full justify-start"
              >
                <Zap className="w-4 h-4 mr-2" />
                Pricing & Plans
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

