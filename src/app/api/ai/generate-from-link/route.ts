import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import * as cheerio from 'cheerio';
import jwt from 'jsonwebtoken';
import { generateWebsiteContent as generateAIWebsiteContent } from '@/lib/ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '');

interface UserData {
  _id: ObjectId;
  plan: string;
  websiteCount: number;
}

// ---------------------------------------------------------------------------
// Resilient fetch helper
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

    const humanise = (slug: string): string =>
      slug
        .replace(/[-_]/g, ' ')
        .replace(/\b(\d{4})\b/g, '$1')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();

    const brandRaw = hostname.split('.')[0];
    const brand = humanise(brandRaw);

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
        !/^\d{4}$/.test(lower)
      );
    });

    const productSlug =
      candidateSegments[candidateSegments.length - 1] ||
      candidateSegments[0] ||
      pathSegments[pathSegments.length - 1] ||
      'product';

    const cleanSlug = productSlug.replace(/\.(html?|php|aspx?)$/i, '');
    const productName = humanise(cleanSlug);

    const yearMatch = pathSegments.join('/').match(/\b(20\d{2}|19\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : '';

    const title = year
      ? `${productName} (${year}) – ${brand}`
      : `${productName} – ${brand}`;

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
// Analyze product URL (local helper for metadata)
// ---------------------------------------------------------------------------
async function analyzeProductURL(url: string) {
  const productInfo = extractProductInfoFromUrl(url);
  try {
    const response = await fetchWithTimeout(url, { method: 'GET' }, 5000, 0);
    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      const title = $('title').text() || $('meta[property="og:title"]').attr('content');
      const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content');
      if (title) productInfo.title = title.trim().substring(0, 120);
      if (description) productInfo.description = description.trim().substring(0, 300);
    }
  } catch (err) {
    console.warn('[analyzeProductURL] Enrichment failed, using extracted info:', err);
  }
  return productInfo;
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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      },
      10_000,
      1
    );

    const html = await response.text();
    const $ = cheerio.load(html);

    const text = $('body')
      .find('script, style, nav, footer, header')
      .remove()
      .end()
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10_000);

    const images: string[] = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && src.startsWith('http') && images.length < 5) {
        images.push(src);
      }
    });

    return { text, images };
  } catch (error) {
    console.error('Scraping error:', error);
    return { text: '', images: [] };
  }
}

// ---------------------------------------------------------------------------
// URL helper
// ---------------------------------------------------------------------------
function generateAffilifyUrl(slug: string) {
  return `https://affilify.eu/sites/${slug}`;
}

