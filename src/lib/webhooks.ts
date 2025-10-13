"use server";
// lib/webhook.ts - Move your handler here
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { createPrintfulOrder } from "@/lib/actions";
import { parseServerActionResponse } from "@/lib/utils";
import { Address, OrderItem } from "../../prisma/generated/prisma";
import { sendOrderConfirmationEmailFromOrder } from "@/emails/OrderConfimration";

export const handleStripeWebhook = async (event: Stripe.Event) => {
    try {
      if (event.type === 'checkout.session.completed') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = event.data.object as any;
        console.log('session in handleStripeWebhook', session);
        if (!session.metadata) {
          return parseServerActionResponse({ 
            status: 'ERROR', 
            error: 'Metadata not found',
            data: null 
          });
        }
        const { cartId, userId, guestUserId, checkoutSessionId } = session.metadata;
  
        // Get cart items
        const cart = await prisma.cart.findFirst({
          where: { id: parseInt(cartId) },
          include: { items: true }
        });
  
        if (!cart) {
          throw new Error('Cart not found');
        }
  
        // Extract shipping address from Stripe session
        const collectedInformation = session.collected_information?.shipping_details;
        const shippingDetails = collectedInformation?.address;
        const customerDetails = session.customer_details; // don't use for address
        console.log("Shipping details in handleStripeWebhook", shippingDetails);
        const shippingAddress = {
            firstName: collectedInformation?.name?.split(' ')[0] || 'Unknown',
            lastName: collectedInformation?.name?.split(' ').slice(1).join(' ') || 'Customer',
            email: customerDetails?.email || '',
            phone: customerDetails?.phone || '',
            line1: shippingDetails?.line1 || '',
            line2: shippingDetails?.line2 || '',
            city: shippingDetails?.city || '',
            state: shippingDetails?.state || '',
            country: shippingDetails?.country || 'US',
            postalCode: shippingDetails?.postal_code || '',
          };
  
        console.log('Extracted shipping address:', shippingAddress);

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
  
        console.log('Order created:', order.orderNumber);

        // Create order items
        const orderItems = await Promise.all(
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

        console.log('Order items created');
  
        // Create Printful order
        const printfulOrderResult = await createPrintfulOrder(
          order.id, 
          cart.items, 
          shippingAddress as unknown as Address, 
          session.customer_details?.email || null
        );
        
        if (printfulOrderResult.status === 'SUCCESS') {
          console.log('Printful order created successfully');
          
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
              printfulOrderId: printfulOrderResult.data?.printfulOrderId.toString() || '',
              printfulStatus: printfulOrderResult.data?.printfulStatus || 'unknown',
              printfulData: printfulOrderResult.data?.printfulData || {}
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

        console.log('Cart cleared');
  
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

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: session.customer
            }
          });
        }

        console.log('Checkout session updated');
        console.log('Order created successfully:', order.orderNumber);

        await sendOrderConfirmationEmailFromOrder(order, orderItems as OrderItem[]);

        console.log('Order confirmation email sent');
        
        return parseServerActionResponse({ 
          status: 'SUCCESS', 
          data: { orderId: order.id },
          error: ''
        });
      } else {
        console.log('Ignoring event type:', event.type);
        return parseServerActionResponse({ 
          status: 'SUCCESS',
          data: null,
          error: 'Event type not handled'
        });
      }
    } catch (error) {
      console.error('Webhook processing failed:', error);
      return parseServerActionResponse({ 
        status: 'ERROR', 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      });
    }
};