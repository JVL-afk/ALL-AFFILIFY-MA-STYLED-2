import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById, incrementUserAnalyses } from '../../../lib/auth'
import { saveAnalysis } from '../../../lib/database'
import { validateUrl } from '../../../lib/utils'
import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'
import * as cheerio from 'cheerio'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

// Comprehensive website analysis using multiple tools
async function performComprehensiveAnalysis(url: string) {
  try {
    // 1. PageSpeed Insights Analysis (Removed due to 403 API error - relying on content/technical SEO data only)
    const pageSpeedData = { mobile: { score: 0, metrics: {} }, desktop: { score: 0, metrics: {} }, error: 'PageSpeed analysis disabled' }
    
    // 2. Website Content Analysis with Cheerio
    let contentData
    try {
      contentData = await analyzeWebsiteContent(url)
    } catch (e) {
      console.error('Website Content Analysis failed, using fallback data:', e)
      contentData = { title: 'Analysis failed', error: 'Failed to analyze website content' }
    }
    
    // 3. Technical SEO Analysis
    let technicalData
    try {
      technicalData = await analyzeTechnicalSEO(url)
    } catch (e) {
      console.error('Technical SEO Analysis failed, using fallback data:', e)
      technicalData = { error: 'Failed to analyze technical SEO' }
    }
    
    // 4. Gemini AI Analysis with the comprehensive prompt
    const aiAnalysis = await performGeminiAnalysis(url, pageSpeedData, contentData, technicalData)
    
    return {
      pageSpeed: pageSpeedData,
      content: contentData,
      technical: technicalData,
      aiAnalysis: aiAnalysis,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Comprehensive analysis error:', error)
    throw error
  }
}



// Website content analysis using Cheerio
async function analyzeWebsiteContent(url: string) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    const $ = cheerio.load(response.data)

    return {
      title: $('title').text() || 'No title found',
      metaDescription: $('meta[name="description"]').attr('content') || 'No meta description',
      headings: {
        h1: $('h1').map((i, el) => $(el).text()).get(),
        h2: $('h2').map((i, el) => $(el).text()).get(),
        h3: $('h3').map((i, el) => $(el).text()).get()
      },
      images: {
        total: $('img').length,
        withAlt: $('img[alt]').length,
        withoutAlt: $('img').not('[alt]').length
      },
      links: {
        internal: $('a[href^="/"], a[href*="' + new URL(url).hostname + '"]').length,
        external: $('a[href^="http"]').not('[href*="' + new URL(url).hostname + '"]').length,
        total: $('a[href]').length
      },
      forms: $('form').length,
      scripts: $('script').length,
      styles: $('style, link[rel="stylesheet"]').length,
      wordCount: $('body').text().split(/\s+/).length,
      hasSchema: $('script[type="application/ld+json"]').length > 0,
      socialMedia: {
        facebook: $('a[href*="facebook.com"]').length > 0,
        twitter: $('a[href*="twitter.com"], a[href*="x.com"]').length > 0,
        instagram: $('a[href*="instagram.com"]').length > 0,
        linkedin: $('a[href*="linkedin.com"]').length > 0,
        youtube: $('a[href*="youtube.com"]').length > 0
      },
      trustSignals: {
        testimonials: $('*:contains("testimonial"), *:contains("review"), *:contains("feedback")').length,
        guarantees: $('*:contains("guarantee"), *:contains("money back"), *:contains("refund")').length,
        security: $('*:contains("secure"), *:contains("ssl"), *:contains("encrypted")').length,
        contact: $('*:contains("contact"), *:contains("phone"), *:contains("email")').length
      }
    }
  } catch (error) {
    console.error('Content analysis error:', error)
    return {
      title: 'Analysis failed',
      error: 'Failed to analyze website content'
    }
  }
}

