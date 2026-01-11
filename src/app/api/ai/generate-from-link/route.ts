import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import * as cheerio from 'cheerio';
import JSZip from 'jszip';
import jwt from 'jsonwebtoken';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Validate if an image URL is accessible
async function validateImageUrl(imageUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(imageUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    clearTimeout(timeoutId);
    
    // Check if response is OK and content-type is an image
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.startsWith('image/') || false);
  } catch (error) {
    console.log('Image validation failed for:', imageUrl, error);
    return false;
  }
}

// Verify if a YouTube video is available and embeddable
async function verifyYouTubeVideo(videoId: string): Promise<{valid: boolean, title?: string, thumbnail?: string}> {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (response.ok) {
      const data = await response.json();
      return {
        valid: true,
        title: data.title,
        thumbnail: data.thumbnail_url
      };
    }
    return { valid: false };
  } catch (error) {
    console.error('YouTube verification failed for:', videoId, error);
    return { valid: false };
  }
}

// Search for YouTube videos related to the product
async function getYouTubeVideos(query: string, count: number = 3) {
  console.log('🎥 [VIDEO] ========== STARTING YOUTUBE SEARCH ==========');
  console.log('🎥 [VIDEO] Query:', query);
  
  try {
    // Use a search engine to find YouTube videos (DuckDuckGo is relatively easy to scrape)
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query + ' site:youtube.com/watch')}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Search engine error: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    const videoIds: string[] = [];
    
    $('.result__url').each((i, el) => {
      const text = $(el).text();
      const match = text.match(/v=([a-zA-Z0-9_-]{11})/);
      if (match && match[1] && !videoIds.includes(match[1])) {
        videoIds.push(match[1]);
      }
    });
    
    console.log('🎥 [VIDEO] Found potential video IDs:', videoIds.length);
    
    const verifiedVideos = [];
    for (const id of videoIds.slice(0, 10)) { // Check up to 10 candidates
      if (verifiedVideos.length >= count) break;
      
      const verification = await verifyYouTubeVideo(id);
      if (verification.valid) {
        verifiedVideos.push({
          id,
          url: `https://www.youtube.com/watch?v=${id}`,
          embedUrl: `https://www.youtube.com/embed/${id}`,
          title: verification.title,
          thumbnail: verification.thumbnail
        });
        console.log('🎥 [VIDEO] ✅ Verified:', id, '-', verification.title);
      }
    }
    
    console.log('🎥 [VIDEO] ✅ Successfully verified', verifiedVideos.length, 'videos');
    return verifiedVideos;
  } catch (error) {
    console.error('🎥 [VIDEO] ❌ Error searching YouTube:', error);
    return [];
  }
}

// Perform real-world research on the product
async function researchProduct(productTitle: string) {
  console.log('🔍 [RESEARCH] ========== STARTING PRODUCT RESEARCH ==========');
  console.log('🔍 [RESEARCH] Product:', productTitle);
  
  try {
    // Search for reviews, comparisons, and expert opinions
    const searchQuery = `${productTitle} expert review comparison pros cons 2026`;
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Search engine error: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const researchFindings: string[] = [];
    
    $('.result__snippet').each((i, el) => {
      if (i < 8) { // Get top 8 snippets
        researchFindings.push($(el).text().trim());
      }
    });
    
    console.log('🔍 [RESEARCH] Found', researchFindings.length, 'research snippets');
    return researchFindings.join('\n\n');
  } catch (error) {
    console.error('🔍 [RESEARCH] ❌ Error researching product:', error);
    return "No additional research data available.";
  }
}

