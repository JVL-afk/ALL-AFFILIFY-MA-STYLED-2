// STRIPE CHECKOUT API - REAL MONEY PROCESSING
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

// AFFILIFY Pricing Plans
const PRICING_PLANS = {
  pro: {
    name: 'AFFILIFY Pro',
    price: 2900, // $29.00 in cents
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      '10 Professional Websites',
      'Advanced Analytics Dashboard',
      'AI-Powered Content Generation',
      'Email Marketing Integration',
      'Priority Support',
      'Custom Domains'
    ]
  },
  enterprise: {
    name: 'AFFILIFY Enterprise',
    price: 9900, // $99.00 in cents
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Unlimited Websites',
      'Advanced Analytics & Reporting',
      'AI Chatbot Integration',
      'Team Collaboration Tools',
      'API Management',
      'Custom Integrations',
      'White-label Solutions',
      'Dedicated Account Manager'
    ]
  }
};

// Verify user authentication
async function verifyUser(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'affilify_jwt_2025_romania_student_success_portocaliu_orange_power_gaming_affiliate_marketing_revolution_secure_token_generation_system') as any;
    
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    
    return user;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

// MAIN STRIPE CHECKOUT API
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

    const { plan } = await request.json();

    // Validate plan
    if (!plan || !PRICING_PLANS[plan as keyof typeof PRICING_PLANS]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const selectedPlan = PRICING_PLANS[plan as keyof typeof PRICING_PLANS];

    // Check if user is already on this plan or higher
    const currentPlan = user.plan || 'basic';
    if (currentPlan === plan) {
      return NextResponse.json(
        { error: `You are already on the ${selectedPlan.name} plan` },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPlan.name,
              description: `Upgrade to ${selectedPlan.name} - ${selectedPlan.features.join(', ')}`,
              images: ['https://affilify.eu/logo-stripe.png'], // Add your logo URL
            },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment (change to 'subscription' for recurring)
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://affilify.eu'}/dashboard?upgrade=success&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://affilify.eu'}/dashboard?upgrade=cancelled`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        plan: plan,
        upgradeType: 'plan_upgrade',
        timestamp: new Date().toISOString()
      },
      // Add customer details
      billing_address_collection: 'required',
      // Add tax calculation if needed
      automatic_tax: { enabled: false },
    });

    // Log the checkout session creation
    console.log('Stripe checkout session created:', {
      sessionId: session.id,
      userId: user._id.toString(),
      plan: plan,
      amount: selectedPlan.price
    });

    // Save checkout session to database for tracking
    const { db } = await connectToDatabase();
    await db.collection('checkout_sessions').insertOne({
      sessionId: session.id,
      userId: user._id,
      plan: plan,
      amount: selectedPlan.price,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      plan: selectedPlan.name,
      amount: selectedPlan.price / 100, // Convert back to dollars
      message: `Redirecting to secure payment for ${selectedPlan.name}...`
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { 
          error: 'Payment processing error',
          message: error.message,
          type: error.type
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        message: 'An error occurred while processing your upgrade request. Please try again.'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests to return pricing information
export async function GET() {
  return NextResponse.json({
    success: true,
    plans: {
      basic: {
        name: 'AFFILIFY Basic',
        price: 0,
        websites: 3,
        features: [
          '3 Professional Websites',
          'Basic Analytics',
          'AI Content Generation',
          'Community Support'
        ]
      },
      pro: {
        name: 'AFFILIFY Pro',
        price: 29,
        websites: 10,
        features: PRICING_PLANS.pro.features
      },
      enterprise: {
        name: 'AFFILIFY Enterprise', 
        price: 99,
        websites: 'Unlimited',
        features: PRICING_PLANS.enterprise.features
      }
    }
  });
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

