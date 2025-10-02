'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Puzzle, Zap, Settings, RefreshCw, ArrowRight, CheckCircle, Code, Lock, Database } from 'lucide-react'
import Header from '@/components/Header'

export default function CustomIntegrationsPage() {
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
              Custom Integrations for Affiliate Marketing
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Connect your affiliate websites with any third-party service or platform to create a seamless marketing ecosystem.
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
                <Puzzle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">1. Choose Integrations</h3>
              <p className="text-white/70">
                Select from our library of pre-built integrations or create custom connections to any service.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">2. Configure Workflows</h3>
              <p className="text-white/70">
                Set up automated workflows and data synchronization between your affiliate tools and services.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">3. Automate & Scale</h3>
              <p className="text-white/70">
                Let your integrations run automatically, saving time and scaling your affiliate operations.
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
                <h3 className="text-xl font-semibold mb-2 text-white">No-Code Integration Builder</h3>
                <p className="text-white/70">
                  Create powerful integrations without writing a single line of code using our visual builder.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">200+ Pre-built Connectors</h3>
                <p className="text-white/70">
                  Connect to popular services like Zapier, Mailchimp, HubSpot, Shopify, and many more.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Custom Webhook Support</h3>
                <p className="text-white/70">
                  Create custom webhooks to connect with any service that supports webhook integration.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Data Mapping</h3>
                <p className="text-white/70">
                  Map data fields between different services to ensure seamless data transfer and compatibility.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Conditional Logic</h3>
                <p className="text-white/70">
                  Create smart workflows with if-then conditions to automate decision-making processes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Integration Monitoring</h3>
                <p className="text-white/70">
                  Track the performance and status of all your integrations with real-time monitoring.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Popular Integrations */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Popular Integrations</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-white font-bold">ZP</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Zapier</h3>
              <p className="text-white/70 text-sm">
                Connect with 3,000+ apps through Zapier's automation platform.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-white font-bold">MC</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Mailchimp</h3>
              <p className="text-white/70 text-sm">
                Sync email subscribers and automate email marketing campaigns.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-white font-bold">GA</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Google Analytics</h3>
              <p className="text-white/70 text-sm">
                Track website performance and affiliate conversion metrics.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-white font-bold">ST</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Stripe</h3>
              <p className="text-white/70 text-sm">
                Process payments and manage subscriptions seamlessly.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-white font-bold">SH</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Shopify</h3>
              <p className="text-white/70 text-sm">
                Integrate with e-commerce stores for product data and sales tracking.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-white font-bold">HS</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">HubSpot</h3>
              <p className="text-white/70 text-sm">
                Manage contacts and automate marketing workflows.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-white font-bold">SF</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Salesforce</h3>
              <p className="text-white/70 text-sm">
                Sync affiliate leads and customer data with your CRM.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-white font-bold">+</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Many More</h3>
              <p className="text-white/70 text-sm">
                200+ additional integrations and custom webhook support.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Integration Builder Preview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Integration Builder</h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="bg-white/5 rounded-lg p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">New Integration</h3>
                  <p className="text-white/70">Connect Amazon Associates with Mailchimp</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  <span>Activate</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Trigger</h4>
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mr-3 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">AM</span>
                      </div>
                      <span className="text-white font-medium">Amazon Associates</span>
                    </div>
                    <div className="bg-white/10 rounded p-2 mb-2">
                      <span className="text-white/80 text-sm">New Commission Earned</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60 text-xs">Product ID</span>
                        <span className="text-white/80 text-xs">{`{{product_id}}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60 text-xs">Commission</span>
                        <span className="text-white/80 text-xs">{`{{commission_amount}}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60 text-xs">Customer</span>
                        <span className="text-white/80 text-xs">{`{{customer_email}}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Transform</h4>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mr-3 flex items-center justify-center">
                          <Code className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">Filter</span>
                      </div>
                      <div className="bg-white/10 rounded p-2 text-sm text-white/80">
                        IF commission_amount &gt; 10
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mr-3 flex items-center justify-center">
                          <Settings className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">Format</span>
                      </div>
                      <div className="bg-white/10 rounded p-2 text-sm text-white/80">
                        Format customer_name = title_case(customer_name)
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mr-3 flex items-center justify-center">
                          <Database className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">Enrich</span>
                      </div>
                      <div className="bg-white/10 rounded p-2 text-sm text-white/80">
                        Add product_category from product database
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-4">Action</h4>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mr-3 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">MC</span>
                      </div>
                      <span className="text-white font-medium">Mailchimp</span>
                    </div>
                    <div className="bg-white/10 rounded p-2 mb-2">
                      <span className="text-white/80 text-sm">Add/Update Subscriber</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60 text-xs">Email</span>
                        <span className="text-white/80 text-xs">{`{{customer_email}}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60 text-xs">First Name</span>
                        <span className="text-white/80 text-xs">{`{{customer_name.first}}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60 text-xs">Tags</span>
                        <span className="text-white/80 text-xs">{`{{product_category}}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60 text-xs">List</span>
                        <span className="text-white/80 text-xs">High Value Customers</span>
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
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Connect Your Marketing Stack?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto">
              Start building powerful integrations to automate your affiliate marketing workflows and scale your business.
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
                  Browse Integrations
                </button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
