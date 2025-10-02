'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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
  MessageSquare,
  Layers,
  Database,
  RefreshCw,
  PieChart,
  FileText,
  Share2
} from 'lucide-react'
import Header from '@/components/Header'

export default function FeaturesPage() {
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
              Powerful Features for Affiliate Marketers
            </span>
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Everything you need to create, manage, and optimize high-converting affiliate websites.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create Website */}
            <Link href="/features/create-website">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Create Website</h3>
                <p className="text-white/70 mb-6">
                  Build beautiful, high-converting affiliate websites in minutes with our AI-powered website generator.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            {/* Analyze Website */}
            <Link href="/features/analyze-website">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Analyze Website</h3>
                <p className="text-white/70 mb-6">
                  Get detailed insights and recommendations to optimize your affiliate websites for maximum conversions.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            {/* My Websites */}
            <Link href="/features/my-websites">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">My Websites</h3>
                <p className="text-white/70 mb-6">
                  Manage all your affiliate websites from a single dashboard with powerful tools and analytics.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            {/* Advanced Analytics */}
            <Link href="/features/advanced-analytics">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Advanced Analytics</h3>
                <p className="text-white/70 mb-6">
                  Comprehensive analytics and reporting to track performance, conversions, and revenue across all your websites.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            {/* AI Chatbot */}
            <Link href="/features/ai-chatbot">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">AI Chatbot</h3>
                <p className="text-white/70 mb-6">
                  Engage visitors with intelligent AI chatbots that answer questions and guide them toward conversion.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            {/* A/B Testing */}
            <Link href="/features/ab-testing">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <RefreshCw className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">A/B Testing</h3>
                <p className="text-white/70 mb-6">
                  Test different versions of your website to optimize conversion rates and maximize affiliate revenue.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            {/* Email Marketing */}
            <Link href="/features/email-marketing">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Email Marketing</h3>
                <p className="text-white/70 mb-6">
                  Create and automate email campaigns to nurture leads and drive repeat traffic to your affiliate websites.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            {/* Team Collaboration */}
            <Link href="/features/team-collaboration">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Team Collaboration</h3>
                <p className="text-white/70 mb-6">
                  Work together with your team on affiliate websites with role-based permissions and collaborative tools.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            {/* API Management */}
            <Link href="/features/api-management">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">API Management</h3>
                <p className="text-white/70 mb-6">
                  Connect your affiliate websites to external services and automate workflows with our powerful API.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            {/* Custom Integrations */}
            <Link href="/features/custom-integrations">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Custom Integrations</h3>
                <p className="text-white/70 mb-6">
                  Integrate with popular affiliate networks, payment processors, and marketing tools to streamline your workflow.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
            
            {/* Advanced Reporting */}
            <Link href="/features/advanced-reporting">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Advanced Reporting</h3>
                <p className="text-white/70 mb-6">
                  Generate detailed reports on website performance, user behavior, and affiliate revenue with customizable dashboards.
                </p>
                <div className="flex items-center text-orange-400">
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Experience All These Features?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto">
              Start your free trial today and discover how AFFILIFY can transform your affiliate marketing business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <Link href="/pricing">
                <button className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg">
                  View Pricing
                </button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
