import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();

        const { styleId, minWidth, maxWidth, minHeight, maxHeight, basePrice, colorId, pricePerSection } = body;
        const { storeId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!styleId) {
            return new NextResponse("Style id is required", { status: 400});
        }

        if (minWidth === undefined || minWidth === null) {
            return new NextResponse("Min width is required", { status: 400});
        }

        if (maxWidth === undefined || maxWidth === null) {
            return new NextResponse("Max width is required", { status: 400});
        }

        if (minHeight === undefined || minHeight === null) {
            return new NextResponse("Min height is required", { status: 400});
        }

        if (maxHeight === undefined || maxHeight === null) {
            return new NextResponse("Max height is required", { status: 400});
        }

        if (basePrice === undefined || basePrice === null) {
            return new NextResponse("Base price is required", { status: 400});
        }

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const priceTier = await prismadb.priceTier.create({
            data: {
                styleId,
                minWidth,
                maxWidth,
                minHeight,
                maxHeight,
                basePrice,
                colorId: colorId || null,
                pricePerSection: pricePerSection || 0,
                storeId: storeId
            }
        })

        return NextResponse.json(priceTier);

    } catch (err) {
        console.log(`[PRICE_TIERS_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params;

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const priceTiers = await prismadb.priceTier.findMany({
            where: {
                storeId: storeId
            },
            include: {
                style: {
                    select: {
                        name: true
                    }
                },
                color: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(priceTiers);

    } catch (err) {
        console.log(`[PRICE_TIERS_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}
