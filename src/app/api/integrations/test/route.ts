import { NextRequest, NextResponse } from 'next/server';
import { sendGridService } from '@/lib/sendgrid';
import { zapierService } from '@/lib/zapier';
import { microsoftClarity } from '@/lib/microsoft-clarity';
import { googleAnalytics } from '@/lib/google-analytics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { integration } = body;

    if (!integration) {
      return NextResponse.json({
        success: false,
        error: 'Integration type is required',
      }, { status: 400 });
    }

    let result: any = {};

    switch (integration) {
      case 'sendgrid':
        result = await testSendGrid();
        break;

      case 'zapier':
        result = await testZapier();
        break;

      case 'clarity':
        result = testMicrosoftClarity();
        break;

      case 'analytics':
        result = await testGoogleAnalytics();
        break;

      case 'all':
        result = await testAllIntegrations();
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid integration type',
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Integration test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

async function testSendGrid() {
  try {
    const testResult = await sendGridService.sendEmail({
      to: 'test@example.com',
      subject: 'AFFILIFY Integration Test',
      html: '<h1>SendGrid Integration Test</h1><p>This is a test email from AFFILIFY platform.</p>',
    });

    return {
      integration: 'SendGrid',
      status: testResult ? 'success' : 'failed',
      configured: !!process.env.SENDGRID_API_KEY,
      message: testResult ? 'Email sent successfully' : 'Failed to send email',
    };
  } catch (error) {
    return {
      integration: 'SendGrid',
      status: 'error',
      configured: !!process.env.SENDGRID_API_KEY,
      message: `Error: ${error}`,
    };
  }
}

async function testZapier() {
  try {
    const testResult = await zapierService.testWebhook();

    return {
      integration: 'Zapier',
      status: testResult ? 'success' : 'failed',
      configured: !!process.env.ZAPIER_WEBHOOK_URL,
      message: testResult ? 'Webhook sent successfully' : 'Failed to send webhook',
      config: zapierService.getConfig(),
    };
  } catch (error) {
    return {
      integration: 'Zapier',
      status: 'error',
      configured: !!process.env.ZAPIER_WEBHOOK_URL,
      message: `Error: ${error}`,
    };
  }
}

function testMicrosoftClarity() {
  try {
    const config = microsoftClarity.getConfig();

    return {
      integration: 'Microsoft Clarity',
      status: config.enabled ? 'configured' : 'not_configured',
      configured: config.enabled,
      message: config.enabled 
        ? `Clarity configured with project ID: ${config.projectId}` 
        : 'Clarity not configured',
      config,
    };
  } catch (error) {
    return {
      integration: 'Microsoft Clarity',
      status: 'error',
      configured: false,
      message: `Error: ${error}`,
    };
  }
}

async function testGoogleAnalytics() {
  try {
    const realtimeData = await googleAnalytics.getRealtimeData();

    return {
      integration: 'Google Analytics',
      status: 'success',
      configured: !!(process.env.GOOGLE_ANALYTICS_PROPERTY_ID && 
                     process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && 
                     process.env.GOOGLE_PRIVATE_KEY),
      message: 'Analytics data retrieved successfully',
      sampleData: {
        activeUsers: realtimeData.activeUsers,
        pageViews: realtimeData.pageViews,
      },
    };
  } catch (error) {
    return {
      integration: 'Google Analytics',
      status: 'error',
      configured: !!(process.env.GOOGLE_ANALYTICS_PROPERTY_ID && 
                     process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && 
                     process.env.GOOGLE_PRIVATE_KEY),
      message: `Error: ${error}`,
    };
  }
}

async function testAllIntegrations() {
  const [sendgridResult, zapierResult, clarityResult, analyticsResult] = await Promise.all([
    testSendGrid(),
    testZapier(),
    Promise.resolve(testMicrosoftClarity()),
    testGoogleAnalytics(),
  ]);

  const allResults = [sendgridResult, zapierResult, clarityResult, analyticsResult];
  const successCount = allResults.filter(r => r.status === 'success' || r.status === 'configured').length;

  return {
    summary: {
      total: allResults.length,
      successful: successCount,
      failed: allResults.length - successCount,
      overallStatus: successCount === allResults.length ? 'all_working' : 'partial_working',
    },
    integrations: allResults,
    timestamp: new Date().toISOString(),
  };
}

