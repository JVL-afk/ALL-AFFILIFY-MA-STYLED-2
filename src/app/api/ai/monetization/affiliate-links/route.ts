import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { html, data } = await request.json();
    if (!html || !data) {
      return NextResponse.json({ error: 'HTML and data are required' }, { status: 400 });
    }

    const { productUrl, affiliateId, subId } = data;
    let modifiedHtml = html;

    // Build the affiliate link
    let finalUrl = productUrl;
    if (affiliateId) {
      try {
        const urlObj = new URL(finalUrl);
        if (urlObj.hostname.includes('amazon.')) {
          urlObj.searchParams.set('tag', affiliateId);
        } else if (urlObj.hostname.includes('ebay.')) {
          urlObj.searchParams.set('campid', affiliateId);
        } else {
          urlObj.searchParams.set('affid', affiliateId);
        }
        finalUrl = urlObj.toString();
      } catch (e) {
        console.error('URL processing error:', e);
      }
    }

    if (subId) {
      try {
        const urlObj = new URL(finalUrl);
        urlObj.searchParams.set('subid', subId);
        finalUrl = urlObj.toString();
      } catch (e) {
        console.error('SubID processing error:', e);
      }
    }

    // Replace all hrefs that look like product links or are placeholders
    // This is a robust regex for CTA links
    modifiedHtml = modifiedHtml.replace(/href=["']([^"']*)["']/g, (match: string, p1: string) => {
      if (p1 === '#' || p1 === '' || p1.includes('amazon.com') || p1.includes('ebay.com') || p1 === productUrl) {
        return `href="${finalUrl}"`;
      }
      return match;
    });

    return NextResponse.json({ html: modifiedHtml });
  } catch (error) {
    console.error('Affiliate links monetization error:', error);
    return NextResponse.json({ error: 'Failed to process monetization' }, { status: 500 });
  }
}