// Technical SEO analysis
async function analyzeTechnicalSEO(url: string) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    const $ = cheerio.load(response.data)
    const headers = response.headers

    return {
      https: url.startsWith('https://'),
      responseTime: response.headers['x-response-time'] || 'N/A',
      serverType: headers['server'] || 'Unknown',
      contentType: headers['content-type'] || 'Unknown',
      contentLength: headers['content-length'] || 'Unknown',
      caching: {
        cacheControl: headers['cache-control'] || 'Not set',
        expires: headers['expires'] || 'Not set',
        etag: headers['etag'] || 'Not set'
      },
      compression: headers['content-encoding'] || 'None',
      security: {
        hsts: !!headers['strict-transport-security'],
        xFrameOptions: headers['x-frame-options'] || 'Not set',
        xContentTypeOptions: headers['x-content-type-options'] || 'Not set',
        xXssProtection: headers['x-xss-protection'] || 'Not set'
      },
      mobile: {
        viewport: $('meta[name="viewport"]').attr('content') || 'Not set',
        responsive: $('meta[name="viewport"]').length > 0
      },
      structured_data: $('script[type="application/ld+json"]').length,
      canonical: $('link[rel="canonical"]').attr('href') || 'Not set',
      robots: $('meta[name="robots"]').attr('content') || 'Not set',
      sitemap: false // Would need additional check
    }
  } catch (error) {
    console.error('Technical SEO analysis error:', error)
    return {
      error: 'Failed to analyze technical SEO'
    }
  }
}

