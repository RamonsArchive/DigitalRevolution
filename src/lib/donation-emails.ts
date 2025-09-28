// lib/donation-emails.ts
import "server-only";
import resend from "@/lib/resend";
import type { Donation, Subscription, SubscriptionPayment } from "../../prisma/generated/prisma";
import Stripe from 'stripe';
import { prisma } from "@/lib/prisma";

const F = {
  money(cents: number, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format((cents || 0) / 100);
  },
  date(d: Date | string | null | undefined) {
    if (!d) return "";
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  },
  esc(s: string) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },
};

const EMAIL_STYLES = `
<style>
  body { margin:0; background:#f4f4f4; color:#333; font-family: Arial, sans-serif; }
  .container { max-width:600px; margin:0 auto; padding:20px; }
  .card { background:#fff; border:1px solid #e9ecef; border-radius:8px; padding:20px; margin-bottom:16px; }
  .header { background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; border-radius:8px; padding:24px; text-align:center; }
  .logo { width:120px; height:auto; margin:0 auto 16px; display:block; }
  .brand { font-size:14px; opacity:0.9; margin:0 0 8px; }
  h1 { margin:0; font-size:24px; }
  .muted { color:#6c757d; font-size:12px; }
  .k { font-weight:600; }
  .highlight { background:#e8f5e8; border-left:4px solid #28a745; padding:16px; border-radius:0 6px 6px 0; margin:16px 0; }
  .btn { display:inline-block; background:#007bff; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; margin:8px 4px; font-weight:700; }
  .btn.donate { background:#28a745; }
  .impact { background:#f8f9fa; border-radius:6px; padding:16px; margin:16px 0; }
  .footer { text-align:center; color:#6c757d; font-size:12px; margin-top:20px; }
  @media (max-width:600px){ .container{padding:12px;} .header{padding:18px;} }
</style>
`;

// 1. One-time donation confirmation email
export async function sendDonationConfirmationEmail(donation: Donation) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Thank You for Your Donation</title>
    ${EMAIL_STYLES}
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/Assets/Logos/lightDRLogo.svg" alt="Digital Revolution" class="logo" />
        <div class="brand">Digital Revolution</div>
        <h1>Thank You!</h1>
        <div class="muted">Your donation makes a real difference</div>
      </div>

      <div class="card">
        <h2 style="margin:0 0 16px; color:#28a745;">Donation Confirmed</h2>
        <div class="highlight">
          <strong>Amount: ${F.money(donation.amount, donation.currency)}</strong><br/>
          <span class="muted">Donation Date: ${F.date(donation.completedAt)}</span><br/>
          <span class="muted">Reference: ${donation.stripePaymentIntentId}</span>
        </div>
        <p>Dear ${F.esc(donation.donorName || "Supporter")},</p>
        <p>Thank you for your generous donation to Digital Revolution! Your contribution of <strong>${F.money(donation.amount, donation.currency)}</strong> helps us bridge the digital divide and create STEM education opportunities for underserved communities.</p>
      </div>

      <div class="card impact">
        <h3 style="margin:0 0 12px;">Your Impact</h3>
        <p><strong>50% of your donation</strong> goes directly to our digital equity and STEM education initiatives:</p>
        <ul>
          <li>Digital literacy training for individuals and families</li>
          <li>Internet access support for communities in need</li>
          <li>STEM education pathways and coding bootcamp scholarships</li>
          <li>Community technology centers and resources</li>
        </ul>
        <p><em>You're helping create pathways from digital exclusion to technology careers!</em></p>
      </div>

      <div class="card" style="text-align:center;">
        <h3>Keep Supporting Our Mission</h3>
        <a class="btn donate" href="${process.env.NEXT_PUBLIC_APP_URL}/shop">Shop Our Store</a>
        <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/about">Learn More</a>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} Digital Revolution. Creating digital equity and STEM opportunities.</p>
        <p class="muted">This serves as your donation receipt. Keep for tax records.</p>
      </div>
    </div>
  </body></html>`;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || "Digital Revolution <onboarding@resend.dev>",
    to: donation.donorEmail,
    subject: `Thank you for your donation! - Digital Revolution`,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return { ok: true };
}

// 2. Monthly subscription confirmation email
export async function sendSubscriptionConfirmationEmail(subscription: Subscription, userEmail: string, userName?: string) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Monthly Subscription Confirmed</title>
    ${EMAIL_STYLES}
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/Assets/Logos/lightDRLogo.svg" alt="Digital Revolution" class="logo" />
        <div class="brand">Digital Revolution</div>
        <h1>Welcome, Monthly Supporter!</h1>
        <div class="muted">Your recurring donation is now active</div>
      </div>

      <div class="card">
        <h2 style="margin:0 0 16px; color:#28a745;">Monthly Subscription Active</h2>
        <div class="highlight">
          <strong>Monthly Amount: ${F.money(subscription.amount, subscription.currency)}</strong><br/>
          <span class="muted">Started: ${F.date(subscription.createdAt)}</span><br/>
          <span class="muted">Next Payment: ${F.date(subscription.currentPeriodEnd)}</span>
        </div>
        <p>Dear ${F.esc(userName || "Supporter")},</p>
        <p>Thank you for setting up a monthly donation of <strong>${F.money(subscription.amount, subscription.currency)}</strong>! Your ongoing support enables us to plan long-term programs and provide consistent support to communities working to bridge the digital divide.</p>
        <p><strong>You can cancel anytime</strong> through your account dashboard or by contacting us.</p>
      </div>

      <div class="card impact">
        <h3 style="margin:0 0 12px;">Your Monthly Impact</h3>
        <p>With <strong>${F.money(subscription.amount, subscription.currency)}</strong> monthly, you're providing:</p>
        <ul>
          <li>Sustained funding for digital literacy programs</li>
          <li>Consistent support for STEM education initiatives</li>
          <li>Reliable resources for community technology centers</li>
          <li>Long-term planning for digital equity projects</li>
        </ul>
        <p><em>Monthly supporters are the backbone of our mission!</em></p>
      </div>

      <div class="card" style="text-align:center;">
        <h3>Manage Your Subscription</h3>
        <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/account">Account Dashboard</a>
        <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/about">Our Mission</a>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} Digital Revolution. Creating digital equity and STEM opportunities.</p>
        <p class="muted">You'll receive monthly receipts and impact updates.</p>
      </div>
    </div>
  </body></html>`;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || "Digital Revolution <onboarding@resend.dev>",
    to: userEmail,
    subject: `Monthly subscription confirmed - Welcome to Digital Revolution!`,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return { ok: true };
}