async function scrapeProductData(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'no-cache'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract key information
    const title = $("h1").first().text().trim();
    const description = $("meta[name=\"description\"]").attr("content") || $("p").first().text().trim();
    const price = $(".price").first().text().trim() || $(".product-price").first().text().trim();
    // Extract images from img tags with filtering
    const images = Array.from($("img")).map(img => {
      const src = $(img).attr("src");
      const alt = $(img).attr("alt") || "";
      const className = $(img).attr("class") || "";
      const id = $(img).attr("id") || "";
      
      if (src) {
        try {
          const fullUrl = new URL(src, url).href;
          
          // Filter out logos, icons, and small images
          const isLogo = /logo|icon|favicon|sprite|badge|button/i.test(fullUrl + alt + className + id);
          const isSvg = fullUrl.toLowerCase().endsWith('.svg');
          const isSmall = $(img).attr('width') && parseInt($(img).attr('width')!) < 200;
          
          // Skip logos, SVGs (usually logos), and small images
          if (isLogo || isSvg || isSmall) {
            return null;
          }
          
          return fullUrl;
        } catch (e) {
          return src;
        }
      }
      return null;
    }).filter((src): src is string => !!src && src.startsWith("http"));
    
    console.log('Total images found:', images.length);
    console.log('Sample images:', images.slice(0, 3));
    
    // Extract video thumbnails and poster images from video tags
    const videoThumbnails = Array.from($("video")).map(video => {
      // Try to get poster attribute (thumbnail image)
      const poster = $(video).attr("poster");
      if (poster) {
        try {
          return new URL(poster, url).href;
        } catch (e) {
          return poster;
        }
      }
      // Try to get first source element
      const source = $(video).find("source").first().attr("src");
      if (source) {
        try {
          return new URL(source, url).href;
        } catch (e) {
          return source;
        }
      }
      return null;
    }).filter((src): src is string => !!src && src.startsWith("http"));
    
    // Combine images and video thumbnails
    const allMedia = [...images, ...videoThumbnails];
    
    // Validate images in parallel (limit to first 20 to avoid too many requests)
    console.log('Validating', Math.min(allMedia.length, 20), 'scraped images...');
    const imagesToValidate = allMedia.slice(0, 20);
    const validationResults = await Promise.all(
      imagesToValidate.map(async (imgUrl) => ({
        url: imgUrl,
        valid: await validateImageUrl(imgUrl)
      }))
    );
    
    const validImages = validationResults
      .filter(result => result.valid)
      .map(result => result.url);
    
    console.log('Valid images:', validImages.length, '/', imagesToValidate.length);
    
    // If we have more than 20 images, add the rest without validation
    const finalImages = allMedia.length > 20 
      ? [...validImages, ...allMedia.slice(20)]
      : validImages;
    const features = Array.from($("ul.features li")).map(li => $(li).text().trim());
    const specs: { [key: string]: string } = {};
    $("table.specs tr").each((i, row) => {
      const key = $(row).find("th").text().trim();
      const value = $(row).find("td").text().trim();
      if (key && value) {
        specs[key] = value;
      }
    });

    return {
      title,
      description,
      price,
      images: finalImages, // Use validated images and video thumbnails
      features,
      specs,
    };
  } catch (error) {
    console.error("Error scraping product data:", error);
    return null; // Return null if scraping fails
  }
}

interface UserData {
  _id: ObjectId;
  email: string;
  plan: string;
  websiteCount: number;
}

// Get professional images from Unsplash API
async function getUnsplashImages(query: string, count: number = 10) {
  console.log('🖼️ [IMAGE] ========== STARTING UNSPLASH FETCH ==========')
  console.log('🖼️ [IMAGE] Query:', query)
  console.log('🖼️ [IMAGE] Count requested:', count)
  
  try {
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY
    console.log('🖼️ [IMAGE] API Key exists:', !!unsplashApiKey)
    console.log('🖼️ [IMAGE] API Key length:', unsplashApiKey?.length || 0)
    
    if (!unsplashApiKey) {
      console.log('🖼️ [IMAGE] ❌ No API key - using placeholders')
      return generatePlaceholderImages(query, count)
    }

    const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&order_by=relevant`
    console.log('🖼️ [IMAGE] Fetching from:', apiUrl)

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Client-ID ${unsplashApiKey}`
      }
    })

    console.log('🖼️ [IMAGE] Response status:', response.status)
    console.log('🖼️ [IMAGE] Response OK:', response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('🖼️ [IMAGE] ❌ API Error Response:', errorText)
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('🖼️ [IMAGE] Results found:', data.results?.length || 0)
    console.log('🖼️ [IMAGE] Total available:', data.total || 0)
    
    const images = data.results.map((photo: any, index: number) => {
      const imageData = {
        url: photo.urls.regular,
        thumb: photo.urls.thumb,
        alt: photo.alt_description || query,
        credit: `Photo by ${photo.user.name} on Unsplash`,
        download_url: photo.links.download_location
      }
      console.log(`🖼️ [IMAGE] [${index + 1}/${data.results.length}] URL: ${imageData.url}`)
      console.log(`🖼️ [IMAGE] [${index + 1}/${data.results.length}] Alt: ${imageData.alt}`)
      console.log(`🖼️ [IMAGE] [${index + 1}/${data.results.length}] By: ${photo.user.name}`)
      return imageData
    })
    
    console.log('🖼️ [IMAGE] ✅ Successfully fetched', images.length, 'images')
    console.log('🖼️ [IMAGE] ========== END UNSPLASH FETCH ==========')
    return images
  } catch (error) {
    console.error('🖼️ [IMAGE] ❌ EXCEPTION in getUnsplashImages:', error)
    console.log('🖼️ [IMAGE] Falling back to placeholders')
    return generatePlaceholderImages(query, count)
  }
}

