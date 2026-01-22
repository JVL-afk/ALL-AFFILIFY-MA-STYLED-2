// src/app/dashboard/seo-auditor/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  BarChart3,
  Target,
  Search,
  Zap,
  Loader2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  ListChecks,
  Lightbulb,
  ChevronRight,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { AffiliateContentDNA } from '@/lib/content-brain/types'
import { getAffiliateDNA, runSeoAuditor } from '@/lib/content-brain/api'

// --- Component ---
export default function SEOAuditorPage() {
  const [dna, setDna] = useState<AffiliateContentDNA | null>(null);
  const [contentToAudit, setContentToAudit] = useState('');
  const [auditResult, setAuditResult] = useState<{ score: number; recommendations: string } | null>(null);
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

  const handleAudit = async () => {
    if (!dna) {
      setError('Affiliate Content DNA not loaded.');
      return;
    }
    if (!contentToAudit.trim()) {
      setError('Please paste content to audit.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAuditResult(null);

    try {
      const result = await runSeoAuditor(dna, contentToAudit);
      setAuditResult(result);
    } catch (err) {
      console.error(err);
      setError('SEO Audit failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || !dna || !contentToAudit.trim();

  // Custom styling to match AFFILIFY's vibe (more technical/data-focused look)
  const auditorBackground = "min-h-screen bg-gray-950";
  const contentAreaBackground = "bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl";
  const gradientText = "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400";
  const primaryButtonClass = "w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg";

  return (
    <div className={`${auditorBackground} p-6`}>
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-extrabold ${gradientText}`}>
            SEO Auditor & Keyword Lab <Search className="inline-block w-8 h-8 ml-2" />
          </h1>
          <p className="text-gray-500 mt-1">
            Ensure your content is perfectly optimized for search engines and high-intent affiliate keywords.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar: DNA & Keywords */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-3 p-4 rounded-xl bg-gray-800 border border-gray-700 overflow-y-auto`}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-red-400" /> Campaign Keywords
            </h2>
            <Card className="bg-gray-900 border-gray-700 text-white">
              <CardHeader className="p-4">
                <CardTitle className="text-sm text-red-400">Primary Keywords</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm space-y-1">
                {dna?.primaryKeywords.map((keyword, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {keyword}
                  </div>
                ))}
                {(!dna || dna.primaryKeywords.length === 0) && <p className="text-gray-500">No primary keywords loaded.</p>}
              </CardContent>
              <CardHeader className="p-4 pt-0">
                <CardTitle className="text-sm text-cyan-400">Secondary (LSI) Keywords</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm space-y-1">
                {dna?.secondaryKeywords.map((keyword, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {keyword}
                  </div>
                ))}
                {(!dna || dna.secondaryKeywords.length === 0) && <p className="text-gray-500">No secondary keywords loaded.</p>}
              </CardContent>
            </Card>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <Button asChild variant="link" className="p-0 h-auto text-blue-400 hover:text-blue-300">
                <Link href="/dashboard/dna-management">
                  <Globe className="w-4 h-4 mr-2" /> Manage Full DNA
                </Link>
              </Button>
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
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white flex items-center">
                  <ListChecks className="w-5 h-5 mr-2 text-cyan-400" />
                  Content to Audit
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Paste your generated or existing content here for a deep SEO and conversion analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  placeholder="Paste your blog post, sales page copy, or product review here..."
                  value={contentToAudit}
                  onChange={(e) => setContentToAudit(e.target.value)}
                  rows={15}
                  className="bg-gray-950 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
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
                  onClick={handleAudit}
                  disabled={isButtonDisabled}
                  className={`${primaryButtonClass} mt-4`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Running Deep SEO Audit...' : 'Run Affiliate SEO Audit'}
                </Button>
              </CardContent>
            </motion.div>

            {/* Output Card */}
            <AnimatePresence mode="wait">
              {auditResult && (
                <motion.div
                  key="audit-output"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={contentAreaBackground}
                >
                  <CardHeader className="border-b border-gray-800">
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                      Audit Results
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Score and actionable recommendations to maximize search performance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-400">
                        {auditResult.score}%
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xl font-semibold text-white">Affiliate SEO Score</p>
                        <p className="text-gray-400">Based on keyword density, LSI term usage, and conversion intent.</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" /> Actionable Recommendations
                    </h3>
                    <div className="prose prose-invert max-w-none text-gray-300">
                      <pre className="whitespace-pre-wrap p-4 bg-gray-950 border border-gray-700 rounded-lg text-sm">
                        {auditResult.recommendations}
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
