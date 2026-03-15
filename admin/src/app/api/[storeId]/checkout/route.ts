import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

interface ConfiguredItemPayload {
    styleName: string;
    colorName: string;
    colorValue: string;
    width: number;
    height: number;
    depth: number;
    ventilationName: string;
    mountingName: string;
    sections: number;
    accessories: Array<{ id: string; name: string; price: number }>;
    unitPrice: number;
    configSnapshot: Record<string, unknown>;
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request, { params }: { params: Promise<{ storeId: string }> }) {
    const { productIds, configuredItems } = await req.json();
    const { storeId } = await params;

    const hasProducts = productIds && productIds.length > 0;
    const hasConfigured = configuredItems && configuredItems.length > 0;

    if(!hasProducts && !hasConfigured) {
        return new NextResponse("Product ids or configured items are required", { status: 400 });
    }

    if (!stripe) {
        return new NextResponse("Payment provider not configured", { status: 503, headers: corsHeaders });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Handle standard products
    if (hasProducts) {
        const products = await prismadb.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            }
        });

        products.forEach((product) => {
            line_items.push({
                quantity: 1,
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: Number(product.price) * 100
                }
            });
        });
    }

    // Handle configured items
    if (hasConfigured) {
        (configuredItems as ConfiguredItemPayload[]).forEach((item) => {
            const description = `${item.width}×${item.height}×${item.depth}cm | ${item.colorName}`;
            line_items.push({
                quantity: 1,
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: `${item.styleName} (Configurație)`,
                        description,
                    },
                    unit_amount: Math.round(item.unitPrice * 100)
                }
            });
        });
    }

    const order = await prismadb.order.create({
        data: {
            storeId: storeId,
            isPaid: false,
            orderItems: hasProducts ? {
                create: productIds.map((productId: string) => ({
                    product: {
                        connect: {
                            id: productId
                        }
                    }
                }))
            } : undefined,
            configuredItems: hasConfigured ? {
                create: (configuredItems as ConfiguredItemPayload[]).map((item) => ({
                    configSnapshot: item.configSnapshot as Prisma.InputJsonValue,
                    styleName: item.styleName,
                    colorName: item.colorName,
                    colorValue: item.colorValue,
                    width: item.width,
                    height: item.height,
                    depth: item.depth,
                    ventilationName: item.ventilationName,
                    mountingName: item.mountingName,
                    sections: item.sections,
                    accessories: item.accessories as Prisma.InputJsonValue,
                    unitPrice: item.unitPrice,
                }))
            } : undefined,
        }
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
            enabled: true,
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
        metadata: {
            orderId: order.id
        }
    });

    return NextResponse.json({ url: session.url }, {
        headers: corsHeaders,
    });
}
