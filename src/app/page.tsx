'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
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
  ChevronRight,
  ChevronLeft,
  Trophy,
  Heart,
  Lightbulb,
  Play,
  Award,
  Layers,
  Mail,
  Bot,
  FileCode,
  PieChart,
  Settings,
  Database,
  Cpu,
  Monitor,
  Smartphone,
  ArrowDown,
  Quote,
  ExternalLink,
  Check,
  X
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const featuresRef = useRef<HTMLDivElement>(null)
  const [featureScrollPosition, setFeatureScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % mainFeatures.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)
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

  const mainFeatures = [
    {
      id: 'create-website',
      icon: Wand2,
      title: 'AI Website Builder',
      description: 'Generate complete affiliate websites from a single prompt. Our AI understands your product and creates high-converting pages instantly.',
      color: 'from-purple-500 to-blue-600',
      bgColor: 'bg-purple-500/20',
      screenshot: '/screenshots/create-website.png',
      link: '/features/create-website',
      stats: ['60 seconds', '1000+ lines', 'Real data']
    },
    {
      id: 'code-editor',
      icon: Code2,
      title: 'Full Code Editor',
      description: 'Complete control over your website code. Edit HTML, CSS, and JavaScript with our Matrix-themed professional IDE.',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/20',
      screenshot: '/screenshots/code-editor.png',
      link: '/features/code-editor',
      stats: ['Syntax highlighting', 'Live preview', 'Auto-save']
    },
    {
      id: 'advanced-analytics',
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real Google Analytics integration. Track visitors, conversions, demographics, and top pages with beautiful visualizations.',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/20',
      screenshot: '/screenshots/analytics.png',
      link: '/features/advanced-analytics',
      stats: ['Real-time data', 'Conversion tracking', 'Demographics']
    },
    {
      id: 'ab-testing',
      icon: TestTube,
      title: 'A/B Testing',
      description: 'Test different versions of your pages to maximize conversions. Data-driven optimization made simple.',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/20',
      screenshot: '/screenshots/ab-testing.png',
      link: '/features/ab-testing',
      stats: ['Split testing', 'Statistical analysis', 'Auto-winner']
    },
    {
      id: 'ai-chatbot',
      icon: Bot,
      title: 'AI Chatbot',
      description: 'Engage visitors 24/7 with an intelligent chatbot that answers questions and guides them to purchase.',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/20',
      screenshot: '/screenshots/chatbot.png',
      link: '/features/ai-chatbot',
      stats: ['24/7 support', 'Smart responses', 'Lead capture']
    },
    {
      id: 'email-marketing',
      icon: Mail,
      title: 'Email Marketing',
      description: 'Build your list and nurture leads with automated email sequences that convert subscribers into buyers.',
      color: 'from-teal-500 to-green-600',
      bgColor: 'bg-teal-500/20',
      screenshot: '/screenshots/email.png',
      link: '/features/email-marketing',
      stats: ['Automation', 'Templates', 'Analytics']
    }
  ]

  const testimonials = [
    { 
      quote: "AFFILIFY is a game-changer. I built a site in 5 minutes that converted better than my old one after 6 months of tweaking.", 
      name: "Sarah J.", 
      title: "Super Affiliate",
      avatar: "S",
      rating: 5
    },
    { 
      quote: "The AI is incredible. It understands the product and writes compelling copy that I couldn't have written myself.", 
      name: "Mark T.", 
      title: "Content Creator",
      avatar: "M",
      rating: 5
    },
    { 
      quote: "I went from zero to my first $1,000 in commissions in under a week. This platform is the real deal.", 
      name: "Alex P.", 
      title: "Newbie Marketer",
      avatar: "A",
      rating: 5
    },
    { 
      quote: "As a 13-year-old built this, I had to try it. Now I'm making more than my parents' side hustles combined!", 
      name: "Jordan K.", 
      title: "Student Entrepreneur",
      avatar: "J",
      rating: 5
    },
    { 
      quote: "The code editor is insane. Full control over everything, yet the AI does the heavy lifting. Best of both worlds.", 
      name: "David R.", 
      title: "Web Developer",
      avatar: "D",
      rating: 5
    }
  ]

  const comparisonData = [
    { feature: 'Code Lines Generated', affilify: '1000+', base44: '~500', lovable: '~500' },
    { feature: 'Real Product Data', affilify: true, base44: false, lovable: false },
    { feature: 'Affiliate Links Integration', affilify: true, base44: false, lovable: false },
    { feature: 'Product Comparison Tables', affilify: true, base44: false, lovable: false },
    { feature: 'AI Content Generation', affilify: true, base44: true, lovable: true },
    { feature: 'Full Code Editor', affilify: true, base44: false, lovable: false },
    { feature: 'Real Analytics Integration', affilify: true, base44: false, lovable: false },
    { feature: 'A/B Testing', affilify: true, base44: false, lovable: false },
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/forever',
      description: 'Perfect for getting started',
      features: ['3 websites', 'Basic templates', 'AI content generation', 'Basic analytics', 'Email support'],
      cta: 'Start Free',
      highlight: false
    },
    {
      name: 'Basic',
      price: '$19',
      period: '/month',
      description: 'For growing marketers',
      features: ['10 websites', 'All templates', 'Advanced analytics', 'Custom domains', 'Priority support'],
      cta: 'Go Basic',
      highlight: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For serious affiliates',
      features: ['25 websites', 'A/B testing', 'AI chatbot', 'Email marketing', 'API access'],
      cta: 'Go Pro',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For agencies & teams',
      features: ['Unlimited websites', 'Full code editor', 'Team collaboration', 'White-label', 'Dedicated support'],
      cta: 'Contact Sales',
      highlight: false
    }
  ]

  const scrollFeatures = (direction: 'left' | 'right') => {
    if (featuresRef.current) {
      const scrollAmount = 400
      const newPosition = direction === 'left' 
        ? featureScrollPosition - scrollAmount 
        : featureScrollPosition + scrollAmount
      featuresRef.current.scrollTo({ left: newPosition, behavior: 'smooth' })
      setFeatureScrollPosition(newPosition)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
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
                  className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-white text-2xl font-black tracking-tight">
                  AFFIL<span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">IFY</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                <Link href="/" className="text-white hover:text-orange-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-white/5">
                  Home
                </Link>
                <Link href="/features" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5">
                  Features
                </Link>
                <Link href="/proof" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5 flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  Proof
                </Link>
                <Link href="/pricing" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5">
                  Pricing
                </Link>
                <Link href="/docs" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5">
                  Docs
                </Link>
                <Link href="/about-me" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5 flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  My Story
                </Link>
                <Link href="/login" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5">
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/signup" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2">
                    <Rocket className="w-4 h-4" />
                    Start Free
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* HERO SECTION - EXPLOSIVE IMPACT */}
      {/* ============================================ */}
      <section className="relative z-10 container mx-auto px-4 pt-16 pb-24">
        <motion.div 
          className="text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div 
            variants={fadeInUp} 
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-full border border-orange-500/30 mb-8"
          >
            <Sparkles className="w-5 h-5 text-orange-400 mr-2 animate-pulse" />
            <span className="text-orange-300 font-semibold text-sm">Built by a 13-year-old from Romania 🇷🇴</span>
            <Link href="/about-me" className="ml-2 text-orange-400 hover:text-orange-300 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9]">
            <span className="block text-white mb-2">Turn Any Link Into</span>
            <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              A Money Machine
            </span>
            <span className="block text-3xl md:text-4xl lg:text-5xl text-white/80 mt-4 font-bold">
              in 60 Seconds
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto mb-8 leading-relaxed">
            Paste your affiliate link. Watch our AI build a{' '}
            <span className="text-orange-400 font-bold">professional, 1000+ line website</span> with real product data, 
            comparison tables, and conversion-optimized design.{' '}
            <span className="text-red-400 font-bold">No coding required.</span>
          </motion.p>

          {/* Trust Indicators */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white/80 font-medium">Free Forever Plan</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white/80 font-medium">No Credit Card</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white/80 font-medium">1-Click Deploy</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white/80 font-medium">Beats Base44 & Lovable</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/signup" 
                className="group relative px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-orange-500/40 overflow-hidden transition-all"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Rocket className="w-6 h-6" />
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
                href="/proof" 
                className="px-10 py-5 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white font-bold text-lg rounded-2xl border-2 border-white/20 hover:border-orange-500/50 transition-all flex items-center gap-3"
              >
                <Trophy className="w-6 h-6 text-yellow-500" />
                See The Proof
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual - Platform Preview */}
          <motion.div 
            variants={fadeInUp}
            className="relative max-w-6xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-orange-500/20">
              {/* Browser Chrome */}
              <div className="bg-slate-800/90 backdrop-blur-sm px-4 py-3 flex items-center gap-3 border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 bg-slate-900/50 rounded-lg px-4 py-1.5 text-sm text-white/50 font-mono">
                  affilify.eu/dashboard
                </div>
              </div>
              {/* Dashboard Preview */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 min-h-[400px] flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                  {/* Stats Cards */}
                  <motion.div 
                    className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Globe className="w-8 h-8 text-orange-400 mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">12</div>
                    <div className="text-white/60 text-sm">Active Websites</div>
                  </motion.div>
                  <motion.div 
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">$4,892</div>
                    <div className="text-white/60 text-sm">This Month</div>
                  </motion.div>
                  <motion.div 
                    className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Users className="w-8 h-8 text-blue-400 mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">24.5K</div>
                    <div className="text-white/60 text-sm">Total Visitors</div>
                  </motion.div>
                </div>
              </div>
            </div>
            {/* Floating Elements */}
            <motion.div 
              className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              +$127 just now! 🎉
            </motion.div>
            <motion.div 
              className="absolute -bottom-4 -left-4 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              New conversion! 🚀
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS - VISUAL PROCESS */}
      {/* ============================================ */}
      <section id="how-it-works" className="relative z-10 py-24 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 mb-6">
              <Lightbulb className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-blue-300 font-semibold text-sm">Simple 4-Step Process</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="text-white">How </span>
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">AFFILIFY</span>
              <span className="text-white"> Works</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              From affiliate link to money-making website in under 60 seconds. Our AI handles everything.
            </p>
          </motion.div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { 
                icon: Target, 
                title: "1. Paste Your Link", 
                description: "Drop any affiliate product link into our builder. Amazon, ClickBank, ShareASale - we support them all.",
                color: "from-orange-500 to-red-600"
              },
              { 
                icon: Cpu, 
                title: "2. AI Analyzes", 
                description: "Our AI scrapes real product data, reviews, specs, and competitor info to build your content.",
                color: "from-blue-500 to-indigo-600"
              },
              { 
                icon: Code2, 
                title: "3. Website Generated", 
                description: "In 60 seconds, get a 1000+ line, conversion-optimized website with comparison tables and CTAs.",
                color: "from-green-500 to-emerald-600"
              },
              { 
                icon: DollarSign, 
                title: "4. Start Earning", 
                description: "Deploy with one click and watch the commissions roll in. Track everything in real-time.",
                color: "from-purple-500 to-pink-600"
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Connector Line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
                )}
                <div className="text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl transition-all hover:shadow-2xl hover:border-orange-500/30 hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HORIZONTAL SCROLLING FEATURE SHOWCASE */}
      {/* ============================================ */}
      <section className="relative z-10 py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-6">
              <Layers className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-purple-300 font-semibold text-sm">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="text-white">Everything You Need to </span>
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Dominate</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto mb-8">
              From AI website generation to advanced analytics, we've built every tool you need to succeed.
            </p>
          </motion.div>

          {/* Horizontal Scroll Navigation */}
          <div className="flex justify-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollFeatures('left')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollFeatures('right')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-all"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          {/* Horizontal Scrolling Features */}
          <div 
            ref={featuresRef}
            className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[400px] snap-center"
              >
                <div className={`h-full bg-gradient-to-br ${feature.bgColor} backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden group hover:border-orange-500/50 transition-all`}>
                  {/* Feature Header */}
                  <div className="p-8">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed mb-6">{feature.description}</p>
                    
                    {/* Feature Stats */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {feature.stats.map((stat, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm font-medium">
                          {stat}
                        </span>
                      ))}
                    </div>

                    <Link 
                      href={feature.link}
                      className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                    >
                      Learn More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Screenshot Preview */}
                  <div className="px-8 pb-8">
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </div>
                      <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-16 h-16 text-white/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Features CTA */}
          <div className="text-center mt-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/features"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 transition-all"
              >
                <Layers className="w-5 h-5" />
                View All 12+ Features
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PROOF SECTION - WHY WE'RE SUPERIOR */}
      {/* ============================================ */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-transparent via-orange-950/20 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 rounded-full border border-yellow-500/30 mb-6">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-yellow-300 font-semibold text-sm">The Ultimate Comparison</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="text-white">Why </span>
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">AFFILIFY</span>
              <span className="text-white"> Wins</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              We gave the same product link to Base44, Lovable, and AFFILIFY. See the difference for yourself.
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto mb-12"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 p-6 bg-slate-900/50 border-b border-white/10">
                <div className="text-white/60 font-semibold">Feature</div>
                <div className="text-center">
                  <span className="text-white/60 font-semibold">Base44</span>
                </div>
                <div className="text-center">
                  <span className="text-white/60 font-semibold">Lovable</span>
                </div>
                <div className="text-center">
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white font-bold text-sm">AFFILIFY 🏆</span>
                </div>
              </div>
              {/* Table Body */}
              {comparisonData.map((row, index) => (
                <div 
                  key={index} 
                  className={`grid grid-cols-4 gap-4 p-6 ${index % 2 === 0 ? 'bg-white/5' : ''} border-b border-white/5 last:border-0`}
                >
                  <div className="text-white font-medium">{row.feature}</div>
                  <div className="text-center">
                    {typeof row.base44 === 'boolean' ? (
                      row.base44 ? <Check className="w-6 h-6 text-green-400 mx-auto" /> : <X className="w-6 h-6 text-red-400 mx-auto" />
                    ) : (
                      <span className="text-white/60">{row.base44}</span>
                    )}
                  </div>
                  <div className="text-center">
                    {typeof row.lovable === 'boolean' ? (
                      row.lovable ? <Check className="w-6 h-6 text-green-400 mx-auto" /> : <X className="w-6 h-6 text-red-400 mx-auto" />
                    ) : (
                      <span className="text-white/60">{row.lovable}</span>
                    )}
                  </div>
                  <div className="text-center">
                    {typeof row.affilify === 'boolean' ? (
                      row.affilify ? <Check className="w-6 h-6 text-green-400 mx-auto" /> : <X className="w-6 h-6 text-red-400 mx-auto" />
                    ) : (
                      <span className="text-green-400 font-bold">{row.affilify}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* See Full Proof CTA */}
          <div className="text-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/proof"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-yellow-500/30 transition-all"
              >
                <Trophy className="w-6 h-6" />
                See The Full Comparison
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOUNDER STORY SECTION */}
      {/* ============================================ */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-3xl border border-orange-500/20 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Side - Story */}
                <div className="p-10 md:p-12">
                  <div className="inline-flex items-center px-4 py-2 bg-red-500/20 rounded-full border border-red-500/30 mb-6">
                    <Heart className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-red-300 font-semibold text-sm">The Story Behind AFFILIFY</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                    Built by a 13-Year-Old<br />
                    <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">From Romania</span>
                  </h2>
                  <div className="space-y-4 text-white/70 leading-relaxed">
                    <p>
                      "I don't want this to be just another app, I want this to be a <span className="text-orange-400 font-semibold">community</span>! 
                      I want this to be an app that's forever changing, an app where users can write its code."
                    </p>
                    <p>
                      "This should be a place created by <span className="text-orange-400 font-semibold">affiliate marketers, for affiliate marketers</span>! 
                      So before you leave AFFILIFY forever because of that one little error, just think what it could've been if JUST YOU got involved!"
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      A
                    </div>
                    <div>
                      <div className="text-white font-bold">Andrew</div>
                      <div className="text-white/60 text-sm">Founder of AFFILIFY • 13 years old 🇷🇴</div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link 
                      href="/about-me"
                      className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                    >
                      Read My Full Story <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                {/* Right Side - Visual */}
                <div className="relative bg-gradient-to-br from-orange-600/20 to-red-600/20 p-10 md:p-12 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.2),transparent_70%)]" />
                  <div className="relative text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="mb-6"
                    >
                      <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-orange-500/40">
                        <Heart className="w-16 h-16 text-white" />
                      </div>
                    </motion.div>
                    <div className="text-white/80 text-lg font-medium mb-2">Join the Community</div>
                    <div className="text-white/60 text-sm">Help shape the future of AFFILIFY</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS SECTION */}
      {/* ============================================ */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30 mb-6">
              <Star className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-green-300 font-semibold text-sm">Real Results</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="text-white">What Our </span>
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Users Say</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Real stories from real affiliate marketers who are crushing it with AFFILIFY.
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-orange-500/30 transition-all"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-white/80 text-lg leading-relaxed mb-6">"{testimonial.quote}"</p>
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-bold">{testimonial.name}</div>
                    <div className="text-orange-400 text-sm">{testimonial.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRICING SECTION */}
      {/* ============================================ */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 mb-6">
              <DollarSign className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-blue-300 font-semibold text-sm">Simple Pricing</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="text-white">Affordable Plans for </span>
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Everyone</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Start free, scale when you're ready. No hidden fees, no surprises.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.highlight 
                    ? 'bg-gradient-to-br from-orange-600 to-red-700 border-2 border-orange-400 shadow-2xl shadow-orange-500/30 scale-105' 
                    : 'bg-slate-800/50 backdrop-blur-sm border border-white/10'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-500 rounded-full text-gray-900 text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-orange-400'}`}>
                  {plan.name}
                </h3>
                <p className="text-white/60 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-white/60 ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/80">
                      <CheckCircle className={`w-5 h-5 ${plan.highlight ? 'text-yellow-400' : 'text-green-400'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`block text-center py-3 rounded-xl font-bold transition-all ${
                    plan.highlight 
                      ? 'bg-white text-red-600 hover:bg-gray-100' 
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* View Full Pricing */}
          <div className="text-center mt-12">
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              View Full Pricing Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* STATS SECTION */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Trusted by Affiliate Marketers Worldwide
            </h2>
            <p className="text-white/60 text-lg">Real numbers, real results</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: '10K+', label: 'Websites Created', icon: Globe },
              { value: '$2.5M+', label: 'Commissions Earned', icon: DollarSign },
              { value: '50K+', label: 'Active Users', icon: Users },
              { value: '99.9%', label: 'Uptime', icon: Shield },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-white/10"
              >
                <stat.icon className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FAQ SECTION */}
      {/* ============================================ */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30 mb-6">
              <MessageSquare className="w-5 h-5 text-teal-400 mr-2" />
              <span className="text-teal-300 font-semibold text-sm">Common Questions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-white">Frequently Asked </span>
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Questions</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'How does AFFILIFY generate websites so fast?',
                a: 'Our AI scrapes real product data, analyzes competitor sites, and generates optimized content in seconds. The result is a 1000+ line website with real information, not generic templates.'
              },
              {
                q: 'Do I need coding experience?',
                a: 'Absolutely not! AFFILIFY is designed for everyone. Our AI handles all the technical work. However, if you want full control, our Enterprise plan includes a complete code editor.'
              },
              {
                q: 'What affiliate programs do you support?',
                a: 'We support all major affiliate programs including Amazon Associates, ClickBank, ShareASale, CJ Affiliate, and many more. Just paste any product link and we handle the rest.'
              },
              {
                q: 'Is there really a free plan?',
                a: 'Yes! Our free plan lets you create 3 websites with basic features. No credit card required, no time limit. Upgrade only when you are ready to scale.'
              },
              {
                q: 'How is AFFILIFY different from other website builders?',
                a: 'Unlike generic builders, AFFILIFY is purpose-built for affiliate marketing. We scrape real product data, create comparison tables, integrate affiliate links automatically, and optimize for conversions.'
              },
              {
                q: 'Can I use my own domain?',
                a: 'Yes! Pro and Enterprise plans support custom domains. You can connect any domain you own and we handle the SSL certificates automatically.'
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                    <span className="text-orange-400">Q:</span>
                    {faq.q}
                  </h3>
                  <p className="text-white/70 leading-relaxed pl-7">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SUPPORTED PLATFORMS SECTION */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Works With All Major Affiliate Programs
            </h2>
            <p className="text-white/60">Paste any product link and start earning</p>
          </motion.div>
          <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
            {['Amazon', 'ClickBank', 'ShareASale', 'CJ Affiliate', 'Rakuten', 'eBay Partner', 'Walmart', 'Target'].map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white/70 font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                {platform}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* MORE TESTIMONIALS */}
      {/* ============================================ */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.slice(3).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-orange-500/30 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 text-lg leading-relaxed mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-bold">{testimonial.name}</div>
                    <div className="text-orange-400 text-sm">{testimonial.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA SECTION */}
      {/* ============================================ */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto text-center p-12 md:p-20 bg-gradient-to-r from-orange-600/30 to-red-600/30 backdrop-blur-lg rounded-3xl border border-orange-500/30 shadow-2xl"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-8"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-orange-500/40">
                <Rocket className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
              Ready to Start Making Money?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10">
              Join thousands of affiliate marketers who are building high-converting websites in minutes, not months. 
              Start free today and see the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/signup" 
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-red-600 font-bold text-lg rounded-2xl shadow-2xl transition-all hover:bg-gray-100"
                >
                  <Crown className="w-6 h-6" />
                  Claim Your Free Account
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/proof" 
                  className="inline-flex items-center gap-3 px-10 py-5 bg-transparent border-2 border-white/30 hover:border-white/50 text-white font-bold text-lg rounded-2xl transition-all"
                >
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  See The Proof First
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="relative z-10 bg-slate-900/80 border-t border-slate-800/50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2 group mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-xl font-bold">AFFILIFY</span>
              </Link>
              <p className="text-white/60 text-sm mb-4">AI-Powered Affiliate Marketing Platform</p>
              <p className="text-white/40 text-xs">Built with ❤️ by a 13-year-old from Romania</p>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="/features" className="hover:text-orange-400 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-orange-400 transition-colors">Pricing</Link></li>
                <li><Link href="/proof" className="hover:text-orange-400 transition-colors">Proof</Link></li>
                <li><Link href="/docs" className="hover:text-orange-400 transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="/features/create-website" className="hover:text-orange-400 transition-colors">AI Builder</Link></li>
                <li><Link href="/features/code-editor" className="hover:text-orange-400 transition-colors">Code Editor</Link></li>
                <li><Link href="/features/advanced-analytics" className="hover:text-orange-400 transition-colors">Analytics</Link></li>
                <li><Link href="/features/ab-testing" className="hover:text-orange-400 transition-colors">A/B Testing</Link></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="/about-me" className="hover:text-orange-400 transition-colors">About Me</Link></li>
                <li><Link href="/contact" className="hover:text-orange-400 transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-orange-400 transition-colors">Terms</Link></li>
              </ul>
            </div>
            
            {/* Get Started */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Get Started</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="/signup" className="hover:text-orange-400 transition-colors">Sign Up Free</Link></li>
                <li><Link href="/login" className="hover:text-orange-400 transition-colors">Login</Link></li>
                <li><Link href="/dashboard" className="hover:text-orange-400 transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom */}
          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2024 AFFILIFY. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-white/40 hover:text-white/60 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/40 hover:text-white/60 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
