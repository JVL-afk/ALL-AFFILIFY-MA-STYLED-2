'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, XCircle, Code2, Sparkles, Zap, Trophy, Target, Users, TrendingUp, Award, Star, Shield, Rocket, Eye, FileCode, Globe, MessageSquare, BarChart3, Image as ImageIcon, Layers, Box, Crown } from 'lucide-react'
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
            We gave the same product link to Base44, Lovable, and AFFILIFY. Here's what happened when each platform created an affiliate website for the 2026 KTM 450 SX-F.
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
              See The Difference Yourself
            </span>
          </h2>

          {/* Base44 Preview */}
          <div className="mb-12 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">Base44</h3>
                <a 
                  href="https://ktm-450-sx-f-factory-edition-7b492498.base44.app/" 
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
                  <li>✓ Clean, modern design</li>
                  <li>✓ Good visual hierarchy</li>
                  <li>✓ Professional product images</li>
                  <li>✓ Feature highlights with icons</li>
                  <li>✓ FAQ section included</li>
                  <li>✓ Mobile responsive</li>
                </ul>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  Critical Weaknesses
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>✗ Generic testimonials (no names, no photos)</li>
                  <li>✗ No competitor comparison</li>
                  <li>✗ No affiliate link integration</li>
                  <li>✗ Generic stock images</li>
                  <li>✗ No real product specs scraped</li>
                  <li>✗ Limited content (~500 lines)</li>
                  <li>✗ No pricing information</li>
                  <li>✗ No niche-specific language</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
              <p className="text-white/90 text-sm">
                <strong>The Verdict:</strong> Base44 creates a visually appealing website, but it's all surface-level. The content is generic, testimonials are fabricated, and there's no real data scraped from the actual product page. It looks nice but won't convert.
              </p>
            </div>
          </div>

          {/* Lovable Preview */}
          <div className="mb-12 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">Lovable</h3>
                <a 
                  href="https://factory-edition-wizard.lovable.app/" 
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
                  <li>✓ Aggressive conversion-focused design</li>
                  <li>✓ Trust badges and urgency elements</li>
                  <li>✓ Star rating displayed (fake, but present)</li>
                  <li>✓ Performance specs section</li>
                  <li>✓ Better CTA placement</li>
                  <li>✓ Professional testimonial presentation</li>
                </ul>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  Critical Weaknesses
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>✗ <strong>FAKE REVIEWS</strong> (4.9/5 from 127 reviews - fabricated)</li>
                  <li>✗ Generic testimonials (no verification)</li>
                  <li>✗ No competitor comparison</li>
                  <li>✗ No affiliate link integration</li>
                  <li>✗ Generic stock images</li>
                  <li>✗ No real specs scraped</li>
                  <li>✗ Limited content (~500 lines)</li>
                  <li>✗ No pricing information</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4">
              <p className="text-white/90 text-sm">
                <strong>The Verdict:</strong> Lovable uses more aggressive conversion tactics (urgency, fake reviews, trust badges), but it's built on deception. The "4.9/5 from 127 reviews" is completely fabricated. Better than Base44 in conversion optimization, but still lacks real data and depth.
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
                  href="https://cheery-gumption-42e6aa.netlify.app/" 
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
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>1000+ lines of code</strong> - 2x more comprehensive</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Real data scraping</strong> - actual product details</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Affiliate link integration</strong> - ready to earn</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Competitor comparison table</strong> - 4 bikes compared</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Interactive "Anatomy of a Holeshot"</strong> - unique section</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Niche-specific language</strong> - authentic terminology</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-900/30 rounded-xl p-6 border border-green-500/30">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                  What Makes It Superior
                </h4>
                <ul className="space-y-2 text-white/90 text-sm">
                  <li className="flex items-start">
                    <Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Actual product photos</strong> from KTM materials</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Credible testimonials</strong> with specific claims</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Technical depth</strong> - Cone Valve, CUO, etc.</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Storytelling approach</strong> - immersive narrative</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Professional design</strong> - premium brand feel</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Conversion optimized</strong> - strategic CTAs</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-600/30 border border-green-400/50 rounded-xl p-4">
              <p className="text-white text-sm">
                <strong>The Verdict:</strong> AFFILIFY doesn't just create a website - it creates a <strong>professional marketing campaign</strong>. With real scraped data, niche-specific language, interactive elements, competitor comparisons, and 2x the content depth, it's in a completely different league. This is what a real affiliate website should look like.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Detailed Feature Comparison */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Feature-by-Feature Breakdown
            </span>
          </h2>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10">
                    <th className="px-6 py-4 text-left text-white font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Base44</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Lovable</th>
                    <th className="px-6 py-4 text-center text-white font-semibold bg-green-900/50">AFFILIFY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <Code2 className="w-5 h-5 text-orange-400 mr-3" />
                        Code Length
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-orange-300">~500 lines</td>
                    <td className="px-6 py-4 text-center text-orange-300">~500 lines</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-bold">1000+ lines</span>
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <BarChart3 className="w-5 h-5 text-orange-400 mr-3" />
                        Real Data Scraping
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 text-orange-400 mr-3" />
                        Affiliate Link Integration
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <Trophy className="w-5 h-5 text-orange-400 mr-3" />
                        Competitor Comparison
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-6 h-6 text-green-400 mb-1" />
                        <span className="text-green-400 text-xs">4 bikes compared</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <ImageIcon className="w-5 h-5 text-orange-400 mr-3" />
                        Product Images
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Generic stock</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Generic stock</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">Actual product photos</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <MessageSquare className="w-5 h-5 text-orange-400 mr-3" />
                        Niche-Specific Language
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Limited</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Limited</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">Extensive</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-orange-400 mr-3" />
                        Testimonials
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Generic, no names</td>
                    <td className="px-6 py-4 text-center text-red-400 text-sm">Fake reviews (4.9/5)</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">Credible & specific</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <Layers className="w-5 h-5 text-orange-400 mr-3" />
                        Interactive Elements
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-6 h-6 text-green-400 mb-1" />
                        <span className="text-green-400 text-xs">"Anatomy of a Holeshot"</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <FileCode className="w-5 h-5 text-orange-400 mr-3" />
                        Technical Specifications
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Surface-level</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">Basic specs only</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">Comprehensive</span>
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
                      <div className="text-white/50 text-xs">Looks nice, no depth</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-yellow-400 font-bold text-lg">5/10</div>
                      <div className="text-white/50 text-xs">Better tactics, fake data</div>
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
              What Makes AFFILIFY 10x Better
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Real Web Scraping */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Real Web Scraping</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">❌ Base44 & Lovable:</p>
                <p>Use generic, AI-generated content with no connection to the actual product page.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY:</p>
                <p>Scrapes the actual product page to extract real details, specs, features, and pricing. The content is authentic and accurate.</p>
              </div>
            </div>

            {/* Competitor Comparison */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Competitor Comparison</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">❌ Base44 & Lovable:</p>
                <p>No competitor comparison whatsoever. Buyers have no context for why this product is better.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY:</p>
                <p>Full comparison table showing KTM vs Honda vs Yamaha vs Kawasaki. Highlights exclusive features like WP Cone Valve Suspension and Brembo brakes.</p>
              </div>
            </div>

            {/* Affiliate Link Integration */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Affiliate Link Integration</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">❌ Base44 & Lovable:</p>
                <p>Just link to the manufacturer's website. No way for the affiliate to get credit for the sale.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY:</p>
                <p>Allows users to input their affiliate ID/link and integrates it into all CTAs. Ready to earn commissions from day one.</p>
              </div>
            </div>

            {/* Niche-Specific Language */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Niche-Specific Language</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">❌ Base44 & Lovable:</p>
                <p>Generic marketing language that could apply to any product in any industry.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY:</p>
                <p>Uses authentic motocross terminology: "holeshot," "podium," "lap times," "unsprung weight," "scrubbing." Speaks the language of the target audience.</p>
              </div>
            </div>

            {/* Interactive Elements */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Interactive Elements</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">❌ Base44 & Lovable:</p>
                <p>Static pages with no interactive elements. Boring and forgettable.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY:</p>
                <p>Features the "Anatomy of a Holeshot" interactive diagram that educates buyers while keeping them engaged. Unique and memorable.</p>
              </div>
            </div>

            {/* Code Depth */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Code Depth & Quality</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">❌ Base44 & Lovable:</p>
                <p>Limited to ~500 lines of code. Rigid, template-based structure with minimal customization.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY:</p>
                <p>1000+ lines of highly creative, custom code. Unique sections, comprehensive content, and professional design that rivals agency work.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Side-by-Side Visual Comparison */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              The Numbers Don't Lie
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Base44 Stats */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Base44</h3>
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-white/60 text-sm mb-1">Content Depth</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-orange-500 h-3 rounded-full" style={{width: '40%'}}></div>
                  </div>
                  <div className="text-orange-400 text-xs mt-1">40% - Surface level</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-white/60 text-sm mb-1">Conversion Power</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-orange-500 h-3 rounded-full" style={{width: '35%'}}></div>
                  </div>
                  <div className="text-orange-400 text-xs mt-1">35% - Weak CTAs</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-white/60 text-sm mb-1">Authenticity</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{width: '25%'}}></div>
                  </div>
                  <div className="text-red-400 text-xs mt-1">25% - Generic content</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-white/60 text-sm mb-1">Technical Detail</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-orange-500 h-3 rounded-full" style={{width: '30%'}}></div>
                  </div>
                  <div className="text-orange-400 text-xs mt-1">30% - Basic features</div>
                </div>
              </div>
            </div>

            {/* Lovable Stats */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Lovable</h3>
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-white/60 text-sm mb-1">Content Depth</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-yellow-500 h-3 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <div className="text-yellow-400 text-xs mt-1">45% - Basic specs</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-white/60 text-sm mb-1">Conversion Power</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-yellow-500 h-3 rounded-full" style={{width: '55%'}}></div>
                  </div>
                  <div className="text-yellow-400 text-xs mt-1">55% - Aggressive tactics</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-white/60 text-sm mb-1">Authenticity</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{width: '20%'}}></div>
                  </div>
                  <div className="text-red-400 text-xs mt-1">20% - Fake reviews</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-white/60 text-sm mb-1">Technical Detail</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-yellow-500 h-3 rounded-full" style={{width: '40%'}}></div>
                  </div>
                  <div className="text-yellow-400 text-xs mt-1">40% - Limited specs</div>
                </div>
              </div>
            </div>

            {/* AFFILIFY Stats */}
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-lg rounded-2xl p-8 border-2 border-green-500/50">
              <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
                AFFILIFY
                <Crown className="w-6 h-6 text-yellow-400 ml-2" />
              </h3>
              <div className="space-y-4">
                <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/30">
                  <div className="text-white/90 text-sm mb-1 font-semibold">Content Depth</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <div className="text-green-400 text-xs mt-1 font-semibold">100% - Comprehensive</div>
                </div>
                <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/30">
                  <div className="text-white/90 text-sm mb-1 font-semibold">Conversion Power</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: '95%'}}></div>
                  </div>
                  <div className="text-green-400 text-xs mt-1 font-semibold">95% - Strategic CTAs</div>
                </div>
                <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/30">
                  <div className="text-white/90 text-sm mb-1 font-semibold">Authenticity</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <div className="text-green-400 text-xs mt-1 font-semibold">90% - Real data</div>
                </div>
                <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/30">
                  <div className="text-white/90 text-sm mb-1 font-semibold">Technical Detail</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <div className="text-green-400 text-xs mt-1 font-semibold">100% - Expert level</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Real Examples Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              See It In Action
            </span>
          </h2>

          <div className="space-y-8">
            {/* Example 1: Competitor Comparison */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Competitor Comparison Table</h3>
                  <p className="text-white/60 text-sm">Only AFFILIFY has this critical feature</p>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-white/90 py-3 px-4">FEATURE</th>
                      <th className="text-center text-orange-400 py-3 px-4 border-l-2 border-orange-500">2026 KTM 450 SX-F</th>
                      <th className="text-center text-white/70 py-3 px-4">HONDA CRF450RWE</th>
                      <th className="text-center text-white/70 py-3 px-4">YAMAHA YZ450F</th>
                      <th className="text-center text-white/70 py-3 px-4">KAWASAKI KX450SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr>
                      <td className="py-3 px-4 text-white/80">WP Cone Valve Suspension</td>
                      <td className="py-3 px-4 text-center border-l-2 border-orange-500/30">
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-white/80">Standard Quickshifter</td>
                      <td className="py-3 px-4 text-center border-l-2 border-orange-500/30">
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center text-yellow-400 text-xs">App Only</td>
                      <td className="py-3 px-4 text-center">
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-white/80">Brembo Brakes</td>
                      <td className="py-3 px-4 text-center border-l-2 border-orange-500/30">
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-center text-white/50 text-xs">(Nissin)</td>
                      <td className="py-3 px-4 text-center text-white/50 text-xs">(Nissin)</td>
                      <td className="py-3 px-4 text-center text-white/50 text-xs">(Nissin)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex items-start bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <Zap className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-white/90 text-sm">
                  <strong>Why this matters:</strong> This comparison table is a conversion powerhouse. It positions the KTM as superior to all competitors by highlighting exclusive features like WP Cone Valve Suspension and Brembo brakes. Neither Base44 nor Lovable has anything like this.
                </p>
              </div>
            </div>

            {/* Example 2: Niche Language */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Niche-Specific Language</h3>
                  <p className="text-white/60 text-sm">AFFILIFY speaks the audience's language</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <div className="text-red-400 font-semibold mb-3 flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    Base44 & Lovable
                  </div>
                  <div className="space-y-2 text-white/70 text-sm">
                    <p>"Championship-winning machine"</p>
                    <p>"Factory-level performance"</p>
                    <p>"Race-ready out of the box"</p>
                    <p className="text-white/50 italic mt-4">Generic marketing speak that could apply to any product.</p>
                  </div>
                </div>
                
                <div className="bg-green-900/30 rounded-xl p-6 border border-green-500/30">
                  <div className="text-green-400 font-semibold mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    AFFILIFY
                  </div>
                  <div className="space-y-2 text-white/90 text-sm">
                    <p>"<strong>Holeshot</strong> device keeps the front wheel planted"</p>
                    <p>"Drop <strong>lap times</strong> and dominate the competition"</p>
                    <p>"Reducing <strong>unsprung weight</strong> for sharper handling"</p>
                    <p>"Built for the <strong>top step</strong> of the podium"</p>
                    <p className="text-green-400 italic mt-4">Authentic motocross terminology that resonates with the target audience.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-start bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <Sparkles className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-white/90 text-sm">
                  <strong>Why this matters:</strong> Using niche-specific language builds instant credibility with the target audience. It shows you understand the sport and aren't just another generic affiliate site.
                </p>
              </div>
            </div>

            {/* Example 3: Interactive Elements */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Interactive "Anatomy of a Holeshot"</h3>
                  <p className="text-white/60 text-sm">Unique to AFFILIFY</p>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6">
                <p className="text-white/90 mb-4">
                  AFFILIFY's website features an interactive diagram showing 5 key components that help riders get the holeshot:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-orange-400 font-semibold mb-2">1. SOHC Powerplant</div>
                    <p className="text-white/70">Featherweight powerhouse with centralized mass for razor-sharp handling.</p>
                  </div>
                  <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-orange-400 font-semibold mb-2">2. Factory Start Device</div>
                    <p className="text-white/70">Locks down front forks for maximum traction off the line.</p>
                  </div>
                  <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-orange-400 font-semibold mb-2">3. High-Grip Seat</div>
                    <p className="text-white/70">Selle Dalla Valle factory race seat keeps you locked in place.</p>
                  </div>
                  <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-orange-400 font-semibold mb-2">4. Launch & Traction Control</div>
                    <p className="text-white/70">Handlebar-mounted switch for optimized starts.</p>
                  </div>
                  <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4 md:col-span-2">
                    <div className="text-orange-400 font-semibold mb-2">5. Quickshifter</div>
                    <p className="text-white/70">Clutchless upshifts from 2nd to 5th gear for uninterrupted acceleration.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-start bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <Eye className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-white/90 text-sm">
                  <strong>Why this matters:</strong> Interactive elements keep visitors engaged longer, educate them about the product, and create a memorable experience. Neither Base44 nor Lovable has anything interactive.
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
              Base44 creates websites that <strong>look nice</strong> but lack depth. Lovable uses <strong>aggressive tactics</strong> but builds on fake data. AFFILIFY creates <strong>professional marketing campaigns</strong> with real data, niche expertise, and conversion optimization.
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
              <strong className="text-white/80">Note:</strong> All three websites compared in this analysis were created using the free plan on each respective platform. The 2026 KTM 450 SX-F was used as the test product for all three platforms to ensure a fair comparison.
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
