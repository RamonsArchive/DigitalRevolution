import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail, sendOrderShippedEmail, sendOrderUpdatedEmail } from '@/emails/OrderEmails';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📦 Printful webhook received:', { 
      type: body.type, 
      orderId: body.data?.id,
      timestamp: new Date().toISOString()
    });

    switch (body.type) {
      case 'order_created':
        await handleOrderCreated(body.data);
        break;

      case 'package_shipped':
        await handlePackageShipped(body.data);
        break;

      case 'order_updated':
        await handleOrderUpdated(body.data);
        break;

      default:
        console.log('ℹ️ Unhandled webhook type:', body.type);
        return NextResponse.json({ 
          success: true, 
          message: `Webhook type ${body.type} acknowledged but not processed` 
        });
    }

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('❌ Printful webhook error:', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

async function handleOrderCreated(printfulOrder: any) {
  try {
    console.log('🆕 Processing order created:', printfulOrder.id);

    const order = await prisma.order.findUnique({
      where: { printfulOrderId: printfulOrder.id },
      include: { items: true }
    });

    if (!order) {
      console.log('❌ Order not found for Printful order:', printfulOrder.id);
      throw new Error('Order not found');
    }

    console.log('✅ Found order:', order.orderNumber);

    // Update order status to processing
    await prisma.order.update({
      where: { id: order.id },
      data: { 
        status: 'processing',
        printfulStatus: printfulOrder.status,
        updatedAt: new Date()
      }
    });

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(order, order.items);
      console.log('✅ Order confirmation email sent');
    } catch (emailError) {
      console.error('❌ Failed to send order confirmation email:', emailError);
      // Don't fail the webhook if email fails
    }

    console.log('✅ Order created webhook processed successfully');
  } catch (error) {
    console.error('❌ Error processing order created:', error);
    throw error;
  }
}

async function handlePackageShipped(printfulOrder: any) {
  try {
    console.log('📦 Processing package shipped:', printfulOrder.id);

    if (!printfulOrder?.id) {
      throw new Error('Invalid Printful order data - missing ID');
    }

    const order = await prisma.order.findUnique({
      where: { printfulOrderId: printfulOrder.id },
      include: { items: true }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    console.log('✅ Found order:', order.orderNumber);

    // Check if order has shipments
    if (printfulOrder.shipments && printfulOrder.shipments.length > 0) {
      const shipment = printfulOrder.shipments[0];
      
      console.log('📦 Processing shipment:', {
        trackingNumber: shipment.tracking_number,
        carrier: shipment.service || shipment.carrier,
        status: printfulOrder.status
      });

      // Update order in database
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "shipped",
          trackingNumber: shipment.tracking_number || null,
          trackingUrl: shipment.tracking_url || null,
          carrier: shipment.service || shipment.carrier || null,
          estimatedDelivery: shipment.estimated_delivery_date || null,
          printfulStatus: printfulOrder.status,
          updatedAt: new Date()
        }
      });

      console.log('✅ Order updated in database:', updatedOrder.orderNumber);

      // Send shipping notification email
      try {
        await sendOrderShippedEmail(updatedOrder, order.items, shipment);
        console.log('✅ Shipping email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send shipping email:', emailError);
        // Don't fail the webhook if email fails
      }

    } else {
      console.log('ℹ️ Order update without shipment data:', printfulOrder.status);
      
      // Update order status even if no shipment info
      await prisma.order.update({
        where: { id: order.id },
        data: {
          printfulStatus: printfulOrder.status,
          updatedAt: new Date()
        }
      });
    }

    console.log('✅ Package shipped webhook processed successfully');
  } catch (error) {
    console.error('❌ Error processing package shipped:', error);
    throw error;
  }
}

async function handleOrderUpdated(printfulOrder: any) {
  try {
    console.log('📝 Processing order updated:', printfulOrder.id);

    if (!printfulOrder?.id) {
      throw new Error('Invalid Printful order data - missing ID');
    }

    const order = await prisma.order.findUnique({
      where: { printfulOrderId: printfulOrder.id },
      include: { items: true }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    console.log('✅ Found order:', order.orderNumber);

    // Update order with new status
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        printfulStatus: printfulOrder.status,
        updatedAt: new Date()
      }
    });

    // Send order updated email for significant status changes
    const significantUpdates = ['onhold', 'canceled', 'returned'];
    if (significantUpdates.includes(printfulOrder.status)) {
      try {
        await sendOrderUpdatedEmail(updatedOrder, order.items, `Order status changed to: ${printfulOrder.status}`);
        console.log('✅ Order update email sent');
      } catch (emailError) {
        console.error('❌ Failed to send order update email:', emailError);
        // Don't fail the webhook if email fails
      }
    }

    console.log('✅ Order updated webhook processed successfully');
  } catch (error) {
    console.error('❌ Error processing order updated:', error);
    throw error;
  }
}