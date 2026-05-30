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
  ExternalLink,
  Video
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
            <span className="text-white font-semibold uppercase tracking-wider">The Ultimate Real-World Comparison</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Performance Comparison
            </span>
          </h1>
          <h2 className="text-white/90 text-2xl md:text-3xl max-w-4xl mx-auto mb-4 font-semibold">
            Purpose-Built vs. General-Purpose AI
          </h2>
          <p className="text-white/70 text-lg max-w-3xl mx-auto mb-8">
            We compared how different AI platforms handle a specific affiliate marketing task: creating a high-converting landing page for the <strong>2026 KTM 450 SX-F</strong>. See how specialized tools make a difference in content depth and data accuracy.
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
                <div className="text-4xl font-bold text-orange-400">6/10</div>
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
                <div className="text-4xl font-bold text-yellow-400">7/10</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Strengths
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>✓ Better marketing copy</li>
                  <li>✓ Use of "social proof" tactics</li>
                  <li>✓ Clearer call-to-action buttons</li>
                  <li>✓ More dynamic layout</li>
                  <li>✓ Included a "What's in the box" section</li>
                  <li>✓ Better use of color and branding</li>
                </ul>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  Critical Weaknesses
                </h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>✗ Testimonials are completely fake</li>
                  <li>✗ No real competitor comparison</li>
                  <li>✗ No affiliate link integration</li>
                  <li>✗ Scraped data is incomplete</li>
                  <li>✗ No technical specs table</li>
                  <li>✗ Limited content (~500 lines)</li>
                  <li>✗ No real-world performance data</li>
                  <li>✗ Generic "Factory Rider" aesthetic</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4">
              <p className="text-white/90 text-sm">
                <strong>The Verdict:</strong> Lovable understands marketing better than Base44, but it still fails on the most important part: <strong>data</strong>. It creates a "Factory Rider" aesthetic but populates it with fake reviews and basic info. It's a brochure, not a high-converting affiliate site.
              </p>
            </div>
          </div>

          {/* AFFILIFY Preview */}
          <div className="mb-12 bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-lg rounded-2xl p-8 border-2 border-green-500 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-3xl font-bold text-white mr-3">AFFILIFY</h3>
                  <div className="px-3 py-1 bg-yellow-500 rounded-full text-gray-900 text-sm font-bold flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    BEST FOR AFFILIATES
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
                <div className="text-5xl font-bold text-green-400">9.5/10</div>
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
                  <li>✓ <strong>Video Extraction</strong>: Integrated "IN ACTION" video section</li>
                  <li>✓ WP XACT PRO suspension details highlighted</li>
                  <li>✓ Akrapovič titanium exhaust specifications</li>
                  <li>✓ Launch control & quickshifter technology explained</li>
                  <li>✓ DUNLOP GEOMAX MX34 tire performance data</li>
                  <li>✓ Factory race aesthetics & graphics showcased</li>
                  <li>✓ Serviceability & maintenance advantages</li>
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
                <strong>The Verdict:</strong> AFFILIFY is the clear winner because it's the only platform that uses <strong>real data</strong> and <strong>multimedia assets</strong>. While competitors use generic content, AFFILIFY scrapes the actual product page and extracts official videos to create an authentic, high-converting affiliate site.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 overflow-x-auto">
            <h3 className="text-2xl font-bold text-white mb-6">The Data Doesn't Lie</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="px-6 py-4 text-left font-semibold text-white/90">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold text-white/90">Base44</th>
                    <th className="px-6 py-4 text-center font-semibold text-white/90">Lovable</th>
                    <th className="px-6 py-4 text-center font-semibold text-white/90">AFFILIFY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <BarChart3 className="w-5 h-5 text-orange-400 mr-3" />
                        Real Web Scraping
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">❌ No</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">❌ Partial</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">✅ Full & Accurate</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <Video className="w-5 h-5 text-orange-400 mr-3" />
                        Video Extraction
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">❌ No</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">❌ No</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">✅ Integrated Videos</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <Trophy className="w-5 h-5 text-orange-400 mr-3" />
                        Competitor Comparison
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">❌ No</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">❌ No</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">✅ Full Table</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 text-orange-400 mr-3" />
                        Affiliate Links
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">❌ No</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">❌ No</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">✅ Integrated</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white/90 font-medium">
                      <div className="flex items-center">
                        <MessageSquare className="w-5 h-5 text-orange-400 mr-3" />
                        Niche Language
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">❌ Generic</td>
                    <td className="px-6 py-4 text-center text-white/60 text-sm">❌ Generic</td>
                    <td className="px-6 py-4 text-center bg-green-900/30">
                      <span className="text-green-400 font-semibold text-sm">✅ Authentic</span>
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

            {/* Video Extraction */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Video Extraction</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">❌ Base44 & Lovable:</p>
                <p>Only use static images. No video content to engage visitors or demonstrate the product.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY:</p>
                <p>Automatically extracts and embeds official product videos. The KTM website features an "IN ACTION" section with multiple YouTube integrations, showcasing the bike's performance.</p>
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

            {/* Code Depth */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <FileCode className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Code Depth</h3>
              </div>
              <div className="space-y-3 text-white/80 text-sm">
                <p className="font-semibold text-white">❌ Base44 & Lovable:</p>
                <p>Basic templates with ~500 lines of code. Limited customization and depth.</p>
                <p className="font-semibold text-green-400 mt-4">✅ AFFILIFY:</p>
                <p>Over 1000 lines of custom-generated code. Includes advanced CSS, interactive components, and deep content structure.</p>
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
              Visual Proof: The Creation Process
            </span>
          </h2>

          <div className="space-y-12">
            {/* AFFILIFY Proof */}
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-lg rounded-2xl p-8 border-2 border-green-500">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">AFFILIFY: Real-Time Creation</h3>
              </div>
              <div className="rounded-xl overflow-hidden border border-white/10 mb-6">
                <img src="/proof/affilify-creation.png" alt="AFFILIFY Creation Process" className="w-full h-auto" />
              </div>
              <p className="text-white/70 text-xs italic text-center">
                AFFILIFY successfully scraping the 2026 KTM 450 SX-F product page, extracting official videos, and generating a professional affiliate website.
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
              Start Creating Better Websites
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
