import resend from '@/lib/resend';


import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (order, orderItems) => {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmation</h1>
        
        <p>Thank you for your order! We've received your payment and are preparing your items.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h2>Order Details</h2>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Total:</strong> $${(order.amountTotal / 100).toFixed(2)}</p>
          <p><strong>Status:</strong> Processing</p>
        </div>
        
        <h3>Items Ordered:</h3>
        ${orderItems.map(item => `
          <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <p><strong>${item.productName}</strong></p>
            <p>${item.variantName} - Qty: ${item.quantity}</p>
            <p>$${(item.totalPrice / 100).toFixed(2)}</p>
          </div>
        `).join('')}
        
        <div style="margin-top: 30px; padding: 20px; background: #e8f4fd; border-radius: 8px;">
          <h3>What's Next?</h3>
          <p>• We'll process your order within 1-2 business days</p>
          <p>• You'll receive a shipping confirmation with tracking info once it ships</p>
          <p>• Estimated delivery: 3-7 business days after shipping</p>
        </div>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Questions? Reply to this email or contact us at support@yourdomain.com
        </p>
      </div>
    `;

    await resend.emails.send({
      from: 'orders@yourdomain.com',
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: emailHtml
    });

    console.log('Order confirmation email sent:', order.orderNumber);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
};