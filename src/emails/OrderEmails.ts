// emails/OrderEmails.ts
import "server-only";
import resend from "@/lib/resend";
import type { Order, OrderItem } from "../../prisma/generated/prisma";

// Email utility functions
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

// Order confirmation email
export async function sendOrderConfirmationEmail(order: Order, items: OrderItem[]) {
  const fullName = `${order.customerFirstName} ${order.customerLastName ?? ""}`.trim();
  const ship = (order.shippingAddress as any) || {};

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Order Confirmation - Digital Revolution</title>
<style>
  body { margin:0; background:#f4f4f4; color:#333; font-family: Arial, sans-serif; }
  .container { max-width:600px; margin:0 auto; padding:20px; }
  .card { background:#fff; border:1px solid #e9ecef; border-radius:8px; padding:20px; margin-bottom:16px; }
  .header { background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; border-radius:8px; padding:24px; text-align:center; }
  .logo { width:120px; height:auto; margin:0 auto 16px; display:block; }
  .brand { font-size:14px; opacity:0.9; margin:0 0 8px; }
  h1 { margin:0; font-size:24px; }
  .badge { display:inline-block; padding:8px 14px; border-radius:18px; font-weight:700; font-size:13px; margin-top:10px; }
  .processing { background:#ffeaa7; color:#2d3436; }
  .muted { color:#6c757d; font-size:12px; }
  .rows { display:flex; gap:16px; flex-wrap:wrap; justify-content:space-between; }
  .k { font-weight:600; }
  .thumb { width:56px; height:56px; border-radius:4px; object-fit:cover; border:1px solid #e9ecef; }
  .thumb-empty { display:flex; align-items:center; justify-content:center; background:#f1f3f5; color:#6c757d; font-size:11px; }
  table { width:100%; border-collapse:collapse; }
  th, td { padding:10px 8px; border-bottom:1px solid #e9ecef; font-size:14px; vertical-align:top; }
  th { text-align:left; background:#f8f9fa; font-weight:700; }
  .row:last-child td { border-bottom:none; }
  .prod-wrap { display:flex; gap:10px; align-items:center; }
  .prod-title { font-weight:700; }
  .totals .line { display:flex; justify-content:space-between; margin:6px 0; }
  .totals .final { border-top:2px solid #333; padding-top:10px; margin-top:10px; font-weight:700; font-size:18px; }
  .btns { text-align:center; margin-top:16px; }
  .btn { display:inline-block; background:#007bff; color:#fff; text-decoration:none; padding:10px 16px; border-radius:6px; margin:6px 4px; font-weight:700; }
  .address { background:#f8f9fa; border-radius:6px; padding:12px; }
  .note { background:#e3f2fd; border-left:4px solid #2196f3; padding:12px; border-radius:0 6px 6px 0; margin-top:10px; }
  @media (max-width:600px){ .container{padding:12px;} .header{padding:18px;} }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${process.env.NEXT_PUBLIC_APP_URL}/Assets/Logos/lightDRLogo.svg" alt="Digital Revolution" class="logo" />
      <div class="brand">Digital Revolution</div>
      <h1>Order Confirmation</h1>
      <div class="badge processing">⏳ Processing</div>
      <div class="muted" style="margin-top:8px;">Thanks for your order, ${F.esc(fullName)}!</div>
    </div>

    <div class="card">
      <h2 style="margin:0 0 8px;">Order #${F.esc(order.orderNumber)}</h2>
      <div class="rows">
        <div>
          <div><span class="k">Order Date:</span> ${F.date(order.createdAt)}</div>
          <div><span class="k">Payment:</span> Charged (PaymentIntent ${F.esc(order.paymentIntentId)})</div>
        </div>
        <div>
          <div><span class="k">Estimated Delivery:</span> ${F.esc(order.estimatedDelivery ?? "5-7 business days")}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 style="margin:0 0 8px;">Items</h3>
      <table>
        <thead><tr><th>Product</th><th>Qty</th><th>Total</th></tr></thead>
        <tbody>
          ${items.map(item => `
            <tr class="row">
              <td class="prod">
                <div class="prod-wrap">
                  ${
                    item.images && Array.isArray(item.images) && item.images.length > 0
                      ? `<img class="thumb" src="${item.images[0] as string}" alt="${F.esc(item.productName)}"/>`
                      : `<div class="thumb thumb-empty">No Image</div>`
                  }
                  <div>
                    <div class="prod-title">${F.esc(item.productName)}</div>
                    <div class="muted">Variant: ${F.esc(item.variantName || "")}</div>
                  </div>
                </div>
              </td>
              <td>${item.quantity}</td>
              <td>${F.money(item.totalPrice, order.currency)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <div class="card totals">
      <h3 style="margin:0 0 8px;">Order Summary</h3>
      <div class="line"><span>Subtotal</span><span>${F.money(order.subtotal, order.currency)}</span></div>
      <div class="line"><span>Shipping</span><span>FREE</span></div>
      <div class="line"><span>Tax</span><span>${F.money(order.taxAmount, order.currency)}</span></div>
      <div class="line final"><span>Total Paid</span><span>${F.money(order.amountTotal, order.currency)}</span></div>
    </div>

    <div class="card">
      <h3 style="margin:0 0 8px;">Shipping Address</h3>
      <div class="address">
        <strong>${F.esc(fullName)}</strong><br/>
        ${F.esc(ship.line1 ?? "")}<br/>
        ${ship.line2 ? `${F.esc(ship.line2)}<br/>` : ""}
        ${F.esc(ship.city ?? "")}, ${F.esc(ship.state ?? "")} ${F.esc(ship.postalCode ?? "")}<br/>
        ${F.esc(ship.country ?? "")}
        ${ship.phone ? `<br/><strong>Phone:</strong> ${F.esc(ship.phone)}` : ""}
      </div>
    </div>

    <div class="card">
      <h3 style="margin:0 0 8px;">What's Next?</h3>
      <div class="note">
        <strong>Processing:</strong> We're preparing your order and will send you a shipping notification once it's on its way.
      </div>
    </div>

    <div class="card" style="text-align:center;">
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/orders">View Order</a>
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/support" style="background:#6c757d;">Support</a>
    </div>

    <div class="container" style="text-align:center; color:#6c757d; font-size:12px;">
      © ${new Date().getFullYear()} Digital Revolution. Order #${F.esc(order.orderNumber)}.
    </div>
  </div>
</body></html>`;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || "Digital Revolution <onboarding@resend.dev>",
    to: order.customerEmail,
    subject: `Order Confirmation – ${order.orderNumber}`,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return { ok: true };
}

// Order shipped email
export async function sendOrderShippedEmail(order: Order, items: OrderItem[], trackingData: any) {
  const fullName = `${order.customerFirstName} ${order.customerLastName ?? ""}`.trim();
  const ship = (order.shippingAddress as any) || {};

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Your Order Has Shipped - Digital Revolution</title>
<style>
  body { margin:0; background:#f4f4f4; color:#333; font-family: Arial, sans-serif; }
  .container { max-width:600px; margin:0 auto; padding:20px; }
  .card { background:#fff; border:1px solid #e9ecef; border-radius:8px; padding:20px; margin-bottom:16px; }
  .header { background:linear-gradient(135deg,#00b894 0%,#00a085 100%); color:#fff; border-radius:8px; padding:24px; text-align:center; }
  .logo { width:120px; height:auto; margin:0 auto 16px; display:block; }
  .brand { font-size:14px; opacity:0.9; margin:0 0 8px; }
  h1 { margin:0; font-size:24px; }
  .badge { display:inline-block; padding:8px 14px; border-radius:18px; font-weight:700; font-size:13px; margin-top:10px; }
  .shipped { background:#00b894; color:#fff; }
  .muted { color:#6c757d; font-size:12px; }
  .rows { display:flex; gap:16px; flex-wrap:wrap; justify-content:space-between; }
  .k { font-weight:600; }
  .thumb { width:56px; height:56px; border-radius:4px; object-fit:cover; border:1px solid #e9ecef; }
  .thumb-empty { display:flex; align-items:center; justify-content:center; background:#f1f3f5; color:#6c757d; font-size:11px; }
  table { width:100%; border-collapse:collapse; }
  th, td { padding:10px 8px; border-bottom:1px solid #e9ecef; font-size:14px; vertical-align:top; }
  th { text-align:left; background:#f8f9fa; font-weight:700; }
  .row:last-child td { border-bottom:none; }
  .prod-wrap { display:flex; gap:10px; align-items:center; }
  .prod-title { font-weight:700; }
  .totals .line { display:flex; justify-content:space-between; margin:6px 0; }
  .totals .final { border-top:2px solid #333; padding-top:10px; margin-top:10px; font-weight:700; font-size:18px; }
  .btns { text-align:center; margin-top:16px; }
  .btn { display:inline-block; background:#00b894; color:#fff; text-decoration:none; padding:10px 16px; border-radius:6px; margin:6px 4px; font-weight:700; }
  .btn.track { background:#007bff; }
  .address { background:#f8f9fa; border-radius:6px; padding:12px; }
  .note { background:#e8f5e8; border-left:4px solid #00b894; padding:12px; border-radius:0 6px 6px 0; margin-top:10px; }
  @media (max-width:600px){ .container{padding:12px;} .header{padding:18px;} }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${process.env.NEXT_PUBLIC_APP_URL}/Assets/Logos/lightDRLogo.svg" alt="Digital Revolution" class="logo" />
      <div class="brand">Digital Revolution</div>
      <h1>Your Order Has Shipped! 📦</h1>
      <div class="badge shipped">📦 Shipped</div>
      <div class="muted" style="margin-top:8px;">Great news, ${F.esc(fullName)}! Your order is on its way.</div>
    </div>

    <div class="card" style="border:2px solid #00b894;">
      <h3 style="margin:0 0 8px;">Shipping & Tracking</h3>
      <div><span class="k">Carrier:</span> ${F.esc(order.carrier ?? "Standard")}</div>
      <div><span class="k">Service:</span> ${F.esc(order.shippingMethod)}</div>
      ${order.trackingNumber ? `<div><span class="k">Tracking #:</span> ${F.esc(order.trackingNumber)}</div>` : ""}
      ${order.estimatedDelivery ? `<div><span class="k">Estimated Delivery:</span> ${F.date(order.estimatedDelivery)}</div>` : ""}
      ${order.trackingUrl ? `<div class="btns"><a class="btn track" href="${order.trackingUrl}">Track Package</a></div>` : ""}
    </div>

    <div class="card">
      <h2 style="margin:0 0 8px;">Order #${F.esc(order.orderNumber)}</h2>
      <div class="rows">
        <div>
          <div><span class="k">Order Date:</span> ${F.date(order.createdAt)}</div>
          <div><span class="k">Shipped Date:</span> ${F.date(new Date())}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 style="margin:0 0 8px;">Items Shipped</h3>
      <table>
        <thead><tr><th>Product</th><th>Qty</th><th>Total</th></tr></thead>
        <tbody>
          ${items.map(item => `
            <tr class="row">
              <td class="prod">
                <div class="prod-wrap">
                  ${
                    item.images && Array.isArray(item.images) && item.images.length > 0
                      ? `<img class="thumb" src="${item.images[0] as string}" alt="${F.esc(item.productName)}"/>`
                      : `<div class="thumb thumb-empty">No Image</div>`
                  }
                  <div>
                    <div class="prod-title">${F.esc(item.productName)}</div>
                    <div class="muted">Variant: ${F.esc(item.variantName || "")}</div>
                  </div>
                </div>
              </td>
              <td>${item.quantity}</td>
              <td>${F.money(item.totalPrice, order.currency)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <div class="card">
      <h3 style="margin:0 0 8px;">Shipping Address</h3>
      <div class="address">
        <strong>${F.esc(fullName)}</strong><br/>
        ${F.esc(ship.line1 ?? "")}<br/>
        ${ship.line2 ? `${F.esc(ship.line2)}<br/>` : ""}
        ${F.esc(ship.city ?? "")}, ${F.esc(ship.state ?? "")} ${F.esc(ship.postalCode ?? "")}<br/>
        ${F.esc(ship.country ?? "")}
        ${ship.phone ? `<br/><strong>Phone:</strong> ${F.esc(ship.phone)}` : ""}
      </div>
    </div>

    <div class="card">
      <h3 style="margin:0 0 8px;">What's Next?</h3>
      <div class="note">
        <strong>Delivery:</strong> Your package should arrive within 5-7 business days. You can track its progress using the tracking number above.
      </div>
    </div>

    <div class="card" style="text-align:center;">
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/orders">View Order</a>
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/support" style="background:#6c757d;">Support</a>
    </div>

    <div class="container" style="text-align:center; color:#6c757d; font-size:12px;">
      © ${new Date().getFullYear()} Digital Revolution. Order #${F.esc(order.orderNumber)}.
    </div>
  </div>
</body></html>`;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || "Digital Revolution <onboarding@resend.dev>",
    to: order.customerEmail,
    subject: `Your Order Has Shipped – ${order.orderNumber}`,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return { ok: true };
}

// Order updated email (optional - for status changes)
export async function sendOrderUpdatedEmail(order: Order, items: OrderItem[], updateReason: string) {
  const fullName = `${order.customerFirstName} ${order.customerLastName ?? ""}`.trim();

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Order Update - Digital Revolution</title>
<style>
  body { margin:0; background:#f4f4f4; color:#333; font-family: Arial, sans-serif; }
  .container { max-width:600px; margin:0 auto; padding:20px; }
  .card { background:#fff; border:1px solid #e9ecef; border-radius:8px; padding:20px; margin-bottom:16px; }
  .header { background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; border-radius:8px; padding:24px; text-align:center; }
  .logo { width:120px; height:auto; margin:0 auto 16px; display:block; }
  .brand { font-size:14px; opacity:0.9; margin:0 0 8px; }
  h1 { margin:0; font-size:24px; }
  .badge { display:inline-block; padding:8px 14px; border-radius:18px; font-weight:700; font-size:13px; margin-top:10px; }
  .updated { background:#ffc107; color:#000; }
  .muted { color:#6c757d; font-size:12px; }
  .note { background:#fff3cd; border-left:4px solid #ffc107; padding:12px; border-radius:0 6px 6px 0; margin-top:10px; }
  .btns { text-align:center; margin-top:16px; }
  .btn { display:inline-block; background:#007bff; color:#fff; text-decoration:none; padding:10px 16px; border-radius:6px; margin:6px 4px; font-weight:700; }
  @media (max-width:600px){ .container{padding:12px;} .header{padding:18px;} }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${process.env.NEXT_PUBLIC_APP_URL}/Assets/Logos/lightDRLogo.svg" alt="Digital Revolution" class="logo" />
      <div class="brand">Digital Revolution</div>
      <h1>Order Update</h1>
      <div class="badge updated">📝 Updated</div>
      <div class="muted" style="margin-top:8px;">Order #${F.esc(order.orderNumber)} has been updated</div>
    </div>

    <div class="card">
      <h2 style="margin:0 0 8px;">Order #${F.esc(order.orderNumber)}</h2>
      <div class="note">
        <strong>Update:</strong> ${F.esc(updateReason)}
      </div>
    </div>

    <div class="card" style="text-align:center;">
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/orders">View Order</a>
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/support" style="background:#6c757d;">Support</a>
    </div>

    <div class="container" style="text-align:center; color:#6c757d; font-size:12px;">
      © ${new Date().getFullYear()} Digital Revolution. Order #${F.esc(order.orderNumber)}.
    </div>
  </div>
</body></html>`;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || "Digital Revolution <onboarding@resend.dev>",
    to: order.customerEmail,
    subject: `Order Update – ${order.orderNumber}`,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return { ok: true };
}
