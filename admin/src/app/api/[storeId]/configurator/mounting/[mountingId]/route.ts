import prismadb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ mountingId: string }>}
) {
    try {
        const { mountingId } = await params;

        if(!mountingId) {
            return new NextResponse("Mounting type id is required", { status: 400 });
        }

        const mountingType = await prismadb.mountingType.findUnique({
            where: {
                id: mountingId,
            }
        })

        return NextResponse.json(mountingType);
    } catch (err) {
        console.log('[MOUNTING_TYPE_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, mountingId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();

        const { name, slug, priceModifier, sortOrder, isActive } = body;
        const { storeId, mountingId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!slug) {
            return new NextResponse("Slug is required", { status: 400 });
        }

        if(!mountingId) {
            return new NextResponse("Mounting type id is required", { status: 400 });
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

        const mountingType = await prismadb.mountingType.updateMany({
            where: {
                id: mountingId
            },
            data: {
                name,
                slug,
                priceModifier,
                sortOrder,
                isActive
            }
        })

        return NextResponse.json(mountingType);
    } catch (err) {
        console.log('[MOUNTING_TYPE_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, mountingId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const { storeId, mountingId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!mountingId) {
            return new NextResponse("Mounting type id is required", { status: 400 });
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

        const mountingType = await prismadb.mountingType.deleteMany({
            where: {
                id: mountingId,
            }
        })

        return NextResponse.json(mountingType);
    } catch (err) {
        console.log('[MOUNTING_TYPE_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}
