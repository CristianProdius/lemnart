import { OpenPanel } from "@openpanel/sdk";
import Stripe from "stripe";
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const op = process.env.OPENPANEL_CLIENT_ID
  ? new OpenPanel({
      clientId: process.env.OPENPANEL_CLIENT_ID,
      clientSecret: process.env.OPENPANEL_SECRET ?? "",
    })
  : null;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    if (!stripe) {
        return new NextResponse("Payment provider not configured", { status: 503 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (error: any) {
         return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
    ];

    const addressString = addressComponents.filter(c => c !== null).join(', ');

    if(event.type === 'checkout.session.completed') {
        const order = await prismadb.order.update({
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || ''
            },
            include: {
                orderItems: true,
            }
        });

        const productIds = order.orderItems.map(orderItem => orderItem.productId);

        await prismadb.product.updateMany({
            where: {
                id: {
                    in: [...productIds]
                },
            },
            data: {
                isArchived: true,
            }
        })

        // Track revenue in OpenPanel (non-blocking, never fails the webhook)
        if (op) {
            try {
                const amount = session.amount_total ? session.amount_total / 100 : 0;
                await op.revenue(amount, {
                    orderId: order.id,
                    currency: session.currency ?? "usd",
                });
            } catch (err) {
                console.log("[WEBHOOK_OPENPANEL]", err);
            }
        }
    }

    return new NextResponse(null, { status: 200 });
}