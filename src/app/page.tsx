'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Globe, 
  BarChart3, 
  Code2, 
  Rocket, 
  Crown,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Target,
  Wand2,
  Eye,
  Users,
  Shield,
  MessageSquare,
  TestTube,
  Palette,
  Clock,
  Star,
  ChevronRight
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <Link href="/" className="flex items-center space-x-2 group">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Zap className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-white text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  AFFILIFY
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-white hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/pricing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Pricing
                </Link>
                <Link href="/docs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Documentation
                </Link>
                <Link href="/about-me" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  About Me
                </Link>
                <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/signup" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg transition-all">
                    Start Free →
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - EXPLOSIVE */}
      <section className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <motion.div 
          className="text-center mb-16"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-full border border-orange-500/30 mb-8">
            <Sparkles className="w-4 h-4 text-orange-400 mr-2" />
            <span className="text-orange-300 font-semibold text-sm">AI-Powered Affiliate Marketing Platform</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-orange-300 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Turn Any Affiliate Link
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
              Into a Money-Making Website
            </span>
            <br />
            <span className="text-white text-4xl md:text-5xl">
              in 60 Seconds
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-4 leading-relaxed">
            No coding. No design skills. Just paste your affiliate link and watch our AI build a{' '}
            <span className="text-orange-300 font-bold">professional, conversion-optimized website</span> that starts making you money today.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-6 mb-12 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Free to Start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Deploy in 1 Click</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/signup" 
                className="group relative px-8 py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-lg rounded-xl shadow-2xl overflow-hidden transition-all"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Start Making Money Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="#how-it-works" 
                className="px-8 py-5 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white font-bold text-lg rounded-xl border-2 border-white/30 transition-all flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                See How It Works
              </Link>
            </motion.div>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div 
            variants={fadeInUp}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: '10,000+', label: 'Websites Created', icon: Globe },
              { number: '$2.5M+', label: 'Revenue Generated', icon: DollarSign },
              { number: '99.5%', label: 'Uptime', icon: Zap },
              { number: '4.9/5', label: 'User Rating', icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, borderColor: 'rgba(251, 146, 60, 0.5)' }}
              >
                <stat.icon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works - Visual Process */}
      <section id="how-it-works" className="relative z-10 py-20 bg-gradient-to-b from-transparent to-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                How AFFILIFY Makes You Money
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our AI does all the heavy lifting. You just paste, deploy, and earn.
            </p>
          </motion.div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '1',
                icon: Target,
                title: 'Paste Your Link',
                description: 'Drop any affiliate link from Amazon, ClickBank, or any network',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '2',
                icon: Wand2,
                title: 'AI Generates Website',
                description: 'Our AI analyzes the product and creates professional content & design',
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '3',
                icon: Rocket,
                title: 'Deploy Instantly',
                description: 'One-click deployment with hosting, SSL, and custom domain included',
                color: 'from-orange-500 to-red-500'
              },
              {
                step: '4',
                icon: TrendingUp,
                title: 'Track & Earn',
                description: 'Monitor clicks, conversions, and revenue in real-time analytics',
                color: 'from-green-500 to-emerald-500'
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-white/30 to-transparent -z-10" />
                )}

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 h-full hover:border-orange-500/50 transition-all">
                  {/* Step Number */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${item.color} text-white font-bold text-xl mb-4`}>
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <item.icon className="w-12 h-12 text-orange-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Time Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-8 border border-orange-500/30"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-red-400 font-bold mb-2">❌ Traditional Way</div>
                <div className="text-white/60 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>2-4 weeks of work</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>$500-2000 in costs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    <span>Coding & design skills required</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-green-400 font-bold mb-2">✅ AFFILIFY Way</div>
                <div className="text-white mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold">60 seconds</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="font-bold">$0 to start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="font-bold">No skills needed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcases - Interactive */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Powerful Features That Drive Revenue
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Everything you need to build, optimize, and scale your affiliate empire
            </p>
          </motion.div>

          {/* Feature Tabs */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { id: 0, icon: Wand2, label: 'AI Generation' },
                { id: 1, icon: BarChart3, label: 'Analytics' },
                { id: 2, icon: Code2, label: 'Code Editor' },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveFeature(tab.id)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                    activeFeature === tab.id
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Feature Content */}
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              {activeFeature === 0 && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center px-3 py-1 bg-purple-500/20 rounded-full mb-4">
                      <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
                      <span className="text-purple-300 text-sm font-semibold">AI-Powered</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      AI Content Generation
                    </h3>
                    <p className="text-white/80 mb-6 leading-relaxed">
                      Our advanced AI analyzes your affiliate product and automatically generates:
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Compelling headlines that grab attention',
                        'SEO-optimized product descriptions',
                        'Persuasive call-to-actions',
                        'Trust-building testimonials',
                        'Conversion-focused copy'
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/90">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
                    <div className="bg-gray-900 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Wand2 className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-semibold">AI Writing...</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-purple-500/30 rounded animate-pulse" style={{width: '90%'}}></div>
                        <div className="h-2 bg-purple-500/30 rounded animate-pulse" style={{width: '75%'}}></div>
                        <div className="h-2 bg-purple-500/30 rounded animate-pulse" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    <div className="text-white/70 text-sm">
                      <div className="font-mono bg-gray-900 rounded p-3">
                        <span className="text-green-400">"</span>
                        <span className="text-white">Transform your game with the Aston Martin DB12 Super GT Landing Page - engineered for champions who demand excellence...</span>
                        <span className="text-green-400">"</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === 1 && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center px-3 py-1 bg-blue-500/20 rounded-full mb-4">
                      <BarChart3 className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-blue-300 text-sm font-semibold">Real-Time Data</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Advanced Analytics Dashboard
                    </h3>
                    <p className="text-white/80 mb-6 leading-relaxed">
                      Track every click, conversion, and dollar with our comprehensive analytics:
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Real-time visitor tracking',
                        'Conversion rate optimization',
                        'Revenue attribution',
                        'Geographic insights',
                        'A/B testing results'
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/90">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-xl p-6 border border-blue-500/30">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                          <div className="text-green-400 text-sm mb-1">Total Revenue</div>
                          <div className="text-white text-2xl font-bold">$12,450</div>
                          <div className="text-green-400 text-xs">↑ 23% this month</div>
                        </div>
                        <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                          <div className="text-blue-400 text-sm mb-1">Conversions</div>
                          <div className="text-white text-2xl font-bold">847</div>
                          <div className="text-blue-400 text-xs">↑ 15% this month</div>
                        </div>
                      </div>
                      <div className="h-32 bg-gray-800 rounded-lg p-3 flex items-end gap-1">
                        {[40, 65, 45, 80, 60, 90, 75, 95, 70, 85, 100, 90].map((height, i) => (
                          <div 
                            key={i} 
                            className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t"
                            style={{height: `${height}%`}}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === 2 && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center px-3 py-1 bg-orange-500/20 rounded-full mb-4">
                      <Crown className="w-4 h-4 text-orange-400 mr-2" />
                      <span className="text-orange-300 text-sm font-semibold">Enterprise Only</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Full Code Editor Access
                    </h3>
                    <p className="text-white/80 mb-6 leading-relaxed">
                      Take complete control with our professional-grade code editor:
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Edit any page in your dashboard',
                        'Syntax highlighting & autocomplete',
                        'Live preview as you code',
                        'Version control & rollback',
                        'One-click deployment'
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/90">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/features/code-editor" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold mt-4">
                      Learn more about Code Editor
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-orange-500/30">
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                        <Code2 className="w-4 h-4 text-orange-400" />
                        <span className="text-white text-sm font-semibold">dashboard/page.tsx</span>
                      </div>
                      <div className="p-4 font-mono text-xs">
                        <div className="text-gray-500">1</div>
                        <div className="text-gray-500">2</div>
                        <div className="text-gray-500">3</div>
                        <div className="text-gray-500">4</div>
                        <div className="text-gray-500">5</div>
                        <div className="text-gray-500">6</div>
                      </div>
                      <div className="p-4 font-mono text-xs -mt-[120px] ml-8">
                        <div><span className="text-purple-400">export</span> <span className="text-blue-400">default</span> <span className="text-yellow-400">function</span> <span className="text-green-400">Dashboard</span>() {'{'}</div>
                        <div>  <span className="text-purple-400">return</span> (</div>
                        <div>    {'<'}<span className="text-red-400">div</span> <span className="text-blue-400">className</span>=<span className="text-green-400">"container"</span>{'>'}</div>
                        <div>      {'<'}<span className="text-red-400">h1</span>{'>'}<span className="text-white">My Dashboard</span>{'</'}<span className="text-red-400">h1</span>{'>'}</div>
                        <div>    {'</'}<span className="text-red-400">div</span>{'>'}</div>
                        <div>  )</div>
                        <div>{'}'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Real Success Story */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-transparent to-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  See AFFILIFY in Action
                </span>
              </h2>
              <p className="text-xl text-white/80">
                Real website. Real results. Built in 60 seconds.
              </p>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Aston Martin DB12 Super GT
                  </h3>
                  <p className="text-white/70">Professional affiliate marketing website</p>
                </div>
                <div className="bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
                  <span className="text-green-400 font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Live
                  </span>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl overflow-hidden mb-6 border border-white/10">
                <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm font-mono">https://db12-super-gt-aston-martinplay-gcpm45.netlify.app/</span>
                </div>
                <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50">
                  <div className="text-center">
                    <div className="text-gray-800 text-4xl font-bold mb-4">🏎️</div>
                    <div className="text-gray-900 text-2xl font-bold mb-2">Aston Martin DB12 Super GT Landing Page</div>
                    <div className="text-gray-700 mb-4">The ultimate landing page for the ultimate Super Tourer. Designed for luxury conversions.</div>
                    <div className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-bold">
                      View Product →
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Time to Create</div>
                  <div className="text-white text-2xl font-bold">60 sec</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Cost</div>
                  <div className="text-white text-2xl font-bold">$0</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Coding Required</div>
                  <div className="text-white text-2xl font-bold">None</div>
                </div>
              </div>

              <Link 
                href="https://db12-super-gt-aston-martinplay-gcpm45.netlify.app/" 
                target="_blank"
                className="block w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-center font-bold py-4 rounded-xl transition-all"
              >
                View Live Website →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-black/30 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                What Our Users Say
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Real stories from real affiliate marketers making real money
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Affiliate Marketer',
                avatar: '👩‍💼',
                rating: 5,
                text: 'AFFILIFY transformed my affiliate business. I went from spending weeks building sites to creating professional websites in minutes. My revenue has tripled!'
              },
              {
                name: 'Mike Chen',
                role: 'Digital Entrepreneur',
                avatar: '👨‍💻',
                rating: 5,
                text: 'The AI content generation is incredible. It creates better copy than I could write myself. The analytics help me optimize for maximum conversions.'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Marketing Agency Owner',
                avatar: '👩‍🎨',
                rating: 5,
                text: 'The Enterprise plan with code editor access is a game-changer. We can customize everything for our clients. Worth every penny!'
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="text-white font-bold">{testimonial.name}</div>
                    <div className="text-white/60 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Start free, upgrade as you grow. No hidden fees, no surprises.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              whileHover={{ y: -10 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Basic</h3>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-white mb-2">$0</div>
                <div className="text-white/60">Forever free</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '3 websites',
                  'AI content generation',
                  'Basic analytics',
                  'Email support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/90">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/signup?plan=basic"
                className="block w-full bg-white/10 hover:bg-white/20 text-white text-center font-bold py-3 rounded-lg transition-all border border-white/20"
              >
                Start Free
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-orange-500/50 relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-600 to-red-600 px-4 py-1 rounded-full">
                <span className="text-white font-bold text-sm">MOST POPULAR</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-orange-400" />
                <h3 className="text-2xl font-bold text-white">Pro</h3>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-white mb-2">$29</div>
                <div className="text-white/60">per month</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '10 websites',
                  'All templates',
                  'Advanced analytics',
                  'Custom domains',
                  'Priority support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/90">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/signup?plan=pro"
                className="block w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-center font-bold py-3 rounded-lg transition-all shadow-lg"
              >
                Start Pro Trial
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Enterprise</h3>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-white mb-2">$99</div>
                <div className="text-white/60">per month</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited websites',
                  'Code editor access',
                  'A/B testing',
                  'API access',
                  'White-label',
                  'Dedicated support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/90">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/signup?plan=enterprise"
                className="block w-full bg-white/10 hover:bg-white/20 text-white text-center font-bold py-3 rounded-lg transition-all border border-white/20"
              >
                Start Enterprise Trial
              </Link>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link href="/pricing" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold">
              View detailed pricing comparison
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-orange-600/30 to-red-600/30 backdrop-blur-lg rounded-3xl p-12 border border-orange-500/50 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">
                Ready to Build Your Affiliate Empire?
              </span>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of affiliate marketers who are building profitable websites with AFFILIFY. 
              Start for free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/signup" 
                  className="group px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold text-xl rounded-xl shadow-2xl transition-all flex items-center gap-2"
                >
                  <Rocket className="w-6 h-6" />
                  Start Building Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 backdrop-blur-lg border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xl font-bold">AFFILIFY</span>
              </div>
              <p className="text-white/60 text-sm">
                AI-powered affiliate marketing platform. Build profitable websites in 60 seconds.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="/about-me" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="/docs" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              © 2025 AFFILIFY. All rights reserved.
            </p>
            <p className="text-white text-sm font-medium">
              Created by Miroiu Andrei
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
