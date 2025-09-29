import resend from "@/lib/resend";
import { Order } from "../../prisma/generated/prisma";
import { PrintfulShipment } from "@/lib/globalTypes";

const F = {
  esc(s: string | null | undefined) {
    if (!s) return "";
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },
  date(d: Date | string | null | undefined) {
    if (!d) return "";
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
};

export const sendShippingNotificationEmail = async (order: Order, shipment: PrintfulShipment) => {
  try {
    // Parse shipping address from JSON
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shippingAddress = order.shippingAddress as any;
    
    const emailHtml = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Your Order Has Shipped</title>
      <style>
        body { margin:0; background:#f4f4f4; color:#333; font-family: Arial, sans-serif; }
        .container { max-width:600px; margin:0 auto; padding:20px; }
        .card { background:#fff; border:1px solid #e9ecef; border-radius:8px; padding:20px; margin-bottom:16px; }
        .header { background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; border-radius:8px; padding:24px; text-align:center; }
        .logo { width:120px; height:auto; margin:0 auto 16px; display:block; }
        .brand { font-size:14px; opacity:0.9; margin:0 0 8px; }
        h1 { margin:0; font-size:24px; }
        .shipped-badge { display:inline-block; padding:8px 14px; border-radius:18px; font-weight:700; font-size:13px; margin-top:10px; background:#00b894; color:#fff; }
        .tracking-highlight { background:#e8f5e8; border-left:4px solid #28a745; padding:20px; margin:20px 0; border-radius:0 8px 8px 0; }
        .btn { display:inline-block; background:#2196F3; color:#fff; text-decoration:none; padding:15px 30px; border-radius:6px; font-weight:700; margin:10px 0; }
        .address { background:#f8f9fa; border-radius:6px; padding:16px; margin:20px 0; }
        .k { font-weight:600; }
        .footer { text-align:center; color:#6c757d; font-size:12px; margin-top:20px; }
        @media (max-width:600px){ .container{padding:12px;} .header{padding:18px;} }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${process.env.NEXT_PUBLIC_APP_URL}/Assets/Logos/lightDRLogo.svg" alt="Digital Revolution" class="logo" />
          <div class="brand">Digital Revolution</div>
          <h1>Your Order Has Shipped!</h1>
          <div class="shipped-badge">📦 On Its Way</div>
        </div>

        <div class="card">
          <h2 style="margin:0 0 16px; color:#28a745;">Order #${F.esc(order.orderNumber)} is en route!</h2>
          <p>Great news! Your Digital Revolution order is now on its way to you. Thank you for supporting our mission to bridge the digital divide and create STEM opportunities.</p>
          
          <div class="tracking-highlight">
            <h3 style="margin:0 0 12px;">Shipping Details</h3>
            <div><span class="k">Carrier:</span> ${F.esc(shipment.service || shipment.carrier || "Standard")}</div>
            <div><span class="k">Tracking Number:</span> ${F.esc(shipment.tracking_number || "")}</div>
            <div><span class="k">Estimated Delivery:</span> ${F.esc(shipment.estimated_delivery || "3-7 business days")}</div>
            ${shipment.estimated_delivery ? `<div><span class="k">Expected:</span> ${F.date(shipment.estimated_delivery)}</div>` : ""}
          </div>

          ${shipment.tracking_url ? `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${shipment.tracking_url}" class="btn">Track Your Package</a>
          </div>
          ` : ""}
        </div>

        <div class="card">
          <h3 style="margin:0 0 12px;">Delivery Information</h3>
          <div class="address">
            <strong>${F.esc(order.customerFirstName)} ${F.esc(order.customerLastName)}</strong><br/>
            ${F.esc(shippingAddress?.line1 || "")}<br/>
            ${shippingAddress?.line2 ? `${F.esc(shippingAddress.line2)}<br/>` : ""}
            ${F.esc(shippingAddress?.city || "")}, ${F.esc(shippingAddress?.state || "")} ${F.esc(shippingAddress?.postalCode || "")}<br/>
            ${F.esc(shippingAddress?.country || "")}
          </div>
        </div>

        <div class="card" style="background:#e3f2fd; border-left:4px solid #2196f3;">
          <h3 style="margin:0 0 12px;">Your Impact</h3>
          <p>Remember: 50% of Digital Revolution's profits go directly to digital equity and STEM education initiatives. Your purchase helps bridge the digital divide!</p>
          <p style="margin:0;"><em>Thank you for supporting communities in need of digital access and technology education.</em></p>
        </div>

        <div class="card" style="text-align:center;">
          <p>Questions about your delivery?</p>
          <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@digitalrevolution.org'}" class="btn" style="background:#6c757d;">Contact Support</a>
          ${process.env.NEXT_PUBLIC_APP_URL ? `<a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}" class="btn" style="background:#28a745;">View Order</a>` : ""}
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} Digital Revolution. Creating digital equity and STEM opportunities.</p>
          <p>Order #${F.esc(order.orderNumber)} • Shipped via ${F.esc(shipment.service || "Standard Shipping")}</p>
        </div>
      </div>
    </body>
    </html>`;

    const { error } = await resend.emails.send({
      from: `Digital Revolution <${process.env.RESEND_FROM}>`,
      to: order.customerEmail || 'rmcdeem.m@gmail.com',
      subject: `📦 Your Digital Revolution order ${order.orderNumber} has shipped!`,
      html: emailHtml
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send shipping email: ${error.message}`);
    }

    console.log('✅ Shipping notification sent:', order.orderNumber);
    return { success: true };

  } catch (error) {
    console.error('❌ Failed to send shipping email:', error);
    throw error;
  }
};