// 3. Subscription payment receipt email (monthly)
export async function sendSubscriptionPaymentEmail(invoice: Stripe.Invoice, subscriptionId: string) {
  // Get subscription details from database
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
    include: { user: true }
  });

  if (!subscription) {
    throw new Error('Subscription not found for invoice');
  }

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Monthly Payment Received</title>
    ${EMAIL_STYLES}
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/Assets/Logos/lightDRLogo.svg" alt="Digital Revolution" class="logo" />
        <div class="brand">Digital Revolution</div>
        <h1>Payment Received</h1>
        <div class="muted">Thank you for your continued support</div>
      </div>

      <div class="card">
        <h2 style="margin:0 0 16px; color:#28a745;">Monthly Payment Processed</h2>
        <div class="highlight">
          <strong>Amount: ${F.money(invoice.amount_paid)}</strong><br/>
          <span class="muted">Payment Date: ${F.date(new Date(invoice.created * 1000))}</span><br/>
          <span class="muted">Period: ${F.date(new Date(invoice.period_start * 1000))} - ${F.date(new Date(invoice.period_end * 1000))}</span><br/>
          <span class="muted">Invoice: ${invoice.id}</span>
        </div>
        <p>Dear ${F.esc(subscription.user?.name || "Supporter")},</p>
        <p>Your monthly donation of <strong>${F.money(invoice.amount_paid)}</strong> has been successfully processed. Thank you for your continued commitment to bridging the digital divide!</p>
        <p>This payment covers your subscription from ${F.date(new Date(invoice.period_start * 1000))} to ${F.date(new Date(invoice.period_end * 1000))}.</p>
      </div>

      <div class="card impact">
        <h3 style="margin:0 0 12px;">This Month's Impact</h3>
        <p>Your ${F.money(invoice.amount_paid)} contribution this month helps fund:</p>
        <ul>
          <li>Digital literacy workshops for families</li>
          <li>Internet connectivity support</li>
          <li>STEM education resources and mentorship</li>
          <li>Community technology infrastructure</li>
        </ul>
        <p><em>Your monthly support creates lasting change!</em></p>
      </div>

      <div class="card" style="text-align:center;">
        <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/account">Manage Subscription</a>
        <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/impact">View Impact Report</a>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} Digital Revolution. Creating digital equity and STEM opportunities.</p>
        <p class="muted">This serves as your monthly donation receipt. Keep for tax records.</p>
      </div>
    </div>
  </body></html>`;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || "Digital Revolution <onboarding@resend.dev>",
    to: subscription.user.email,
    subject: `Monthly payment received - ${F.money(invoice.amount_paid)} - Digital Revolution`,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return { ok: true };
}

// 4. Subscription cancelled email
export async function sendSubscriptionCancelledEmail(subscription: Subscription, userEmail: string, userName?: string, cancelReason?: string) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Subscription Cancelled</title>
    ${EMAIL_STYLES}
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${process.env.NEXT_PUBLIC_APP_URL}/Assets/Logos/lightDRLogo.svg" alt="Digital Revolution" class="logo" />
        <div class="brand">Digital Revolution</div>
        <h1>Subscription Cancelled</h1>
        <div class="muted">Thank you for your past support</div>
      </div>

      <div class="card">
        <h2 style="margin:0 0 16px;">Monthly Subscription Cancelled</h2>
        <div class="highlight">
          <strong>Final Amount: ${F.money(subscription.amount, subscription.currency)}</strong><br/>
          <span class="muted">Cancelled: ${F.date(subscription.canceledAt)}</span><br/>
          ${subscription.cancelAtPeriodEnd ? `<span class="muted">Service continues until: ${F.date(subscription.currentPeriodEnd)}</span>` : ''}
        </div>
        <p>Dear ${F.esc(userName || "Supporter")},</p>
        <p>Your monthly subscription of <strong>${F.money(subscription.amount, subscription.currency)}</strong> has been cancelled as requested.</p>
        ${subscription.cancelAtPeriodEnd ? 
          `<p><strong>Important:</strong> You'll continue to have access until ${F.date(subscription.currentPeriodEnd)}, and no further payments will be charged.</p>` :
          `<p>Your subscription has been cancelled immediately and no further payments will be charged.</p>`
        }
        <p>Thank you for supporting Digital Revolution during your time as a monthly donor. Your contributions made a real difference in bridging the digital divide.</p>
        ${cancelReason ? `<p><em>Reason for cancellation: ${F.esc(cancelReason)}</em></p>` : ''}
      </div>

      <div class="card impact">
        <h3 style="margin:0 0 12px;">Your Impact</h3>
        <p>During your subscription, you helped us:</p>
        <ul>
          <li>Provide digital literacy training to underserved communities</li>
          <li>Support STEM education pathways and career opportunities</li>
          <li>Fund internet access and technology resources</li>
          <li>Build sustainable community technology programs</li>
        </ul>
        <p><em>Thank you for being part of our mission!</em></p>
      </div>

      <div class="card" style="text-align:center;">
        <h3>Stay Connected</h3>
        <p>You can still support our mission by:</p>
        <a class="btn donate" href="${process.env.NEXT_PUBLIC_APP_URL}/donate">Make One-Time Donation</a>
        <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/shop">Shop Our Store</a>
        <p class="muted" style="margin-top:16px;">Or restart your subscription anytime</p>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} Digital Revolution. Creating digital equity and STEM opportunities.</p>
        <p class="muted">You'll remain on our newsletter for mission updates (unsubscribe anytime).</p>
      </div>
    </div>
  </body></html>`;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || "Digital Revolution <onboarding@resend.dev>",
    to: userEmail,
    subject: `Subscription cancelled - Thank you for your support - Digital Revolution`,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return { ok: true };
}