// ---------------------------------------------------------------------------
// Generate website content with monetization injection
// ---------------------------------------------------------------------------
async function generateWebsiteContent(
  productInfo: any,
  scrapedData: any,
  monetization: any,
  aiGeneratedContent: any
) {
  const { primaryMethod, affiliateLinks, displayAds, digitalProducts, sponsorships, secondaryMethods } = monetization || {};

  // Build the final affiliate URL with SubID if provided
  let finalAffiliateUrl = productInfo.originalUrl;
  if (primaryMethod === 'affiliateLinks' && affiliateLinks) {
    const url = new URL(affiliateLinks.productUrl || productInfo.originalUrl);
    if (affiliateLinks.affiliateId) {
      url.searchParams.set('tag', affiliateLinks.affiliateId);
    }
    if (affiliateLinks.subId) {
      url.searchParams.set('subid', affiliateLinks.subId);
    }
    finalAffiliateUrl = url.toString();
  }

  // AdSense Injection
  let adsenseScript = '';
  if (displayAds?.enabled && displayAds.adsensePublisherId) {
    adsenseScript = `
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${displayAds.adsensePublisherId}"
     crossorigin="anonymous"></script>
    `;
  }

  // Custom Scripts
  const headerScript = secondaryMethods?.customTrackingScript?.enabled ? secondaryMethods.customTrackingScript.headerScript : '';
  const bodyScript = secondaryMethods?.customTrackingScript?.enabled ? secondaryMethods.customTrackingScript.bodyScript : '';

  // Email Signup Form
  let emailFormHtml = '';
  if (secondaryMethods?.emailSignup?.enabled) {
    emailFormHtml = `
      <section class="email-signup" style="padding: 60px 0; background: #f0f4f8; text-align: center;">
        <div class="container">
          <h2>Get Exclusive Updates</h2>
          <p>Join our newsletter to receive the latest deals and product reviews.</p>
          <form action="${secondaryMethods.emailSignup.espFormActionUrl || '#'}" method="POST" style="max-width: 500px; margin: 20px auto; display: flex; gap: 10px;">
            <input type="email" name="email" placeholder="Your email address" required style="flex: 1; padding: 12px; border: 1px solid #ccc; border-radius: 5px;">
            <button type="submit" style="background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer;">Subscribe</button>
          </form>
        </div>
      </section>
    `;
  }

  // Sponsorship Section
  let sponsorshipHtml = '';
  if (sponsorships?.enabled) {
    sponsorshipHtml = `
      <section class="sponsorship" style="padding: 40px 0; border-top: 1px solid #eee; text-align: center;">
        <div class="container">
          <p style="color: #666; font-style: italic;">Interested in partnering with us? <a href="mailto:sponsorships@affilify.eu?subject=Sponsorship Inquiry for ${productInfo.title}">Contact us here</a>.</p>
        </div>
      </section>
    `;
  }

  // Digital Product Promotion
  let digitalProductHtml = '';
  if (primaryMethod === 'digitalProducts' && digitalProducts) {
    digitalProductHtml = `
      <div class="digital-product-promo" style="margin: 40px 0; padding: 30px; background: #fffbeb; border: 2px dashed #f59e0b; border-radius: 15px; text-align: center;">
        <h3 style="color: #92400e;">Special Offer: ${digitalProducts.name}</h3>
        <p>${digitalProducts.description}</p>
        <a href="${digitalProducts.salesPageUrl}" class="cta-button" style="background: #f59e0b;">Get the Guide Now</a>
      </div>
    `;
  }

  // Use AI generated content if available, otherwise fallback to basic structure
  const hero = aiGeneratedContent?.content?.hero || {
    headline: productInfo.title,
    subheadline: productInfo.description,
    ctaText: `Get Started with ${productInfo.title}`
  };

  const features = aiGeneratedContent?.content?.features || [
    { title: 'Premium Performance', description: `Engineered for excellence, ${productInfo.title} delivers unmatched results in its category.`, icon: '🚀' },
    { title: 'Exceptional Value', description: 'Invest in quality that lasts. This product offers the best price-to-performance ratio on the market.', icon: '💎' }
  ];

  const benefits = aiGeneratedContent?.content?.benefits || [];
  const testimonials = aiGeneratedContent?.content?.testimonials || [];
  const faq = aiGeneratedContent?.content?.faq || [];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${aiGeneratedContent?.seo?.title || productInfo.title + ' - Expert Review'}</title>
    <meta name="description" content="${aiGeneratedContent?.seo?.description || productInfo.description}">
    <meta name="keywords" content="${aiGeneratedContent?.seo?.keywords?.join(', ') || ''}">
    ${adsenseScript}
    ${headerScript}
    <style>
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; margin: 0; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        .hero { padding: 100px 0; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; text-align: center; }
        .hero h1 { font-size: 3.5rem; margin-bottom: 20px; }
        .hero p { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
        .cta-button { background: #2563eb; color: white; padding: 15px 35px; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; text-decoration: none; display: inline-block; transition: transform 0.2s; }
        .cta-button:hover { transform: translateY(-2px); }
        .features { padding: 80px 0; background: #f8fafc; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-top: 50px; }
        .feature { padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .feature h3 { color: #1e293b; margin-bottom: 15px; }
        .benefits { padding: 80px 0; }
        .benefit-list { list-style: none; padding: 0; max-width: 800px; margin: 40px auto; }
        .benefit-item { margin-bottom: 20px; padding-left: 30px; position: relative; }
        .benefit-item::before { content: '✓'; position: absolute; left: 0; color: #2563eb; font-weight: bold; }
        .testimonials { padding: 80px 0; background: #f1f5f9; }
        .testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .testimonial-card { padding: 30px; background: white; border-radius: 12px; font-style: italic; }
        .faq { padding: 80px 0; }
        .faq-item { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .faq-question { font-weight: bold; font-size: 1.2rem; color: #1e293b; margin-bottom: 10px; }
        @media (max-width: 768px) { .hero h1 { font-size: 2.5rem; } }
    </style>
</head>
<body>
    ${bodyScript}
    <section class="hero">
        <div class="container">
            <h1>${hero.headline}</h1>
            <p>${hero.subheadline}</p>
            <a href="${finalAffiliateUrl}" class="cta-button">${hero.ctaText}</a>
        </div>
    </section>

    <div class="container">
      ${digitalProductHtml}
    </div>

    <section class="features">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem;">Key Features</h2>
            <div class="feature-grid">
                ${features.map((f: any) => `
                <div class="feature">
                    <div style="font-size: 2rem; margin-bottom: 15px;">${f.icon || '✨'}</div>
                    <h3>${f.title}</h3>
                    <p>${f.description}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    ${benefits.length > 0 ? `
    <section class="benefits">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem;">Why Choose This?</h2>
            <ul class="benefit-list">
                ${benefits.map((b: any) => `
                <li class="benefit-item">
                    <strong>${b.title}:</strong> ${b.description}
                </li>
                `).join('')}
            </ul>
        </div>
    </section>
    ` : ''}

    ${testimonials.length > 0 ? `
    <section class="testimonials">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem;">What Users Say</h2>
            <div class="testimonial-grid">
                ${testimonials.map((t: any) => `
                <div class="testimonial-card">
                    <p>"${t.text}"</p>
                    <div style="margin-top: 15px; font-weight: bold; color: #2563eb;">- ${t.name}</div>
                    <div style="color: #f59e0b;">${'★'.repeat(t.rating || 5)}</div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${faq.length > 0 ? `
    <section class="faq">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem;">Frequently Asked Questions</h2>
            <div style="max-width: 800px; margin: 40px auto;">
                ${faq.map((f: any) => `
                <div class="faq-item">
                    <div class="faq-question">${f.question}</div>
                    <div class="faq-answer">${f.answer}</div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${emailFormHtml}
    ${sponsorshipHtml}

    <footer style="padding: 40px 0; background: #0f172a; color: white; text-align: center;">
      <div class="container">
        <p>&copy; ${new Date().getFullYear()} ${productInfo.brand || 'Affilify'}. All rights reserved.</p>
        <p style="font-size: 0.8rem; opacity: 0.6; margin-top: 10px;">Affiliate Disclosure: We may earn a commission when you click through our links.</p>
      </div>
    </footer>
</body>
</html>`;
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

    const body = await request.json();
    const { productUrl, monetization, plan, niche, template, userInput, dnaContext } = body;

    // Handle Content Studio generation request
    if (userInput && dnaContext) {
      console.log('Generating content for Content Studio...');
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `
        You are an elite affiliate marketing AI agent. 
        Generate high-converting content based on the following Campaign DNA and User Brief.
        
        CAMPAIGN DNA:
        - Product: ${dnaContext.productName}
        - UVP: ${dnaContext.productUVP}
        - Brand Voice: ${dnaContext.brandVoice}
        - Target Audience: ${dnaContext.targetAudience}
        - Keywords: ${dnaContext.primaryKeywords?.join(', ')}
        
        USER BRIEF:
        ${userInput}
        
        AGENT TYPE: ${template || 'General Content'}
        
        The content should be persuasive, authentic, and optimized for conversions.
        Return the result in ${body.format || 'markdown'} format.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({
        success: true,
        title: `${dnaContext.productName} - ${template}`,
        content: text,
        seo: { score: 95 }
      });
    }

    // Handle standard website generation
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

    console.log('Generating comprehensive AI content...');
    // Use the elite generation logic from lib/ai.ts
    const aiGeneratedContent = await generateAIWebsiteContent({
      productUrl,
      niche: niche || 'Affiliate Marketing',
      targetAudience: body.targetAudience || 'Potential Customers',
      template: template || 'modern',
      tone: body.tone || 'professional',
      features: body.features || []
    });

    console.log('Generating professional website content with monetization…');
    const websiteHTML = await generateWebsiteContent(productInfo, scrapedData, monetization, aiGeneratedContent);

    const baseSlug = productInfo.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .substring(0, 30)
      .replace(/^-|-$/g, '');
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const slug = `${baseSlug}-${uniqueId}`;

    const liveUrl = generateAffilifyUrl(slug);

    const { db } = await connectToDatabase();

    const websiteData = {
      _id: new ObjectId(),
      userId: user._id,
      slug,
      title: aiGeneratedContent.title || productInfo.title,
      description: aiGeneratedContent.description || productInfo.description,
      productUrl,
      url: liveUrl,
      productInfo,
      status: 'published',
      template: template || 'modern',
      content: { html: websiteHTML },
      monetization,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        visitors: 0,
        pageViews: 0,
        conversions: 0,
        revenue: 0,
        conversionRate: 0
      },
      performance: {
        uptime: 100,
        loadTime: 0.8,
        seoScore: aiGeneratedContent.seo?.score || 95
      },
      isActive: true,
    };

    await db.collection('websites').insertOne(websiteData);
    await db.collection('users').updateOne({ _id: user._id }, { $inc: { websiteCount: 1 } });

    return NextResponse.json({
      success: true,
      website: {
        id: websiteData._id.toString(),
        slug,
        title: websiteData.title,
        description: websiteData.description,
        url: liveUrl,
      },
      message: 'Professional affiliate website created and deployed successfully!',
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
    const jwtSecret = process.env.JWT_SECRET || 'affilify_jwt_2025_romania_student_success_portocaliu_orange_power_gaming_affiliate_marketing_revolution_secure_token_generation_system_v1';
    let decoded: any;

    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (e) {
      return null;
    }

    if (!decoded || !decoded.userId) return null;

    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    return user as UserData | null;
  } catch (error) {
    return null;
  }
}

function getPlanLimits(plan: string) {
  switch (plan) {
    case 'basic':      return { websites: 3 };
    case 'pro':        return { websites: 10 };
    case 'enterprise': return { websites: 999 };
    default:           return { websites: 3 };
  }
}
