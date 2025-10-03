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
  score: number
  metrics: {
    performance: number
    seo: number
    accessibility: number
    bestPractices: number
  }
  insights: {
    category: string
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    type: 'opportunity' | 'issue' | 'success'
  }[]
  recommendations: {
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    effort: 'easy' | 'medium' | 'hard'
  }[]
  competitors?: {
    url: string
    score: number
    traffic: number
  }[]
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-orange-500 text-gray-800'
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
        return 'bg-orange-500 text-gray-800'
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
                <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}/100
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full ${getScoreBg(result.metrics.performance)} flex items-center justify-center mx-auto mb-2`}>
                    <span className={`text-lg font-bold ${getScoreColor(result.metrics.performance)}`}>
                      {result.metrics.performance}
                    </span>
                  </div>
                  <p className="text-sm font-medium">Performance</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full ${getScoreBg(result.metrics.seo)} flex items-center justify-center mx-auto mb-2`}>
                    <span className={`text-lg font-bold ${getScoreColor(result.metrics.seo)}`}>
                      {result.metrics.seo}
                    </span>
                  </div>
                  <p className="text-sm font-medium">SEO</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full ${getScoreBg(result.metrics.accessibility)} flex items-center justify-center mx-auto mb-2`}>
                    <span className={`text-lg font-bold ${getScoreColor(result.metrics.accessibility)}`}>
                      {result.metrics.accessibility}
                    </span>
                  </div>
                  <p className="text-sm font-medium">Accessibility</p>
                </div>
                
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full ${getScoreBg(result.metrics.bestPractices)} flex items-center justify-center mx-auto mb-2`}>
                    <span className={`text-lg font-bold ${getScoreColor(result.metrics.bestPractices)}`}>
                      {result.metrics.bestPractices}
                    </span>
                  </div>
                  <p className="text-sm font-medium">Best Practices</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Important findings from the analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-orange-500 rounded-lg">
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

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>Actionable steps to improve your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{rec.title}</h4>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority} priority
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500 text-gray-800">
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

          {/* Competitor Analysis */}
          {result.competitors && result.competitors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>How you compare to similar websites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.competitors.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-500 rounded-lg">
                      <div>
                        <h4 className="font-medium">{competitor.url}</h4>
                        <p className="text-sm text-gray-600">
                          {competitor.traffic?.toLocaleString() || "0"} monthly visitors
                        </p>
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(competitor.score)}`}>
                        {competitor.score}/100
                      </div>
                    </div>
                  ))}
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

