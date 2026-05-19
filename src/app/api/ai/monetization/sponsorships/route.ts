import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { html, data } = await request.json();
    const { pitch } = data;
    let modifiedHtml = html;

    if (pitch) {
      const sponsorshipSection = `
        <section class="sponsorship-section" style="padding: 40px 0; background: #fafafa; border-top: 1px solid #eaeaea;">
          <div style="max-width: 800px; margin: 0 auto; text-align: center; padding: 0 20px;">
            <h2 style="margin-bottom: 20px;">Partner With Us</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">${pitch}</p>
            <a href="mailto:admin@affilify.eu?subject=Sponsorship Inquiry" style="color: #0070f3; text-decoration: underline;">Contact us for sponsorship opportunities</a>
          </div>
        </section>
      `;

      // Inject before body end
      modifiedHtml = modifiedHtml.replace('</body>', `${sponsorshipSection}</body>`);
    }

    return NextResponse.json({ html: modifiedHtml });
  } catch (error) {
    console.error('Sponsorships monetization error:', error);
    return NextResponse.json({ error: 'Failed to process monetization' }, { status: 500 });
  }
}
