import { motion } from 'framer-motion'
import Link from 'next/link'
import { RefreshCw, BarChart3, Target, Zap, ArrowRight, CheckCircle, Layers, Lightbulb } from 'lucide-react'
import Header from '@/components/Header'

export default function ABTestingPage() {
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
              A/B Testing for Affiliate Websites
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Optimize your conversion rates and maximize affiliate revenue with powerful A/B testing tools.
          </p>
        </motion.div>

        {/* How It Works */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How A/B Testing Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">1. Create Variants</h3>
              <p className="text-white/70">
                Create multiple versions of your website with different headlines, images, layouts, or call-to-action buttons.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">2. Split Traffic</h3>
              <p className="text-white/70">
                Our system automatically splits your website traffic between the different variants to gather data.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">3. Analyze Results</h3>
              <p className="text-white/70">
                Review detailed analytics to see which variant performs better in terms of conversions and revenue.
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
                <h3 className="text-xl font-semibold mb-2 text-white">Visual Editor</h3>
                <p className="text-white/70">
                  Create test variants with our intuitive visual editor, no coding required.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Smart Traffic Allocation</h3>
                <p className="text-white/70">
                  Our AI automatically adjusts traffic distribution to favor better-performing variants.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Statistical Significance</h3>
                <p className="text-white/70">
                  Advanced algorithms ensure your test results are statistically significant before declaring a winner.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Multivariate Testing</h3>
                <p className="text-white/70">
                  Test multiple elements simultaneously to find the optimal combination for maximum conversions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Detailed Analytics</h3>
                <p className="text-white/70">
                  Get comprehensive reports on visitor behavior, conversion rates, and revenue for each variant.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">One-Click Implementation</h3>
                <p className="text-white/70">
                  Instantly implement the winning variant with a single click once your test is complete.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* What to Test */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">What You Can Test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Lightbulb className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Headlines</h3>
              <p className="text-white/70">
                Test different headlines to see which ones capture attention and drive engagement.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Zap className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Call-to-Actions</h3>
              <p className="text-white/70">
                Optimize button text, colors, and placement for maximum click-through rates.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Layers className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Page Layout</h3>
              <p className="text-white/70">
                Test different layouts and content arrangements to improve user experience.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Target className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Pricing Display</h3>
              <p className="text-white/70">
                Experiment with different ways to present pricing and special offers.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Case Study */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Success Story</h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-4 text-white">FitnessGearPro: 43% Conversion Increase</h3>
                <p className="text-white/80 mb-4">
                  FitnessGearPro, an affiliate website for fitness equipment, was struggling with low conversion rates on their product review pages. Using AFFILIFY's A/B testing tools, they tested different:
                </p>
                <ul className="list-disc list-inside text-white/80 mb-6 space-y-2">
                  <li>Product image placements</li>
                  <li>Call-to-action button colors and text</li>
                  <li>Review formats and layouts</li>
                  <li>Pricing display options</li>
                </ul>
                <p className="text-white/80 mb-4">
                  After running tests for just two weeks, they identified a winning combination that increased their conversion rate by 43% and boosted their monthly affiliate revenue by over $3,200.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Read Full Case Study</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div className="md:w-1/3 bg-white/5 rounded-xl p-6">
                <div className="mb-4">
                  <p className="text-lg font-bold text-white">Results:</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-white/70 text-sm">Conversion Rate</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-bold">+43%</p>
                      <span className="text-green-400">↑</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Click-Through Rate</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-bold">+27%</p>
                      <span className="text-green-400">↑</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Average Order Value</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-bold">+12%</p>
                      <span className="text-green-400">↑</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Monthly Revenue</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-bold">+$3,200</p>
                      <span className="text-green-400">↑</span>
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
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Optimize Your Affiliate Website?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto">
              Start testing different elements of your website to discover what drives the highest conversions and revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg flex items-center justify-center">
                  Start A/B Testing
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
