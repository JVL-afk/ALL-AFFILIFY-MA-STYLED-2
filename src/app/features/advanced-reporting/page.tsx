'use client'

import Link from 'next/link'
import { BarChart3, PieChart, LineChart, ArrowUpRight, ArrowRight, CheckCircle, Download, Share2, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'

export default function AdvancedReportingPage() {
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
              Advanced Reporting & Analytics
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Gain deep insights into your affiliate marketing performance with comprehensive reports and actionable analytics.
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
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">1. Track Performance</h3>
              <p className="text-white/70">
                Automatically collect data from all your affiliate websites, campaigns, and marketing channels.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <PieChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">2. Visualize Data</h3>
              <p className="text-white/70">
                Transform raw data into beautiful, easy-to-understand charts, graphs, and visual reports.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <ArrowUpRight className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">3. Optimize Strategy</h3>
              <p className="text-white/70">
                Use data-driven insights to optimize your affiliate marketing strategy and increase revenue.
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
                <h3 className="text-xl font-semibold mb-2 text-white">Comprehensive Dashboards</h3>
                <p className="text-white/70">
                  Customizable dashboards that provide a complete overview of your affiliate marketing performance.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Multi-Channel Tracking</h3>
                <p className="text-white/70">
                  Track performance across all your affiliate networks, websites, and marketing channels in one place.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Advanced Segmentation</h3>
                <p className="text-white/70">
                  Segment your data by product, campaign, traffic source, geography, and more for detailed analysis.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Conversion Attribution</h3>
                <p className="text-white/70">
                  Understand which touchpoints contribute to conversions with multi-touch attribution modeling.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Automated Reporting</h3>
                <p className="text-white/70">
                  Schedule and automatically deliver reports to your inbox or team members on a regular basis.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Predictive Analytics</h3>
                <p className="text-white/70">
                  AI-powered insights that predict future trends and recommend optimization opportunities.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Report Types */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Available Reports</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-white">Performance Reports</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Revenue & Commission Summary</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Product Performance</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Campaign Performance</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Conversion Rate Analysis</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Click-through Rate Analysis</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-white">Traffic Reports</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Traffic Source Breakdown</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Geographic Distribution</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Device & Browser Analysis</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Landing Page Performance</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Referral Path Analysis</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-white">Advanced Reports</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Customer Journey Analysis</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Attribution Modeling</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Cohort Analysis</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Predictive Revenue Forecasting</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-white/80">Competitive Benchmarking</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Dashboard Preview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Analytics Dashboard</h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="bg-white/5 rounded-lg p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">Performance Overview</h3>
                  <p className="text-white/70">Last 30 days vs. previous period</p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    <span>Export</span>
                  </button>
                  <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    <span>Share</span>
                  </button>
                  <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <p className="text-white/70 text-sm mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-white mb-2">$24,582</p>
                  <div className="flex items-center text-green-400">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">+12.5% vs. prev. period</span>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <p className="text-white/70 text-sm mb-1">Commissions</p>
                  <p className="text-3xl font-bold text-white mb-2">$3,845</p>
                  <div className="flex items-center text-green-400">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">+8.3% vs. prev. period</span>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <p className="text-white/70 text-sm mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold text-white mb-2">4.2%</p>
                  <div className="flex items-center text-green-400">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">+0.5% vs. prev. period</span>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <p className="text-white/70 text-sm mb-1">Avg. Order Value</p>
                  <p className="text-3xl font-bold text-white mb-2">$87.50</p>
                  <div className="flex items-center text-green-400">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">+5.2% vs. prev. period</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Revenue Trend</h4>
                  <div className="h-64 flex items-end space-x-2">
                    {/* Simulated chart bars */}
                    {[40, 65, 50, 80, 75, 90, 60, 70, 85, 95, 75, 80].map((height, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-orange-600 to-red-600 rounded-t-sm" 
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-white/50 text-xs mt-2">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Top Products</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-white">Fitness Tracker Pro</span>
                          <span className="text-white">$8,245</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-white">Smart Home Hub</span>
                          <span className="text-white">$6,120</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-white">Wireless Earbuds</span>
                          <span className="text-white">$4,890</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-white">Portable Charger</span>
                          <span className="text-white">$3,250</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Traffic Sources</h4>
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 rounded-full border-8 border-orange-600 relative">
                      <div className="absolute inset-0 border-t-8 border-r-8 border-blue-500 rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                      <div className="absolute inset-0 border-t-8 border-l-8 border-green-500 rounded-full" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
                        <span className="text-white/80 text-sm">Organic Search</span>
                      </div>
                      <span className="text-white/80 text-sm">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-white/80 text-sm">Social Media</span>
                      </div>
                      <span className="text-white/80 text-sm">30%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-white/80 text-sm">Direct</span>
                      </div>
                      <span className="text-white/80 text-sm">25%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Geographic Distribution</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/80 text-sm">United States</span>
                        <span className="text-white/80 text-sm">42%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/80 text-sm">United Kingdom</span>
                        <span className="text-white/80 text-sm">18%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/80 text-sm">Canada</span>
                        <span className="text-white/80 text-sm">15%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/80 text-sm">Australia</span>
                        <span className="text-white/80 text-sm">12%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/80 text-sm">Germany</span>
                        <span className="text-white/80 text-sm">8%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '8%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Device Breakdown</h4>
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 rounded-full border-8 border-orange-600 relative">
                      <div className="absolute inset-0 border-t-8 border-r-8 border-blue-500 rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 30%)' }}></div>
                      <div className="absolute inset-0 border-b-8 border-l-8 border-green-500 rounded-full" style={{ clipPath: 'polygon(0 30%, 100% 30%, 100% 100%, 0 100%)' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
                        <span className="text-white/80 text-sm">Mobile</span>
                      </div>
                      <span className="text-white/80 text-sm">65%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-white/80 text-sm">Desktop</span>
                      </div>
                      <span className="text-white/80 text-sm">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-white/80 text-sm">Tablet</span>
                      </div>
                      <span className="text-white/80 text-sm">10%</span>
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
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Gain Deeper Insights?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto">
              Start tracking your affiliate marketing performance and make data-driven decisions to increase your revenue.
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
                  View Sample Reports
                </button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
