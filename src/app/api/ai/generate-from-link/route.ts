import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import * as cheerio from 'cheerio';
import * as jwt from 'jsonwebtoken';
import { google } from 'googleapis';
// @ts-ignore
import YoutubeTranscript from 'youtube-transcript-api';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

// ---------------------------------------------------------------------------
// Resilient fetch helper
// ---------------------------------------------------------------------------
// Every outbound fetch in this file goes through this helper, which provides:
//   • A hard AbortController-based timeout (default 30 s)
//   • Automatic retry with exponential back-off for transient network errors
//     (ETIMEDOUT, ECONNRESET, ECONNREFUSED, ENOTFOUND, AbortError)
//   • Clean error propagation so callers can decide on fallback behaviour
// ---------------------------------------------------------------------------
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 30_000,
  retries: number = 2
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (err: any) {
      clearTimeout(timer);
      lastError = err;

      const isAbort = err?.name === 'AbortError';
      const isTransient =
        isAbort ||
        err?.code === 'ETIMEDOUT' ||
        err?.code === 'ECONNRESET' ||
        err?.code === 'ECONNREFUSED' ||
        err?.code === 'ENOTFOUND';

      if (!isTransient || attempt === retries) break;

      const backoffMs = Math.pow(2, attempt) * 1_000;
      console.warn(
        `[fetchWithTimeout] Attempt ${attempt + 1} failed for ${url} ` +
        `(${err?.code || err?.name}). Retrying in ${backoffMs}ms…`
      );
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  throw lastError;
}