// Generate placeholder images if Unsplash fails
function generatePlaceholderImages(query: string, count: number) {
  console.log('🖼️ [IMAGE] 🎨 Generating', count, 'placeholder images for:', query)
  const images = []
  for (let i = 0; i < count; i++) {
    images.push({
      url: `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center`,
      thumb: `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center`,
      alt: query,
      credit: 'Professional stock photo',
      download_url: null
    })
  }
  console.log('🖼️ [IMAGE] ✅ Generated', images.length, 'placeholders')
  return images
}

// Deploy website to Netlify
async function deployToNetlify(websiteHTML: string, siteName: string) {
  try {
    const netlifyToken = process.env.NETLIFY_ACCESS_TOKEN
    if (!netlifyToken) {
      console.log('Netlify token not found, returning local URL')
      return null
    }

    // ✅ FIX 1: Clean the site name to meet Netlify requirements
    // Site names must be lowercase, alphanumeric, and can contain hyphens
    const cleanSiteName = siteName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 63) // Max 63 characters

    console.log('Creating Netlify site with name:', cleanSiteName)

    // ✅ FIX 2: Don't specify site name in creation (let Netlify generate it)
    const siteResponse = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Don't specify name - let Netlify auto-generate
        // name: cleanSiteName,
      })
    })

    if (!siteResponse.ok) {
      const errorText = await siteResponse.text()
      console.error(`Netlify site creation error: ${siteResponse.status}`, errorText)
      throw new Error(`Netlify site creation error: ${siteResponse.status}`)
    }

    const siteData = await siteResponse.json()
    const siteId = siteData.id

    console.log('Netlify site created:', siteId)

    // ✅ FIX 3: Convert Buffer to Uint8Array, then to Blob
    const zipBuffer = await createZipFromHTML(websiteHTML)
    const zipUint8Array = new Uint8Array(zipBuffer)
    const zipBlob = new Blob([zipUint8Array], { type: 'application/zip' })

    console.log('Deploying to Netlify site:', siteId)

    // Deploy the HTML content
    const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/zip'
      },
      body: zipBlob
    })

    if (!deployResponse.ok) {
      const errorText = await deployResponse.text()
      console.error(`Netlify deploy error: ${deployResponse.status}`, errorText)
      throw new Error(`Netlify deploy error: ${deployResponse.status}`)
    }

    const deployData = await deployResponse.json()
    
    console.log('Netlify deployment successful:', deployData.id)

    return {
      url: siteData.ssl_url || siteData.url,
      deploy_id: deployData.id,
      site_id: siteId,
      admin_url: siteData.admin_url
    }
  } catch (error) {
    console.error('Netlify deployment error:', error)
    // Return null so the system falls back to local URL
    return null
  }
}

async function createZipFromHTML(html: string): Promise<Buffer> {
  const zip = new JSZip();
  
  // Add the main index.html file
  zip.file('index.html', html);

  // Add a _headers file to force Netlify to serve index.html as text/html
  const headersContent = `
/*
  Content-Type: text/html
`;
  zip.file('_headers', headersContent);

  // Generate the zip file as a Buffer
  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  return content;
}

