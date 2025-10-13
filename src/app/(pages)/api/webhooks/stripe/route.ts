// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { handleStripeWebhook } from '@/lib/webhooks'; // Move your handler to lib/webhook.ts

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  console.log('=== WEBHOOK RECEIVED ===');
  
  try {
    // Get the raw body
    const body = await request.text();
    const signature = (await headers()).get('stripe-signature');


    console.log('body in webhook handler', body);
    console.log('signature in webhook handler', signature);

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json({ 
        error: 'Missing stripe-signature header' 
      }, { status: 400 });
    }

    if (!process.env.STRIPE_SHOP_WEBHOOK_SECRET) {
      console.error('STRIPE_SHOP_WEBHOOK_SECRET not configured');
      return NextResponse.json({ 
        error: 'Webhook secret not configured' 
      }, { status: 500 });
    }

    console.log('Verifying webhook signature...');

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_SHOP_WEBHOOK_SECRET!
      );

      console.log('event in stripe webhook handler', event);
      
      console.log('✅ Webhook signature verified');
      console.log('Event type:', event.type);
      console.log('Event ID:', event.id);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json({ 
        error: `Webhook signature verification failed: ${err}` 
      }, { status: 400 });
    }

    // Process the webhook
    console.log('Processing webhook event...');
    const result = await handleStripeWebhook(event);
    
    if (result.status === 'SUCCESS') {
      console.log('✅ Webhook processed successfully:', result);
      return NextResponse.json({ 
        received: true,
        orderId: result.data?.orderId 
      });
    } else {
      console.error('❌ Webhook processing failed:', result.error);
      return NextResponse.json({ 
        error: result.error 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Webhook route error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ 
    error: 'Method not allowed' 
  }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ 
    error: 'Method not allowed' 
  }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ 
    error: 'Method not allowed' 
  }, { status: 405 });
}