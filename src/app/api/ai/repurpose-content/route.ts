import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ContentRepurposing, VideoAsset } from '../../../../lib/models/MultimediaAssets';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Generate social media clips from website content
 */
async function generateSocialClips(websiteData: any, videoUrl?: string): Promise<any[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  const prompt = `You are a social media expert specializing in short-form video content. Create 3 unique 30-second social media clips from this product:

Product: ${websiteData.title}
Description: ${websiteData.description}
Key Features: ${JSON.stringify(websiteData.features || [])}

For each clip, provide:
1. Hook (first 2 seconds)
2. Main message (15 seconds)
3. CTA (last 5 seconds)
4. Platform recommendation (TikTok, Instagram Reels, or YouTube Shorts)
5. Suggested captions with hashtags

Format as JSON array with objects containing: hook, mainMessage, cta, platform, captions`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error('Error generating social clips:', error);
    return [];
  }
}

/**
 * Generate podcast snippet from website content
 */
async function generatePodcastSnippet(websiteData: any): Promise<{
  transcript: string;
  duration: number;
  outline: string;
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  const prompt = `You are a podcast producer. Create a 2-3 minute podcast snippet about this product that would work as a standalone episode or segment:

Product: ${websiteData.title}
Description: ${websiteData.description}
Benefits: ${JSON.stringify(websiteData.benefits || [])}
Target Audience: ${websiteData.targetAudience || 'General'}

Create:
1. A compelling intro hook
2. The main story (problem -> solution -> benefits)
3. A strong outro with call-to-action
4. Natural, conversational tone as if speaking to a friend

Estimate the duration in seconds when read at natural pace.

Format as:
TRANSCRIPT:
[Full podcast transcript]

DURATION:
[Estimated duration in seconds]

OUTLINE:
[Brief outline of segments]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const transcriptMatch = text.match(/TRANSCRIPT:\s*([\s\S]*?)(?=DURATION:|$)/);
    const durationMatch = text.match(/DURATION:\s*(\d+)/);
    const outlineMatch = text.match(/OUTLINE:\s*([\s\S]*?)$/);

    return {
      transcript: transcriptMatch ? transcriptMatch[1].trim() : text,
      duration: durationMatch ? parseInt(durationMatch[1]) : 120,
      outline: outlineMatch ? outlineMatch[1].trim() : '',
    };
  } catch (error) {
    console.error('Error generating podcast snippet:', error);
    return {
      transcript: '',
      duration: 0,
      outline: '',
    };
  }
}

/**
 * Generate quote graphics from website content
 */
async function generateQuoteGraphics(websiteData: any): Promise<any[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  const prompt = `You are a copywriter specializing in social media quotes. Create 5 powerful, shareable quotes from this product's benefits:

Product: ${websiteData.title}
Benefits: ${JSON.stringify(websiteData.benefits || [])}
Target Audience: ${websiteData.targetAudience || 'General'}

Each quote should:
- Be 1-2 sentences maximum
- Be emotionally resonant and shareable
- Highlight a specific benefit
- Include a subtle call-to-action or curiosity hook

Format as JSON array with objects containing: quote, benefit, tone, cta`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error('Error generating quotes:', error);
    return [];
  }
}

/**
 * Generate ad variants for A/B testing
 */
async function generateAdVariants(
  websiteData: any,
  demographics: string[] = ['young-professionals', 'parents', 'enthusiasts']
): Promise<any[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  const prompt = `You are a performance marketing expert. Create 3 unique 15-second video ad scripts targeting different demographics:

Product: ${websiteData.title}
Description: ${websiteData.description}
Target Demographics: ${JSON.stringify(demographics)}

For each demographic, create:
1. A unique hook that resonates with them
2. A value proposition tailored to their needs
3. A specific CTA
4. Recommended avatar tone and voice style
5. Suggested color scheme and music genre

Format as JSON array with objects containing: demographic, hook, valueProposition, cta, avatarTone, voiceStyle, colorScheme, musicGenre`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error('Error generating ad variants:', error);
    return [];
  }
}

/**
 * Main API handler for content repurposing
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
      sourceType = 'website',
      includeTypes = ['social-clips', 'podcast-snippet', 'quote-graphics', 'ad-variants'],
      targetPlatforms = ['tiktok', 'instagram', 'youtube-shorts'],
      demographics = ['young-professionals', 'parents', 'enthusiasts'],
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

    console.log('🔄 [REPURPOSE] Starting content repurposing for website:', websiteId);

    // Initialize repurposing assets object
    const repurposedAssets: any = {
      socialClips: [],
      podcastSnippet: null,
      quoteGraphics: [],
      adVariants: [],
    };

    // Generate social clips
    if (includeTypes.includes('social-clips')) {
      console.log('📱 [REPURPOSE] Generating social media clips...');
      const clips = await generateSocialClips(website);
      repurposedAssets.socialClips = clips.map((clip: any) => ({
        platform: clip.platform || 'tiktok',
        duration: 30,
        captions: clip.captions || '',
        script: `${clip.hook} ${clip.mainMessage} ${clip.cta}`,
        videoUrl: `https://placeholder-video.affilify.eu/social/${clip.platform}/clip.mp4`,
        views: 0,
        engagementRate: 0,
        createdAt: new Date(),
      }));
      console.log('✅ [REPURPOSE] Generated', clips.length, 'social clips');
    }

    // Generate podcast snippet
    if (includeTypes.includes('podcast-snippet')) {
      console.log('🎙️ [REPURPOSE] Generating podcast snippet...');
      const podcast = await generatePodcastSnippet(website);
      repurposedAssets.podcastSnippet = {
        audioUrl: `https://placeholder-audio.affilify.eu/podcast/${websiteId}/snippet.mp3`,
        transcript: podcast.transcript,
        duration: podcast.duration,
        downloads: 0,
        createdAt: new Date(),
      };
      console.log('✅ [REPURPOSE] Generated podcast snippet');
    }

    // Generate quote graphics
    if (includeTypes.includes('quote-graphics')) {
      console.log('🎨 [REPURPOSE] Generating quote graphics...');
      const quotes = await generateQuoteGraphics(website);
      repurposedAssets.quoteGraphics = quotes.map((quote: any) => ({
        imageUrl: `https://placeholder-graphics.affilify.eu/quote/${Math.random().toString(36).substr(2, 9)}.png`,
        quote: quote.quote || '',
        attribution: website.title,
        shares: 0,
        createdAt: new Date(),
      }));
      console.log('✅ [REPURPOSE] Generated', quotes.length, 'quote graphics');
    }

    // Generate ad variants
    if (includeTypes.includes('ad-variants')) {
      console.log('📊 [REPURPOSE] Generating ad variants...');
      const variants = await generateAdVariants(website, demographics);
      repurposedAssets.adVariants = variants.map((variant: any) => ({
        videoUrl: `https://placeholder-video.affilify.eu/ads/${variant.demographic}/variant.mp4`,
        targetDemographic: variant.demographic || '',
        avatarId: 'default-avatar',
        voiceId: 'default-voice',
        valueProposition: variant.valueProposition || '',
        ctr: 0,
        conversions: 0,
        impressions: 0,
        createdAt: new Date(),
      }));
      console.log('✅ [REPURPOSE] Generated', variants.length, 'ad variants');
    }

    // Save content repurposing document
    const repurposingDoc = await ContentRepurposing.create({
      userId: new ObjectId(userId),
      websiteId: new ObjectId(websiteId),
      sourceType,
      repurposedAssets,
      status: 'completed',
    });

    console.log('✅ [REPURPOSE] Content repurposing completed:', repurposingDoc._id);

    // Update website with repurposing reference
    await db.collection('websites').updateOne(
      { _id: new ObjectId(websiteId) },
      {
        $set: {
          contentRepurposingId: repurposingDoc._id,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      repurposingId: repurposingDoc._id.toString(),
      assets: {
        socialClips: repurposedAssets.socialClips.length,
        podcastSnippet: repurposedAssets.podcastSnippet ? true : false,
        quoteGraphics: repurposedAssets.quoteGraphics.length,
        adVariants: repurposedAssets.adVariants.length,
      },
      status: 'completed',
    });
  } catch (error) {
    console.error('❌ [REPURPOSE] Error repurposing content:', error);
    return NextResponse.json(
      {
        error: 'Failed to repurpose content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler to retrieve repurposing status
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const userId = decoded.userId || decoded.id;

    const repurposingId = request.nextUrl.searchParams.get('repurposingId');
    if (!repurposingId) {
      return NextResponse.json({ error: 'repurposingId is required' }, { status: 400 });
    }

    const repurposing = await ContentRepurposing.findOne({
      _id: new ObjectId(repurposingId),
      userId: new ObjectId(userId),
    });

    if (!repurposing) {
      return NextResponse.json({ error: 'Repurposing not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      repurposing: {
        id: repurposing._id.toString(),
        status: repurposing.status,
        assets: {
          socialClips: repurposing.repurposedAssets.socialClips?.length || 0,
          podcastSnippet: repurposing.repurposedAssets.podcastSnippet ? true : false,
          quoteGraphics: repurposing.repurposedAssets.quoteGraphics?.length || 0,
          adVariants: repurposing.repurposedAssets.adVariants?.length || 0,
        },
        createdAt: repurposing.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching repurposing status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repurposing status' },
      { status: 500 }
    );
  }
}
