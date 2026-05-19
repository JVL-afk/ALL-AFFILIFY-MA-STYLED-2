import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { html, data } = await request.json();
    const { name, salesPageUrl } = data;
    let modifiedHtml = html;

    if (name && salesPageUrl) {
      const productBanner = `
        <div class="digital-product-banner" style="background: #f0f7ff; border: 2px solid #0070f3; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h3 style="color: #0070f3; margin-bottom: 10px;">Special Offer: ${name}</h3>
          <p style="margin-bottom: 15px;">Check out our exclusive digital product to accelerate your results!</p>
          <a href="${salesPageUrl}" style="background: #0070f3; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Get it Now</a>
        </div>
      `;

      // Inject before the footer or at the end of body
      if (modifiedHtml.includes('</footer>')) {
        modifiedHtml = modifiedHtml.replace('</footer>', `${productBanner}</footer>`);
      } else {
        modifiedHtml = modifiedHtml.replace('</body>', `${productBanner}</body>`);
      }
    }

    return NextResponse.json({ html: modifiedHtml });
  } catch (error) {
    console.error('Digital products monetization error:', error);
    return NextResponse.json({ error: 'Failed to process monetization' }, { status: 500 });
  }
}
