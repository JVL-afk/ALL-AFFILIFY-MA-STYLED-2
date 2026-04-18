// src/app/dashboard/content-studio/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Sparkles,
  Feather,
  LayoutGrid,
  Mail,
  Youtube,
  BookOpen,
  ClipboardList,
  Loader2,
  AlertCircle,
  Zap,
  ChevronRight,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { AffiliateContentDNA, ContentAgent, GeneratedContent } from '@/lib/content-brain/types'
import { getAffiliateDNA, generateContent } from '@/lib/content-brain/api'

// --- Agent Definitions (The AFFILIFY Mega-Prompts) ---
const contentAgents: ContentAgent[] = [
  {
    id: 'blog-post',
    name: 'Affiliate Blog Post',
    description: 'Generates a full, SEO-optimized blog post (1000+ words) for a product review.',
    icon: BookOpen,
    promptTemplate: 'Generate a comprehensive, high-converting affiliate blog post review for the promoted product. The post must follow the AIDA framework and seamlessly integrate the primary and secondary keywords. Include a strong call-to-action with a clear benefit statement.',
    outputFormat: 'markdown',
    requiredDNAFields: ['productName', 'productUVP', 'primaryKeywords', 'secondaryKeywords', 'brandVoice'],
  },
  {
    id: 'email-sequence',
    name: '5-Day Email Sequence',
    description: 'Creates a 5-day email sequence (Welcome, Problem, Solution, Scarcity, Final Call) for the product.',
    icon: Mail,
    promptTemplate: 'Create a 5-day email sequence designed to convert a cold lead into a buyer of the promoted product. Each email must be short, punchy, and follow the prescribed sequence structure. Use the brand voice and address the target audience\'s pain points directly.',
    outputFormat: 'markdown',
    requiredDNAFields: ['productName', 'productPainPoints', 'brandVoice', 'targetAudience'],
  },
  {
    id: 'ad-copy',
    name: 'Facebook Ad Copy',
    description: 'Generates 5 variations of high-impact ad copy for Facebook/Instagram.',
    icon: LayoutGrid,
    promptTemplate: 'Generate 5 high-impact Facebook ad copy variations (Headline, Primary Text, Description). Focus on the product\'s UVP and the pain points it solves. Use an urgent and direct-response tone.',
    outputFormat: 'json',
    requiredDNAFields: ['productUVP', 'productPainPoints'],
  },
  {
    id: 'youtube-script',
    name: 'YouTube Review Script',
    description: 'Creates a full script for a 5-minute video review, including hook and CTA.',
    icon: Youtube,
    promptTemplate: 'Write a full YouTube video script for a 5-minute product review. The script must include a strong 15-second hook, a detailed feature-to-benefit breakdown, and a clear call-to-action to the affiliate link. Maintain an engaging and expert brand voice.',
    outputFormat: 'markdown',
    requiredDNAFields: ['productName', 'productUVP', 'brandVoice'],
  },
];

export default function ContentStudioPage() {
  const [dna, setDna] = useState<AffiliateContentDNA | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<ContentAgent | null>(contentAgents[0]);
  const [userInput, setUserInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDnaLoading, setIsDnaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDNA = async () => {
      try {
        setIsDnaLoading(true);
        const fetchedDNA = await getAffiliateDNA('current');
        setDna(fetchedDNA);
      } catch (err) {
        setError('Failed to load Campaign DNA. Please configure it in DNA Management.');
      } finally {
        setIsDnaLoading(false);
      }
    };
    fetchDNA();
  }, []);

  const handleGenerate = async () => {
    if (!selectedAgent || !dna) {
      setError('Please select an agent and ensure DNA is loaded.');
      return;
    }
    if (!userInput.trim()) {
      setError('Please provide a brief for the content generation.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const content = await generateContent(dna, selectedAgent, userInput);
      setGeneratedContent(content);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Content generation failed. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || isDnaLoading || !selectedAgent || !dna || !userInput.trim();

  const studioBackground = "min-h-screen bg-gray-900";
  const sidebarBackground = "bg-gray-800/70 backdrop-blur-sm border-r border-gray-700";
  const contentAreaBackground = "bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl";
  const gradientText = "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400";
  const primaryButtonClass = "w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={`${studioBackground} p-6`}>
      <div className="max-w-8xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-extrabold ${gradientText}`}>
            Content Studio <Feather className="inline-block w-8 h-8 ml-2" />
          </h1>
          <p className="text-gray-400 mt-1">
            The Affiliate Content Brain: Generate, optimize, and repurpose high-converting content with one click.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar: Agents & DNA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-3 p-4 rounded-xl ${sidebarBackground}`}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-400" /> AI Agents
            </h2>
            <div className="space-y-3">
              {contentAgents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                    selectedAgent?.id === agent.id
                      ? 'border-green-500 bg-gray-700'
                      : 'border-gray-700 hover:border-green-500/50 bg-gray-800'
                  } text-white`}
                >
                  <div className="flex items-center mb-1">
                    <agent.icon className="w-4 h-4 mr-2 text-green-400" />
                    <span className="text-sm font-medium">{agent.name}</span>
                  </div>
                  <p className="text-xs text-gray-400">{agent.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-blue-400" /> Campaign DNA
              </h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm space-y-2 text-white">
                {isDnaLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-green-400" />
                  </div>
                ) : dna?.productName ? (
                  <>
                    <p className="text-gray-400">Voice: <span className="font-medium text-white capitalize">{dna.brandVoice}</span></p>
                    <p className="text-gray-400">Product: <span className="font-medium text-white">{dna.productName}</span></p>
                    <p className="text-gray-400">Keywords: <span className="font-medium text-white">{dna.primaryKeywords?.length || 0} loaded</span></p>
                  </>
                ) : (
                  <p className="text-yellow-400 text-xs italic">DNA not configured. Content quality may be lower.</p>
                )}
                <Button asChild variant="link" className="p-0 h-auto text-green-400 hover:text-green-300">
                  <Link href="/dashboard/dna-management">
                    Manage DNA <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={contentAreaBackground}
            >
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white flex items-center">
                  {selectedAgent && <selectedAgent.icon className="w-5 h-5 mr-2 text-green-400" />}
                  {selectedAgent?.name || 'Select an Agent'} Brief
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Provide a detailed brief for the AI. What should the content focus on?
                </p>
              </div>
              <div className="p-6">
                <Textarea
                  placeholder="e.g., 'Focus on the unique features of the product and how it solves specific user pain points.'"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  rows={4}
                  className="bg-gray-900 border-gray-700 text-white focus:ring-green-500 focus:border-green-500 mb-4"
                />
                {error && (
                  <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg flex items-center text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {error}
                  </div>
                )}
                <Button
                  onClick={handleGenerate}
                  disabled={isButtonDisabled}
                  className={primaryButtonClass}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Generating Content...' : 'Generate High-Converting Content'}
                </Button>
              </div>
            </motion.div>

            <AnimatePresence>
              {generatedContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={contentAreaBackground}
                >
                  <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-400" />
                      Generated Content
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded border border-green-700">
                        SEO Score: {generatedContent.seoScore}%
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-gray-300 whitespace-pre-wrap font-mono text-sm max-h-[500px] overflow-y-auto">
                      {generatedContent.content}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
