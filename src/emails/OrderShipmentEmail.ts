import resend from "@/lib/resend";
import { Order } from "../../prisma/generated/prisma";
import { PrintfulShipment } from "@/lib/globalTypes";

export const sendShippingNotificationEmail = async (order, shipment) => {
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Your Order Has Shipped! 📦</h1>
          
          <p>Great news! Your order ${order.orderNumber} is on its way to you.</p>
          
          <div style="background: #e8f5e9; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2>Shipping Details</h2>
            <p><strong>Carrier:</strong> ${shipment.service}</p>
            <p><strong>Tracking Number:</strong> ${shipment.tracking_number}</p>
            <p><strong>Estimated Delivery:</strong> ${shipment.estimated_delivery_date || '3-7 business days'}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${shipment.tracking_url}" 
               style="background: #2196F3; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold;">
              Track Your Package
            </a>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
            <h3>Delivery Information</h3>
            <p><strong>Shipping to:</strong></p>
            <p>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
            <p>${order.shippingAddress.line1}</p>
            ${order.shippingAddress.line2 ? `<p>${order.shippingAddress.line2}</p>` : ''}
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
          </div>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Questions about your delivery? Contact us or use the tracking link above.
          </p>
        </div>
      `;
  
      await resend.emails.send({
        from: 'shipping@yourdomain.com',
        to: order.customerEmail,
        subject: `Your order ${order.orderNumber} has shipped!`,
        html: emailHtml
      });
  
      console.log('Shipping notification sent:', order.orderNumber);
    } catch (error) {
      console.error('Failed to send shipping email:', error);
    }
  };