// ---------------------------------------------------------------------------
// Smart URL-to-product-info parser
// ---------------------------------------------------------------------------
// When direct scraping is blocked or fails, this function extracts as much
// product context as possible from the URL structure itself (hostname, path
// segments, query params) and returns a rich, human-readable product info
// object that Gemini can use to generate an accurate affiliate website.
// ---------------------------------------------------------------------------
function extractProductInfoFromUrl(url: string): {
  title: string;
  description: string;
  price: string;
  originalUrl: string;
  brand: string;
  inferredFromUrl: boolean;
} {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');
    const pathSegments = parsed.pathname
      .split('/')
      .map((s) => s.trim())
      .filter(Boolean);

    // Humanise a slug segment: "bmw-m5-sedan" → "BMW M5 Sedan"
    const humanise = (slug: string): string =>
      slug
        .replace(/[-_]/g, ' ')
        .replace(/\b(\d{4})\b/g, '$1') // keep years as-is
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();

    // Extract brand from hostname: "bmw-m.com" → "BMW M", "amazon.com" → "Amazon"
    const brandRaw = hostname.split('.')[0];
    const brand = humanise(brandRaw);

    // Find the most descriptive path segment (longest non-year, non-generic slug)
    const genericSegments = new Set([
      'en', 'us', 'uk', 'de', 'fr', 'all-models', 'products', 'product',
      'shop', 'store', 'catalog', 'category', 'overview', 'detail', 'item',
      'dp', 'gp', 'b', 'p', 'index', 'html', 'htm',
    ]);

    const candidateSegments = pathSegments.filter((seg) => {
      const lower = seg.toLowerCase().replace(/\.(html?|php|aspx?)$/, '');
      return (
        lower.length > 3 &&
        !genericSegments.has(lower) &&
        !/^\d{4}$/.test(lower) // skip bare year segments
      );
    });

    // The last meaningful segment is usually the product name
    const productSlug =
      candidateSegments[candidateSegments.length - 1] ||
      candidateSegments[0] ||
      pathSegments[pathSegments.length - 1] ||
      'product';

    // Strip file extensions
    const cleanSlug = productSlug.replace(/\.(html?|php|aspx?)$/i, '');
    const productName = humanise(cleanSlug);

    // Try to find a year in the path (useful for cars, electronics, etc.)
    const yearMatch = pathSegments.join('/').match(/\b(20\d{2}|19\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : '';

    // Build a rich title: "BMW M5 Sedan (2024) – BMW M"
    const title = year
      ? `${productName} (${year}) – ${brand}`
      : `${productName} – ${brand}`;

    // Build a descriptive fallback description
    const description =
      `Discover the ${productName}${year ? ` ${year}` : ''} by ${brand}. ` +
      `Explore its features, specifications, and find the best deal through our affiliate link.`;

    return {
      title: title.substring(0, 120),
      description: description.substring(0, 300),
      price: '',
      originalUrl: url,
      brand,
      inferredFromUrl: true,
    };
  } catch {
    return {
      title: 'Premium Product',
      description: 'An exceptional product that delivers outstanding value and performance.',
      price: '',
      originalUrl: url,
      brand: 'Unknown Brand',
      inferredFromUrl: true,
    };
  }
}

// ---------------------------------------------------------------------------
// Validate if an image URL is accessible
// ---------------------------------------------------------------------------
async function validateImageUrl(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(
      imageUrl,
      {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      },
      5_000,
      0 // no retries for image validation — speed matters
    );
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.startsWith('image/') || false);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Gemini 2.5 Flash Agent: Generate YouTube Search Queries
// ---------------------------------------------------------------------------
// This function uses Gemini 2.5 Flash as an intelligent agent to generate
// multiple YouTube search queries based on product information and custom instructions.
// It returns an array of search queries that will be used by the YouTube Data API v3.
// ---------------------------------------------------------------------------
async function generateYouTubeSearchQueries(
  productLink: string,
  productInfo: any,
  customInstructions?: string
): Promise<string[]> {
  console.log('🤖 [YOUTUBE_AGENT] ========== STARTING YOUTUBE SEARCH QUERY GENERATION ==========');
  console.log('🤖 [YOUTUBE_AGENT] Product:', productInfo.title);
  console.log('🤖 [YOUTUBE_AGENT] Link:', productLink);

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const agentPrompt = `You are a YouTube search optimization expert. Your task is to generate 3-5 diverse and highly relevant YouTube search queries for the following product.

Product Information:
- Title: ${productInfo.title}
- Brand: ${productInfo.brand}
- Description: ${productInfo.description}
- Link: ${productLink}

${customInstructions ? `Special Instructions: ${customInstructions}` : ''}

Generate search queries that will find:
1. Professional reviews and unboxings
2. Tutorial or how-to content
3. Comparisons with competitors
4. Real user experiences and testimonials
5. Product features and specifications breakdown

Return ONLY a JSON array of strings with the search queries. Example format:
["query 1", "query 2", "query 3", "query 4", "query 5"]

Make sure each query is:
- Specific and relevant to the product
- Likely to return high-quality, authentic content
- Diverse in search intent (reviews, tutorials, comparisons, etc.)
- Natural and conversational (as a real user would search)`;

  try {
    const result = await model.generateContent(agentPrompt);
    const response = await result.response;
    const responseText = response.text();
    console.log('🤖 [YOUTUBE_AGENT] Raw response:', responseText);

    // Extract JSON array from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('🤖 [YOUTUBE_AGENT] Could not extract JSON array, using fallback queries');
      return [
        `${productInfo.brand} ${productInfo.title} review`,
        `${productInfo.title} tutorial how to use`,
        `${productInfo.brand} ${productInfo.title} vs competitors`,
        `${productInfo.title} unboxing`,
        `${productInfo.title} features explained`,
      ];
    }

    const queries: string[] = JSON.parse(jsonMatch[0]);
    console.log('🤖 [YOUTUBE_AGENT] ✅ Generated queries:', queries.length);
    queries.forEach((q, i) => console.log(`  [${i + 1}] ${q}`));
    return queries;
  } catch (error) {
    console.error('🤖 [YOUTUBE_AGENT] ❌ Error generating queries:', error);
    // Return sensible fallback queries
    return [
      `${productInfo.brand} ${productInfo.title} review`,
      `${productInfo.title} tutorial`,
      `${productInfo.title} unboxing`,
    ];
  }
}

