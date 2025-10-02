import { Zap, ArrowRight, CheckCircle, AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'

export default function QuickStartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-white/70 mb-8">
            <Link href="/docs" className="hover:text-white">Documentation</Link>
            <span className="mx-2">/</span>
            <Link href="/docs/getting-started" className="hover:text-white">Getting Started</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Quick Start Guide</span>
          </div>

          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Quick Start Guide</h1>
            </div>
            <p className="text-xl text-white/80">
              Get up and running with AFFILIFY in just a few minutes. This guide will walk you through the basics of creating your first affiliate website.
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Step 1: Create Your Account</h2>
            <div className="space-y-4 text-white/80">
              <p>
                To get started with AFFILIFY, you'll need to create an account. The signup process is quick and straightforward:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Visit the <Link href="/signup" className="text-orange-400 hover:text-orange-300">signup page</Link></li>
                <li>Enter your email address and create a password</li>
                <li>Verify your email address by clicking the link sent to your inbox</li>
                <li>Complete your profile with basic information</li>
              </ol>
              <div className="flex items-start p-4 bg-white/5 rounded-lg border border-white/10 mt-6">
                <Info className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  AFFILIFY offers a free tier that allows you to create up to 3 websites. No credit card is required to get started.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Step 2: Navigate the Dashboard</h2>
            <div className="space-y-4 text-white/80">
              <p>
                After signing in, you'll be taken to your dashboard. Here's a quick overview of the main sections:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">My Websites:</span> View and manage all your affiliate websites
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Analytics:</span> Track performance metrics for your websites
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Create Website:</span> Start building a new affiliate website
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Settings:</span> Manage your account and preferences
                  </div>
                </li>
              </ul>
              <div className="mt-4">
                <p>
                  Take some time to explore the dashboard and familiarize yourself with the interface. The navigation menu on the left provides quick access to all features.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Step 3: Create Your First Website</h2>
            <div className="space-y-4 text-white/80">
              <p>
                Now it's time to create your first affiliate website:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Click on the <strong className="text-white">Create Website</strong> button in your dashboard</li>
                <li>Enter the product URL you want to promote (e.g., an Amazon product link)</li>
                <li>Select your preferred template style</li>
                <li>Customize the website settings (colors, fonts, etc.)</li>
                <li>Click <strong className="text-white">Generate Website</strong></li>
              </ol>
              <p className="mt-4">
                Our AI will analyze the product and generate a complete affiliate website with optimized content, images, and affiliate links. This process typically takes 1-2 minutes.
              </p>
              <div className="flex items-start p-4 bg-white/5 rounded-lg border border-white/10 mt-6">
                <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Make sure the product URL is valid and accessible. The quality of the generated website depends on the information our AI can extract from the product page.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Step 4: Customize Your Website</h2>
            <div className="space-y-4 text-white/80">
              <p>
                After your website is generated, you can customize it further:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Edit Content:</span> Modify the AI-generated text to add your personal touch
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Add Sections:</span> Include additional content sections like FAQs, comparisons, or reviews
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Adjust Design:</span> Fine-tune colors, fonts, and layout to match your preferences
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Add Media:</span> Upload custom images or videos to enhance your content
                  </div>
                </li>
              </ul>
              <p className="mt-4">
                Take your time to review and refine the website. The more personalized and valuable your content is, the better it will perform.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Step 5: Publish and Promote</h2>
            <div className="space-y-4 text-white/80">
              <p>
                When you're satisfied with your website, it's time to publish and promote it:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Click the <strong className="text-white">Publish</strong> button to make your website live</li>
                <li>Copy your unique website URL (e.g., yoursite.affilify.com)</li>
                <li>Share your website on social media, forums, or other channels</li>
                <li>Monitor performance in the Analytics dashboard</li>
              </ol>
              <p className="mt-4">
                Your website is now live and ready to generate affiliate commissions! You can track visits, clicks, and conversions in real-time through your dashboard.
              </p>
              <div className="flex items-start p-4 bg-white/5 rounded-lg border border-white/10 mt-6">
                <Info className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  For best results, promote your website to relevant audiences who are likely to be interested in the product you're recommending.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Next Steps</h2>
            <div className="space-y-4 text-white/80">
              <p>
                Now that you've created your first affiliate website, here are some next steps to explore:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Link href="/docs/features/ai-generator" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">AI Website Generator</h3>
                  <p className="text-sm text-white/70 mb-4">Learn advanced techniques for generating high-converting websites</p>
                  <div className="flex items-center text-orange-400">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
                <Link href="/docs/features/analytics" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">Analytics & Reporting</h3>
                  <p className="text-sm text-white/70 mb-4">Understand your website performance and optimize for conversions</p>
                  <div className="flex items-center text-orange-400">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
                <Link href="/docs/tutorials/beginner-guide" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">Complete Beginner Guide</h3>
                  <p className="text-sm text-white/70 mb-4">Comprehensive tutorial for affiliate marketing beginners</p>
                  <div className="flex items-center text-orange-400">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
                <Link href="/docs/integrations/stripe" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">Stripe Integration</h3>
                  <p className="text-sm text-white/70 mb-4">Set up direct payments and subscriptions on your affiliate websites</p>
                  <div className="flex items-center text-orange-400">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
