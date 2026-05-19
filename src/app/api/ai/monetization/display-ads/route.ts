import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { html, data } = await request.json();
    const { adsensePublisherId, premiumAdNetworkId } = data;
    let modifiedHtml = html;

    let adScript = '';
    if (adsensePublisherId) {
      adScript += `
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}" crossorigin="anonymous"></script>
        <ins class="adsbygoogle" style="display:block" data-ad-client="${adsensePublisherId}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      `;
    }

    if (premiumAdNetworkId) {
      if (premiumAdNetworkId.startsWith('http')) {
        adScript += `<script src="${premiumAdNetworkId}" async></script>`;
      } else {
        adScript += `<!-- Premium Ad Network ID: ${premiumAdNetworkId} -->`;
      }
    }

    if (adScript) {
      // Inject into sidebar or after first paragraph if possible, otherwise at the end of body
      if (modifiedHtml.includes('</aside>')) {
        modifiedHtml = modifiedHtml.replace('</aside>', `${adScript}</aside>`);
      } else if (modifiedHtml.includes('</p>')) {
        modifiedHtml = modifiedHtml.replace('</p>', `</p>${adScript}`);
      } else {
        modifiedHtml = modifiedHtml.replace('</body>', `${adScript}</body>`);
      }
    }

    return NextResponse.json({ html: modifiedHtml });
  } catch (error) {
    console.error('Display ads monetization error:', error);
    return NextResponse.json({ error: 'Failed to process monetization' }, { status: 500 });
  }
}