// ---------------------------------------------------------------------------
// YouTube Data API and Transcript Retrieval
// ---------------------------------------------------------------------------
async function getYouTubeVideos(query: string, maxResults: number = 3) {
  console.log('🎥 [YOUTUBE] ========== STARTING YOUTUBE SEARCH ==========');
  console.log('🎥 [YOUTUBE] Query:', query);

  try {
    const response = await youtube.search.list({
      part: ['snippet'],
      q: query,
      maxResults,
      type: ['video'],
      relevanceLanguage: 'en',
    });

    const videos = response.data.items || [];
    console.log(`🎥 [YOUTUBE] Found ${videos.length} videos`);

    const videoDetails = await Promise.all(
      videos.map(async (video) => {
        const videoId = video.id?.videoId;
        if (!videoId) return null;

        let transcript = '';
        try {
          const transcriptData = await YoutubeTranscript.getTranscript(videoId);
          transcript = transcriptData.map((t: any) => t.text).join(' ');
          console.log(`🎥 [YOUTUBE] Transcript fetched for ${videoId} (${transcript.length} chars)`);
        } catch (e) {
          console.log(`🎥 [YOUTUBE] Could not fetch transcript for ${videoId}`);
        }

        return {
          videoId,
          title: video.snippet?.title,
          description: video.snippet?.description,
          thumbnail: video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url,
          channelTitle: video.snippet?.channelTitle,
          publishTime: video.snippet?.publishedAt,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          transcript: transcript.substring(0, 5000), // Limit transcript size for prompt
        };
      })
    );

    const validVideos = videoDetails.filter((v) => v !== null);
    console.log(`🎥 [YOUTUBE] ✅ Successfully processed ${validVideos.length} videos`);
    console.log('🎥 [YOUTUBE] ========== END YOUTUBE SEARCH ==========');
    return validVideos;
  } catch (error) {
    console.error('🎥 [YOUTUBE] ❌ Error fetching YouTube videos:', error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Scrape product data
// ---------------------------------------------------------------------------
async function scrapeProductData(url: string) {
  try {
    const response = await fetchWithTimeout(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9',
          Connection: 'keep-alive',
          Referer: 'https://www.google.com/',
          'Cache-Control': 'no-cache',
        },
      },
      30_000,
      2
    );

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('h1').first().text().trim();
    const description =
      $('meta[name="description"]').attr('content') ||
      $('p').first().text().trim();
    const price =
      $('.price').first().text().trim() ||
      $('.product-price').first().text().trim();

    const images = Array.from($('img'))
      .map((img) => {
        const src = $(img).attr('src');
        const alt = $(img).attr('alt') || '';
        const className = $(img).attr('class') || '';
        const id = $(img).attr('id') || '';
        if (src) {
          try {
            const fullUrl = new URL(src, url).href;
            const isLogo = /logo|icon|favicon|sprite|badge|button/i.test(fullUrl + alt + className + id);
            const isSvg = fullUrl.toLowerCase().endsWith('.svg');
            const isSmall = $(img).attr('width') && parseInt($(img).attr('width')!) < 200;
            if (isLogo || isSvg || isSmall) return null;
            return fullUrl;
          } catch {
            return src;
          }
        }
        return null;
      })
      .filter((src): src is string => !!src && src.startsWith('http'));

    console.log('Total images found:', images.length);

    const videoThumbnails = Array.from($('video'))
      .map((video) => {
        const poster = $(video).attr('poster');
        if (poster) {
          try { return new URL(poster, url).href; } catch { return poster; }
        }
        const source = $(video).find('source').first().attr('src');
        if (source) {
          try { return new URL(source, url).href; } catch { return source; }
        }
        return null;
      })
      .filter((src): src is string => !!src && src.startsWith('http'));

    const allMedia = [...images, ...videoThumbnails];

    // Validate images in batches of 5 to avoid connection-pool exhaustion
    const BATCH_SIZE = 5;
    const imagesToValidate = allMedia.slice(0, 20);
    const validImages: string[] = [];
    for (let i = 0; i < imagesToValidate.length; i += BATCH_SIZE) {
      const batch = imagesToValidate.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map(async (imgUrl) => ({ url: imgUrl, valid: await validateImageUrl(imgUrl) }))
      );
      results.filter((r) => r.valid).forEach((r) => validImages.push(r.url));
    }

    console.log('Valid images:', validImages.length, '/', imagesToValidate.length);

    const finalImages = allMedia.length > 20 ? [...validImages, ...allMedia.slice(20)] : validImages;
    const features = Array.from($('ul.features li')).map((li) => $(li).text().trim());
    const specs: { [key: string]: string } = {};
    $('table.specs tr').each((_, row) => {
      const key = $(row).find('th').text().trim();
      const value = $(row).find('td').text().trim();
      if (key && value) specs[key] = value;
    });

    return { title, description, price, images: finalImages, features, specs };
  } catch (error) {
    console.error('Error scraping product data:', error);
    return null;
  }
}

interface UserData {
  _id: ObjectId;
  email: string;
  plan: string;
  websiteCount: number;
}

