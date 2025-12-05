import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import * as cheerio from 'cheerio';
import JSZip from 'jszip';
import jwt from 'jsonwebtoken';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function scrapeProductData(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract key information
    const title = $("h1").first().text().trim();
    const description = $("meta[name=\"description\"]").attr("content") || $("p").first().text().trim();
    const price = $(".price").first().text().trim() || $(".product-price").first().text().trim();
    const images = Array.from($("img")).map(img => {
      const src = $(img).attr("src");
      if (src) {
        try {
          // Resolve relative URLs to absolute URLs
          return new URL(src, url).href;
        } catch (e) {
          return src;
        }
      }
      return null;
    }).filter((src): src is string => !!src && src.startsWith("http"));
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
      images: images.slice(0, 10), // Limit to 10 images
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
async function getUnsplashImages(query: string, count: number = 3) {
  try {
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY
    if (!unsplashApiKey) {
      console.log('Unsplash API key not found, using placeholder images')
      return generatePlaceholderImages(query, count)
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&order_by=relevant`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashApiKey}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()
    
    return data.results.map((photo: any) => ({
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      alt: photo.alt_description || query,
      credit: `Photo by ${photo.user.name} on Unsplash`,
      download_url: photo.links.download_location
    }))
  } catch (error) {
    console.error('Unsplash API error:', error)
    return generatePlaceholderImages(query, count)
  }
}

// Generate placeholder images if Unsplash fails
function generatePlaceholderImages(query: string, count: number) {
  const images = []
  for (let i = 0; i < count; i++) {
    images.push({
      url: \`https://via.placeholder.com/800x600/e0e0e0/333333?text=${encodeURIComponent(query.replace(/ /g, '+'))}\`,
      thumb: \`https://via.placeholder.com/400x300/e0e0e0/333333?text=${encodeURIComponent(query.replace(/ /g, '+'))}\`,
      alt: query,
      credit: 'Professional stock photo',
      download_url: null
    })
  }
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

    // Create a new site on Netlify
    const siteResponse = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: siteName,
        custom_domain: null
      })
    })

    if (!siteResponse.ok) {
      throw new Error(`Netlify site creation error: ${siteResponse.status}`)
    }

    const siteData = await siteResponse.json()
    const siteId = siteData.id

    // Deploy the HTML content
    const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/zip'
      },
      body: await createZipFromHTML(websiteHTML)
    })

    if (!deployResponse.ok) {
      throw new Error(`Netlify deploy error: ${deployResponse.status}`)
    }

    const deployData = await deployResponse.json()
    
    return {
      url: siteData.ssl_url || siteData.url,
      deploy_id: deployData.id,
      site_id: siteId,
      admin_url: siteData.admin_url
    }
  } catch (error) {
    console.error('Netlify deployment error:', error)
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
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  // Prioritize scraped images, fallback to Unsplash
  const scrapedImages = scrapedData.images || [];
  
  // Use scraped images for hero, fallback to Unsplash
  const heroImages = scrapedImages.length > 0 
    ? [{ url: scrapedImages[0], alt: `${productInfo.title} hero image`, credit: 'Scraped from product page', download_url: null }]
    : await getUnsplashImages(`${productInfo.title} product lifestyle`, 1);

  // Use scraped images for features, fallback to Unsplash
  const featureImages = scrapedImages.length > 1 
    ? scrapedImages.slice(1, 3).map((url: string) => ({ url, alt: `${productInfo.title} feature image`, credit: 'Scraped from product page', download_url: null }))
    : await getUnsplashImages(`${productInfo.title} benefits features`, 2);

  // Use Unsplash for testimonials as scraped images are unlikely to be testimonials
  const testimonialImages = await getUnsplashImages('happy customer testimonial', 1);
  
  const prompt = `You are the world's most elite product marketing expert and conversion optimization copywriter. Your mission is to create a highly compelling, conversion-optimized website to promote and sell the specific product described in the data. The website MUST be focused entirely on the product's features, benefits, and value proposition to the end consumer. DO NOT mention affiliate marketing, making money, or any business opportunity. Your goal is to drive the user to click the affiliate link to purchase the product.Here is the product data you have to work with: ${JSON.stringify(scrapedData)}.
Here are the high-quality image URLs you MUST use in the generated HTML for the hero section and features:
Hero Image: ${heroImages[0]?.url || 'NO_HERO_IMAGE'}
Feature Image 1: ${featureImages[0]?.url || 'NO_FEATURE_IMAGE_1'}
Feature Image 2: ${featureImages[1]?.url || 'NO_FEATURE_IMAGE_2'}
Testimonial Image: ${testimonialImages[0]?.url || 'NO_TESTIMONIAL_IMAGE'}
Now, create a unique, creative, conversion-optimized website with over 1000 lines of code. Do not use a restrictive output structure. Be creative. Include a competitor comparison section. Use niche-specific language. Include unique sections that competitors don't have. The primary call-to-action (CTA) should be a prominent button with the affiliate link. Do NOT insert any prices if you don't know the price exactly. Make each website unique (DON'T USE the same colors, if the scraped data and the website in general has a specific color that's recognizable, make that color the color of the writing)! Compare with REAL COMPETITORS of the product and specify the competitors names. Respond ONLY with the full code! Here is the affiliate information: affiliateId: ${affiliateId}, affiliateType: ${affiliateType};.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let websiteHTML = response.text();
    
    // Clean up the response to ensure it's valid HTML
    websiteHTML = websiteHTML.replace(/```html/g, '').replace(/```/g, '').trim();
    
    // If the response doesn't start with HTML, extract it
    if (!websiteHTML.toLowerCase().includes('<!doctype') && !websiteHTML.toLowerCase().includes('<html')) {
      // Try to find HTML content in the response
      const htmlMatch = websiteHTML.match(/<!DOCTYPE[\s\S]*<\/html>/i);
      if (htmlMatch) {
        websiteHTML = htmlMatch[0];
      } else {
        // Fallback to professional template
        websiteHTML = generateProfessionalTemplate(productInfo, heroImages, featureImages, testimonialImages);
      }
    }
    
    return websiteHTML;
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return generateProfessionalTemplate(productInfo, heroImages, featureImages, testimonialImages);
  }
}

// Professional fallback template with Unsplash images
function generateProfessionalTemplate(productInfo: any, heroImages: any[], featureImages: any[], testimonialImages: any[]) {
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
            <a href="${productInfo.originalUrl}" class="cta-button">Get ${productInfo.title} Now - ${productInfo.price}</a>
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
                <a href="${productInfo.originalUrl}" class="cta-button">Order ${productInfo.title} Today - ${productInfo.price}</a>
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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

    // Generate REAL website content using AI with Unsplash images
    console.log('Generating professional website content with Unsplash images...');
 const websiteHTML = await generateWebsiteContent({ productUrl }, productInfo, affiliateId, affiliateType);

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
      html: websiteHTML,
      productInfo,
      netlifyDeployment,
      status: 'draft',
      template: 'modern',
      content: {},
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

