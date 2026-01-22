// src/app/dashboard/ideation-lab/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Lightbulb,
  Zap,
  Loader2,
  AlertCircle,
  Brain,
  Target,
  Users,
  ChevronRight,
  Globe,
  LayoutGrid,
  Mail,
  Twitter,
  Youtube,
  BookOpen,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { AffiliateContentDNA } from '@/lib/content-brain/types'
import { getAffiliateDNA } from '@/lib/content-brain/api'

// --- Component ---
export default function IdeationLabPage() {
  const [dna, setDna] = useState<AffiliateContentDNA | null>(null);
  const [ideationTopic, setIdeationTopic] = useState('');
  const [ideationResult, setIdeationResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch DNA on component mount
  useEffect(() => {
    const fetchDNA = async () => {
      try {
        const fetchedDNA = await getAffiliateDNA('mock-project-id'); // Use a mock ID for now
        setDna(fetchedDNA);
      } catch (err) {
        setError('Failed to load Affiliate Content DNA. Check API connection.');
      }
    };
    fetchDNA();
  }, []);

  const handleIdeation = async () => {
    if (!dna) {
      setError('Affiliate Content DNA not loaded.');
      return;
    }
    if (!ideationTopic.trim()) {
      setError('Please provide a topic or goal for ideation.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIdeationResult(null);

    try {
      // Mock LLM call for Ideation
      const mockIdeationPrompt = `
        You are the "Campaign Ideation Lab" AI. Based on the following Affiliate Content DNA, generate a comprehensive campaign strategy for the topic: "${ideationTopic}".

        The output must include:
        1. **5 High-Converting Content Angles** (Headlines/Titles)
        2. **3 Multi-Format Repurposing Ideas** (e.g., Blog to Twitter Thread, Email to YouTube Script)
        3. **Targeted Audience Segment** for this campaign.
        4. **Key Performance Indicators (KPIs)** to track.

        --- DNA Summary ---
        Product: ${dna.productName} (${dna.productUVP})
        Audience: ${dna.targetAudience}
        Pain Points: ${dna.productPainPoints.join(', ')}
        Keywords: ${dna.primaryKeywords.join(', ')}
        -------------------
      `;

      // In a real app, this would call a specialized LLM route
      const mockResult = `
        # Campaign Strategy: ${ideationTopic}

        ## 1. High-Converting Content Angles (Headlines)
        1. **The $10,000 Secret:** Why [Product Name] is the only tool you need to hit 5-figure commissions this month.
        2. **[Pain Point] Solved:** How [Product Name] eliminates [Pain Point] for good.
        3. **Review: The Motocross Bike That Wins Races:** Is the 2026 KTM 450 SX-F worth the price tag?
        4. **Don't Buy a Motocross Bike Until You Read This:** The one feature you're missing (and [Product Name] has it).
        5. **Affiliate Showdown:** [Product Name] vs. Competitor - The Unbiased Truth.

        ## 2. Multi-Format Repurposing Ideas
        | Source Content | Target Format | Agent Used |
        | :--- | :--- | :--- |
        | Blog Post (Review) | **Twitter Thread (10 Tweets)** | Multi-Format Repurposer Agent |
        | Email Sequence (Day 3) | **Short-Form Video Script (TikTok/Reel)** | YouTube Script Agent |
        | Content Angle #1 | **Personalized Outreach Pitch** | Proposal Creation Agent |

        ## 3. Targeted Audience Segment
        **Segment:** Experienced, competitive motocross riders (age 25-45) who are currently riding older models and are frustrated with their current performance. They have a high disposable income and prioritize winning.

        ## 4. Key Performance Indicators (KPIs)
        - **Primary:** Affiliate Link Clicks (Goal: 500+ in first 7 days)
        - **Secondary:** Email Opt-ins (Goal: 15% conversion on landing page)
        - **Tertiary:** Social Share Rate (Goal: 5% on the Twitter Thread)
      `;

      setIdeationResult(mockResult);
    } catch (err) {
      console.error(err);
      setError('Ideation failed. Please check the topic and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || !dna || !ideationTopic.trim();

  // Custom styling to match AFFILIFY's vibe (creative, dynamic look)
  const ideationBackground = "min-h-screen bg-gray-900";
  const contentAreaBackground = "bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl";
  const gradientText = "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400";
  const primaryButtonClass = "w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg";

  return (
    <div className={`${ideationBackground} p-6`}>
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-extrabold ${gradientText}`}>
            Campaign Ideation Lab <Brain className="inline-block w-8 h-8 ml-2" />
          </h1>
          <p className="text-gray-500 mt-1">
            AI-powered campaign brainstorming, offer-to-content mapping, and multi-format repurposing planning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar: DNA & Prompts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-3 p-4 rounded-xl bg-gray-800 border border-gray-700 overflow-y-auto`}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-yellow-400" /> Current Campaign DNA
            </h2>
            <Card className="bg-gray-900 border-gray-700 text-white">
              <CardContent className="p-4 text-sm space-y-2">
                <p className="text-gray-400">Product: <span className="font-medium text-white">{dna?.productName || 'Loading...'}</span></p>
                <p className="text-gray-400">Audience: <span className="font-medium text-white">{dna?.targetAudience || 'Loading...'}</span></p>
                <p className="text-gray-400">UVP: <span className="font-medium text-white">{dna?.productUVP || 'Loading...'}</span></p>
                <Button asChild variant="link" className="p-0 h-auto text-purple-400 hover:text-purple-300">
                  <Link href="/dashboard/dna-management">
                    Manage DNA <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <LayoutGrid className="w-5 h-5 mr-2 text-green-400" /> Content Repurposing
              </h2>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center"><BookOpen className="w-4 h-4 mr-2 text-green-400" /> Blog Post to...</p>
                <p className="flex items-center"><Twitter className="w-4 h-4 mr-2 text-blue-400" /> Twitter Thread</p>
                <p className="flex items-center"><Youtube className="w-4 h-4 mr-2 text-red-400" /> YouTube Script</p>
                <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-yellow-400" /> Email Sequence</p>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area: Input & Output */}
          <div className="lg:col-span-9 space-y-6">
            {/* Input Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={contentAreaBackground}
            >
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-pink-400" />
                  Ideation Topic/Goal
                </CardTitle>
                <CardDescription className="text-gray-500">
                  What is the main goal or topic for your next affiliate campaign?
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  placeholder="e.g., 'Launch a campaign focused on the superior handling of the KTM 450 SX-F to convert existing riders of older models.'"
                  value={ideationTopic}
                  onChange={(e) => setIdeationTopic(e.target.value)}
                  rows={4}
                  className="bg-gray-900 border-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                />
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </motion.div>
                )}
                <Button
                  onClick={handleIdeation}
                  disabled={isButtonDisabled}
                  className={`${primaryButtonClass} mt-4`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Brainstorming Campaign...' : 'Generate Campaign Strategy'}
                </Button>
              </CardContent>
            </motion.div>

            {/* Output Card */}
            <AnimatePresence mode="wait">
              {ideationResult && (
                <motion.div
                  key="ideation-output"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={contentAreaBackground}
                >
                  <CardHeader className="border-b border-gray-700">
                    <CardTitle className="text-white flex items-center">
                      <RefreshCw className="w-5 h-5 mr-2 text-purple-400" />
                      Generated Campaign Strategy
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Your full blueprint for the next high-converting affiliate campaign.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="prose prose-invert max-w-none text-gray-300">
                      <pre className="whitespace-pre-wrap p-4 bg-gray-900 border border-gray-700 rounded-lg text-sm">
                        {ideationResult}
                      </pre>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