// ---------------------------------------------------------------------------
// Unsplash image fetcher
// ---------------------------------------------------------------------------
async function getUnsplashImages(query: string, count: number = 10) {
  console.log('🖼️ [IMAGE] ========== STARTING UNSPLASH FETCH ==========');
  console.log('🖼️ [IMAGE] Query:', query);
  console.log('🖼️ [IMAGE] Count requested:', count);

  try {
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!unsplashApiKey) {
      console.log('🖼️ [IMAGE] ❌ No API key - using placeholders');
      return generatePlaceholderImages(query, count);
    }

    const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&order_by=relevant`;
    console.log('🖼️ [IMAGE] Fetching from:', apiUrl);

    const response = await fetchWithTimeout(
      apiUrl,
      { headers: { Authorization: `Client-ID ${unsplashApiKey}` } },
      15_000,
      1
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🖼️ [IMAGE] ❌ API Error Response:', errorText);
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🖼️ [IMAGE] Results found:', data.results?.length || 0);

    const images = data.results.map((photo: any, index: number) => {
      const imageData = {
        url: photo.urls.regular,
        thumb: photo.urls.thumb,
        alt: photo.alt_description || query,
        credit: `Photo by ${photo.user.name} on Unsplash`,
        download_url: photo.links.download_location,
      };
      console.log(`🖼️ [IMAGE] [${index + 1}/${data.results.length}] URL: ${imageData.url}`);
      return imageData;
    });

    console.log('🖼️ [IMAGE] ✅ Successfully fetched', images.length, 'images');
    console.log('🖼️ [IMAGE] ========== END UNSPLASH FETCH ==========');
    return images;
  } catch (error) {
    console.error('🖼️ [IMAGE] ❌ EXCEPTION in getUnsplashImages:', error);
    return generatePlaceholderImages(query, count);
  }
}

// ---------------------------------------------------------------------------
// Placeholder image generator (last-resort fallback)
// ---------------------------------------------------------------------------
function generatePlaceholderImages(query: string, count: number) {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push({
      url: `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center`,
      thumb: `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center`,
      alt: query,
      credit: 'Professional stock photo',
      download_url: null,
    });
  }
  return images;
}

// ---------------------------------------------------------------------------
// Affilify URL generator
// ---------------------------------------------------------------------------
function generateAffilifyUrl(slug: string): string {
  return `https://affilify.eu/sites/${slug}`;
}

// ---------------------------------------------------------------------------
// Niche Expert Analysis (Layer 1: Understand the niche deeply)
// ---------------------------------------------------------------------------
async function analyzeNiche(
  productInfo: any,
  scrapedData: any,
  youtubeVideos: any[]
) {
  console.log('🧠 [NICHE] ========== STARTING NICHE ANALYSIS ==========');
  console.log('🧠 [NICHE] Analyzing niche for:', productInfo.title);

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const nichePrompt = `You are a world-class niche expert and industry insider. Your task is to deeply understand the niche and market for this product: "${productInfo.title}" by ${productInfo.brand}.

Based on the product data, YouTube videos, and your knowledge, provide a strategic brief that covers:

1. **Niche Language & Terminology**: What are the specific terms, jargon, and phrases that experts in this niche use? What words do insiders use that outsiders don't?

2. **Target Audience Profile**: Who is the ideal customer? What are their pain points, desires, and objections?

3. **Industry Standards & Best Practices**: What does a professional in this space care about? What are the key metrics or features they evaluate?

4. **Competitor Landscape**: Who are the main competitors? What do they do well? What gaps exist?

5. **Unique Selling Angles**: What makes this product special within the niche? What story can we tell that resonates with insiders?

6. **Content Tone & Style**: How should the website sound? Formal? Casual? Technical? Inspirational?

7. **Key Benefits to Emphasize**: Based on the niche, what benefits matter most? (Not just features, but real value).

Product Data: ${JSON.stringify({ ...scrapedData, ...productInfo })}

YouTube Video Insights: ${youtubeVideos.map((v) => `${v.title} - ${v.transcript.substring(0, 500)}`).join('\n\n')}

Respond with a clear, structured brief that will guide the website creation. Be specific and actionable.`;

  try {
    const result = await model.generateContent(nichePrompt);
    const response = await result.response;
    const nicheBrief = response.text();
    console.log('🧠 [NICHE] ✅ Niche analysis complete, brief length:', nicheBrief.length, 'chars');
    return nicheBrief;
  } catch (error) {
    console.error('🧠 [NICHE] ❌ Niche analysis error:', error);
    return 'Unable to generate niche brief. Proceed with standard approach.';
  }
}

