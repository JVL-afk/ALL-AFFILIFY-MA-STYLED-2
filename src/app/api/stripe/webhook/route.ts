// STRIPE WEBHOOK - HANDLE SUCCESSFUL PAYMENTS
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Handle Stripe webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Stripe webhook event received:', event.type);

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Processing successful payment:', {
        sessionId: session.id,
        userId: session.metadata?.userId,
        plan: session.metadata?.plan,
        amount: session.amount_total
      });

      // Extract metadata
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;

      if (!userId || !plan) {
        console.error('Missing metadata in checkout session:', session.metadata);
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      // Connect to database
      const { db } = await connectToDatabase();

      // Update user plan in database
      const updateResult = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            plan: plan,
            planUpdatedAt: new Date(),
            stripeCustomerId: session.customer,
            stripeSessionId: session.id,
            lastPaymentAmount: session.amount_total,
            lastPaymentDate: new Date()
          } 
        }
      );

      if (updateResult.matchedCount === 0) {
        console.error('User not found:', userId);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Update checkout session status
      await db.collection('checkout_sessions').updateOne(
        { sessionId: session.id },
        { 
          $set: { 
            status: 'completed',
            completedAt: new Date(),
            stripeCustomerId: session.customer,
            paymentIntentId: session.payment_intent
          } 
        }
      );

      // Log successful upgrade
      await db.collection('plan_upgrades').insertOne({
        userId: new ObjectId(userId),
        fromPlan: 'basic', // Could be enhanced to track previous plan
        toPlan: plan,
        amount: session.amount_total,
        currency: session.currency,
        stripeSessionId: session.id,
        stripeCustomerId: session.customer,
        paymentIntentId: session.payment_intent,
        createdAt: new Date()
      });

      console.log('User plan upgraded successfully:', {
        userId,
        newPlan: plan,
        amount: session.amount_total
      });

      // Send upgrade confirmation email (optional)
      try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (user?.email) {
          // You can add SendGrid email notification here
          console.log('Plan upgrade completed for user:', user.email);
        }
      } catch (emailError) {
        console.error('Failed to send upgrade email:', emailError);
        // Don't fail the webhook for email errors
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Plan upgraded successfully' 
      });
    }

    // Handle failed payments
    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Checkout session expired:', session.id);

      // Update checkout session status
      const { db } = await connectToDatabase();
      await db.collection('checkout_sessions').updateOne(
        { sessionId: session.id },
        { 
          $set: { 
            status: 'expired',
            expiredAt: new Date()
          } 
        }
      );

      return NextResponse.json({ 
        success: true, 
        message: 'Session expired' 
      });
    }

    // Handle payment failures
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      console.log('Payment failed:', paymentIntent.id);

      // You could add logic here to handle failed payments
      // such as sending notification emails or updating user status

      return NextResponse.json({ 
        success: true, 
        message: 'Payment failed handled' 
      });
    }

    // Log unhandled events
    console.log('Unhandled webhook event type:', event.type);

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received' 
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook endpoint verification)
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AFFILIFY Stripe webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
    },
  });
}

