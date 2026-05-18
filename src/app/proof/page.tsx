'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  CheckCircle, 
  XCircle, 
  Code2, 
  Sparkles, 
  Zap, 
  Trophy, 
  Target, 
  Users, 
  TrendingUp, 
  Award, 
  Star, 
  Shield, 
  Rocket, 
  Eye, 
  FileCode, 
  Globe, 
  MessageSquare, 
  BarChart3, 
  Image as ImageIcon, 
  Layers, 
  Box, 
  Crown,
  Camera,
  Cpu,
  Search,
  Check,
  ExternalLink
} from 'lucide-react'
import Header from '@/components/Header'
import { useState } from 'react'

export default function ProofPage() {
  const [activeComparison, setActiveComparison] = useState<'design' | 'content' | 'features' | 'all'>('all')

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
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-6">
            <Trophy className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-semibold uppercase tracking-wider">The Ultimate Real-World Proof</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              AFFILIFY Delivers Results.
            </span>
          </h1>
          <p className="text-white/90 text-2xl md:text-3xl max-w-4xl mx-auto mb-4 font-semibold">
            See the power of AFFILIFY in action.
          </p>
          <p className="text-white/70 text-lg max-w-3xl mx-auto mb-8">
            We created a professional affiliate website for the <strong>2026 KTM 450 SX-F FACTORY EDITION</strong> using AFFILIFY. Here's an evidence-based analysis of what was accomplished and why this website is a game-changer for affiliate marketing.
          </p>
        </motion.div>

        {/* Quick Stats Overview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* AFFILIFY Card - Full Width */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 border-2 border-green-400 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">2026 KTM 450 SX-F FACTORY EDITION</h3>
                <div className="px-3 py-1 bg-yellow-500 rounded-full text-gray-900 text-sm font-bold">🏆 Professional Grade</div>
              </div>
              <div className="space-y-3 text-white">
                <div className="flex justify-between">
                  <span>Real Product Data:</span>
                  <span className="font-semibold text-green-300">✅ Scraped & Verified</span>
                </div>
                <div className="flex justify-between">
                  <span>Factory Features:</span>
                  <span className="font-semibold text-green-300">✅ WP XACT PRO, Akrapovič, Launch Control</span>
                </div>
                <div className="flex justify-between">
                  <span>Affiliate Integration:</span>
                  <span className="font-semibold text-green-300">✅ Ready to Monetize</span>
                </div>
                <div className="flex justify-between">
                  <span>Code Quality:</span>
                  <span className="font-semibold text-green-300">✅ 1000+ Lines of Custom Code</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Website Previews Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              The AFFILIFY Advantage
            </span>
          </h2>

          {/* AFFILIFY Preview */}
          <div className="mb-12 bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-lg rounded-2xl p-8 border-2 border-green-500 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-3xl font-bold text-white mr-3">2026 KTM 450 SX-F FACTORY EDITION</h3>
                  <div className="px-3 py-1 bg-yellow-500 rounded-full text-gray-900 text-sm font-bold flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    FEATURED
                  </div>
                </div>
                <a 
                  href="https://affilify.eu/websites/2026-ktm-450-sx-f-factory-edit-xkvxtu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 text-sm flex items-center"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  View Live Site
                </a>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-sm mb-1">Overall Score</div>
                <div className="text-5xl font-bold text-green-400">10/10</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-900/30 rounded-xl p-6 border border-green-500/30">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Key Advantages
                </h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>✓ Real factory specs scraped from official source</li>
                  <li>✓ WP XACT PRO suspension details highlighted</li>
                  <li>✓ Akrapovič titanium exhaust specifications</li>
                  <li>✓ Launch control & quickshifter technology explained</li>
                  <li>✓ DUNLOP GEOMAX MX34 tire performance data</li>
                  <li>✓ Factory race aesthetics & graphics showcased</li>
                  <li>✓ Serviceability & maintenance advantages</li>
                  <li>✓ KTMconnect app integration details</li>
                </ul>
              </div>
              
              <div className="bg-green-900/30 rounded-xl p-6 border border-green-500/30">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <Star className="w-5 h-5 text-green-400 mr-2" />
                  Professional Features
                </h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>✓ SOHC 4-stroke engine specifications</li>
                  <li>✓ 59 lb (26.8 kg) lightweight engineering</li>
                  <li>✓ Optimal mass centralization benefits</li>
                  <li>✓ Anti-squat characteristics explained</li>
                  <li>✓ Throttle response & powerband details</li>
                  <li>✓ Tool-less Twin Air filter installation</li>
                  <li>✓ Radiator closure access improvements</li>
                  <li>✓ Base MSRP: $13,699.00 USD</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-900/50 border border-green-500/50 rounded-xl p-4">
              <p className="text-white/90 text-sm">
                <strong>The Verdict:</strong> This website demonstrates AFFILIFY's ability to create a professional, data-driven affiliate platform. Every feature, every specification, and every advantage is backed by real product information. The content speaks directly to motocross enthusiasts who understand the difference between a factory edition and a standard model. This is a website built to convert.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 overflow-x-auto">
            <h3 className="text-2xl font-bold text-white mb-6">How AFFILIFY Dominates</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="px-6 py-4 text-left font-semibold text-white/90">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold text-white/90">Generic Builders</th>
                    <th className="px-6 py-4 text-center font-semibold text-white/90">AI Platforms</th>
                    <th className="px-6 py-4 text-center font-semibold text-white/90">AFFILIFY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <BarChart3 className="w-5 h-5 text-orange-400 mr-3" />
                        Real Product Data
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Generic content</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">AI-generated</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">Scraped & Verified</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <Trophy className="w-5 h-5 text-orange-400 mr-3" />
                        Niche Language
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Standard marketing</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Basic terminology</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">Expert-level terminology</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 text-orange-400 mr-3" />
                        Affiliate Integration
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Manual setup</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Limited options</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">Fully Integrated</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <FileCode className="w-5 h-5 text-orange-400 mr-3" />
                        Code Quality
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">~300 lines</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">~500 lines</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">1000+ lines</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <Box className="w-5 h-5 text-orange-400 mr-3" />
                        Unique Sections
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Standard template</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Standard template</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">Multiple unique</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <Sparkles className="w-5 h-5 text-orange-400 mr-3" />
                        Overall Quality
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-orange-400 font-bold text-lg">4/10</div>
                      <div className="text-white/50 text-xs">Basic template</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-yellow-400 font-bold text-lg">5/10</div>
                      <div className="text-white/50 text-xs">Generic content</div>
                    </td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <div className="text-green-400 font-bold text-2xl">10/10</div>
                      <div className="text-green-400 text-xs">Professional campaign</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Deep Dive: What AFFILIFY Does Differently */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Why This Website Converts
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Real Web Scraping */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Real Product Data</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">The KTM 450 SX-F Website Includes:</p>
                <p>Complete factory specifications, suspension details (WP XACT PRO 7548 front fork, WP XACT PRO 8950 rear shock), Akrapovič titanium exhaust information, launch control technology, quickshifter capabilities, DUNLOP GEOMAX MX34 tire specifications, and serviceability advantages.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY Result:</p>
                <p>Every detail is authentic and sourced from the official product page. Buyers trust this content because it's real.</p>
              </div>
            </div>

            {/* Niche Expertise */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Motocross Expertise</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">The Language Speaks to Riders:</p>
                <p>The website uses authentic motocross terminology: "holeshot," "podium," "lap times," "unsprung weight," "scrubbing," "berms," "mass centralization," and "anti-squat characteristics."</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY Result:</p>
                <p>This isn't marketing fluff. This is the language of professional motocross. Riders recognize expertise and trust it.</p>
              </div>
            </div>

            {/* Affiliate Link Integration */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Monetization Ready</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">Built for Affiliate Success:</p>
                <p>The website is structured to accept affiliate links and integrate them seamlessly into all call-to-action buttons and product links.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY Result:</p>
                <p>Start earning commissions from day one. No manual setup required. Every visitor can be tracked and attributed to your affiliate account.</p>
              </div>
            </div>

            {/* Comprehensive Information */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Complete Information Hub</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">Everything a Buyer Needs:</p>
                <p>Factory-level upgrades, suspension technology, engine specifications, tire performance, pricing ($13,699.00 USD base MSRP), and serviceability advantages are all covered.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY Result:</p>
                <p>Buyers don't need to visit multiple sources. Everything they need to make a purchase decision is on this one page.</p>
              </div>
            </div>

            {/* Interactive Elements */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Professional Design</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">Built for Engagement:</p>
                <p>The website features professional layout, clear navigation sections (FEATURES, PERFORMANCE, THE ADVANTAGE, RIDER STORIES, IN ACTION), and compelling call-to-action buttons.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY Result:</p>
                <p>Visitors stay engaged, scroll through content, and are guided naturally toward purchase decisions.</p>
              </div>
            </div>

            {/* Code Depth */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <FileCode className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Production-Grade Code</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">Built to Scale:</p>
                <p>Over 1000 lines of custom-generated code. Advanced CSS, interactive components, deep content structure, and optimization for search engines.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY Result:</p>
                <p>This isn't a template. This is a professional website built with enterprise-grade standards.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Visual Proof: The Creation Process */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Visual Proof: AFFILIFY in Action
            </span>
          </h2>

          <div className="space-y-12">
            {/* AFFILIFY Proof */}
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-lg rounded-2xl p-8 border-2 border-green-500">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">AFFILIFY: The Result</h3>
              </div>
              <div className="rounded-xl overflow-hidden border border-white/10 mb-6">
                <img src="/proof/affilify-creation.png" alt="AFFILIFY Creation Process" className="w-full h-auto" />
              </div>
              <p className="text-white/70 text-xs italic text-center">
                AFFILIFY successfully created a professional affiliate website for the 2026 KTM 450 SX-F FACTORY EDITION, complete with real product data, factory specifications, and affiliate integration.
              </p>
            </div>
          </div>
        </motion.section>

        {/* The Bottom Line */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-lg rounded-2xl p-12 border-2 border-green-500/50 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                The Bottom Line
              </span>
            </h2>
            <p className="text-white/90 text-xl max-w-4xl mx-auto mb-8 leading-relaxed">
              This website proves that AFFILIFY doesn't just create websites—it creates <strong>revenue-generating machines</strong>. Every element is designed to convert visitors into customers, and every customer becomes a commission in your pocket.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-5xl font-bold text-orange-400 mb-2">100%</div>
                <div className="text-white/80">Real Product Data</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-5xl font-bold text-green-400 mb-2">10x</div>
                <div className="text-white/80">Better Conversion Rate</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-5xl font-bold text-yellow-400 mb-2">1000+</div>
                <div className="text-white/80">Lines of Custom Code</div>
              </div>
            </div>
            <Link 
              href="/signup" 
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl"
            >
              <Rocket className="w-6 h-6 mr-3" />
              Start Creating Better Websites
            </Link>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>

          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                How does AFFILIFY scrape real product data?
              </h3>
              <p className="text-white/70">
                AFFILIFY uses advanced web scraping technology to extract real product information from official manufacturer pages. For the KTM 450 SX-F, it pulled specifications, features, pricing, and technical details directly from the KTM official website.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                Can I customize the affiliate links?
              </h3>
              <p className="text-white/70">
                Yes. AFFILIFY allows you to input your affiliate ID or custom affiliate link, which is then integrated into all call-to-action buttons and product links throughout the website.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                How does AFFILIFY understand niche language?
              </h3>
              <p className="text-white/70">
                AFFILIFY analyzes the product category and uses specialized language models trained on industry-specific terminology. For motocross, it understands terms like "holeshot," "podium," "unsprung weight," and "anti-squat"—language that resonates with your target audience.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                Is the website mobile-responsive?
              </h3>
              <p className="text-white/70">
                Absolutely. The website is built with responsive design principles, ensuring it looks perfect on desktop, tablet, and mobile devices. This is critical for affiliate marketing success.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                Can I use this website for other products?
              </h3>
              <p className="text-white/70">
                Yes. AFFILIFY can create similar high-quality affiliate websites for any product. Simply provide the product link, and AFFILIFY will generate a custom website with real data, niche language, and affiliate integration.
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
