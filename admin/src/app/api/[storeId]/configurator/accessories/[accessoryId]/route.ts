import prismadb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ accessoryId: string }>}
) {
    try {
        const { accessoryId } = await params;

        if(!accessoryId) {
            return new NextResponse("Accessory id is required", { status: 400 });
        }

        const configAccessory = await prismadb.configAccessory.findUnique({
            where: {
                id: accessoryId,
            }
        })

        return NextResponse.json(configAccessory);
    } catch (err) {
        console.log('[CONFIG_ACCESSORY_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, accessoryId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();

        const { name, slug, previewUrl, price, sortOrder, isActive } = body;
        const { storeId, accessoryId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!slug) {
            return new NextResponse("Slug is required", { status: 400 });
        }

        if(!accessoryId) {
            return new NextResponse("Accessory id is required", { status: 400 });
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

        const configAccessory = await prismadb.configAccessory.updateMany({
            where: {
                id: accessoryId
            },
            data: {
                name,
                slug,
                previewUrl,
                price,
                sortOrder,
                isActive
            }
        })

        return NextResponse.json(configAccessory);
    } catch (err) {
        console.log('[CONFIG_ACCESSORY_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, accessoryId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const { storeId, accessoryId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!accessoryId) {
            return new NextResponse("Accessory id is required", { status: 400 });
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

        const configAccessory = await prismadb.configAccessory.deleteMany({
            where: {
                id: accessoryId,
            }
        })

        return NextResponse.json(configAccessory);
    } catch (err) {
        console.log('[CONFIG_ACCESSORY_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}
