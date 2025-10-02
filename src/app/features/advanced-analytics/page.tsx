'use client'

import Link from 'next/link'
import { BarChart3, PieChart, TrendingUp, Users, Globe, ArrowRight, CheckCircle, Target, Clock, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'

export default function AdvancedAnalyticsPage() {
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
              Advanced Analytics for Affiliate Marketers
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Gain deep insights into your affiliate marketing performance with comprehensive analytics and reporting tools.
          </p>
        </motion.div>

        {/* Analytics Dashboard Preview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Comprehensive Analytics Dashboard</h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Total Traffic</h3>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">24,892</p>
                <p className="text-white/70 text-sm">
                  <span className="text-green-400">↑ 12.5%</span> vs last month
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Conversion Rate</h3>
                  <Target className="w-5 h-5 text-orange-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">3.8%</p>
                <p className="text-white/70 text-sm">
                  <span className="text-orange-400">↑ 0.5%</span> vs last month
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Revenue</h3>
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">$8,459</p>
                <p className="text-white/70 text-sm">
                  <span className="text-green-400">↑ 18.2%</span> vs last month
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Traffic Sources</h3>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-white/70">Organic Search</span>
                  </div>
                  <span className="text-white">42%</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-white/70">Social Media</span>
                  </div>
                  <span className="text-white">28%</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-white/70">Direct</span>
                  </div>
                  <span className="text-white">15%</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-white/70">Referral</span>
                  </div>
                  <span className="text-white">10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-white/70">Email</span>
                  </div>
                  <span className="text-white">5%</span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Top Performing Pages</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">/best-fitness-equipment-2025</span>
                    <span className="text-white">4,582 visits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">/top-10-running-shoes</span>
                    <span className="text-white">3,291 visits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">/home-gym-essentials</span>
                    <span className="text-white">2,847 visits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">/protein-powder-comparison</span>
                    <span className="text-white">2,103 visits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">/yoga-mats-review</span>
                    <span className="text-white">1,876 visits</span>
                  </div>
                </div>
              </div>
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
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Key Analytics Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Real-Time Data</h3>
                <p className="text-white/70">
                  Monitor your affiliate website performance in real-time with live updates on traffic, conversions, and revenue.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Conversion Tracking</h3>
                <p className="text-white/70">
                  Track every step of the conversion funnel to identify bottlenecks and optimize for higher conversion rates.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Audience Demographics</h3>
                <p className="text-white/70">
                  Understand your audience with detailed demographic data including age, location, interests, and behavior.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Traffic Source Analysis</h3>
                <p className="text-white/70">
                  Identify which channels drive the most valuable traffic and optimize your marketing efforts accordingly.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Content Performance</h3>
                <p className="text-white/70">
                  Analyze which content performs best for different metrics like engagement, time on page, and conversion rate.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Custom Reports</h3>
                <p className="text-white/70">
                  Create personalized reports with the metrics that matter most to your affiliate business goals.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Analytics Types */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Comprehensive Analytics Suite</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <BarChart3 className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Performance</h3>
              <p className="text-white/70">
                Track website performance metrics including page views, bounce rate, and session duration.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Users className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Audience</h3>
              <p className="text-white/70">
                Understand your visitors with demographic data, interests, and behavior patterns.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <DollarSign className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Revenue</h3>
              <p className="text-white/70">
                Track affiliate earnings, commission rates, and revenue attribution by source.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <PieChart className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Conversion</h3>
              <p className="text-white/70">
                Analyze conversion funnels, click-through rates, and affiliate link performance.
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Gain Deeper Insights?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto">
              Start using our advanced analytics tools to optimize your affiliate marketing strategy and increase your revenue.
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
