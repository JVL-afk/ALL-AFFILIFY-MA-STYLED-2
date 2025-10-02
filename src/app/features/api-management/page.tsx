import { motion } from 'framer-motion'
import Link from 'next/link'
import { Code, Database, Lock, Zap, ArrowRight, CheckCircle, Settings, RefreshCw, Shield } from 'lucide-react'
import Header from '@/components/Header'

export default function ApiManagementPage() {
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
              API Management for Affiliate Marketers
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Connect, integrate, and automate your affiliate marketing operations with our powerful API management tools.
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
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">1. Connect APIs</h3>
              <p className="text-white/70">
                Easily connect to affiliate networks, payment processors, and marketing tools through our API hub.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">2. Configure Integrations</h3>
              <p className="text-white/70">
                Set up data flows and automation rules without writing complex code using our visual interface.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">3. Manage Data</h3>
              <p className="text-white/70">
                Monitor API performance, track data flows, and ensure seamless operation of all your integrations.
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
                <h3 className="text-xl font-semibold mb-2 text-white">Pre-built Connectors</h3>
                <p className="text-white/70">
                  Ready-to-use connectors for popular affiliate networks, payment gateways, and marketing platforms.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Visual API Builder</h3>
                <p className="text-white/70">
                  Create custom API workflows with our intuitive drag-and-drop interface, no coding required.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Real-time Monitoring</h3>
                <p className="text-white/70">
                  Track API performance, error rates, and data throughput with comprehensive dashboards.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Data Transformation</h3>
                <p className="text-white/70">
                  Convert, filter, and enrich data between different systems to ensure compatibility.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Secure Authentication</h3>
                <p className="text-white/70">
                  Industry-standard OAuth, API keys, and token management for secure connections.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Webhook Support</h3>
                <p className="text-white/70">
                  Create and manage webhooks to trigger actions based on events in your affiliate systems.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Available Integrations */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Available Integrations</h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-white font-bold">AN</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Amazon Associates</h3>
                <p className="text-white/60 text-sm">Product data, earnings reports</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-white font-bold">CJ</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Commission Junction</h3>
                <p className="text-white/60 text-sm">Affiliate links, commission data</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-white font-bold">SP</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">ShareASale</h3>
                <p className="text-white/60 text-sm">Merchant data, transaction tracking</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-white font-bold">RA</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Rakuten Advertising</h3>
                <p className="text-white/60 text-sm">Affiliate programs, reporting</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-white font-bold">ST</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Stripe</h3>
                <p className="text-white/60 text-sm">Payment processing, subscriptions</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-white font-bold">GA</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Google Analytics</h3>
                <p className="text-white/60 text-sm">Traffic data, conversion tracking</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-white font-bold">FB</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Facebook Ads</h3>
                <p className="text-white/60 text-sm">Ad performance, audience data</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-white font-bold">+</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Many More</h3>
                <p className="text-white/60 text-sm">30+ additional integrations</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* API Dashboard Preview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">API Management Dashboard</h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="bg-white/5 rounded-lg p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">API Connections</h3>
                  <p className="text-white/70">5 active connections · 2 pending</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  <span>Add New Connection</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="col-span-2">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/10 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4">API Health Status</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white/70 text-sm mb-1">Amazon Associates</p>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-white font-medium">Healthy</span>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white/70 text-sm mb-1">Stripe</p>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-white font-medium">Healthy</span>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white/70 text-sm mb-1">Google Analytics</p>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-white font-medium">Healthy</span>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white/70 text-sm mb-1">ShareASale</p>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-white font-medium">Degraded</span>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white/70 text-sm mb-1">Facebook Ads</p>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-white font-medium">Error</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Recent API Activity</h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-full mr-3 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white text-xs">GA</span>
                        </div>
                        <div>
                          <p className="text-white text-sm">Google Analytics data sync completed</p>
                          <p className="text-white/50 text-xs">10 minutes ago · 2.3MB transferred</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-full mr-3 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white text-xs">FB</span>
                        </div>
                        <div>
                          <p className="text-white text-sm">Facebook Ads API authentication failed</p>
                          <p className="text-white/50 text-xs">1 hour ago · Error 401</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mr-3 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white text-xs">AM</span>
                        </div>
                        <div>
                          <p className="text-white text-sm">Amazon product data updated</p>
                          <p className="text-white/50 text-xs">3 hours ago · 156 products</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">API Usage</h4>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Amazon Associates</span>
                        <span className="text-white/70 text-sm">78%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Stripe</span>
                        <span className="text-white/70 text-sm">45%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Google Analytics</span>
                        <span className="text-white/70 text-sm">92%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">ShareASale</span>
                        <span className="text-white/70 text-sm">23%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Facebook Ads</span>
                        <span className="text-white/70 text-sm">0%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '0%' }}></div>
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
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Connect Your Affiliate Systems?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto">
              Streamline your affiliate marketing operations with our powerful API management tools.
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
                  View API Documentation
                </button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
