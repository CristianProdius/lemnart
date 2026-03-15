import prismadb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ styleId: string }>}
) {
    try {
        const { styleId } = await params;

        if(!styleId) {
            return new NextResponse("Style id is required", { status: 400 });
        }

        const configStyle = await prismadb.configStyle.findUnique({
            where: {
                id: styleId,
            }
        })

        return NextResponse.json(configStyle);
    } catch (err) {
        console.log('[CONFIG_STYLE_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, styleId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();

        const { name, slug, description, modelUrl, previewUrl, sortOrder, isActive } = body;
        const { storeId, styleId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!slug) {
            return new NextResponse("Slug is required", { status: 400 });
        }

        if(!styleId) {
            return new NextResponse("Style id is required", { status: 400 });
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

        const configStyle = await prismadb.configStyle.updateMany({
            where: {
                id: styleId
            },
            data: {
                name,
                slug,
                description,
                modelUrl,
                previewUrl,
                sortOrder,
                isActive
            }
        })

        return NextResponse.json(configStyle);
    } catch (err) {
        console.log('[CONFIG_STYLE_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, styleId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const { storeId, styleId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!styleId) {
            return new NextResponse("Style id is required", { status: 400 });
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

        const configStyle = await prismadb.configStyle.deleteMany({
            where: {
                id: styleId,
            }
        })

        return NextResponse.json(configStyle);
    } catch (err) {
        console.log('[CONFIG_STYLE_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}
