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
              { icon: Wand2, title: "Paste Link", description: "Paste your affiliate link into our AI builder." },
              { icon: Code2, title: "AI Builds Page", description: "Our AI instantly generates a high-converting landing page." },
              { icon: Rocket, title: "1-Click Deploy", description: "Publish your new website to a custom domain in seconds." },
              { icon: DollarSign, title: "Start Earning", description: "Watch the conversions roll in and start making money." },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl transition-all hover:shadow-2xl hover:border-orange-500/50"
              >
                <step.icon className="w-10 h-10 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-slate-900/50">
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
                Unmatched Features
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Everything you need to dominate affiliate marketing, powered by AI.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: "High-Converting Templates", description: "AI-optimized designs proven to maximize click-through and conversion rates." },
              { icon: Globe, title: "Global SEO Optimization", description: "Built-in tools for keyword research, meta tags, and fast loading speeds for top rankings." },
              { icon: BarChart3, title: "Real-Time Analytics", description: "Track visitors, clicks, and conversions with a simple, powerful dashboard." },
              { icon: Code2, title: "No-Code Editor", description: "Customize every element with a drag-and-drop interface, no coding required." },
              { icon: Shield, title: "Secure & Reliable Hosting", description: "Fast, secure, and scalable hosting included with every plan." },
              { icon: MessageSquare, title: "24/7 Priority Support", description: "Get help from our expert team whenever you need it, day or night." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-8 bg-slate-800/70 rounded-xl border border-slate-700/50 shadow-xl transition-all hover:shadow-2xl hover:border-red-500/50"
              >
                <feature.icon className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
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
                What Our Users Say
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Real results from real affiliate marketers.
            </p>
          </motion.div>

          {/* Testimonial Carousel */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "AFFILIFY is a game-changer. I built a site in 5 minutes that converted better than my old one after 6 months of tweaking.", name: "Sarah J.", title: "Super Affiliate" },
              { quote: "The AI is incredible. It understands the product and writes compelling copy that I couldn't have written myself.", name: "Mark T.", title: "Content Creator" },
              { quote: "I went from zero to my first $1,000 in commissions in under a week. This platform is the real deal.", name: "Alex P.", title: "Newbie Marketer" },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-8 bg-slate-800/70 rounded-xl border border-slate-700/50 shadow-xl transition-all hover:shadow-2xl hover:border-orange-500/50 flex flex-col justify-between"
              >
                <Star className="w-6 h-6 text-yellow-400 mb-4" fill="currentColor" />
                <p className="text-white text-lg italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="text-white font-bold">{testimonial.name}</p>
                  <p className="text-orange-400 text-sm">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-20 bg-slate-900/50">
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
                Simple, Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Choose the plan that fits your ambition. Start free, scale when you're ready.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                name: "Starter", 
                price: "Free", 
                description: "Perfect for testing the waters and your first campaign.", 
                features: ["1 AI-Generated Site", "Basic Analytics", "AFFILIFY Subdomain", "Community Support"],
                cta: "Start Free",
                highlight: false
              },
              { 
                name: "Pro", 
                price: "$49", 
                period: "/month", 
                description: "For serious marketers ready to scale their earnings.", 
                features: ["Unlimited AI Sites", "Advanced Analytics", "Custom Domain Support", "Priority Support", "A/B Testing"],
                cta: "Go Pro",
                highlight: true
              },
              { 
                name: "Enterprise", 
                price: "Custom", 
                description: "For agencies and high-volume affiliate businesses.", 
                features: ["All Pro Features", "Dedicated Account Manager", "Custom Integrations", "White-Label Options", "Volume Discounts"],
                cta: "Contact Sales",
                highlight: false
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`p-8 rounded-xl shadow-2xl flex flex-col ${plan.highlight ? 'bg-gradient-to-br from-orange-800 to-red-900 border-4 border-orange-500' : 'bg-slate-800/70 border border-slate-700/50'}`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-orange-400'}`}>{plan.name}</h3>
                <p className="text-white/70 mb-4">{plan.description}</p>
                <div className="flex items-baseline mb-6">
                  <span className={`text-5xl font-extrabold ${plan.highlight ? 'text-white' : 'text-white'}`}>{plan.price}</span>
                  {plan.period && <span className="text-xl font-medium text-white/70">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-white">
                      <CheckCircle className={`w-5 h-5 mr-3 ${plan.highlight ? 'text-yellow-400' : 'text-green-400'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={plan.cta === "Contact Sales" ? "/contact" : "/signup"} 
                  className={`block text-center py-3 rounded-lg font-bold transition-all ${plan.highlight ? 'bg-white text-red-600 hover:bg-gray-200' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center p-10 md:p-20 bg-gradient-to-r from-orange-600/30 to-red-600/30 backdrop-blur-lg rounded-3xl border border-orange-500/50 shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Ready to Stop Leaving Money on the Table?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Join thousands of affiliates who are building high-converting sites in minutes, not months.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/signup" 
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-red-600 font-bold text-xl rounded-xl shadow-2xl transition-all hover:bg-gray-200"
              >
                <Crown className="w-6 h-6" />
                Claim Your Free Account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/80 border-t border-slate-800/50 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2 group mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xl font-bold">AFFILIFY</span>
              </Link>
              <p className="text-white/60 text-sm">AI-Powered Affiliate Marketing.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><Link href="/features" className="hover:text-orange-400 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-orange-400 transition-colors">Pricing</Link></li>
                <li><Link href="/templates" className="hover:text-orange-400 transition-colors">Templates</Link></li>
                <li><Link href="/roadmap" className="hover:text-orange-400 transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><Link href="/about-me" className="hover:text-orange-400 transition-colors">About Me</Link></li>
                <li><Link href="/contact" className="hover:text-orange-400 transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-orange-400 transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-orange-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><Link href="/docs" className="hover:text-orange-400 transition-colors">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-orange-400 transition-colors">Support</Link></li>
                <li><Link href="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Twitter</a></li>
                <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Facebook</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">LinkedIn</a></li>
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
