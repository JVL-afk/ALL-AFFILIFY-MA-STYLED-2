'use client'

import { useState } from 'react'
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
  Zap
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

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a website URL')
      return
    }

    // Basic URL validation
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
        // ✅ FIX: Properly access the nested analysis object
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
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  // Helper function to safely get metric scores from the AI analysis
  const getMetricScore = (metricName: string): number => {
    if (!result?.ai_analysis) return 0
    
    // Try different possible locations for the metric
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

  // Generate insights from AI analysis
  const generateInsights = () => {
    if (!result?.ai_analysis) return []
    
    const insights: any[] = []
    const ai = result.ai_analysis

    // Add key strengths as success insights
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

    // Add improvement areas as opportunities
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

    // Add risk factors as issues
    if (ai.risk_assessment?.primary_risks) {
      ai.risk_assessment.primary_risks.slice(0, 2).forEach((risk: any) => {
        insights.push({
          category: 'Risk',
          title: risk,
          description: 'Be aware of this potential risk factor',
          impact: 'medium',
          type: 'issue'
        })
      })
    }

    return insights
  }

  // Generate recommendations from AI analysis
  const generateRecommendations = () => {
    if (!result?.ai_analysis?.recommendations) return []
    
    const recs: any[] = []
    const recommendations = result.ai_analysis.recommendations

    // Traffic sources
    if (recommendations.traffic_sources) {
      recommendations.traffic_sources.slice(0, 3).forEach((source: any, idx) => {
        recs.push({
          title: `Focus on ${source}`,
          description: 'Leverage this traffic source for maximum reach',
          priority: idx === 0 ? 'high' : 'medium',
          effort: 'medium'
        })
      })
    }

    // Content strategy
    if (recommendations.content_strategy) {
      recs.push({
        title: 'Content Strategy',
        description: recommendations.content_strategy,
        priority: 'high',
        effort: 'medium'
      })
    }

    // Optimization tips
    if (recommendations.optimization_tips) {
      recommendations.optimization_tips.slice(0, 3).forEach((tip: any) => {
        recs.push({
          title: tip,
          description: 'Implement this optimization for better performance',
          priority: 'medium',
          effort: 'easy'
        })
      })
    }

    return recs
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Analyze Website</h1>
        <p className="text-gray-600">Get detailed insights and optimization recommendations for any website</p>
      </div>

      {/* Analysis Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Website Analysis
          </CardTitle>
          <CardDescription>
            Enter a website URL to get comprehensive performance and SEO analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL *
            </label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="competitors"
              checked={includeCompetitors}
              onChange={(e) => setIncludeCompetitors(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="competitors" className="text-sm text-gray-700">
              Include competitor analysis
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <Button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 w-4 h-4" />
                Analyze Website
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall Performance Score</span>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.rating_category === 'EXCELLENT' ? 'bg-green-100 text-green-800' :
                    result.rating_category === 'GOOD' ? 'bg-blue-100 text-blue-800' :
                    result.rating_category === 'FAIR' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.rating_category}
                  </span>
                  <div className={`text-3xl font-bold ${getScoreColor(result.main_score)}`}>
                    {result.main_score}/100
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full ${getScoreBg(getMetricScore('performance'))} flex items-center justify-center mx-auto mb-2`}>
                    <span className={`text-lg font-bold ${getScoreColor(getMetricScore('performance'))}`}>
                      {getMetricScore('performance')}
                    </span>
                  </div>
                  <p className="text-sm font-medium">Performance</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full ${getScoreBg(getMetricScore('seo'))} flex items-center justify-center mx-auto mb-2`}>
                    <span className={`text-lg font-bold ${getScoreColor(getMetricScore('seo'))}`}>
                      {getMetricScore('seo')}
                    </span>
                  </div>
                  <p className="text-sm font-medium">SEO</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full ${getScoreBg(getMetricScore('accessibility'))} flex items-center justify-center mx-auto mb-2`}>
                    <span className={`text-lg font-bold ${getScoreColor(getMetricScore('accessibility'))}`}>
                      {getMetricScore('accessibility')}
                    </span>
                  </div>
                  <p className="text-sm font-medium">Stability</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full ${getScoreBg(getMetricScore('bestPractices'))} flex items-center justify-center mx-auto mb-2`}>
                    <span className={`text-lg font-bold ${getScoreColor(getMetricScore('bestPractices'))}`}>
                      {getMetricScore('bestPractices')}
                    </span>
                  </div>
                  <p className="text-sm font-medium">Overall Quality</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          {generateInsights().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Important findings from the analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generateInsights().map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {insight.type === 'opportunity' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                        {insight.type === 'issue' && <AlertCircle className="w-5 h-5 text-red-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{insight.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                            {insight.impact} impact
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{insight.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {generateRecommendations().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
                <CardDescription>Actionable steps to improve your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generateRecommendations().map((rec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                            {rec.priority} priority
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {rec.effort} effort
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis Details */}
          {result.ai_analysis?.strategic_insights?.why_its_special && (
            <Card>
              <CardHeader>
                <CardTitle>What Makes This Special</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{result.ai_analysis.strategic_insights.why_its_special}</p>
              </CardContent>
            </Card>
          )}

          {/* Fallback Notice */}
          {result.ai_analysis?.fallback_used && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Limited Analysis</h4>
                    <p className="text-sm text-yellow-800 mt-1">
                      Some advanced analysis features were temporarily unavailable. Basic comprehensive analysis has been provided.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* No results state */}
      {!result && !loading && (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No analysis yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter a website URL above to get started with comprehensive analysis.
          </p>
        </div>
      )}
    </div>
  )
}