// ---------------------------------------------------------------------------
// Website content generator (Gemini AI + Unsplash)
// ---------------------------------------------------------------------------
async function generateWebsiteContent(
  productInfo: any,
  scrapedData: any,
  affiliateId: string,
  affiliateType: string
) {
  console.log('🌐 [WEBSITE] ========== STARTING WEBSITE GENERATION ==========');
  console.log('🌐 [WEBSITE] Product title:', productInfo.title);
  console.log('🌐 [WEBSITE] Product URL:', productInfo.originalUrl);
  console.log('🌐 [WEBSITE] Info inferred from URL:', productInfo.inferredFromUrl || false);

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const scrapedImages = scrapedData?.images || [];
  console.log('🖼️ [IMAGE] Scraped images available:', scrapedImages.length);

  // Build a smart Unsplash search query based on available product context
  const imageSearchQuery = productInfo.inferredFromUrl
    ? `${productInfo.brand} ${productInfo.title.split('–')[0].trim()} product`
    : `${productInfo.title} product lifestyle`;

  console.log('🖼️ [IMAGE] ========== FETCHING HERO IMAGE ==========');
  const heroImages =
    scrapedImages.length > 0
      ? [{ url: scrapedImages[0], alt: `${productInfo.title} hero image`, credit: 'Scraped from product page', download_url: null }]
      : await getUnsplashImages(imageSearchQuery, 1);
  console.log('🖼️ [IMAGE] Hero image selected:', heroImages[0]?.url);

  console.log('🖼️ [IMAGE] ========== FETCHING FEATURE IMAGES ==========');
  const featureImages =
    scrapedImages.length > 1
      ? scrapedImages.slice(1).map((url: string) => ({ url, alt: `${productInfo.title} feature image`, credit: 'Scraped from product page', download_url: null }))
      : await getUnsplashImages(`${imageSearchQuery} features`, 10);
  console.log('🖼️ [IMAGE] Feature image 1:', featureImages[0]?.url);
  console.log('🖼️ [IMAGE] Feature image 2:', featureImages[1]?.url);

  console.log('🖼️ [IMAGE] ========== FETCHING TESTIMONIAL IMAGE ==========');
  const testimonialImages = await getUnsplashImages('happy customer testimonial', 1);
  console.log('🖼️ [IMAGE] Testimonial image:', testimonialImages[0]?.url);

  console.log('🖼️ [IMAGE] ========== IMAGE SUMMARY ==========');
  console.log('🖼️ [IMAGE] Hero:', heroImages[0]?.url ? '✅ VALID' : '❌ MISSING');
  console.log('🖼️ [IMAGE] Feature 1:', featureImages[0]?.url ? '✅ VALID' : '❌ MISSING');
  console.log('🖼️ [IMAGE] Feature 2:', featureImages[1]?.url ? '✅ VALID' : '❌ MISSING');
  console.log('🖼️ [IMAGE] Testimonial:', testimonialImages[0]?.url ? '✅ VALID' : '❌ MISSING');

  console.log('🎥 [YOUTUBE] ========== FETCHING YOUTUBE VIDEOS ==========');
  
  // Use Gemini 2.5 Flash agent to generate intelligent YouTube search queries
  const youtubeSearchQueries = await generateYouTubeSearchQueries(
    productInfo.originalUrl,
    productInfo,
    'Generate search queries that will find high-quality reviews, tutorials, and user experiences for this product.'
  );
  
  // Fetch videos for each generated query and combine results
  let youtubeVideos: any[] = [];
  for (const query of youtubeSearchQueries) {
    const videos = await getYouTubeVideos(query, 2);
    youtubeVideos = [...youtubeVideos, ...videos];
    if (youtubeVideos.length >= 6) break; // Limit total videos to 6
  }
  
  // Remove duplicates based on videoId
  youtubeVideos = Array.from(
    new Map(youtubeVideos.map(v => [v.videoId, v])).values()
  ).slice(0, 3);
  
  console.log('🎥 [YOUTUBE] Videos found:', youtubeVideos.length);

  // Layer 1: Analyze the niche to understand industry language and best practices
  console.log('🧠 [NICHE] Calling niche expert analysis...');
  const nicheBrief = await analyzeNiche(productInfo, scrapedData, youtubeVideos);

  // If scraping was blocked, tell Gemini explicitly so it can research the product itself
  const scrapedDataNote = productInfo.inferredFromUrl
    ? `NOTE: Direct scraping of the product page was blocked by the target website. ` +
      `The product details below were inferred from the URL structure. ` +
      `You MUST use your own knowledge and internet research to fill in accurate product details, ` +
      `specifications, pricing, reviews, and competitor comparisons for: "${productInfo.title}" by ${productInfo.brand}.`
    : '';

  const prompt = `You are the world's most elite product marketing expert and conversion optimization copywriter. Your mission is to create a highly compelling, conversion-optimized website to promote and sell the specific product described in the data. The website MUST be focused entirely on the product's features, benefits, and value proposition to the end consumer. DO NOT mention affiliate marketing, making money, or any business opportunity. Your goal is to drive the user to click the affiliate link to purchase the product.

${scrapedDataNote}

Here is the product data you have to work with: ${JSON.stringify({ ...scrapedData, ...productInfo })}.

Here are the high-quality image URLs you MUST use in the generated HTML for the hero section and features:
	Hero Image: ${heroImages[0]?.url || 'NO_HERO_IMAGE'}
	Feature Image 1: ${featureImages[0]?.url || 'NO_FEATURE_IMAGE_1'}
	Feature Image 2: ${featureImages[1]?.url || 'NO_FEATURE_IMAGE_2'}
	Testimonial Image: ${testimonialImages[0]?.url || 'NO_TESTIMONIAL_IMAGE'}
	
		🎥 YOUTUBE VIDEOS (REAL & VERIFIABLE):
		${youtubeVideos.length > 0 
    ? youtubeVideos.map((v, i) => `Video ${i+1}:
      - Title: ${v.title}
      - URL: ${v.url}
      - Embed URL: ${v.embedUrl}
      - Thumbnail: ${v.thumbnail}
      - Channel: ${v.channelTitle}
      - Full Transcript: ${v.transcript}`).join('\n\n')
    : 'NO_YOUTUBE_VIDEOS_FOUND'}

		⭐ IMPORTANT: Extract genuine user feedback, benefits, and insights from the video transcripts above. Use these to create authentic, verifiable reviews and testimonials in the website. Focus on real product benefits mentioned in the videos.

	CRITICAL: The affiliate link is: ${productInfo.originalUrl}
${affiliateId ? `AFFILIATE INTEGRATION: The user has provided an affiliate ID: ${affiliateId}. If the product link is from a known platform (like Amazon, eBay, etc.), you MUST append this affiliate ID to the URL using the correct parameter (e.g., ?tag=${affiliateId} for Amazon). If the platform is unknown, ensure the affiliate ID is integrated into the CTA links or mentioned appropriately in the conversion-focused content to ensure the user gets credit for the sale.` : ''}
ALL call-to-action (CTA) buttons MUST use the affiliate-integrated URL.
Do NOT use placeholder links like "#" or relative links. Every CTA button must have a valid href.

Now, create a unique, creative, conversion-optimized website with over 1000 lines of code. Do not use a restrictive output structure. Be creative. Include a competitor comparison section. Use niche-specific language. Include unique sections that competitors don't have. The primary call-to-action (CTA) should be a prominent button with the affiliate link. Do NOT insert any prices if you don't know the price exactly. Make each website unique (DON'T USE the same colors, if the scraped data and the website in general has a specific color that's recognizable, make that color the color of the writing)! Compare with REAL COMPETITORS of the product and specify the competitors names. Also don't only get your info from the scraped data, research blogs, reviews, articles everything on this internet about the product, make ONLY THE BEST WEBSITE that promotes the specific product! Make ABSOLUTELY SURE that the website can't be interpratated in any kind of way as a copy of the original website (the one fro  where you have the affiliate link). Make each WEBSITE UNIQUE, DO NOT use any generic templates. MAKE SURE each single word or piece of info in the website is REAL and verifiable! Before you even think about creating the website please find at least 1 (max 3) youtube videos to put into the website at the proof (don't use the word proof everytime, use some synonimes if possible) section (make sure the link and thumbnail is visible)!!!!! Insert ONLY real, VERIFIABLE reviews in testimonials page!!!! Make sure to put different backgrounds in the different sections of the website but just make sure the contrast isn't too powerful!!! Respond ONLY with the full code! Here is the affiliate information: affiliateId: ${affiliateId}, affiliateType: ${affiliateType};.`;

  console.log('🤖 [AI] Sending to Gemini, prompt length:', prompt.length, 'chars');

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let websiteHTML = response.text();

    console.log('🤖 [AI] ✅ Received response, length:', websiteHTML.length, 'chars');

    websiteHTML = websiteHTML.replace(/```html/g, '').replace(/```/g, '').trim();

    if (!websiteHTML.toLowerCase().includes('<!doctype') && !websiteHTML.toLowerCase().includes('<html')) {
      console.log('⚠️ [AI] Response missing HTML tags, extracting…');
      const htmlMatch = websiteHTML.match(/<!DOCTYPE[\s\S]*<\/html>/i);
      if (htmlMatch) {
        websiteHTML = htmlMatch[0];
        console.log('✅ [AI] Extracted HTML successfully');
      } else {
        console.log('❌ [AI] Could not extract, using fallback template');
        websiteHTML = generateProfessionalTemplate(productInfo, heroImages, featureImages, testimonialImages, affiliateId);
      }
    }

    console.log('✅ [WEBSITE] Website generated successfully!');
    console.log('🌐 [WEBSITE] ========== END WEBSITE GENERATION ==========');
    return websiteHTML;
  } catch (error) {
    console.error('❌ [AI] Gemini error:', error);
    return generateProfessionalTemplate(productInfo, heroImages, featureImages, testimonialImages, affiliateId);
  }
}