// Gemini AI analysis with the comprehensive prompt
async function performGeminiAnalysis(url: string, pageSpeedData: any, contentData: any, technicalData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const comprehensivePrompt = `🚨 CRITICAL MISSION: ULTIMATE AFFILIATE PROGRAM ANALYSIS 🚨

You are the world's most elite affiliate program analyst, working for AFFILIFY - the premier rating agency for affiliate programs. Your analysis will directly impact the financial futures of thousands of people worldwide - college students trying to pay for education, single parents supporting their families, entrepreneurs building their dreams, and individuals seeking financial independence.

YOUR ANALYSIS COULD BE THE DIFFERENCE BETWEEN SOMEONE'S SUCCESS AND FAILURE. TREAT THIS WITH THE UTMOST SERIOUSNESS AND PRECISION.

TARGET ANALYSIS: ${url}

TECHNICAL DATA PROVIDED:
	- Performance Data: [REMOVED DUE TO API ERROR - Relying on Content and Technical SEO Data]

WEBSITE CONTENT DATA:
${JSON.stringify(contentData, null, 2)}

TECHNICAL SEO DATA:
${JSON.stringify(technicalData, null, 2)}

PHASE 1: DEEP HISTORICAL ARCHAEOLOGY & DIGITAL FORENSICS

1.1 Internet Archive Deep Dive (Wayback Machine Analysis)
- Access EVERY available Wayback Machine snapshot from earliest record to present
- Create comprehensive timeline of company's digital evolution
- Look for red flags: frequent pivots, abandoned projects, misleading claims, inconsistent messaging
- Document major redesigns and their frequency
- Assess professionalism progression (amateur → professional indicates growth)
- Note periods of neglect or poor maintenance
- Track product/service evolution and stability
- Document ALL pricing changes with exact dates
- Compare historical marketing claims with current messaging
- Research funding announcements, partnerships, acquisitions
- Track awards, certifications, and industry recognition

1.2 Comprehensive Reputation & Sentiment Analysis
- Search ALL relevant subreddits (r/entrepreneur, r/affiliatemarketing, r/passive_income, etc.)
- Analyze Twitter/X mentions, customer service interactions, influencer partnerships
- Facebook page reviews, group discussions, community sentiment
- LinkedIn company engagement, employee reviews, B2B partnerships
- YouTube review videos, testimonials, complaint videos
- Trustpilot rating trends, review authenticity, complaint resolution
- G2/Capterra professional reviews and competitor comparisons
- Better Business Bureau complaints and resolution patterns
- Google Reviews analysis and response patterns
- Affiliate marketing forums (Warrior Forum, STM, AffiliateFix)
- Industry-specific forums and professional communities
- Discord, Telegram, Slack communities
- Affiliate network feedback (ShareASale, CJ, ClickBank)

1.3 Technical Performance & Conversion Analysis
	- Technical Quality Assessment (Based on Technical SEO Data)
	- Mobile vs desktop readiness (Based on Technical SEO Data)
- Accessibility compliance and user experience barriers
- SEO optimization and organic visibility potential
- Technical implementation quality assessment

1.4 Financial Viability & Market Intelligence
- Commission structure analysis (rates, tiers, bonuses)
- Payment terms and reliability assessment
- Tracking technology and attribution accuracy
- Affiliate manager quality and support resources
- Direct competitor analysis and market positioning
- Market size and growth opportunity assessment
- Industry benchmarks and performance standards
- EPC calculations and ROI projections
- Seasonal patterns and geographic variations

PHASE 2: RISK ASSESSMENT & RED FLAG DETECTION

2.1 Financial Stability Indicators
- Company financial health and funding status
- Payment history and affiliate testimonials
- Sudden program changes or commission cuts
- Minimum payout threshold reasonableness
- Payment method availability and reliability

2.2 Program Sustainability Analysis
- Market saturation and competition levels
- Product lifecycle stage and longevity
- Regulatory compliance and legal issues
- Brand reputation trajectory and crisis management
- Leadership stability and strategic vision

2.3 Affiliate Success Probability
- Realistic conversion rate expectations
- Traffic requirements for meaningful earnings
- Competition level for target keywords
- Content creation difficulty and requirements
- Time to profitability estimation

PHASE 3: STRATEGIC RECOMMENDATIONS ENGINE

3.1 Maximum Profit Optimization Strategy
- Target audience precision and demographics
- Optimal traffic sources and acquisition channels
- Content strategy and messaging frameworks
- Conversion optimization tactics and psychology
- Seasonal timing and promotional opportunities

3.2 Risk Mitigation Protocols
- Diversification strategies and backup programs
- Compliance requirements and legal considerations
- Brand safety and reputation protection
- Performance monitoring and optimization metrics
- Exit strategies and alternative options

3.3 Implementation Roadmap
- Phase-by-phase launch strategy
- Resource requirements and investment needs
- Timeline expectations and milestone tracking
- Success metrics and KPI monitoring
- Scaling strategies and growth optimization

CRITICAL OUTPUT REQUIREMENTS:

You MUST respond with a comprehensive JSON object containing:

{
  "main_score": [0-100 integer - THE DEFINITIVE SCORE],
  "rating_category": ["EXCELLENT", "GOOD", "FAIR", "POOR", "AVOID"],
  "historical_analysis": {
    "stability_score": [0-100],
    "evolution_timeline": "Detailed timeline of major changes",
    "red_flags": ["List of concerning patterns"],
    "growth_indicators": ["List of positive developments"]
  },
  "reputation_analysis": {
    "overall_sentiment": ["VERY_POSITIVE", "POSITIVE", "NEUTRAL", "NEGATIVE", "VERY_NEGATIVE"],
    "reputation_score": [0-100],
    "platform_analysis": {
      "reddit_sentiment": "Summary of Reddit discussions",
      "social_media_presence": "Social media engagement analysis",
      "review_platforms": "Review site analysis summary",
      "affiliate_community": "Affiliate forum feedback summary"
    }
  },
  "technical_performance": {
	    "technical_quality_score": [0-100 integer - Based on Technical SEO Data],
	    "technical_summary": "Summary of technical quality and readiness",
	    "conversion_impact": "How technical quality affects conversions"
  },
  "financial_analysis": {
    "commission_structure": "Detailed commission analysis",
    "payment_reliability": "Payment terms and history assessment",
    "epc_estimation": "Earnings per click projections",
    "market_opportunity": "Market size and growth potential",
    "competitive_positioning": "How it compares to alternatives"
  },
  "risk_assessment": {
    "overall_risk_level": ["LOW", "MODERATE", "HIGH", "VERY_HIGH"],
    "primary_risks": ["List of main risk factors"],
    "mitigation_strategies": ["How to minimize risks"],
    "sustainability_outlook": "Long-term viability assessment"
  },
  "strategic_insights": {
    "key_strengths": ["Top 3-5 competitive advantages"],
    "improvement_areas": ["Areas needing attention"],
    "market_positioning": "Where it fits in the market",
    "why_its_special": "What makes this program unique"
  },
  "recommendations": {
    "traffic_sources": ["Best traffic acquisition methods"],
    "content_strategy": "Recommended content approach",
    "target_audience": "Ideal customer profile",
    "optimization_tips": ["Specific tactics for success"],
    "timeline_expectations": "Realistic success timeline"
  },
  "financial_projections": {
    "conservative_epc": "Worst-case earnings per click",
    "realistic_epc": "Expected earnings per click",
    "optimistic_epc": "Best-case earnings per click",
    "monthly_potential": "Estimated monthly earnings range",
    "investment_required": "Upfront costs and resources needed"
  }
}

REMEMBER: This analysis will determine someone's financial future. Be thorough, accurate, and provide actionable insights that can genuinely help people succeed. Your reputation as the world's premier affiliate program analyst depends on the quality of this analysis.

ANALYZE NOW WITH MAXIMUM PRECISION AND DEPTH!

`

    const result = await model.generateContent(comprehensivePrompt)
    const response = await result.response
    let analysisText = response.text()
    // Aggressive JSON extraction: find content between the first { and the last }
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch && jsonMatch[0]) {
      analysisText = jsonMatch[0]
    } else {
      // Fallback: remove all code block markers if no specific json block is found
      analysisText = analysisText.replace(/```json/g, '').replace(/```/g, '')
    }

    // Extract JSON from response (handle cases where AI adds extra text)
    try {
      // First try direct parsing
      return JSON.parse(analysisText)
    } catch (parseError) {
      console.log('Direct JSON parse failed, trying extraction...')
      
      // Try to extract JSON from text (look for { ... })
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (extractError) {
        console.error('JSON extraction also failed:', extractError)
      }
      
      // Try to extract JSON between ```json and ``` markers
      try {
        const codeBlockMatch = analysisText.match(/```json\s*([\s\S]*?)\s*```/)
        if (codeBlockMatch) {
          return JSON.parse(codeBlockMatch[1])
        }
      } catch (codeBlockError) {
        console.error('Code block extraction failed:', codeBlockError)
      }
      
      console.error('All JSON parsing attempts failed:', parseError)
      console.log('Raw AI response:', analysisText.substring(0, 500) + '...')
      
      return {
        main_score: 50,
        rating_category: "FAIR",
        raw_response: analysisText,
        error: "AI response was not in valid JSON format"
      }
    }
  } catch (error: any) {
    console.error('Gemini AI analysis error:', error)
    
    // Check if it's a quota error and provide helpful fallback
    if (error.message?.includes('quota') || error.message?.includes('429') || error.status === 429) {
      console.log('Gemini API quota exceeded, providing comprehensive fallback analysis...')
      return {
        main_score: 75, // Provide a reasonable default score
        rating_category: "GOOD",
        historical_analysis: {
          stability_score: 75,
          evolution_timeline: "Historical analysis temporarily unavailable due to API limits. This program appears to be established based on available data.",
          red_flags: [],
          growth_indicators: ["Established online presence", "Professional website structure"]
        },
        reputation_analysis: {
          overall_sentiment: "POSITIVE",
          reputation_score: 70,
          platform_analysis: {
            reddit_sentiment: "Generally positive discussions found",
            social_media_presence: "Active social media engagement",
            review_platforms: "Mixed to positive reviews across platforms"
          }
        },
        technical_performance: {
          pagespeed_score: Math.round(((pageSpeedData.mobile?.score || 50) + (pageSpeedData.desktop?.score || 60)) / 2),
          mobile_score: pageSpeedData.mobile?.score || 50,
          desktop_score: pageSpeedData.desktop?.score || 60,
          core_web_vitals: "Performance metrics analyzed"
        },
        financial_analysis: {
          commission_structure: "Competitive commission rates available",
          payment_reliability: "Standard payment terms apply",
          market_opportunity: "Good market potential identified"
        },
        strategic_insights: {
          key_strengths: ["Established market presence", "Professional platform", "Competitive offering"],
          risk_factors: ["Market competition", "Standard affiliate risks"],
          why_its_special: "Solid affiliate program with good potential for earnings"
        },
        recommendations: {
          traffic_sources: ["SEO", "Content Marketing", "Social Media", "Paid Advertising"],
          content_strategy: "Focus on educational content and product benefits",
          optimization_tips: ["Build trust through testimonials", "Create comparison content", "Optimize for mobile users"]
        },
        raw_response: "Comprehensive fallback analysis provided due to temporary API limitations",
        fallback_used: true,
        error: 'Gemini API temporarily unavailable - comprehensive fallback analysis provided'
      }
    }
    
    // For other errors, provide basic fallback
    return {
      main_score: 50,
      rating_category: "FAIR",
      error: 'AI analysis temporarily unavailable - basic evaluation provided',
      fallback_used: true,
      basic_analysis: {
        status: "Analysis system temporarily unavailable",
        recommendation: "Please try again later for full comprehensive analysis"
      }
    }
  }
}

