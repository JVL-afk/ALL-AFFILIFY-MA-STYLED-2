// src/app/dashboard/content-studio/page.tsx

'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Sparkles,
  Feather,
  LayoutGrid,
  Mail,
  Twitter,
  Youtube,
  BookOpen,
  ClipboardList,
  CheckCircle,
  Loader2,
  AlertCircle,
  Copy,
  Users,
  Code,
  Target,
  BarChart3,
  RefreshCw,
  Zap,
  ChevronRight,
  ClipboardCheck,
  Palette,
  FileText,
  MessageSquare,
  Search,
  Globe
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

// --- Component ---
export default function ContentStudioPage() {
  const [dna, setDna] = useState<AffiliateContentDNA | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<ContentAgent | null>(contentAgents[0]);
  const [userInput, setUserInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
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
    } catch (err) {
      console.error(err);
      setError('Content generation failed. Please check the prompt and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || !selectedAgent || !dna || !userInput.trim();

  // Custom styling to match AFFILIFY's vibe
  const studioBackground = "min-h-screen bg-gray-900";
  const sidebarBackground = "bg-gray-800/70 backdrop-blur-sm border-r border-gray-700";
  const contentAreaBackground = "bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl";
  const gradientText = "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400";
  const primaryButtonClass = "w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 shadow-lg";

  return (
    <div className={`${studioBackground} p-6`}>
      <div className="max-w-8xl mx-auto">
        {/* Header */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-10rem)]">
          {/* Left Sidebar: Agents & DNA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-3 p-4 rounded-xl ${sidebarBackground} overflow-y-auto`}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-400" /> AI Agents
            </h2>
            <div className="space-y-3">
              {contentAgents.map((agent) => (
                <Card
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedAgent?.id === agent.id
                      ? 'border-green-500 ring-2 ring-green-500 bg-gray-700'
                      : 'border-gray-700 hover:border-green-500 hover:bg-gray-700/50'
                  } bg-gray-800 text-white`}
                >
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm flex items-center">
                      <agent.icon className="w-4 h-4 mr-2 text-green-400" />
                      {agent.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                      {agent.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-blue-400" /> Campaign DNA
              </h2>
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardContent className="p-4 text-sm space-y-2">
                  <p className="text-gray-400">Voice: <span className="font-medium text-white">{dna?.brandVoice || 'Loading...'}</span></p>
                  <p className="text-gray-400">Product: <span className="font-medium text-white">{dna?.productName || 'Loading...'}</span></p>
                  <p className="text-gray-400">Keywords: <span className="font-medium text-white">{dna?.primaryKeywords.length || 0} loaded</span></p>
                  <Button asChild variant="link" className="p-0 h-auto text-green-400 hover:text-green-300">
                    <Link href="/dashboard/dna-management">
                      Manage DNA <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
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
                  {selectedAgent && <selectedAgent.icon className="w-5 h-5 mr-2 text-green-400" />}
                  {selectedAgent?.name || 'Select an Agent'} Brief
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Provide a detailed brief for the AI. What should the content focus on?
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  placeholder="e.g., 'Focus on the superior handling and lightweight design of the KTM 450 SX-F, targeting experienced riders who want a competitive edge.'"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  rows={4}
                  className="bg-gray-900 border-gray-700 text-white focus:ring-green-500 focus:border-green-500"
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
                  onClick={handleGenerate}
                  disabled={isButtonDisabled}
                  className={`${primaryButtonClass} mt-4`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Generating Content...' : 'Generate High-Converting Content'}
                </Button>
              </CardContent>
            </motion.div>

            {/* Output Card */}
            <AnimatePresence mode="wait">
              {generatedContent && (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={contentAreaBackground}
                >
                  <CardHeader className="border-b border-gray-700 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center">
                        <ClipboardCheck className="w-5 h-5 mr-2 text-green-400" />
                        Generated Content
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {selectedAgent?.name} - SEO Score: <span className="font-bold text-green-400">{generatedContent.seoScore}%</span>
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                        <Copy className="w-4 h-4 mr-2" /> Copy
                      </Button>
                      <Button asChild variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                        <Link href="/dashboard/docos">
                          <FileText className="w-4 h-4 mr-2" /> Refine in docOS
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="prose prose-invert max-w-none text-gray-300">
                      {/* In a real app, this would render the markdown/json content */}
                      <pre className="whitespace-pre-wrap p-4 bg-gray-900 border border-gray-700 rounded-lg text-sm">
                        {generatedContent.content}
                      </pre>
                    </div>
                    <div className="mt-4 text-xs text-gray-500 flex justify-between">
                      <span>Plagiarism Score: {generatedContent.plagiarismScore}% | AI Detection Score: {generatedContent.aiDetectionScore}%</span>
                      <span>Generated at: {new Date(generatedContent.createdAt).toLocaleTimeString()}</span>
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

// --- Placeholder for docOS page (The docOS editor) ---
// This page would contain the block-based editor for content refinement.
// We will create a link to it but not the full implementation for this phase.
