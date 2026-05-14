import prismadb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ colorId: string }>}
) {
    try {
        const { colorId } = await params;

        if(!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: colorId,
            }
        })

        return NextResponse.json(color);
    } catch (err) {
        console.log('[COLOR_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, colorId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();

        const { name, value } = body;
        const { storeId, colorId } = await params;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!value) return new NextResponse("Value is required", { status: 400 });
        if (!colorId) return new NextResponse("Color id is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const result = await prismadb.color.updateMany({
            where: { id: colorId, storeId },
            data: { name, value },
        });
        if (result.count === 0) return new NextResponse("Not found", { status: 404 });

        return NextResponse.json(result);
    } catch (err) {
        console.log('[COLOR_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, colorId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const { storeId, colorId } = await params;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!colorId) return new NextResponse("Color id is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({ where: { id: storeId, userId } });
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        // Refuse deletion if the color is in use anywhere — relationMode = "prisma" gives no DB cascade.
        const [productColorCount, imageCount, priceTierCount, orderItemCount] = await Promise.all([
            prismadb.productColor.count({ where: { colorId } }),
            prismadb.image.count({ where: { colorId } }),
            prismadb.priceTier.count({ where: { colorId } }),
            prismadb.orderItem.count({ where: { colorId } }),
        ]);
        if (productColorCount + imageCount + priceTierCount + orderItemCount > 0) {
            return new NextResponse("Color is in use by products, images, price tiers, or orders. Detach it first.", { status: 409 });
        }

        const result = await prismadb.color.deleteMany({ where: { id: colorId, storeId } });
        if (result.count === 0) return new NextResponse("Not found", { status: 404 });

        return NextResponse.json(result);
    } catch (err) {
        console.log('[COLOR_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}