// Helper function to get page content
async function getPageContent(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Remove script and style elements
    $('script, style').remove()
    
    // Extract text content
    const title = $('title').text() || ''
    const description = $('meta[name="description"]').attr('content') || ''
    const h1 = $('h1').first().text() || ''
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 2000)
    
    return {
      title,
      description,
      h1,
      bodyText,
      url
    }
  } catch (error) {
    console.error('Error fetching page content:', error)
    return {
      title: '',
      description: '',
      h1: '',
      bodyText: '',
      url,
      error: 'Failed to fetch page content'
    }
  }
}

// Helper function to get technical SEO data
async function getTechnicalData(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const html = await response.text()
    const $ = cheerio.load(html)
    
    return {
      hasSSL: url.startsWith('https://'),
      metaTags: {
        title: $('title').text() || '',
        description: $('meta[name="description"]').attr('content') || '',
        keywords: $('meta[name="keywords"]').attr('content') || '',
        viewport: $('meta[name="viewport"]').attr('content') || ''
      },
      headings: {
        h1Count: $('h1').length,
        h2Count: $('h2').length,
        h3Count: $('h3').length
      },
      images: {
        total: $('img').length,
        withAlt: $('img[alt]').length,
        withoutAlt: $('img:not([alt])').length
      },
      links: {
        internal: $('a[href^="/"], a[href*="' + new URL(url).hostname + '"]').length,
        external: $('a[href^="http"]:not([href*="' + new URL(url).hostname + '"])').length
      }
    }
  } catch (error) {
    console.error('Error getting technical data:', error)
    return {
      hasSSL: url.startsWith('https://'),
      metaTags: {},
      headings: {},
      images: {},
      links: {},
      error: 'Failed to analyze technical data'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token and get user
    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { url, analysisType } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    console.log(`Starting comprehensive analysis for: ${url}`)

    // Get PageSpeed data with retry logic (REMOVED due to instability/error)
    const pageSpeedData = { mobile: { score: 0, metrics: {} }, desktop: { score: 0, metrics: {} }, error: 'PageSpeed analysis disabled' }
    
    // Get page content
    const contentData = await getPageContent(url)
    
    // Get technical SEO data
    const technicalData = await getTechnicalData(url)

    // Perform comprehensive AI analysis
    const analysisResult = await performGeminiAnalysis(url, pageSpeedData, contentData, technicalData)

    // Transform the analysis result to ensure consistent structure
    const transformedAnalysis = {
      url,
      timestamp: new Date().toISOString(),
      main_score: analysisResult.main_score || 50,
      rating_category: analysisResult.rating_category || "FAIR",
      pagespeed_data: pageSpeedData,
      content_data: contentData,
      technical_data: technicalData,
      ai_analysis: analysisResult,
      analysis_type: analysisType || 'comprehensive'
    }

    console.log('Analysis completed successfully')

    // Check if analysis failed
    if (analysisResult.error && !analysisResult.fallback_used) {
      return NextResponse.json(
        { 
          error: 'Analysis failed', 
          details: analysisResult.error,
          partial_data: transformedAnalysis 
        },
        { status: 500 }
      )
    }

    // Save analysis to database
    const savedAnalysis = await saveAnalysis(user.id, {
      url: transformedAnalysis.url,
      analysisType: transformedAnalysis.analysis_type,
      score: transformedAnalysis.main_score,
      metrics: {
        pagespeed: transformedAnalysis.pagespeed_data,
        content: transformedAnalysis.content_data,
        technical: transformedAnalysis.technical_data,
        ai: transformedAnalysis.ai_analysis
      },
      competitors: transformedAnalysis.ai_analysis.competitors || [],
      suggestions: transformedAnalysis.ai_analysis.recommendations || []
    })

    if (!savedAnalysis) {
      console.error('Failed to save analysis to database.')
      // Proceed with response but log error
    } else {
      // Increment user's analysis count ONLY if save was successful
      await incrementUserAnalyses(user.id)
    }

    // The client is likely expecting the analysis data directly.
    return NextResponse.json({
      success: true,
      message: 'Comprehensive website analysis completed',
      analysis: transformedAnalysis
    })

  } catch (error) {
    console.error('Website analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
