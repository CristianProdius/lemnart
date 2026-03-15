import prismadb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ patternId: string }>}
) {
    try {
        const { patternId } = await params;

        if(!patternId) {
            return new NextResponse("Pattern id is required", { status: 400 });
        }

        const ventilationPattern = await prismadb.ventilationPattern.findUnique({
            where: {
                id: patternId,
            }
        })

        return NextResponse.json(ventilationPattern);
    } catch (err) {
        console.log('[VENTILATION_PATTERN_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, patternId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();

        const { name, slug, previewUrl, priceModifier, sortOrder, isActive } = body;
        const { storeId, patternId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!slug) {
            return new NextResponse("Slug is required", { status: 400 });
        }

        if(!patternId) {
            return new NextResponse("Pattern id is required", { status: 400 });
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

        const ventilationPattern = await prismadb.ventilationPattern.updateMany({
            where: {
                id: patternId
            },
            data: {
                name,
                slug,
                previewUrl,
                priceModifier,
                sortOrder,
                isActive
            }
        })

        return NextResponse.json(ventilationPattern);
    } catch (err) {
        console.log('[VENTILATION_PATTERN_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, patternId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const { storeId, patternId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!patternId) {
            return new NextResponse("Pattern id is required", { status: 400 });
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

        const ventilationPattern = await prismadb.ventilationPattern.deleteMany({
            where: {
                id: patternId,
            }
        })

        return NextResponse.json(ventilationPattern);
    } catch (err) {
        console.log('[VENTILATION_PATTERN_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}
