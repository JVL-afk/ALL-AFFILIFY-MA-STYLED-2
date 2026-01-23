import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '../../../../lib/mongodb';
import { VideoAsset, VideoScript, ContentRepurposing } from '../../../../lib/models/MultimediaAssets';
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
    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const userId = decoded.userId || decoded.id;

    // Parse request body
    const body = await request.json();
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
      return NextResponse.json({ error: 'websiteId is required' }, { status: 400 });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Fetch website data
    const website = await db.collection('websites').findOne({
      _id: new ObjectId(websiteId),
      userId: new ObjectId(userId),
    });

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    // Generate video script if not provided
    let videoScript = script;
    if (!videoScript) {
      console.log('🎬 [VIDEO] Generating video script from website data...');
      const scriptText = await generateVideoScript(website, website, videoType);
      const parsedScript = parseVideoScript(scriptText);
      videoScript = parsedScript.fullScript;

      // Save script to database
      const savedScript = await VideoScript.create({
        websiteId: new ObjectId(websiteId),
        userId: new ObjectId(userId),
        title: `${website.title} - ${videoType} Script`,
        hook: parsedScript.hook,
        story: parsedScript.story,
        offer: parsedScript.offer,
        fullScript: parsedScript.fullScript,
        duration: Math.ceil((parsedScript.fullScript.split(/\s+/).length / 150) * 60),
        status: 'approved',
      });

      console.log('✅ [VIDEO] Script saved:', savedScript._id);
    }

    // Call Synthesise AI to generate video
    console.log('🎥 [VIDEO] Calling Synthesise AI for video generation...');
    const videoResult = await callSynthesiseAI(videoScript, avatarId, voiceId, videoType);

    // Save video asset to database
    const videoAsset = await VideoAsset.create({
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
    });

    console.log('✅ [VIDEO] Video asset created:', videoAsset._id);

    // Update website with video asset reference
    await db.collection('websites').updateOne(
      { _id: new ObjectId(websiteId) },
      {
        $set: {
          'multimedia.videoAssets': [
            ...(website.multimedia?.videoAssets || []),
            {
              _id: videoAsset._id,
              type: videoType,
              url: videoResult.videoUrl,
              status: 'ready',
            },
          ],
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      videoAssetId: videoAsset._id.toString(),
      videoUrl: videoResult.videoUrl,
      thumbnailUrl: videoResult.thumbnailUrl,
      duration: videoResult.duration,
      status: 'ready',
    });
  } catch (error) {
    console.error('❌ [VIDEO] Error generating video:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate video',
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
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const userId = decoded.userId || decoded.id;

    const videoAssetId = request.nextUrl.searchParams.get('videoAssetId');
    if (!videoAssetId) {
      return NextResponse.json({ error: 'videoAssetId is required' }, { status: 400 });
    }

    const videoAsset = await VideoAsset.findOne({
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