// Generate REAL website content using Gemini AI with Unsplash images
async function generateWebsiteContent(productInfo: any, scrapedData: any, affiliateId: string, affiliateType: string) {
  console.log('🌐 [WEBSITE] ========== STARTING WEBSITE GENERATION ==========')
  console.log('🌐 [WEBSITE] Product title:', productInfo.title)
  console.log('🌐 [WEBSITE] Product URL:', productInfo.originalUrl)
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  
  // Prioritize scraped images, fallback to Unsplash
  const scrapedImages = scrapedData?.images || [];
  console.log('🖼️ [IMAGE] Scraped images available:', scrapedImages.length)
  if (scrapedImages.length > 0) {
    console.log('🖼️ [IMAGE] Sample scraped image:', scrapedImages[0])
  } else {
    console.log('🖼️ [IMAGE] ⚠️ No valid scraped images - will use Unsplash for all images')
  }
  
  // Use scraped images for hero, fallback to Unsplash
  console.log('🖼️ [IMAGE] ========== FETCHING HERO IMAGE ==========')
  const heroImages = scrapedImages.length > 0 
    ? [{ url: scrapedImages[0], alt: `${productInfo.title} hero image`, credit: 'Scraped from product page', download_url: null }]
    : await getUnsplashImages(`${productInfo.title} product lifestyle`, 1);
  
  console.log('🖼️ [IMAGE] Hero image selected:', heroImages[0]?.url)

  // Use scraped images for features, fallback to Unsplash
  console.log('🖼️ [IMAGE] ========== FETCHING FEATURE IMAGES ==========')
  const featureImages = scrapedImages.length > 1 
    ? scrapedImages.slice(1).map((url: string) => ({ url, alt: `${productInfo.title} feature image`, credit: 'Scraped from product page', download_url: null }))
    : await getUnsplashImages(`${productInfo.title} benefits features`, 10);
  
  console.log('🖼️ [IMAGE] Feature image 1:', featureImages[0]?.url)
  console.log('🖼️ [IMAGE] Feature image 2:', featureImages[1]?.url)

  // Use Unsplash for testimonials as scraped images are unlikely to be testimonials
  console.log('🖼️ [IMAGE] ========== FETCHING TESTIMONIAL IMAGE ==========')
  const testimonialImages = await getUnsplashImages('happy customer testimonial', 1);
  console.log('🖼️ [IMAGE] Testimonial image:', testimonialImages[0]?.url)
  
  console.log('🖼️ [IMAGE] ========== IMAGE SUMMARY ==========')
  console.log('🖼️ [IMAGE] Hero:', heroImages[0]?.url ? '✅ VALID' : '❌ MISSING')
  console.log('🖼️ [IMAGE] Feature 1:', featureImages[0]?.url ? '✅ VALID' : '❌ MISSING')
  console.log('🖼️ [IMAGE] Feature 2:', featureImages[1]?.url ? '✅ VALID' : '❌ MISSING')
  console.log('🖼️ [IMAGE] Testimonial:', testimonialImages[0]?.url ? '✅ VALID' : '❌ MISSING')
  
  // Fetch verified YouTube videos
  console.log('🎥 [VIDEO] ========== FETCHING VERIFIED VIDEOS ==========')
  const youtubeVideos = await getYouTubeVideos(`${productInfo.title} review`, 3);
  const videoDataString = youtubeVideos.length > 0 
    ? youtubeVideos.map((v, i) => `Video ${i+1}: Title: ${v.title}, Embed URL: ${v.embedUrl}, Thumbnail: ${v.thumbnail}`).join("\n")
    : 'NO_VERIFIED_VIDEOS_FOUND';
  console.log("🎥 [VIDEO] Verified videos for prompt:", youtubeVideos.length)

  // Perform real-world research
  const researchData = await researchProduct(productInfo.title);
  console.log("🔍 [RESEARCH] Research data collected.");

  const prompt = `You are the world\'s foremost expert in **neuromarketing, evolutionary psychology, and hypnotic persuasion**, combined with elite product marketing and conversion optimization copywriting skills. Your ultimate mission is to create a website so profoundly compelling that it **hypnotizes any visitor into buying the promoted product.**

Your understanding of human nature, biology, and psychology goes to the core. You know how to tap into primal desires, leverage cognitive biases, and craft narratives that bypass logical resistance to trigger immediate action. You are a master of persuasive language and subliminal influence.

**Product Data (Scraped):**
${JSON.stringify(scrapedData)}.

**Real-World Research Data (Crucial for Persuasion):**
${researchData}

**High-Quality Image URLs (MUST USE):**
Hero Image: ${heroImages[0]?.url || 'NO_HERO_IMAGE'}
Feature Image 1: ${featureImages[0]?.url || 'NO_FEATURE_IMAGE_1'}
Feature Image 2: ${featureImages[1]?.url || 'NO_FEATURE_IMAGE_2'}
Testimonial Image: ${testimonialImages[0]?.url || 'NO_TESTIMONIAL_IMAGE'}

**CRITICAL: Affiliate Link (MUST INTEGRATE INTO ALL CTAs):** ${productInfo.originalUrl}
${affiliateId ? `AFFILIATE INTEGRATION: The user has provided an affiliate ID: ${affiliateId}. If the product link is from a known platform (like Amazon, eBay, etc.), you MUST append this affiliate ID to the URL using the correct parameter (e.g., ?tag=${affiliateId} for Amazon). If the platform is unknown, ensure the affiliate ID is integrated into the CTA links or mentioned appropriately in the conversion-focused content to ensure the user gets credit for the sale.` : ''}
ALL call-to-action (CTA) buttons MUST use the affiliate-integrated URL. Do NOT use placeholder links like "#" or relative links. Every CTA button must have a valid href.

**VERIFIED YOUTUBE VIDEOS (MUST EMBED):**
Use the following REAL and VERIFIED YouTube videos in your "Proof" or "Video Review" section. DO NOT hallucinate or use any other YouTube links. Use these specific embed URLs:
${videoDataString}

**Your Website Generation Directives (Follow these meticulously to achieve hypnotic persuasion):**

1. PRIMAL DESIRE ACTIVATION: Identify the core, often subconscious, desires this product fulfills (e.g., status, security, belonging, freedom, comfort, pleasure, pain avoidance). Frame all benefits around these primal motivators. Speak directly to the visitor's lizard brain (amygdala) to trigger immediate, emotional responses.
2. COGNITIVE BIAS EXPLOITATION: Strategically employ: (a) Scarcity/Urgency - Create a sense of limited availability or time-sensitive offers. (b) Social Proof - Integrate testimonials, user counts, expert endorsements, and review snippets to demonstrate widespread acceptance and trust. (c) Authority - Position the product as the leading solution, backed by expert opinions and data from research. (d) Anchoring - Present higher-priced alternatives or the product's original value before revealing the current offer. (e) Loss Aversion - Emphasize what the visitor stands to lose by not acquiring the product. (f) Commitment & Consistency - Encourage micro-commitments (e.g., signing up for a newsletter) that lead to larger commitments.
3. HYPNOTIC NARRATIVE & LANGUAGE: Weave a compelling story where the visitor is the hero, and the product is the magical elixir that solves their deepest problems and fulfills their aspirations. Use: (a) Sensory-Rich Language - Describe the product experience using vivid details that engage all five senses, creating a mental movie in the visitor's mind. (b) Embedded Commands - Subtly instruct the reader to take action (e.g., feel the power, imagine yourself owning this). (c) Presuppositions - Frame sentences to assume the purchase (e.g., When you experience the Jaguar XF's unparalleled luxury...). (d) Future Pacing - Guide the reader to envision their improved life after purchasing the product. (e) Power Words & Active Verbs - Utilize language that evokes strong emotions and drives action.
4. VISUAL PERSUASION: Ensure images and videos are not just aesthetically pleasing but also strategically chosen to reinforce psychological triggers. Show aspirational lifestyles, happy users, and the product in action. Use color psychology to evoke desired emotions (e.g., trust, excitement, luxury). Ensure video content showcases real benefits and builds trust.
5. CLEAR CALL-TO-ACTION (CTA) DOMINANCE: The primary CTA button MUST be impossible to ignore. It should be visually prominent, use urgent and benefit-driven language, and be strategically placed throughout the page. Reinforce the affiliate link with clear, concise messaging.
6. UNIQUE & NICHE-SPECIFIC CONTENT: Avoid generic templates. The website must feel bespoke, speaking directly to the target audience with niche-specific language and addressing their unique pain points and desires.
7. COMPETITOR COMPARISON (STRATEGIC): Frame comparisons to highlight the promoted product's unique advantages, making competitors seem inferior without explicitly denigrating them. Focus on the value gap the promoted product fills.
8. REAL & VERIFIABLE INFORMATION: Every claim, review, and piece of information MUST be real and verifiable. Authenticity builds trust, which is paramount for hypnotic persuasion. Use scraped data and research data as your factual anchors.
9. AESTHETIC & FLOW: Maintain a Rolex-quality UI. The design should be elegant, intuitive, and guide the visitor effortlessly towards the purchase decision. Use contrasting backgrounds strategically to delineate sections without overwhelming the user.

Now, create a unique, creative, conversion-optimized website with over 1000 lines of code. Respond ONLY with the full HTML code! Here is the affiliate information: affiliateId: ${affiliateId}, affiliateType: ${affiliateType};.`;

  console.log('🤖 [AI] Sending to Gemini, prompt length:', prompt.length, 'chars')

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let websiteHTML = response.text();
    
    console.log('🤖 [AI] ✅ Received response, length:', websiteHTML.length, 'chars')
    
    // Clean up the response to ensure it's valid HTML
    websiteHTML = websiteHTML.replace(/```html/g, '').replace(/```/g, '').trim();
    
    // If the response doesn't start with HTML, extract it
    if (!websiteHTML.toLowerCase().includes('<!doctype') && !websiteHTML.toLowerCase().includes('<html')) {
      console.log('⚠️ [AI] Response missing HTML tags, extracting...')
      const htmlMatch = websiteHTML.match(/<!DOCTYPE[\s\S]*<\/html>/i);
      if (htmlMatch) {
        websiteHTML = htmlMatch[0];
        console.log('✅ [AI] Extracted HTML successfully')
      } else {
        console.log('❌ [AI] Could not extract, using fallback template')
        websiteHTML = generateProfessionalTemplate(productInfo, heroImages, featureImages, testimonialImages, affiliateId);
      }
    }
    
    console.log('✅ [WEBSITE] Website generated successfully!')
    console.log('🌐 [WEBSITE] ========== END WEBSITE GENERATION ==========')
    return websiteHTML;
  } catch (error) {
    console.error('❌ [AI] Gemini error:', error);
    console.log('⚠️ [AI] Using fallback template')
    return generateProfessionalTemplate(productInfo, heroImages, featureImages, testimonialImages, affiliateId);
  }
}

