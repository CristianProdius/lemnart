import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";

// MUST stay in sync with store/hooks/use-cart.tsx MAX_QTY. Both apps validate
// independently because they don't share a module. If you change one, change both.
const MAX_QTY = 99;

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

interface ProductLinePayload {
    productId: string;
    cartLineId?: string;
    selectedColorId: string | null;
    quantity?: number;
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request, { params }: { params: Promise<{ storeId: string }> }) {
    const body = await req.json();
    const { storeId } = await params;

    // Accept both new productLines payload and legacy productIds payload (back-compat for older store builds).
    const productLines: ProductLinePayload[] = Array.isArray(body.productLines)
        ? body.productLines
        : (Array.isArray(body.productIds)
            ? body.productIds.map((id: string) => ({ productId: id, selectedColorId: null, quantity: 1 }))
            : []);
    const configuredItems = body.configuredItems as ConfiguredItemPayload[] | undefined;

    const hasProducts = productLines.length > 0;
    const hasConfigured = Array.isArray(configuredItems) && configuredItems.length > 0;

    if (!hasProducts && !hasConfigured) {
        return new NextResponse("Product lines or configured items are required", { status: 400 });
    }

    if (!stripe) {
        return new NextResponse("Payment provider not configured", { status: 503, headers: corsHeaders });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const orderItemsCreate: {
        productId: string;
        colorId: string | null;
        colorName: string | null;
        colorValue: string | null;
        quantity: number;
        unitPrice: Prisma.Decimal;
    }[] = [];

    if (hasProducts) {
        const ids = [...new Set(productLines.map((l) => l.productId))];
        const products = await prismadb.product.findMany({
            where: { id: { in: ids }, storeId },
            include: { productColors: { include: { color: true } } },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));

        for (const line of productLines) {
            const product = productMap.get(line.productId);
            if (!product) {
                return new NextResponse(`Product ${line.productId} not found in store`, { status: 400, headers: corsHeaders });
            }

            // Strict quantity validation — silent clamp would create a cart-shows-N-but-Stripe-charges-MAX_QTY
            // mismatch if the client and server limits drift.
            const rawQty = line.quantity ?? 1;
            if (!Number.isInteger(rawQty) || rawQty < 1 || rawQty > MAX_QTY) {
                return new NextResponse(
                    `Invalid quantity for product ${line.productId}: ${rawQty} (must be integer in 1..${MAX_QTY})`,
                    { status: 400, headers: corsHeaders }
                );
            }
            const qty = rawQty;

            let selectedColor: { id: string; name: string; value: string } | null = null;
            if (line.selectedColorId) {
                const match = product.productColors.find((pc) => pc.colorId === line.selectedColorId);
                if (!match) {
                    // Reject tampered cart payloads — do NOT silently downgrade to a null color.
                    return new NextResponse(
                        `Color ${line.selectedColorId} is not associated with product ${line.productId}`,
                        { status: 400, headers: corsHeaders }
                    );
                }
                selectedColor = match.color;
            }

            const colorSuffix = selectedColor ? ` — ${selectedColor.name}` : "";
            line_items.push({
                quantity: qty,
                price_data: {
                    currency: 'USD',
                    product_data: { name: `${product.name}${colorSuffix}` },
                    unit_amount: Number(product.price) * 100,
                },
            });
            orderItemsCreate.push({
                productId: product.id,
                colorId: selectedColor?.id ?? null,
                colorName: selectedColor?.name ?? null,
                colorValue: selectedColor?.value ?? null,
                quantity: qty,
                unitPrice: product.price, // immutable snapshot — admin orders page uses this, not current product.price
            });
        }
    }

    if (hasConfigured) {
        configuredItems!.forEach((item) => {
            const description = `${item.width}×${item.height}×${item.depth}cm | ${item.colorName}`;
            line_items.push({
                quantity: 1,
                price_data: {
                    currency: 'USD',
                    product_data: { name: `${item.styleName} (Configurație)`, description },
                    unit_amount: Math.round(item.unitPrice * 100),
                },
            });
        });
    }

    const order = await prismadb.order.create({
        data: {
            storeId,
            isPaid: false,
            orderItems: hasProducts ? { create: orderItemsCreate } : undefined,
            configuredItems: hasConfigured ? {
                create: configuredItems!.map((item) => ({
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
                })),
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
