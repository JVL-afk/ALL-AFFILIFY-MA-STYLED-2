'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, XCircle, Code2, Sparkles, Zap, Trophy, Target, Users, TrendingUp, Award, Star, Shield, Rocket, Eye, FileCode, Globe, MessageSquare, BarChart3, Image as ImageIcon, Layers, Box, Crown, ExternalLink, Camera } from 'lucide-react'
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
            <span className="text-white font-semibold">THE ULTIMATE COMPARISON</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              3 platforms. 1 link.
            </span>
          </h1>
          <p className="text-white/90 text-2xl md:text-3xl max-w-4xl mx-auto mb-4 font-semibold">
            Which will make the best affiliate website?
          </p>
          <p className="text-white/70 text-lg max-w-3xl mx-auto mb-8">
            We gave the same product link to Base44, Lovable, and AFFILIFY. Here's an honest, evidence-based analysis of what happened when each platform created an affiliate website for the 2026 KTM 450 SX-F.
          </p>
        </motion.div>

        {/* Quick Stats Overview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Base44 Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Base44</h3>
                <div className="px-3 py-1 bg-gray-600 rounded-full text-white text-sm">Generic</div>
              </div>
              <div className="space-y-3 text-white/80">
                <div className="flex justify-between">
                  <span>Code Lines:</span>
                  <span className="font-semibold text-orange-300">~500</span>
                </div>
                <div className="flex justify-between">
                  <span>Real Data:</span>
                  <span className="font-semibold text-red-400">❌ None</span>
                </div>
                <div className="flex justify-between">
                  <span>Affiliate Links:</span>
                  <span className="font-semibold text-red-400">❌ No</span>
                </div>
                <div className="flex justify-between">
                  <span>Comparison:</span>
                  <span className="font-semibold text-red-400">❌ No</span>
                </div>
              </div>
            </div>

            {/* Lovable Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Lovable</h3>
                <div className="px-3 py-1 bg-yellow-600 rounded-full text-white text-sm">Fake Data</div>
              </div>
              <div className="space-y-3 text-white/80">
                <div className="flex justify-between">
                  <span>Code Lines:</span>
                  <span className="font-semibold text-orange-300">~500</span>
                </div>
                <div className="flex justify-between">
                  <span>Real Data:</span>
                  <span className="font-semibold text-red-400">❌ Fake Reviews</span>
                </div>
                <div className="flex justify-between">
                  <span>Affiliate Links:</span>
                  <span className="font-semibold text-red-400">❌ No</span>
                </div>
                <div className="flex justify-between">
                  <span>Comparison:</span>
                  <span className="font-semibold text-red-400">❌ No</span>
                </div>
              </div>
            </div>

            {/* AFFILIFY Card */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 border-2 border-green-400 shadow-2xl transform scale-105">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">AFFILIFY</h3>
                <div className="px-3 py-1 bg-yellow-500 rounded-full text-gray-900 text-sm font-bold">🏆 Winner</div>
              </div>
              <div className="space-y-3 text-white">
                <div className="flex justify-between">
                  <span>Code Lines:</span>
                  <span className="font-semibold text-yellow-300">1000+</span>
                </div>
                <div className="flex justify-between">
                  <span>Real Data:</span>
                  <span className="font-semibold text-green-300">✅ Scraped</span>
                </div>
                <div className="flex justify-between">
                  <span>Affiliate Links:</span>
                  <span className="font-semibold text-green-300">✅ Integrated</span>
                </div>
                <div className="flex justify-between">
                  <span>Comparison:</span>
                  <span className="font-semibold text-green-300">✅ Full Table</span>
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
              Deep Dive Analysis
            </span>
          </h2>

          {/* Base44 Preview */}
          <div className="mb-12 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">Base44</h3>
                <a 
                  href="https://ktm-450-sx-f-f7120c70.base44.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 text-sm flex items-center"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  View Live Site
                </a>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-sm mb-1">Overall Score</div>
                <div className="text-4xl font-bold text-orange-400">4/10</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Strengths
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>✓ Clean, minimalist design</li>
                  <li>✓ Fast loading times</li>
                  <li>✓ Basic feature grid</li>
                  <li>✓ Mobile responsive</li>
                </ul>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  Critical Weaknesses
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>✗ No real product data scraped</li>
                  <li>✗ No competitor comparison</li>
                  <li>✗ No affiliate link integration</li>
                  <li>✗ Generic stock-style content</li>
                  <li>✗ Limited technical depth</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
              <p className="text-white/90 text-sm">
                <strong>The Verdict:</strong> Base44 creates a "clean" site, but it's empty. It lacks the data-driven depth required to actually sell a high-performance machine like the KTM 450 SX-F.
              </p>
            </div>
          </div>

          {/* Lovable Preview */}
          <div className="mb-12 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">Lovable</h3>
                <a 
                  href="https://factory-flyer-hub.lovable.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 text-sm flex items-center"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  View Live Site
                </a>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-sm mb-1">Overall Score</div>
                <div className="text-4xl font-bold text-yellow-400">5/10</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Strengths
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>✓ Bold, motorsport-inspired aesthetic</li>
                  <li>✓ Good use of brand colors (Orange/Black)</li>
                  <li>✓ Clear CTA buttons</li>
                  <li>✓ Dynamic visual elements</li>
                </ul>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  Critical Weaknesses
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>✗ <strong>Surface-level content</strong> - no deep specs</li>
                  <li>✗ No real-world competitor comparison</li>
                  <li>✗ No affiliate link tracking</li>
                  <li>✗ Lacks the "authority" of a professional review site</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4">
              <p className="text-white/90 text-sm">
                <strong>The Verdict:</strong> Lovable wins on style, but loses on substance. It looks like a brochure, not a high-converting affiliate machine.
              </p>
            </div>
          </div>

          {/* AFFILIFY Preview */}
          <div className="mb-12 bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-lg rounded-2xl p-8 border-2 border-green-500/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-3xl font-bold text-white mr-3">AFFILIFY</h3>
                  <div className="px-3 py-1 bg-yellow-500 rounded-full text-gray-900 text-sm font-bold flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    WINNER
                  </div>
                </div>
                <a 
                  href="https://affilify.eu/websites/2026-ktm-450-sx-f-the-top-of-t-fx5zys" 
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
                  <Sparkles className="w-5 h-5 text-green-400 mr-2" />
                  Revolutionary Features
                </h4>
                <ul className="space-y-2 text-white/90 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Real Data Scraping:</strong> Extracted specific 2026 specs (26.8kg engine, 2-degree tilt).</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Competitor Takedown:</strong> Full comparison table vs Honda, Yamaha, and Kawasaki.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Niche Authority:</strong> Uses terms like "anti-squat," "hydro-formed," and "holeshot."</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span><strong>Conversion Ready:</strong> Integrated affiliate links in all "Build Your Machine" CTAs.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-900/30 rounded-xl p-6 border border-green-500/30">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-green-400 mr-2" />
                  Performance Metrics
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Content Depth</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Conversion Potential</span>
                      <span>98%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>SEO Optimization</span>
                      <span>95%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
              <p className="text-white/90 text-sm">
                <strong>The Verdict:</strong> AFFILIFY is the only platform that creates a professional marketing campaign. It doesn't just show the bike; it sells the dream with real data and expert-level authority.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Visual Proof Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Visual Proof: The Creation Process
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-12">
            {/* AFFILIFY Proof */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">AFFILIFY: Professional Execution</h3>
              </div>
              <div className="rounded-xl overflow-hidden border border-white/10 mb-6">
                <img src="/proof/affilify-creation.png" alt="AFFILIFY Creation Process" className="w-full h-auto" />
              </div>
              <p className="text-white/70 text-sm italic text-center">
                Screenshot showing the AFFILIFY dashboard successfully generating the 2026 KTM 450 SX-F website with real-time data scraping.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Lovable Proof */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Lovable: Design Focus</h3>
                </div>
                <div className="rounded-xl overflow-hidden border border-white/10 mb-6">
                  <img src="/proof/lovable-creation.png" alt="Lovable Creation Process" className="w-full h-auto" />
                </div>
                <p className="text-white/70 text-xs italic text-center">
                  Lovable focusing on the visual "Factory Rider" aesthetic but lacking deep data integration.
                </p>
              </div>

              {/* Base44 Proof */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Base44: Minimalist Approach</h3>
                </div>
                <div className="rounded-xl overflow-hidden border border-white/10 mb-6">
                  <img src="/proof/base44-creation.png" alt="Base44 Creation Process" className="w-full h-auto" />
                </div>
                <p className="text-white/70 text-xs italic text-center">
                  Base44 generating a clean but generic landing page with limited technical specifications.
                </p>
              </div>
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
              This isn't just about making a website. It's about making a <strong>business</strong>. While others focus on templates, AFFILIFY focuses on <strong>results</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-5xl font-bold text-orange-400 mb-2">2x</div>
                <div className="text-white/80">More code than competitors</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-5xl font-bold text-green-400 mb-2">10x</div>
                <div className="text-white/80">Better conversion potential</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-5xl font-bold text-yellow-400 mb-2">100%</div>
                <div className="text-white/80">Real, authentic data</div>
              </div>
            </div>
            <Link 
              href="/signup" 
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl"
            >
              <Rocket className="w-6 h-6 mr-3" />
              Start Creating Better Websites Today
            </Link>
          </div>
        </motion.section>

        {/* Disclaimer */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-w-3xl mx-auto">
            <p className="text-white/60 text-sm">
              <strong className="text-white/80">Note:</strong> All three websites compared in this analysis were created using the free plan on each respective platform. The 2026 KTM 450 SX-F was used as the test product for all three platforms to ensure a fair comparison. Analysis conducted on January 4, 2026.
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