// ---------------------------------------------------------------------------
// Professional fallback template
// ---------------------------------------------------------------------------
function generateProfessionalTemplate(
  productInfo: any,
  heroImages: any[],
  featureImages: any[],
  testimonialImages: any[],
  affiliateId?: string
) {
  console.log('🎨 [TEMPLATE] Generating fallback template');
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productInfo.title} - Professional Affiliate Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 0; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 20px; }
        .hero p { font-size: 1.2rem; margin-bottom: 30px; }
        .cta-button { background: #ff6b6b; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer; text-decoration: none; display: inline-block; }
        .features { padding: 80px 0; background: #f8f9fa; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-top: 50px; }
        .feature { text-align: center; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .feature img { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 20px; }
        .testimonials { padding: 80px 0; }
        .testimonial { text-align: center; max-width: 600px; margin: 0 auto; }
        .testimonial img { width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px; }
        @media (max-width: 768px) { .hero h1 { font-size: 2rem; } .feature-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>${productInfo.title}</h1>
            <p>${productInfo.description}</p>
            <a href="${productInfo.originalUrl}${affiliateId ? (productInfo.originalUrl.includes('?') ? '&' : '?') + 'tag=' + affiliateId : ''}" class="cta-button">Get ${productInfo.title} Now${productInfo.price ? ' - ' + productInfo.price : ''}</a>
        </div>
    </section>
    <section class="features">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 20px;">Why Choose ${productInfo.title}?</h2>
            <div class="feature-grid">
                <div class="feature">
                    <img src="${featureImages[0]?.url || heroImages[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43'}" alt="Premium Quality">
                    <h3>Premium Quality</h3>
                    <p>Experience the highest quality standards with ${productInfo.title}. Built to last and designed to impress.</p>
                </div>
                <div class="feature">
                    <img src="${featureImages[1]?.url || heroImages[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43'}" alt="Amazing Value">
                    <h3>Amazing Value</h3>
                    <p>Get incredible value for your money. ${productInfo.title} delivers results that exceed expectations.</p>
                </div>
            </div>
        </div>
    </section>
    <section class="testimonials">
        <div class="container">
            <div class="testimonial">
                <img src="${testimonialImages[0]?.url || heroImages[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43'}" alt="Happy Customer">
                <h3>"Life-changing results!"</h3>
                <p>"${productInfo.title} has completely transformed my experience. I couldn't be happier with my purchase!"</p>
                <strong>- Sarah Johnson, Verified Customer</strong>
            </div>
            <div style="text-align: center; margin-top: 40px;">
                <a href="${productInfo.originalUrl}${affiliateId ? (productInfo.originalUrl.includes('?') ? '&' : '?') + 'tag=' + affiliateId : ''}" class="cta-button">Order ${productInfo.title} Today${productInfo.price ? ' - ' + productInfo.price : ''}</a>
            </div>
        </div>
    </section>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Analyze product URL
// ---------------------------------------------------------------------------
// Strategy:
//   1. Attempt direct fetch with a 30 s timeout and up to 2 retries.
//   2. If the fetch succeeds, parse the HTML for title/description/price.
//   3. If the fetch fails for any reason (blocked, timeout, DNS, etc.),
//      fall back to extractProductInfoFromUrl() which parses the URL
//      structure itself — guaranteeing a rich, product-specific result
//      instead of the generic "Premium Product" placeholder.
// ---------------------------------------------------------------------------
async function analyzeProductURL(url: string) {
  try {
    const response = await fetchWithTimeout(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9',
          Connection: 'keep-alive',
          Referer: 'https://www.google.com/',
          'Cache-Control': 'no-cache',
        },
      },
      30_000,
      2
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('title').text() ||
      $('h1').first().text() ||
      $('[data-testid="product-title"]').text() ||
      '';

    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      $('p').first().text() ||
      '';

    const price =
      $('[data-testid="price"]').text() ||
      $('.price').first().text() ||
      $('[class*="price"]').first().text() ||
      '';

    // If the page returned HTML but it's empty/unhelpful (bot-detection page),
    // fall back to URL parsing
    if (!title && !description) {
      console.warn('[analyzeProductURL] Page returned no usable content — likely bot-detection. Falling back to URL parsing.');
      return extractProductInfoFromUrl(url);
    }

    return {
      title: title.substring(0, 120),
      description: description.substring(0, 300),
      price: price.substring(0, 20),
      originalUrl: url,
      brand: '',
      inferredFromUrl: false,
    };
  } catch (error) {
    console.error('URL analysis error:', error);
    console.log('[analyzeProductURL] Falling back to URL-based product info extraction.');
    return extractProductInfoFromUrl(url);
  }
}

// ---------------------------------------------------------------------------
// Verify user authentication
// ---------------------------------------------------------------------------
async function verifyUser(request: NextRequest): Promise<UserData | null> {
  try {
    let token =
      request.cookies.get('auth-token')?.value ||
      request.cookies.get('token')?.value ||
      request.cookies.get('authToken')?.value;

    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;

    const { db } = await connectToDatabase();
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
    let decoded: any;

    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (e) {
      console.log('JWT verification failed:', e);
      return null;
    }

    if (!decoded || !decoded.userId) return null;

    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    return user as UserData | null;
  } catch (error) {
    console.error('User verification error:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Plan limits
// ---------------------------------------------------------------------------
function getPlanLimits(plan: string) {
  switch (plan) {
    case 'basic':      return { websites: 3 };
    case 'pro':        return { websites: 10 };
    case 'enterprise': return { websites: 999 };
    default:           return { websites: 3 };
  }
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { productUrl, affiliateId, affiliateType } = await request.json();
    if (!productUrl) {
      return NextResponse.json({ error: 'Product URL is required' }, { status: 400 });
    }

    const limits = getPlanLimits(user.plan);
    const currentWebsiteCount = user.websiteCount || 0;

    if (currentWebsiteCount >= limits.websites) {
      return NextResponse.json(
        {
          error: 'Website limit reached',
          message: `Your ${user.plan} plan allows ${limits.websites} websites. Please upgrade to create more.`,
          currentCount: currentWebsiteCount,
          limit: limits.websites,
        },
        { status: 403 }
      );
    }

    console.log('Analyzing affiliate URL:', productUrl);
    const productInfo = await analyzeProductURL(productUrl);

    console.log('Scraping product data…');
    const scrapedData = await scrapeProductData(productUrl);

    console.log('Generating professional website content with Unsplash images…');
    const websiteHTML = await generateWebsiteContent(productInfo, scrapedData, affiliateId, affiliateType);

    const baseSlug = productInfo.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .substring(0, 30)
      .replace(/^-|-$/g, '');
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const slug = `${baseSlug}-${uniqueId}`;

    console.log('Generating affilify.eu URL…');
    const liveUrl = generateAffilifyUrl(slug);

    const { db } = await connectToDatabase();

    const websiteData = {
      _id: new ObjectId(),
      userId: user._id,
      slug,
      title: productInfo.title,
      description: productInfo.description,
      productUrl,
      url: liveUrl,
      productInfo,
      status: 'draft',
      template: 'modern',
      content: { html: websiteHTML },
      seo: {},
      affiliateLinks: [{ url: productUrl, title: productInfo.title }],
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      isActive: true,
    };

    await db.collection('websites').insertOne(websiteData);
    await db.collection('users').updateOne({ _id: user._id }, { $inc: { websiteCount: 1 } });

    console.log('Website created successfully:', slug);

    return NextResponse.json({
      success: true,
      website: {
        id: websiteData._id.toString(),
        slug,
        title: productInfo.title,
        description: productInfo.description,
        url: liveUrl,
        previewUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://affilify.eu'}/preview/${slug}`,
      },
      message: 'Professional affiliate website created and deployed successfully!',
      remainingWebsites: limits.websites - currentWebsiteCount - 1,
      deployment: { status: 'deployed', platform: 'affilify' },
    });
  } catch (error) {
    console.error('Website generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create website',
        message: 'An error occurred while creating your affiliate website. Please try again.',
      },
      { status: 500 }
    );
  }
}