// Professional fallback template with Unsplash images
function generateProfessionalTemplate(productInfo: any, heroImages: any[], featureImages: any[], testimonialImages: any[], affiliateId?: string) {
  console.log('🎨 [TEMPLATE] Generating fallback template')
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
            <a href="${productInfo.originalUrl}${affiliateId ? (productInfo.originalUrl.includes('?') ? '&' : '?') + 'tag=' + affiliateId : ''}" class="cta-button">Get ${productInfo.title} Now - ${productInfo.price}</a>
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
                <a href="${productInfo.originalUrl}${affiliateId ? (productInfo.originalUrl.includes('?') ? '&' : '?') + 'tag=' + affiliateId : ''}" class="cta-button">Order ${productInfo.title} Today - ${productInfo.price}</a>
            </div>
        </div>
    </section>
</body>
</html>`;
}

// Analyze product URL to extract information
async function analyzeProductURL(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract product information
    const title = $('title').text() || 
                  $('h1').first().text() || 
                  $('[data-testid="product-title"]').text() ||
                  'Amazing Product';

    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') ||
                       $('p').first().text() ||
                       'Discover this incredible product that will transform your life.';

    const price = $('[data-testid="price"]').text() ||
                  $('.price').first().text() ||
                  $('[class*="price"]').first().text() ||
                  '$99.99';

    return {
      title: title.substring(0, 100),
      description: description.substring(0, 200),
      price: price.substring(0, 20),
      originalUrl: url
    };
  } catch (error) {
    console.error('URL analysis error:', error);
    return {
      title: 'Premium Product',
      description: 'An amazing product that delivers exceptional value and results.',
      price: '$99.99',
      originalUrl: url
    };
  }
}

// Verify user authentication
async function verifyUser(request: NextRequest): Promise<UserData | null> {
  try {
    let token = request.cookies.get('auth-token')?.value || 
                request.cookies.get('token')?.value || 
                request.cookies.get('authToken')?.value;
    
    // Also check for Bearer token in Authorization header (standard for frontend fetch)
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    // Final check for token existence
    if (!token) {
      return null;
    }

    const { db } = await connectToDatabase();
    // Instead of looking up the token directly, decode the JWT to get the userId
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a fallback secret for local testing
    let decoded: any;
    
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (e) {
      console.log('JWT verification failed:', e);
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    // Use the extracted userId to find the user
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(decoded.userId)
    });

    return user as UserData | null;
  } catch (error) {
    console.error('User verification error:', error);
    return null;
  }
}

// Get plan limits
function getPlanLimits(plan: string) {
  switch (plan) {
    case 'basic':
      return { websites: 3 };
    case 'pro':
      return { websites: 10 };
    case 'enterprise':
      return { websites: 999 };
    default:
      return { websites: 3 };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get request data
    const { productUrl, affiliateId, affiliateType } = await request.json();
    if (!productUrl) {
      return NextResponse.json(
        { error: 'Product URL is required' },
        { status: 400 }
      );
    }

    // Check plan limits
    const limits = getPlanLimits(user.plan);
    const currentWebsiteCount = user.websiteCount || 0;

    if (currentWebsiteCount >= limits.websites) {
      return NextResponse.json(
        { 
          error: 'Website limit reached',
          message: `Your ${user.plan} plan allows ${limits.websites} websites. Please upgrade to create more.`,
          currentCount: currentWebsiteCount,
          limit: limits.websites
        },
        { status: 403 }
      );
    }

    // Analyze REAL product URL
    console.log('Analyzing affiliate URL:', productUrl);
    const productInfo = await analyzeProductURL(productUrl);
    
    // Scrape product data for images and details
    console.log('Scraping product data...');
    const scrapedData = await scrapeProductData(productUrl);

    // Generate REAL website content using AI with Unsplash images
    console.log('Generating professional website content with Unsplash images...');
    const websiteHTML = await generateWebsiteContent(productInfo, scrapedData, affiliateId, affiliateType);

    // Generate unique slug for the website
    const baseSlug = productInfo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30).replace(/^-|-$/g, ''); // Clean, truncate to 30 chars, remove trailing hyphen
    const uniqueId = Math.random().toString(36).substring(2, 8); // 6-character random hash
    const slug = `${baseSlug}-${uniqueId}`;

    // Deploy to Netlify for live URL
    console.log('Deploying website to Netlify...');
    const netlifyDeployment = await deployToNetlify(websiteHTML, slug);

    // Save website to database
    const { db } = await connectToDatabase();
    
    // Determine the live URL
    const liveUrl = netlifyDeployment?.url || `${process.env.NEXT_PUBLIC_APP_URL || 'https://affilify.eu'}/websites/${slug}`;
    
    const websiteData = {
      _id: new ObjectId(),
      userId: user._id,
      slug,
      title: productInfo.title,
      description: productInfo.description,
      productUrl,
      url: liveUrl,
      productInfo,
      netlifyDeployment,
      status: 'draft',
      template: 'modern',
      content: { html: websiteHTML }, // Save the full HTML inside the content object
      seo: {},
      affiliateLinks: [{ url: productUrl, title: productInfo.title }],
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      isActive: true
    };

    await db.collection('websites').insertOne(websiteData);

    // Update user website count
    await db.collection('users').updateOne(
      { _id: user._id },
      { $inc: { websiteCount: 1 } }
    );

    console.log('Website created successfully:', slug);

    // Return success response
    return NextResponse.json({
      success: true,
      website: {
        id: websiteData._id.toString(),
        slug,
        title: productInfo.title,
        description: productInfo.description,
        url: liveUrl,
        previewUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://affilify.eu'}/preview/${slug}`,
        netlifyUrl: netlifyDeployment?.url || null,
        adminUrl: netlifyDeployment?.admin_url || null
      },
      message: 'Professional affiliate website created and deployed successfully!',
      remainingWebsites: limits.websites - currentWebsiteCount - 1,
      deployment: {
        status: netlifyDeployment ? 'deployed' : 'local',
        platform: netlifyDeployment ? 'netlify' : 'affilify'
      }
    });

  } catch (error) {
    console.error('Website generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create website',
        message: 'An error occurred while creating your affiliate website. Please try again.'
      },
      { status: 500 }
    );
  }
}
