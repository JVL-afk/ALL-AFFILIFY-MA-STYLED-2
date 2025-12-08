import sgMail from '@sendgrid/mail';

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}

interface WebsiteCreatedEmailData {
  userName: string;
  userEmail: string;  // ← Added this
  websiteName: string;
  websiteUrl: string;
}

interface PasswordResetEmailData {
  userName: string;
  userEmail: string;  // ← Added this
  resetLink: string;
}

class SendGridService {
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured. Email functionality will use mock mode.');
      return;
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.initialized = true;
  }

  async sendEmail(emailData: EmailTemplate): Promise<boolean> {
    if (!this.initialized) {
      console.log('SendGrid not initialized. Mock email sent:', emailData.subject);
      return true; // Return success for mock mode
    }

    try {
      const msg = {
        to: emailData.to,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@affilify.com',
          name: 'AFFILIFY Platform',
        },
        subject: emailData.subject,
        text: emailData.text || this.stripHtml(emailData.html),
        html: emailData.html,
      };

      await sgMail.send(msg);
      console.log('Email sent successfully to:', emailData.to);
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    const emailTemplate: EmailTemplate = {
      to: data.userEmail,
      subject: 'Welcome to AFFILIFY - Your AI-Powered Affiliate Marketing Platform!',
      html: this.getWelcomeEmailTemplate(data),
    };

    return this.sendEmail(emailTemplate);
  }

  async sendWebsiteCreatedEmail(data: WebsiteCreatedEmailData): Promise<boolean> {
    const emailTemplate: EmailTemplate = {
      to: data.userEmail,
      subject: `Your Website "${data.websiteName}" is Ready!`,
      html: this.getWebsiteCreatedTemplate(data),
    };

    return this.sendEmail(emailTemplate);
  }

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<boolean> {
    const emailTemplate: EmailTemplate = {
      to: data.userEmail,
      subject: 'Reset Your AFFILIFY Password',
      html: this.getPasswordResetTemplate(data),
    };

    return this.sendEmail(emailTemplate);
  }

  async sendSubscriptionConfirmationEmail(userEmail: string, userName: string, planName: string): Promise<boolean> {
    const emailTemplate: EmailTemplate = {
      to: userEmail,
      subject: `Welcome to AFFILIFY ${planName} Plan!`,
      html: this.getSubscriptionConfirmationTemplate(userName, planName),
    };

    return this.sendEmail(emailTemplate);
  }

  private getWelcomeEmailTemplate(data: WelcomeEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AFFILIFY</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Welcome to AFFILIFY!</h1>
            <p>Your AI-Powered Affiliate Marketing Journey Starts Now</p>
          </div>
          <div class="content">
            <h2>Hello ${data.userName}!</h2>
            <p>Thank you for joining AFFILIFY, the revolutionary AI-powered affiliate marketing platform that's transforming how entrepreneurs build and scale their online businesses.</p>
            
            <h3>🎯 What You Can Do Now:</h3>
            <ul>
              <li><strong>Create AI Websites:</strong> Generate professional affiliate websites in minutes</li>
              <li><strong>Analyze Performance:</strong> Get deep insights into your website's performance</li>
              <li><strong>Advanced Analytics:</strong> Track your success with real-time data</li>
              <li><strong>Email Marketing:</strong> Build and engage your audience</li>
              <li><strong>A/B Testing:</strong> Optimize your conversions</li>
            </ul>

            <div style="text-align: center;">
              <a href="https://affilify.eu/dashboard" class="button">Access Your Dashboard</a>
            </div>

            <h3>🚀 Quick Start Guide:</h3>
            <ol>
              <li>Complete your profile setup</li>
              <li>Create your first AI-powered website</li>
              <li>Analyze your website's performance</li>
              <li>Start driving traffic and conversions</li>
            </ol>

            <p>Need help? Our comprehensive documentation and support team are here to ensure your success.</p>
            
            <p>Welcome aboard!<br>
            <strong>The AFFILIFY Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 AFFILIFY Platform. All rights reserved.</p>
            <p>Visit us at <a href="https://affilify.eu">affilify.eu</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getWebsiteCreatedTemplate(data: WebsiteCreatedEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Website is Ready!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .website-preview { background: white; border: 2px solid #667eea; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Your Website is Live!</h1>
            <p>AI-Generated and Ready for Success</p>
          </div>
          <div class="content">
            <h2>Congratulations ${data.userName}!</h2>
            <p>Your AI-powered affiliate website "<strong>${data.websiteName}</strong>" has been successfully created and is now live!</p>
            
            <div class="website-preview">
              <h3>🌐 ${data.websiteName}</h3>
              <p>Your professional affiliate marketing website is ready to start generating conversions.</p>
              <a href="${data.websiteUrl}" class="button">View Your Website</a>
            </div>

            <h3>🚀 Next Steps:</h3>
            <ol>
              <li><strong>Customize:</strong> Fine-tune your website's content and design</li>
              <li><strong>Analyze:</strong> Use our analytics tools to track performance</li>
              <li><strong>Optimize:</strong> Run A/B tests to improve conversions</li>
              <li><strong>Scale:</strong> Drive traffic and maximize your earnings</li>
            </ol>

            <h3>📊 Available Tools:</h3>
            <ul>
              <li>Real-time analytics and performance tracking</li>
              <li>A/B testing for conversion optimization</li>
              <li>Email marketing integration</li>
              <li>Advanced reporting and insights</li>
            </ul>

            <div style="text-align: center;">
              <a href="https://affilify.eu/dashboard" class="button">Manage Your Websites</a>
            </div>

            <p>Ready to create more websites? Our AI can generate unlimited high-converting affiliate sites for your business.</p>
            
            <p>To your success!<br>
            <strong>The AFFILIFY Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 AFFILIFY Platform. All rights reserved.</p>
            <p>Visit us at <a href="https://affilify.eu">affilify.eu</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPasswordResetTemplate(data: PasswordResetEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>Secure Your AFFILIFY Account</p>
          </div>
          <div class="content">
            <h2>Hello ${data.userName}!</h2>
            <p>We received a request to reset your password for your AFFILIFY account. If you made this request, click the button below to reset your password.</p>
            
            <div style="text-align: center;">
              <a href="${data.resetLink}" class="button">Reset Your Password</a>
            </div>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>

            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${data.resetLink}</p>

            <p>If you didn't request a password reset, your account is still secure and no action is needed.</p>
            
            <p>Stay secure!<br>
            <strong>The AFFILIFY Security Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 AFFILIFY Platform. All rights reserved.</p>
            <p>Visit us at <a href="https://affilify.eu">affilify.eu</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getSubscriptionConfirmationTemplate(userName: string, planName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${planName} Plan!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .plan-features { background: white; border: 2px solid #667eea; border-radius: 10px; padding: 20px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to ${planName}!</h1>
            <p>Your Subscription is Active</p>
          </div>
          <div class="content">
            <h2>Congratulations ${userName}!</h2>
            <p>Your ${planName} subscription has been successfully activated. You now have access to all premium features of the AFFILIFY platform!</p>
            
            <div class="plan-features">
              <h3>🚀 Your ${planName} Features:</h3>
              ${planName === 'Pro' ? `
                <ul>
                  <li>✅ Unlimited AI website generation</li>
                  <li>✅ Advanced analytics and reporting</li>
                  <li>✅ A/B testing capabilities</li>
                  <li>✅ Email marketing integration</li>
                  <li>✅ Priority support</li>
                  <li>✅ Custom domain support</li>
                </ul>
              ` : `
                <ul>
                  <li>✅ Everything in Pro plan</li>
                  <li>✅ Team collaboration tools</li>
                  <li>✅ API access and management</li>
                  <li>✅ Custom integrations</li>
                  <li>✅ White-label solutions</li>
                  <li>✅ Dedicated account manager</li>
                  <li>✅ Advanced security features</li>
                </ul>
              `}
            </div>

            <div style="text-align: center;">
              <a href="https://affilify.eu/dashboard" class="button">Access Your Dashboard</a>
            </div>

            <h3>🎯 Get Started:</h3>
            <ol>
              <li>Explore your new premium features</li>
              <li>Create advanced AI-powered websites</li>
              <li>Set up your analytics and tracking</li>
              <li>Start scaling your affiliate business</li>
            </ol>

            <p>Need help getting started? Our premium support team is ready to assist you with onboarding and optimization.</p>
            
            <p>Here's to your success!<br>
            <strong>The AFFILIFY Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 AFFILIFY Platform. All rights reserved.</p>
            <p>Visit us at <a href="https://affilify.eu">affilify.eu</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}

export const sendGridService = new SendGridService();
export default SendGridService;

