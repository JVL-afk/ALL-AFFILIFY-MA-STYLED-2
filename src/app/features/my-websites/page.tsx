'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, Edit, BarChart3, Trash2, Copy, Settings, ArrowRight, CheckCircle, Eye, Share2 } from 'lucide-react'
import Header from '@/components/Header'

export default function MyWebsitesPage() {
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
              Manage All Your Affiliate Websites
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            A powerful dashboard to manage, monitor, and optimize all your affiliate websites in one place.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Your Website Management Hub</h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">FitnessGearPro</h3>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Live</span>
                </div>
                <p className="text-white/70 text-sm mb-4">Fitness equipment affiliate website with product reviews and comparisons.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">Fitness</span>
                  <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">Equipment</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg">
                      <Edit className="w-4 h-4 text-white/70" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-white/70" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg">
                      <Eye className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                  <span className="text-white/70 text-xs">Updated 2d ago</span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">TechGadgetHub</h3>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Live</span>
                </div>
                <p className="text-white/70 text-sm mb-4">Tech gadget reviews and affiliate links for the latest electronics.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">Tech</span>
                  <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">Gadgets</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg">
                      <Edit className="w-4 h-4 text-white/70" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-white/70" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg">
                      <Eye className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                  <span className="text-white/70 text-xs">Updated 5d ago</span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">HomeDecorFinds</h3>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Draft</span>
                </div>
                <p className="text-white/70 text-sm mb-4">Curated home decor products with affiliate marketing links.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">Home</span>
                  <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">Decor</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg">
                      <Edit className="w-4 h-4 text-white/70" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-white/70" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg">
                      <Eye className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                  <span className="text-white/70 text-xs">Updated 1w ago</span>
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
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Centralized Management</h3>
                <p className="text-white/70">
                  Manage all your affiliate websites from a single dashboard with intuitive controls.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Performance Monitoring</h3>
                <p className="text-white/70">
                  Track key metrics for all your websites including traffic, conversions, and revenue.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Quick Editing</h3>
                <p className="text-white/70">
                  Make changes to your websites directly from the dashboard without complex workflows.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Duplicate & Templates</h3>
                <p className="text-white/70">
                  Clone successful websites or save templates to quickly launch new affiliate sites.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Bulk Operations</h3>
                <p className="text-white/70">
                  Apply changes across multiple websites simultaneously to save time and ensure consistency.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
              <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Automated Backups</h3>
                <p className="text-white/70">
                  Regular automated backups of all your websites to prevent data loss and enable quick recovery.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Management Tools */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Powerful Management Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Edit className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Edit</h3>
              <p className="text-white/70">
                Make quick changes to your website content, design, and structure.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Copy className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Duplicate</h3>
              <p className="text-white/70">
                Clone successful websites to quickly expand your affiliate network.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Share2 className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Share</h3>
              <p className="text-white/70">
                Share access with team members or clients with customizable permissions.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Settings className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Configure</h3>
              <p className="text-white/70">
                Adjust settings, integrations, and advanced features for each website.
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
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Manage Your Affiliate Empire?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto">
              Create and manage multiple affiliate websites with our powerful dashboard and tools.
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
