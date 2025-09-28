// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendSubscriptionPaymentEmail, sendSubscriptionConfirmationEmail, sendDonationConfirmationEmail, sendSubscriptionCancelledEmail } from '@/lib/donation-emails';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.metadata?.type === 'donation') {
    // Update one-time donation
    const donation = await prisma.donation.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (!donation) {
      throw new Error('Donation not found');
    }
    await prisma.donation.update({
      where: { stripeSessionId: session.id },
      data: {
        status: 'completed',
        stripePaymentIntentId: session.payment_intent as string,
        completedAt: new Date(),
      },
    });

    await sendDonationConfirmationEmail(donation);

  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error('User not found');
  }
  await prisma.subscription.create({
    data: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0]?.price.id,
      amount: subscription.items.data[0]?.price.unit_amount || 0,
      interval: subscription.items.data[0]?.price.recurring?.interval || 'month',
      status: subscription.status,
      currentPeriodStart: new Date(subscription.items.data[0]?.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.items.data[0]?.current_period_end * 1000),
    },
  });

  const storedSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (!storedSubscription) {
    throw new Error('Subscription not found');
  }
  await sendSubscriptionConfirmationEmail(storedSubscription, user.email, user.name || "");

}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.items.data[0]?.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.items.data[0]?.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'canceled',
      canceledAt: new Date(),
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: subscription.metadata?.userId },
  });
  if (!user) {
    throw new Error('User not found');
  }

  const storedSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (!storedSubscription) {
    throw new Error('Subscription not found');
  }
  await sendSubscriptionCancelledEmail(storedSubscription, user.email, user.name || "", storedSubscription.cancelReason || "");

  
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
    // Check if this invoice has subscription line items
    // Subscription invoices will have line items with subscription details
    if (invoice.lines && invoice.lines.data && invoice.lines.data.length > 0) {
      const firstLineItem = invoice.lines.data[0];
      
      // Check if the line item has a subscription ID
      if (firstLineItem.subscription && typeof firstLineItem.subscription === 'string') {
        try {
          const subscriptionId = await getSubscriptionId(firstLineItem.subscription);
          await prisma.subscriptionPayment.create({
            data: {
              subscriptionId,
              stripeInvoiceId: invoice.id as string,
              amount: invoice.amount_paid,
              status: 'paid',
              periodStart: new Date(invoice.period_start * 1000),
              periodEnd: new Date(invoice.period_end * 1000),
              paidAt: new Date(),
            },
          });
  
          // Send subscription payment confirmation email
          await sendSubscriptionPaymentEmail(invoice, firstLineItem.subscription);
        } catch (error) {
          console.error('Error processing subscription payment:', error);
        }
      }
    }
  }

async function getSubscriptionId(stripeSubscriptionId: string): Promise<number> {
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId },
    select: { id: true },
  });
  return subscription!.id;
}