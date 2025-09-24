import { prisma } from "@/lib/prisma";
import {stripe} from "@/lib/stripe";
import Stripe from "stripe";
import { createPrintfulOrder } from "@/lib/actions";
import { parseServerActionResponse } from "@/lib/utils";
import { Address } from "../../../../../../prisma/generated/prisma";

export const handleStripeWebhook = async (event: Stripe.Event) => {
    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        if (!session.metadata) {
          return parseServerActionResponse({ status: 'ERROR', error: 'Metadata not found' });
        }
        const { cartId, userId, guestUserId, checkoutSessionId } = session.metadata;
  
            // DEBUG: Log the entire session to see what's available
        console.log('=== FULL SESSION DEBUG ===');
        console.log('Session status:', session.status);
        console.log('Session keys:', Object.keys(session));
        console.log('Customer details keys:', Object.keys(session.customer_details || {}));
        console.log('Shipping details:', (session as any).shipping_details);
        console.log('Customer details:', session.customer_details);
  
        // Get cart items
        const cart = await prisma.cart.findFirst({
          where: { id: parseInt(cartId) },
          include: { items: true }
        });
  
        if (!cart) {
          throw new Error('Cart not found');
        }
  
        // Extract shipping address from Stripe session
        const shippingDetails = session.shipping_details;
        const customerDetails = session.customer_details;
        const shippingAddress = {
            firstName: shippingDetails?.name?.split(' ')[0] || customerDetails?.name?.split(' ')[0] || 'Unknown',
            lastName: shippingDetails?.name?.split(' ').slice(1).join(' ') || customerDetails?.name?.split(' ').slice(1).join(' ') || 'Customer',
            email: customerDetails?.email || '',
            phone: customerDetails?.phone || '',
            line1: shippingDetails?.address?.line1 || '',
            line2: shippingDetails?.address?.line2 || '',
            city: shippingDetails?.address?.city || '',
            state: shippingDetails?.address?.state || '',
            country: shippingDetails?.address?.country || 'US',
            postalCode: shippingDetails?.address?.postal_code || '',
          };
  
        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  
        // Create order record
        const order = await prisma.order.create({
          data: {
            orderNumber,
            ...(userId ? { userId } : { guestUserId }),
            customerEmail: session.customer_details?.email || '',
            customerFirstName: shippingAddress.firstName,
            customerLastName: shippingAddress.lastName,
            customerPhone: session.customer_details?.phone || '',
            shippingAddress: shippingAddress,
            shippingMethod: 'standard',
            shippingCost: 0, // Free shipping
            stripeSessionId: session.id,
            stripeCustomerId: session.customer,
            paymentIntentId: session.payment_intent,
            subtotal: cart.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
            discountAmount: 0,
            taxAmount: session.total_details?.amount_tax || 0,
            amountTotal: session.amount_total,
            currency: session.currency,
            status: 'processing'
          }
        });
  
        // Create order items
        await Promise.all(
          cart.items.map(item => 
            prisma.orderItem.create({
              data: {
                orderId: order.id,
                printfulVariantId: item.printfulVariantId,
                printfulProductId: item.printfulProductId,
                productName: item.productName,
                variantName: item.variantName,
                variantSize: item.size,
                variantColor: item.color,
                variantSku: item.sku,
                images: item.imageUrl ? [item.imageUrl] : [],
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                totalPrice: item.unitPrice * item.quantity
              }
            })
          )
        );
  
        // Create Printful order
        const printfulOrderResult = await createPrintfulOrder(order.id, cart.items, shippingAddress as unknown as Address, session.customer_details?.email || null);
        
        if (printfulOrderResult.status === 'SUCCESS') {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              printfulOrderId: printfulOrderResult.data?.printfulOrderId.toString(),
              printfulStatus: printfulOrderResult.data?.printfulStatus
            }
          });
  
          await prisma.printfulOrder.create({
            data: {
              orderId: order.id,
              printfulOrderId: printfulOrderResult.data?.printfulOrderId.toString(),
              printfulStatus: printfulOrderResult.data?.printfulStatus,
              printfulData: printfulOrderResult.data?.printfulData
            }
          });
        } else {
          console.error('Printful order creation failed:', printfulOrderResult.error);
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'fulfillment_pending' }
          });
        }
  
        // Clear the cart
        await prisma.cartItem.deleteMany({
          where: { cartId: parseInt(cartId) }
        });
  
        // Update checkout session
        await prisma.checkoutSession.update({
          where: { id: parseInt(checkoutSessionId) },
          data: {
            status: 'completed',
            finalTotal: session.amount_total,
            finalTax: session.total_details?.amount_tax || 0,
            finalShipping: 0,
            webhookProcessedAt: new Date(),
            stripeEventId: event.id
          }
        });
  
        console.log('Order created successfully:', order.orderNumber);
        return parseServerActionResponse({ status: 'SUCCESS', orderId: order.id });
      } else {
        return parseServerActionResponse({ status: 'ERROR', error: 'Invalid event type' });
      }
    } catch (error) {
      console.error('Webhook processing failed:', error);
      return parseServerActionResponse({ status: 'ERROR', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };