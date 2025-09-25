import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendShippingNotificationEmail } from '@/emails/OrderShipmentEmail';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Printful webhook body:', body);
        if (body.type === 'order_updated') {
            const printfulOrder = body.data;

            const order = await prisma.order.findUnique({
                where: {
                    printfulOrderId: printfulOrder.id
                },
                include: {
                    items: true
                }
            })
            if (!order) {
                console.log('❌ Order not found for Printful order:', printfulOrder.id);
                return NextResponse.json({ 
                    error: 'Order not found' 
                }, { status: 404 });
            }

            if (printfulOrder.shipments && printfulOrder.shipments.length > 0) {
                const shipment = printfulOrder.shipments[0];

                await prisma.order.update({
                    where: {id: order.id},
                    data: {
                        status: "shipped",
                        trackingNumber: shipment.tracking_number,
                        trackingUrl: shipment.tracking_url,
                        carrier: shipment.carrier,
                        estimatedDelivery: shipment.estimated_delivery
                    }
                })

                await sendShippingNotificationEmail(order, shipment);
            }
        }

    } catch (error) {
        console.error('❌ Printful webhook error:', error);
        return NextResponse.json({ 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}