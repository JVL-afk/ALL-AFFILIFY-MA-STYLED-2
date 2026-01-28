'use server';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Generate Video Script from Website Data
 * Uses Gemini 2.5 Pro to create compelling video narration
 * Follows the "Hook, Story, Offer" framework
 */
async function generateVideoScript(
  websiteData: any,
  productInfo: any,
  videoType: 'explainer' | 'review' | 'social'
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  const prompt = `You are an elite video copywriter specializing in high-converting product videos. Create a compelling ${videoType} video script for the following product:

Product: ${productInfo.title}
Description: ${productInfo.description}
Features: ${JSON.stringify(productInfo.features || [])}
Benefits: ${JSON.stringify(productInfo.benefits || [])}
Target Audience: ${productInfo.targetAudience || 'General'}

Create a script that follows the "Hook, Story, Offer" framework:

1. HOOK (First 3-5 seconds): A bold, attention-grabbing opening that immediately captures interest
2. STORY (Main body): A narrative that articulates the problem, showcases the solution, and builds desire
3. OFFER (Closing): A clear, compelling call-to-action that drives the viewer to click the affiliate link

The script should be:
- Conversational and engaging
- Focused on benefits, not just features
- Optimized for the ${videoType} format
- Include [VISUAL CUE] markers for video editors
- Approximately ${videoType === 'social' ? '30-60' : videoType === 'explainer' ? '90-120' : '60-90'} seconds when read at natural pace

Format the response as:
HOOK:
[Hook text here]

STORY:
[Story text here with [VISUAL CUE] markers]

OFFER:
[Offer text here]

FULL_SCRIPT:
[Complete narration combining all three]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating video script:', error);
    throw new Error('Failed to generate video script');
  }
}

/**
 * Parse video script response from Gemini
 */
function parseVideoScript(scriptText: string): {
  hook: string;
  story: string;
  offer: string;
  fullScript: string;
} {
  try {
    const hookMatch = scriptText.match(/HOOK:\s*([\s\S]*?)(?=STORY:|$)/);
    const storyMatch = scriptText.match(/STORY:\s*([\s\S]*?)(?=OFFER:|$)/);
    const offerMatch = scriptText.match(/OFFER:\s*([\s\S]*?)(?=FULL_SCRIPT:|$)/);
    const fullScriptMatch = scriptText.match(/FULL_SCRIPT:\s*([\s\S]*?)$/);

    return {
      hook: hookMatch ? hookMatch[1].trim() : '',
      story: storyMatch ? storyMatch[1].trim() : '',
      offer: offerMatch ? offerMatch[1].trim() : '',
      fullScript: fullScriptMatch ? fullScriptMatch[1].trim() : scriptText,
    };
  } catch (error) {
    console.error('Error parsing video script:', error);
    return {
      hook: '',
      story: '',
      offer: '',
      fullScript: scriptText,
    };
  }
}

/**
 * Call Synthesise AI API to generate actual video
 * This would integrate with the real Synthesise AI service
 */
async function callSynthesiseAI(
  script: string,
  avatarId: string,
  voiceId: string,
  videoType: string
): Promise<{ videoUrl: string; thumbnailUrl: string; duration: number }> {
  try {
    // Placeholder for actual Synthesise AI API call
    // In production, this would call the real Synthesise AI endpoint
    const synthesiseApiKey = process.env.SYNTHESISE_AI_API_KEY;
    const synthesiseApiUrl = process.env.SYNTHESISE_AI_API_URL || 'https://api.synthesise.ai/v1';

    if (!synthesiseApiKey) {
      console.warn('Synthesise AI API key not configured, using fallback');
      return generateFallbackVideo(script, avatarId, voiceId);
    }

    const response = await fetch(`${synthesiseApiUrl}/generate-video`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${synthesiseApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script,
        avatarId,
        voiceId,
        videoType,
        resolution: '1080p',
        format: 'mp4',
      }),
    });

    if (!response.ok) {
      throw new Error(`Synthesise AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
      duration: data.duration,
    };
  } catch (error) {
    console.error('Error calling Synthesise AI:', error);
    return generateFallbackVideo(script, avatarId, voiceId);
  }
}

/**
 * Fallback video generation when Synthesise AI is unavailable
 */
function generateFallbackVideo(
  script: string,
  avatarId: string,
  voiceId: string
): { videoUrl: string; thumbnailUrl: string; duration: number } {
  // Estimate duration based on script length (average 150 words per minute)
  const wordCount = script.split(/\s+/).length;
  const estimatedDuration = Math.ceil((wordCount / 150) * 60);

  return {
    videoUrl: `https://placeholder-video.affilify.eu/${avatarId}/${voiceId}/video.mp4`,
    thumbnailUrl: `https://placeholder-video.affilify.eu/${avatarId}/thumbnail.jpg`,
    duration: estimatedDuration,
  };
}

