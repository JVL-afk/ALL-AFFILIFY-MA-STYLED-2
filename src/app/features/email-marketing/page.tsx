'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Send, Clock, BarChart3, Users, ArrowRight, CheckCircle, Zap, Target, Settings } from 'lucide-react'
import Header from '@/components/Header'

export default function EmailMarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Email Marketing for Affiliate Success
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Build relationships, drive repeat traffic, and increase affiliate conversions with powerful email marketing tools.
          </p>
        </motion.div>

        {/* How It Works */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">1. Build Your List</h3>
              <p className="text-white/70">
                Capture visitor emails with customizable opt-in forms strategically placed on your affiliate website.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">2. Create Campaigns</h3>
              <p className="text-white/70">
                Design beautiful email campaigns with our drag-and-drop editor and affiliate-optimized templates.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">3. Analyze & Optimize</h3>
              <p className="text-white/70">
                Track opens, clicks, and conversions to refine your email strategy and maximize affiliate revenue.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Key Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Affiliate-Optimized Templates</h3>
                <p className="text-white/70">
                  Pre-designed email templates specifically created to showcase affiliate products and drive conversions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Automated Sequences</h3>
                <p className="text-white/70">
                  Set up automated email sequences to nurture leads and guide subscribers toward affiliate purchases.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Segmentation</h3>
                <p className="text-white/70">
                  Segment your email list based on behavior, interests, and purchase history for targeted campaigns.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">A/B Testing</h3>
                <p className="text-white/70">
                  Test different subject lines, content, and CTAs to optimize your email performance.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Conversion Tracking</h3>
                <p className="text-white/70">
                  Track affiliate conversions from email campaigns to measure ROI and optimize your strategy.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Compliance Tools</h3>
                <p className="text-white/70">
                  Stay compliant with email marketing laws with built-in tools for managing subscriptions and preferences.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Email Campaign Types */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Email Campaign Types</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Send className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Welcome Series</h3>
              <p className="text-white/70">
                Introduce new subscribers to your brand and affiliate products with a strategic welcome sequence.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Zap className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Promotional</h3>
              <p className="text-white/70">
                Highlight special offers, discounts, and limited-time deals for your affiliate products.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Target className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Targeted</h3>
              <p className="text-white/70">
                Send personalized product recommendations based on subscriber interests and behavior.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Clock className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Automated</h3>
              <p className="text-white/70">
                Set up trigger-based emails that send automatically based on specific user actions.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Email Builder Preview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Powerful Email Builder</h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <h3 className="text-2xl font-bold mb-6 text-white">Drag & Drop Editor</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-white/80">Intuitive drag-and-drop interface</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-white/80">No coding required</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-white/80">Mobile-responsive designs</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-white/80">Affiliate-optimized components</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-white/80">Product showcase blocks</p>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-6 text-white">Template Library</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-white/80">50+ pre-designed templates</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-white/80">Niche-specific designs</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-white/80">Customizable to match your brand</p>
                  </div>
                </div>
              </div>
              
              <div className="col-span-2 bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="bg-white/10 rounded-t-lg p-3 border border-white/10 border-b-0">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-4 text-white/70 text-sm">Email Builder</div>
                  </div>
                </div>
                <div className="bg-white/5 p-4 border border-white/10 rounded-b-lg">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="col-span-1 bg-white/10 rounded p-2 text-center">
                      <span className="text-white/70 text-xs">Elements</span>
                    </div>
                    <div className="col-span-1 bg-white/10 rounded p-2 text-center">
                      <span className="text-white/70 text-xs">Templates</span>
                    </div>
                    <div className="col-span-1 bg-white/10 rounded p-2 text-center">
                      <span className="text-white/70 text-xs">Content</span>
                    </div>
                    <div className="col-span-1 bg-white/10 rounded p-2 text-center">
                      <span className="text-white/70 text-xs">Settings</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-1/4 bg-white/5 rounded p-2 space-y-2">
                      <div className="bg-white/10 rounded p-1 text-center">
                        <span className="text-white/70 text-xs">Header</span>
                      </div>
                      <div className="bg-white/10 rounded p-1 text-center">
                        <span className="text-white/70 text-xs">Text</span>
                      </div>
                      <div className="bg-white/10 rounded p-1 text-center">
                        <span className="text-white/70 text-xs">Image</span>
                      </div>
                      <div className="bg-white/10 rounded p-1 text-center">
                        <span className="text-white/70 text-xs">Button</span>
                      </div>
                      <div className="bg-white/10 rounded p-1 text-center">
                        <span className="text-white/70 text-xs">Product</span>
                      </div>
                      <div className="bg-white/10 rounded p-1 text-center">
                        <span className="text-white/70 text-xs">Divider</span>
                      </div>
                      <div className="bg-white/10 rounded p-1 text-center">
                        <span className="text-white/70 text-xs">Spacer</span>
                      </div>
                    </div>
                    
                    <div className="w-3/4 bg-white/5 rounded p-4">
                      <div className="bg-white/10 rounded-lg p-3 mb-3 text-center">
                        <span className="text-white font-bold">Your Email Subject</span>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 mb-3 flex justify-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                          <Mail className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 mb-3 text-center">
                        <span className="text-white">Main Headline Goes Here</span>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 mb-3">
                        <div className="w-full h-4 bg-white/20 rounded mb-2"></div>
                        <div className="w-full h-4 bg-white/20 rounded mb-2"></div>
                        <div className="w-3/4 h-4 bg-white/20 rounded"></div>
                      </div>
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg py-2 px-4">
                          <span className="text-white text-sm">Call to Action</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Grow Your Affiliate Revenue with Email Marketing?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto">
              Start building your email list and creating campaigns that drive traffic and conversions to your affiliate offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg flex items-center justify-center">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <Link href="/docs">
                <button className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
