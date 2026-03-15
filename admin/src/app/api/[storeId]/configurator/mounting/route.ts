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

        const { name, slug, priceModifier, sortOrder, isActive } = body;
        const { storeId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if (!slug) {
            return new NextResponse("Slug is required", { status: 400});
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

        const mountingType = await prismadb.mountingType.create({
            data: {
                name,
                slug,
                priceModifier: priceModifier || 0,
                sortOrder: sortOrder || 0,
                isActive: isActive !== undefined ? isActive : true,
                storeId: storeId
            }
        })

        return NextResponse.json(mountingType);

    } catch (err) {
        console.log(`[MOUNTING_TYPES_POST] ${err}`);
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

        const mountingTypes = await prismadb.mountingType.findMany({
            where: {
                storeId: storeId
            },
            orderBy: {
                sortOrder: 'asc'
            }
        })

        return NextResponse.json(mountingTypes);

    } catch (err) {
        console.log(`[MOUNTING_TYPES_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}