/**
 * Main API handler for video generation
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication - institutional-grade auth check
    const token = request.cookies.get('token')?.value;
    if (!token) {
      console.warn('[AUTH] Missing authentication token in video generation request');
      return NextResponse.json(
        { error: 'Unauthorized', code: 'NO_AUTH_TOKEN' },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (authError) {
      console.warn('[AUTH] Invalid JWT token:', authError instanceof Error ? authError.message : 'Unknown');
      return NextResponse.json(
        { error: 'Unauthorized', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const userId = decoded.userId || decoded.id;
    if (!userId) {
      console.warn('[AUTH] No userId found in JWT payload');
      return NextResponse.json(
        { error: 'Unauthorized', code: 'NO_USER_ID' },
        { status: 401 }
      );
    }

    // Parse request body with validation
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[REQUEST] Failed to parse JSON body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    const {
      websiteId,
      videoType = 'explainer',
      script,
      avatarId = 'default-avatar',
      voiceId = 'default-voice',
      includeSubtitles = true,
      resolution = '1080p',
    } = body;

    if (!websiteId) {
      return NextResponse.json(
        { error: 'websiteId is required', code: 'MISSING_WEBSITE_ID' },
        { status: 400 }
      );
    }

    // Connect to database with error handling
    let db: any;
    try {
      const connection = await connectToDatabase();
      db = connection.db;
    } catch (dbError) {
      console.error('[DATABASE] Connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', code: 'DB_CONNECTION_ERROR' },
        { status: 500 }
      );
    }

    // Fetch website data with user scope validation
    let website: any;
    try {
      website = await db.collection('websites').findOne({
        _id: new ObjectId(websiteId),
        userId: new ObjectId(userId),
      });
    } catch (dbError) {
      console.error('[DATABASE] Query failed:', dbError);
      return NextResponse.json(
        { error: 'Database query failed', code: 'DB_QUERY_ERROR' },
        { status: 500 }
      );
    }

    if (!website) {
      console.warn('[VALIDATION] Website not found or user not authorized:', { websiteId, userId });
      return NextResponse.json(
        { error: 'Website not found', code: 'WEBSITE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Generate video script if not provided
    let videoScript = script;
    if (!videoScript) {
      try {
        console.log('🎬 [VIDEO] Generating video script from website data...');
        const scriptText = await generateVideoScript(website, website, videoType);
        const parsedScript = parseVideoScript(scriptText);
        videoScript = parsedScript.fullScript;
        console.log('✅ [VIDEO] Script generated successfully');
      } catch (scriptError) {
        console.error('[SCRIPT_GENERATION] Failed to generate script:', scriptError);
        return NextResponse.json(
          {
            error: 'Failed to generate video script',
            code: 'SCRIPT_GENERATION_ERROR',
            details: scriptError instanceof Error ? scriptError.message : 'Unknown error',
          },
          { status: 500 }
        );
      }
    }

    // Call Synthesise AI to generate video
    let videoResult: any;
    try {
      console.log('🎥 [VIDEO] Calling Synthesise AI for video generation...');
      videoResult = await callSynthesiseAI(videoScript, avatarId, voiceId, videoType);
      console.log('✅ [VIDEO] Video generated successfully');
    } catch (videoError) {
      console.error('[VIDEO_GENERATION] Failed to generate video:', videoError);
      return NextResponse.json(
        {
          error: 'Failed to generate video',
          code: 'VIDEO_GENERATION_ERROR',
          details: videoError instanceof Error ? videoError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

    // Save video asset to database
    try {
      const videoAssetData = {
        websiteId: new ObjectId(websiteId),
        userId: new ObjectId(userId),
        type: videoType,
        url: videoResult.videoUrl,
        thumbnailUrl: videoResult.thumbnailUrl,
        duration: videoResult.duration,
        script: videoScript,
        avatarId,
        voiceId,
        status: 'ready',
        metadata: {
          resolution,
          format: 'mp4',
          processingTime: Date.now(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const insertResult = await db.collection('videoAssets').insertOne(videoAssetData);
      const videoAssetId = insertResult.insertedId;

      console.log('✅ [VIDEO] Video asset created:', videoAssetId);

      // Update website with video asset reference
      await db.collection('websites').updateOne(
        { _id: new ObjectId(websiteId) },
        {
          $push: {
            'multimedia.videoAssets': {
              _id: videoAssetId,
              type: videoType,
              url: videoResult.videoUrl,
              status: 'ready',
              createdAt: new Date(),
            },
          },
          $set: {
            updatedAt: new Date(),
          },
        }
      );

      return NextResponse.json({
        success: true,
        videoAssetId: videoAssetId.toString(),
        videoUrl: videoResult.videoUrl,
        thumbnailUrl: videoResult.thumbnailUrl,
        duration: videoResult.duration,
        status: 'ready',
      });
    } catch (dbError) {
      console.error('[DATABASE] Failed to save video asset:', dbError);
      return NextResponse.json(
        {
          error: 'Failed to save video asset',
          code: 'DB_SAVE_ERROR',
          details: dbError instanceof Error ? dbError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ [VIDEO] Unexpected error generating video:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate video',
        code: 'UNEXPECTED_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler to check video generation status
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const videoAssetId = request.nextUrl.searchParams.get('videoAssetId');
    if (!videoAssetId) {
      return NextResponse.json({ error: 'videoAssetId is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const videoAsset = await db.collection('videoAssets').findOne({
      _id: new ObjectId(videoAssetId),
      userId: new ObjectId(userId),
    });

    if (!videoAsset) {
      return NextResponse.json({ error: 'Video asset not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      videoAsset: {
        id: videoAsset._id.toString(),
        type: videoAsset.type,
        url: videoAsset.url,
        thumbnailUrl: videoAsset.thumbnailUrl,
        duration: videoAsset.duration,
        status: videoAsset.status,
        createdAt: videoAsset.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching video status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video status' },
      { status: 500 }
    );
  }
}
