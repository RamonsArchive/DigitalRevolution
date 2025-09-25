// emails/orderConfirmation.ts
"server only";
import resend from "@/lib/resend";
import type { Order, OrderItem } from "../../prisma/generated/prisma";

// Optional overrides (brand name, from address, support URL, order page link)
export type OrderEmailOptions = {
  from?: string;               // e.g. "Digital Revolution <orders@yourdomain.com>"
  brandName?: string;          // e.g. "Digital Revolution"
  orderUrl?: string;           // e.g. `${APP_URL}/orders/${order.id}`
  supportUrl?: string;         // e.g. `${APP_URL}/support`
};

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

function itemRow(i: OrderItem, currency: string) {
  return `
    <tr class="row">
      <td class="prod">
        <div class="prod-wrap">
          ${
            i.images && Array.isArray(i.images) && i.images.length > 0
              ? `<img class="thumb" src="${i.images[0] as string}" alt="${F.esc(i.productName)}"/>`
              : `<div class="thumb thumb-empty">No Image</div>`
          }
          <div>
            <div class="prod-title">${F.esc(i.productName)}</div>
            <div class="muted">Variant: ${F.esc(i.variantName || "")}</div>
          </div>
        </div>
      </td>
      <td>${i.quantity}</td>
      <td>${F.money(i.totalPrice, currency)}</td>
    </tr>
  `;
}

function emailHTML(order: Order, items: OrderItem[], opts: Required<OrderEmailOptions>) {
  const statusBadge =
    order.trackingCode || order.trackingNumber ? `<span class="badge shipped">📦 Shipped</span>` : `<span class="badge processing">⏳ Processing</span>`;

  // pull shipping snapshot
  const ship = (order.shippingAddress as any) || {};
  const fullName = `${order.customerFirstName} ${order.customerLastName ?? ""}`.trim();

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Order Confirmation</title>
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
  .btn { display:inline-block; background:#007bff; color:#fff; text-decoration:none; padding:10px 16px; border-radius:6px; margin:6px 4px; font-weight:700; }
  .btn.track { background:#00b894; }
  .address { background:#f8f9fa; border-radius:6px; padding:12px; }
  .note { background:#e3f2fd; border-left:4px solid #2196f3; padding:12px; border-radius:0 6px 6px 0; margin-top:10px; }
  @media (max-width:600px){ .container{padding:12px;} .header{padding:18px;} }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${process.env.NEXT_PUBLIC_APP_URL}/Assets/Logos/lightDRLogo.svg" alt="${F.esc(opts.brandName)}" class="logo" />
      <div class="brand">${F.esc(opts.brandName)}</div>
      <h1>Order Confirmation</h1>
      <div>${statusBadge}</div>
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
          <div><span class="k">Estimated Delivery:</span> ${F.esc(order.estimatedDelivery ?? "—")}</div>
          ${order.deliveryDate ? `<div><span class="k">Expected:</span> ${F.date(order.deliveryDate)}</div>` : ""}
        </div>
      </div>
    </div>

    ${
      order.trackingUrl || order.trackingNumber || order.trackingCode
        ? `
      <div class="card" style="border:2px solid #00b894;">
        <h3 style="margin:0 0 8px;">Shipping & Tracking</h3>
        <div><span class="k">Carrier:</span> ${F.esc(order.carrier ?? "Standard")}</div>
        <div><span class="k">Service:</span> ${F.esc(order.methodShipped ?? order.shippingMethod)}</div>
        ${order.trackingNumber || order.trackingCode ? `<div><span class="k">Tracking #:</span> ${F.esc(order.trackingNumber ?? order.trackingCode ?? "")}</div>` : ""}
        ${order.deliveryDays ? `<div><span class="k">ETA:</span> ${order.deliveryDays} business days</div>` : ""}
        ${order.trackingUrl ? `<div class="btns"><a class="btn track" href="${order.trackingUrl}">Track Package</a></div>` : ""}
      </div>`
        : `
      <div class="card">
        <h3 style="margin:0 0 8px;">We’re preparing your order</h3>
        <div class="note">You’ll receive another email with tracking once your items ship.</div>
      </div>`
    }

    <div class="card">
      <h3 style="margin:0 0 8px;">Items</h3>
      <table>
        <thead><tr><th>Product</th><th>Qty</th><th>Total</th></tr></thead>
        <tbody>
          ${items.map(it => itemRow(it, order.currency)).join("")}
        </tbody>
      </table>
    </div>

    <div class="card totals">
      <h3 style="margin:0 0 8px;">Order Summary</h3>
      <div class="line"><span>Subtotal</span><span>${F.money(order.subtotal, order.currency)}</span></div>
      ${order.promoCodeUsed ? `<div class="line" style="color:#28a745;"><span>Discount (${F.esc(order.promoCodeUsed)})</span><span>-${F.money(order.promoDiscount ?? 0, order.currency)}</span></div>` : ""}
      <div class="line"><span>Shipping (${F.esc(order.shippingMethod)})</span><span>${order.shippingCost === 0 ? "FREE" : F.money(order.shippingCost, order.currency)}</span></div>
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

    <div class="card" style="text-align:center;">
      ${opts.orderUrl ? `<a class="btn" href="${opts.orderUrl}">View Order</a>` : ""}
      ${opts.supportUrl ? `<a class="btn" href="${opts.supportUrl}" style="background:#6c757d;">Support</a>` : ""}
    </div>

    <div class="container" style="text-align:center; color:#6c757d; font-size:12px;">
      © ${new Date().getFullYear()} ${F.esc(opts.brandName)}. Order #${F.esc(order.orderNumber)}.
    </div>
  </div>
</body></html>`;
}

export async function sendOrderConfirmationEmailFromOrder(
  order: Order,
  items: OrderItem[],
  options: OrderEmailOptions = {}
) {
  const opts: Required<OrderEmailOptions> = {
    from: options.from ?? (process.env.RESEND_FROM || "Digital Revolution <onboarding@resend.dev>"),
    brandName: options.brandName ?? "Digital Revolution",
    orderUrl: options.orderUrl ?? "",
    supportUrl: options.supportUrl ?? "",
  };

  const html = emailHTML(order, items, opts);

  const { error } = await resend.emails.send({
    from: opts.from,
    to: order.customerEmail,
    subject: `Order Confirmation – ${order.orderNumber} ${order.trackingCode ? "• Shipping Label Created" : ""}`,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return { ok: true };
}