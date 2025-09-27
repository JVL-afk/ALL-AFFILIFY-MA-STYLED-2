import { NextRequest, NextResponse } from 'next/server';
import { sendGridService } from '@/lib/sendgrid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({
        success: false,
        error: 'Missing email type or data',
      }, { status: 400 });
    }

    let result = false;

    switch (type) {
      case 'welcome':
        if (!data.userName || !data.userEmail) {
          return NextResponse.json({
            success: false,
            error: 'Missing userName or userEmail for welcome email',
          }, { status: 400 });
        }
        result = await sendGridService.sendWelcomeEmail(data);
        break;

      case 'website-created':
        if (!data.userName || !data.userEmail || !data.websiteName || !data.websiteUrl) {
          return NextResponse.json({
            success: false,
            error: 'Missing required data for website created email',
          }, { status: 400 });
        }
        result = await sendGridService.sendWebsiteCreatedEmail(data);
        break;

      case 'password-reset':
        if (!data.userName || !data.userEmail || !data.resetLink) {
          return NextResponse.json({
            success: false,
            error: 'Missing required data for password reset email',
          }, { status: 400 });
        }
        result = await sendGridService.sendPasswordResetEmail(data);
        break;

      case 'subscription-confirmation':
        if (!data.userEmail || !data.userName || !data.planName) {
          return NextResponse.json({
            success: false,
            error: 'Missing required data for subscription confirmation email',
          }, { status: 400 });
        }
        result = await sendGridService.sendSubscriptionConfirmationEmail(
          data.userEmail,
          data.userName,
          data.planName
        );
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid email type',
        }, { status: 400 });
    }

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send email',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

