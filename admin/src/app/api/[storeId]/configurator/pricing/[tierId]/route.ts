import prismadb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ tierId: string }>}
) {
    try {
        const { tierId } = await params;

        if(!tierId) {
            return new NextResponse("Price tier id is required", { status: 400 });
        }

        const priceTier = await prismadb.priceTier.findUnique({
            where: {
                id: tierId,
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
            }
        })

        return NextResponse.json(priceTier);
    } catch (err) {
        console.log('[PRICE_TIER_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, tierId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();

        const { styleId, minWidth, maxWidth, minHeight, maxHeight, basePrice, colorId, pricePerSection } = body;
        const { storeId, tierId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!styleId) {
            return new NextResponse("Style id is required", { status: 400 });
        }

        if (minWidth === undefined || minWidth === null) {
            return new NextResponse("Min width is required", { status: 400 });
        }

        if (maxWidth === undefined || maxWidth === null) {
            return new NextResponse("Max width is required", { status: 400 });
        }

        if (minHeight === undefined || minHeight === null) {
            return new NextResponse("Min height is required", { status: 400 });
        }

        if (maxHeight === undefined || maxHeight === null) {
            return new NextResponse("Max height is required", { status: 400 });
        }

        if (basePrice === undefined || basePrice === null) {
            return new NextResponse("Base price is required", { status: 400 });
        }

        if(!tierId) {
            return new NextResponse("Price tier id is required", { status: 400 });
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

        const priceTier = await prismadb.priceTier.updateMany({
            where: {
                id: tierId
            },
            data: {
                styleId,
                minWidth,
                maxWidth,
                minHeight,
                maxHeight,
                basePrice,
                colorId: colorId || null,
                pricePerSection
            }
        })

        return NextResponse.json(priceTier);
    } catch (err) {
        console.log('[PRICE_TIER_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, tierId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const { storeId, tierId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!tierId) {
            return new NextResponse("Price tier id is required", { status: 400 });
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

        const priceTier = await prismadb.priceTier.deleteMany({
            where: {
                id: tierId,
            }
        })

        return NextResponse.json(priceTier);
    } catch (err) {
        console.log('[PRICE_TIER_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}
