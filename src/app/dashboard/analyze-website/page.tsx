'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart3, 
  Globe, 
  Search, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Eye,
  MousePointer,
  Clock,
  Star,
  Zap,
  Target,
  Award,
  Shield,
  Rocket,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  DollarSign,
  Users,
  Activity,
  Gauge,
  Flame,
  Crown,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  Lightbulb,
  CheckCircle2,
  XCircle,
  CircleDot
} from 'lucide-react'

interface AnalysisResult {
  url: string
  timestamp: string
  main_score: number
  rating_category: string
  pagespeed_data: any
  content_data: any
  technical_data: any
  ai_analysis: {
    main_score: number
    rating_category: string
    historical_analysis?: any
    reputation_analysis?: any
    technical_performance?: any
    financial_analysis?: any
    risk_assessment?: any
    strategic_insights?: {
      key_strengths?: string[]
      improvement_areas?: string[]
      market_positioning?: string
      why_its_special?: string
    }
    recommendations?: {
      traffic_sources?: string[]
      content_strategy?: string
      target_audience?: string
      optimization_tips?: string[]
      timeline_expectations?: string
    }
    financial_projections?: any
    error?: string
    fallback_used?: boolean
  }
  analysis_type: string
}

export default function AnalyzeWebsitePage() {
  const [url, setUrl] = useState('')
  const [includeCompetitors, setIncludeCompetitors] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'recommendations' | 'technical'>('overview')

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a website URL')
      return
    }

    try {
      new URL(url)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          analysisType: 'comprehensive',
          includeCompetitors
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data.analysis)
      } else {
        setError(data.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-yellow-400'
    if (score >= 60) return 'text-yellow-500'
    if (score >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50'
    if (score >= 60) return 'bg-gradient-to-br from-yellow-600/20 to-orange-500/20 border-yellow-600/50'
    if (score >= 40) return 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/50'
    return 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/50'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-yellow-400 to-yellow-600'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    if (score >= 40) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-red-700'
  }

  const getRatingBadge = (category: string) => {
    switch (category) {
      case 'EXCELLENT':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
      case 'GOOD':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      case 'FAIR':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
      default:
        return 'bg-gradient-to-r from-red-500 to-red-700 text-white'
    }
  }

  const getMetricScore = (metricName: string): number => {
    if (!result?.ai_analysis) return 0
    
    const aiAnalysis = result.ai_analysis
    
    switch (metricName) {
      case 'performance':
        return aiAnalysis.technical_performance?.pagespeed_score || 
               aiAnalysis.technical_performance?.technical_quality_score || 
               result.main_score || 0
      case 'seo':
        return aiAnalysis.reputation_analysis?.reputation_score || 
               result.main_score || 0
      case 'accessibility':
        return aiAnalysis.historical_analysis?.stability_score || 
               result.main_score || 0
      case 'bestPractices':
        return result.main_score || 0
      default:
        return 0
    }
  }

  const generateInsights = () => {
    if (!result?.ai_analysis) return []
    
    const insights: any[] = []
    const ai = result.ai_analysis

    if (ai.strategic_insights?.key_strengths) {
      ai.strategic_insights.key_strengths.slice(0, 3).forEach((strength: any) => {
        insights.push({
          category: 'Strength',
          title: strength,
          description: 'This is a competitive advantage for this program',
          impact: 'high',
          type: 'success'
        })
      })
    }

    if (ai.strategic_insights?.improvement_areas) {
      ai.strategic_insights.improvement_areas.slice(0, 2).forEach((area: any) => {
        insights.push({
          category: 'Opportunity',
          title: area,
          description: 'Consider improving this area for better results',
          impact: 'medium',
          type: 'opportunity'
        })
      })
    }

    if (ai.risk_assessment?.primary_risks) {
      ai.risk_assessment.primary_risks.slice(0, 2).forEach((risk: any) => {
        insights.push({
          category: 'Risk',
          title: risk,
          description: 'Be aware of this potential risk factor',
          impact: 'high',
          type: 'issue'
        })
      })
    }

    return insights
  }

  const generateRecommendations = () => {
    if (!result?.ai_analysis?.recommendations) return []
    
    const recs: any[] = []
    const recommendations = result.ai_analysis.recommendations

    if (recommendations.traffic_sources) {
      recommendations.traffic_sources.slice(0, 3).forEach((source: any, idx) => {
        recs.push({
          title: `Focus on ${source}`,
          description: 'Leverage this traffic source for maximum reach',
          priority: idx === 0 ? 'high' : 'medium',
          effort: 'medium',
          category: 'Traffic'
        })
      })
    }

    if (recommendations.content_strategy) {
      recs.push({
        title: 'Content Strategy',
        description: recommendations.content_strategy,
        priority: 'high',
        effort: 'medium',
        category: 'Content'
      })
    }

    if (recommendations.optimization_tips) {
      recommendations.optimization_tips.slice(0, 3).forEach((tip: any) => {
        recs.push({
          title: tip,
          description: 'Implement this optimization for better performance',
          priority: 'medium',
          effort: 'easy',
          category: 'Optimization'
        })
      })
    }

    return recs
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Flame className="w-4 h-4" />
      case 'medium':
        return <Zap className="w-4 h-4" />
      default:
        return <CircleDot className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-600 rounded-xl flex items-center justify-center mr-4">
              <BarChart3 className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
                Website Analyzer
              </h1>
              <p className="text-gray-400 mt-1">Professional-grade insights for affiliate marketers & agencies</p>
            </div>
          </div>
        </motion.div>

        {/* Analysis Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/30 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center mb-6">
              <Search className="w-6 h-6 text-yellow-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Analyze Any Website</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Website URL *
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full pl-12 bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20 h-14 text-lg"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-black/30 p-4 rounded-xl border border-gray-700">
                <input
                  type="checkbox"
                  id="competitors"
                  checked={includeCompetitors}
                  onChange={(e) => setIncludeCompetitors(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500/20"
                />
                <label htmlFor="competitors" className="text-gray-300 font-medium flex items-center">
                  <Crown className="w-4 h-4 text-yellow-400 mr-2" />
                  Include competitor analysis (Advanced)
                </label>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl flex items-center"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                    <span className="text-red-300">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                onClick={handleAnalyze} 
                disabled={loading}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 hover:from-yellow-500 hover:via-orange-600 hover:to-red-700 text-black shadow-lg shadow-yellow-500/50 transition-all transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 w-6 h-6 animate-spin" />
                    Analyzing Website...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 w-6 h-6" />
                    Start Comprehensive Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Hero Score Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black border-2 border-yellow-500/50 rounded-3xl p-8 shadow-2xl"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-red-500/5 to-yellow-500/5 animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                        <Award className="w-9 h-9 text-black" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-1">Overall Performance</h2>
                        <p className="text-gray-400">Comprehensive Website Analysis</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`px-6 py-3 rounded-xl text-lg font-bold shadow-lg ${getRatingBadge(result.rating_category)}`}>
                        {result.rating_category}
                      </span>
                      <div className="text-center">
                        <div className={`text-6xl font-black bg-gradient-to-r ${getScoreGradient(result.main_score)} bg-clip-text text-transparent`}>
                          {result.main_score}
                        </div>
                        <div className="text-gray-500 text-sm font-semibold">/ 100</div>
                      </div>
                    </div>
                  </div>

                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Performance', key: 'performance', icon: Rocket, desc: 'Speed & Loading' },
                      { name: 'SEO Score', key: 'seo', icon: TrendingUp, desc: 'Search Ranking' },
                      { name: 'Stability', key: 'accessibility', icon: Shield, desc: 'Reliability' },
                      { name: 'Quality', key: 'bestPractices', icon: Star, desc: 'Best Practices' }
                    ].map((metric, idx) => {
                      const score = getMetricScore(metric.key)
                      const Icon = metric.icon
                      return (
                        <motion.div
                          key={metric.key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          className={`relative overflow-hidden border-2 rounded-2xl p-6 ${getScoreBg(score)} backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer group`}
                        >
                          <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity">
                            <Icon className="w-16 h-16 text-yellow-400" />
                          </div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                              <Icon className={`w-6 h-6 ${getScoreColor(score)}`} />
                              <div className={`text-3xl font-black ${getScoreColor(score)}`}>
                                {score}
                              </div>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">{metric.name}</h3>
                            <p className="text-gray-400 text-xs">{metric.desc}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Navigation Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-2"
              >
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: Eye },
                    { id: 'insights', label: 'Key Insights', icon: Lightbulb },
                    { id: 'recommendations', label: 'Recommendations', icon: Target },
                    { id: 'technical', label: 'Technical Details', icon: Activity }
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-semibold transition-all ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-yellow-400 to-red-600 text-black shadow-lg'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5 inline-block mr-2" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-500/30 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <DollarSign className="w-8 h-8 text-yellow-400" />
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold">
                            BEGINNER
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-xl mb-2">Monetization Potential</h3>
                        <p className="text-gray-300 text-sm mb-3">
                          This website has {result.main_score >= 70 ? 'strong' : result.main_score >= 50 ? 'moderate' : 'limited'} potential for affiliate marketing based on its current performance.
                        </p>
                        <div className="flex items-center text-yellow-400 font-semibold">
                          {result.main_score >= 70 ? <ArrowUp className="w-4 h-4 mr-1" /> : result.main_score >= 50 ? <Minus className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                          {result.main_score >= 70 ? 'High Potential' : result.main_score >= 50 ? 'Medium Potential' : 'Needs Work'}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-500/30 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Users className="w-8 h-8 text-orange-400" />
                          <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold">
                            BEGINNER
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-xl mb-2">User Experience</h3>
                        <p className="text-gray-300 text-sm mb-3">
                          Visitors will have a {result.main_score >= 70 ? 'great' : result.main_score >= 50 ? 'decent' : 'poor'} experience on this site, affecting conversion rates.
                        </p>
                        <div className="flex items-center text-orange-400 font-semibold">
                          <Activity className="w-4 h-4 mr-1" />
                          {result.main_score >= 70 ? 'Excellent UX' : result.main_score >= 50 ? 'Good UX' : 'Needs Improvement'}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-500/30 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Gauge className="w-8 h-8 text-red-400" />
                          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">
                            AGENCY
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-xl mb-2">Technical Health</h3>
                        <p className="text-gray-300 text-sm mb-3">
                          The technical foundation is {result.main_score >= 70 ? 'solid' : result.main_score >= 50 ? 'acceptable' : 'concerning'} for scaling affiliate campaigns.
                        </p>
                        <div className="flex items-center text-red-400 font-semibold">
                          <Shield className="w-4 h-4 mr-1" />
                          {result.main_score >= 70 ? 'Production Ready' : result.main_score >= 50 ? 'Needs Optimization' : 'Critical Issues'}
                        </div>
                      </div>
                    </div>

                    {/* What Makes This Special */}
                    {result.ai_analysis?.strategic_insights?.why_its_special && (
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/30 rounded-2xl p-8">
                        <div className="flex items-center mb-4">
                          <Sparkles className="w-7 h-7 text-yellow-400 mr-3" />
                          <h3 className="text-2xl font-bold text-white">What Makes This Website Special</h3>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed">
                          {result.ai_analysis.strategic_insights.why_its_special}
                        </p>
                      </div>
                    )}

                    {/* Market Positioning */}
                    {result.ai_analysis?.strategic_insights?.market_positioning && (
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-8">
                        <div className="flex items-center mb-4">
                          <Target className="w-7 h-7 text-orange-400 mr-3" />
                          <h3 className="text-2xl font-bold text-white">Market Positioning</h3>
                          <span className="ml-auto px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold">
                            AGENCY INSIGHT
                          </span>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed">
                          {result.ai_analysis.strategic_insights.market_positioning}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Insights Tab */}
                {activeTab === 'insights' && (
                  <motion.div
                    key="insights"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {generateInsights().length > 0 ? (
                      <>
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/30 rounded-2xl p-8">
                          <div className="flex items-center mb-6">
                            <Lightbulb className="w-7 h-7 text-yellow-400 mr-3" />
                            <h3 className="text-2xl font-bold text-white">Key Insights & Findings</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            {generateInsights().map((insight, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative overflow-hidden rounded-xl p-6 border-2 ${
                                  insight.type === 'success' 
                                    ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-yellow-500/50' 
                                    : insight.type === 'opportunity'
                                    ? 'bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-500/50'
                                    : 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/50'
                                }`}
                              >
                                <div className="flex items-start space-x-4">
                                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                                    insight.type === 'success' 
                                      ? 'bg-yellow-500/20' 
                                      : insight.type === 'opportunity'
                                      ? 'bg-orange-500/20'
                                      : 'bg-red-500/20'
                                  }`}>
                                    {insight.type === 'success' && <CheckCircle2 className="w-6 h-6 text-yellow-400" />}
                                    {insight.type === 'opportunity' && <TrendingUp className="w-6 h-6 text-orange-400" />}
                                    {insight.type === 'issue' && <AlertTriangle className="w-6 h-6 text-red-400" />}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="text-white font-bold text-lg">{insight.title}</h4>
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        insight.impact === 'high' 
                                          ? 'bg-red-500/20 text-red-400' 
                                          : 'bg-yellow-500/20 text-yellow-400'
                                      }`}>
                                        {insight.impact.toUpperCase()} IMPACT
                                      </span>
                                    </div>
                                    <p className="text-gray-300 mb-2">{insight.description}</p>
                                    <div className="flex items-center text-sm">
                                      <span className={`px-2 py-1 rounded-md font-semibold ${
                                        insight.type === 'success' 
                                          ? 'bg-yellow-500/10 text-yellow-400' 
                                          : insight.type === 'opportunity'
                                          ? 'bg-orange-500/10 text-orange-400'
                                          : 'bg-red-500/10 text-red-400'
                                      }`}>
                                        {insight.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Strengths Section */}
                        {result.ai_analysis?.strategic_insights?.key_strengths && (
                          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/30 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                              <Award className="w-7 h-7 text-yellow-400 mr-3" />
                              <h3 className="text-2xl font-bold text-white">Competitive Strengths</h3>
                              <span className="ml-auto px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
                                AGENCY ANALYSIS
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {result.ai_analysis.strategic_insights.key_strengths.map((strength: any, idx: number) => (
                                <div key={idx} className="flex items-start space-x-3 bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                                  <CheckCircle2 className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-300">{strength}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Improvement Areas */}
                        {result.ai_analysis?.strategic_insights?.improvement_areas && (
                          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                              <TrendingUp className="w-7 h-7 text-orange-400 mr-3" />
                              <h3 className="text-2xl font-bold text-white">Growth Opportunities</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {result.ai_analysis.strategic_insights.improvement_areas.map((area: any, idx: number) => (
                                <div key={idx} className="flex items-start space-x-3 bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
                                  <ChevronRight className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-300">{area}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-12 text-center">
                        <Info className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">No Detailed Insights Available</h3>
                        <p className="text-gray-500">Try analyzing a different website for more comprehensive insights.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Recommendations Tab */}
                {activeTab === 'recommendations' && (
                  <motion.div
                    key="recommendations"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {generateRecommendations().length > 0 ? (
                      <>
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/30 rounded-2xl p-8">
                          <div className="flex items-center mb-6">
                            <Target className="w-7 h-7 text-yellow-400 mr-3" />
                            <h3 className="text-2xl font-bold text-white">Actionable Recommendations</h3>
                          </div>
                          
                          <div className="space-y-4">
                            {generateRecommendations().map((rec, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border-2 border-gray-600 hover:border-yellow-500/50 rounded-xl p-6 transition-all hover:scale-[1.02] cursor-pointer group"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-start space-x-3 flex-1">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                      rec.priority === 'high' 
                                        ? 'bg-red-500/20 text-red-400' 
                                        : rec.priority === 'medium'
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                      {getPriorityIcon(rec.priority)}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-white font-bold text-lg mb-1 group-hover:text-yellow-400 transition-colors">
                                        {rec.title}
                                      </h4>
                                      <p className="text-gray-400 text-sm mb-3">{rec.description}</p>
                                      <div className="flex items-center space-x-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                          rec.priority === 'high' 
                                            ? 'bg-red-500/20 text-red-400' 
                                            : rec.priority === 'medium'
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                          {rec.priority.toUpperCase()} PRIORITY
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-600/50 text-gray-300">
                                          {rec.effort.toUpperCase()} EFFORT
                                        </span>
                                        {rec.category && (
                                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-700/50 text-gray-400">
                                            {rec.category}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-yellow-400 transition-colors" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Target Audience */}
                        {result.ai_analysis?.recommendations?.target_audience && (
                          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-8">
                            <div className="flex items-center mb-4">
                              <Users className="w-7 h-7 text-orange-400 mr-3" />
                              <h3 className="text-2xl font-bold text-white">Target Audience</h3>
                              <span className="ml-auto px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold">
                                BEGINNER FRIENDLY
                              </span>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed">
                              {result.ai_analysis.recommendations.target_audience}
                            </p>
                          </div>
                        )}

                        {/* Timeline Expectations */}
                        {result.ai_analysis?.recommendations?.timeline_expectations && (
                          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-red-500/30 rounded-2xl p-8">
                            <div className="flex items-center mb-4">
                              <Clock className="w-7 h-7 text-red-400 mr-3" />
                              <h3 className="text-2xl font-bold text-white">Timeline & Expectations</h3>
                              <span className="ml-auto px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">
                                REALISTIC GOALS
                              </span>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed">
                              {result.ai_analysis.recommendations.timeline_expectations}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-12 text-center">
                        <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">No Recommendations Available</h3>
                        <p className="text-gray-500">The analysis didn't generate specific recommendations for this website.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Technical Details Tab */}
                {activeTab === 'technical' && (
                  <motion.div
                    key="technical"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/30 rounded-2xl p-8">
                      <div className="flex items-center mb-6">
                        <Activity className="w-7 h-7 text-yellow-400 mr-3" />
                        <h3 className="text-2xl font-bold text-white">Technical Analysis</h3>
                        <span className="ml-auto px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
                          AGENCY LEVEL
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Performance Metrics */}
                        {result.ai_analysis?.technical_performance && (
                          <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center mb-4">
                              <Rocket className="w-6 h-6 text-yellow-400 mr-2" />
                              <h4 className="text-white font-bold text-lg">Performance Metrics</h4>
                            </div>
                            <div className="space-y-3">
                              {Object.entries(result.ai_analysis.technical_performance).map(([key, value]: [string, any]) => (
                                <div key={key} className="flex justify-between items-center">
                                  <span className="text-gray-400 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                                  <span className="text-white font-semibold">{typeof value === 'number' ? value : String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reputation Analysis */}
                        {result.ai_analysis?.reputation_analysis && (
                          <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center mb-4">
                              <Shield className="w-6 h-6 text-orange-400 mr-2" />
                              <h4 className="text-white font-bold text-lg">Reputation Analysis</h4>
                            </div>
                            <div className="space-y-3">
                              {Object.entries(result.ai_analysis.reputation_analysis).map(([key, value]: [string, any]) => (
                                <div key={key} className="flex justify-between items-center">
                                  <span className="text-gray-400 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                                  <span className="text-white font-semibold">{typeof value === 'number' ? value : String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Historical Analysis */}
                        {result.ai_analysis?.historical_analysis && (
                          <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center mb-4">
                              <Clock className="w-6 h-6 text-red-400 mr-2" />
                              <h4 className="text-white font-bold text-lg">Historical Data</h4>
                            </div>
                            <div className="space-y-3">
                              {Object.entries(result.ai_analysis.historical_analysis).map(([key, value]: [string, any]) => (
                                <div key={key} className="flex justify-between items-center">
                                  <span className="text-gray-400 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                                  <span className="text-white font-semibold">{typeof value === 'number' ? value : String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Risk Assessment */}
                        {result.ai_analysis?.risk_assessment && (
                          <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center mb-4">
                              <AlertTriangle className="w-6 h-6 text-red-400 mr-2" />
                              <h4 className="text-white font-bold text-lg">Risk Assessment</h4>
                            </div>
                            <div className="space-y-3">
                              {result.ai_analysis.risk_assessment.primary_risks && (
                                <div>
                                  <span className="text-gray-400 text-sm block mb-2">Primary Risks:</span>
                                  {result.ai_analysis.risk_assessment.primary_risks.map((risk: any, idx: number) => (
                                    <div key={idx} className="flex items-start space-x-2 mb-2">
                                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                      <span className="text-white text-sm">{risk}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Analysis Metadata */}
                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-gray-500 text-xs mb-1">Analysis Type</div>
                            <div className="text-white font-semibold">{result.analysis_type}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs mb-1">Timestamp</div>
                            <div className="text-white font-semibold">{new Date(result.timestamp).toLocaleTimeString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs mb-1">URL Analyzed</div>
                            <div className="text-white font-semibold truncate">{new URL(result.url).hostname}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs mb-1">Overall Rating</div>
                            <div className="text-white font-semibold">{result.rating_category}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fallback Notice */}
              {result.ai_analysis?.fallback_used && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-500/50 rounded-2xl p-6"
                >
                  <div className="flex items-start space-x-4">
                    <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-yellow-400 text-lg mb-2">Limited Analysis Mode</h4>
                      <p className="text-gray-300">
                        Some advanced analysis features were temporarily unavailable. A comprehensive basic analysis has been provided instead.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No results state */}
        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-16 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
              <BarChart3 className="w-12 h-12 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-3">Ready to Analyze</h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Enter any website URL above to get professional-grade insights and recommendations.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
