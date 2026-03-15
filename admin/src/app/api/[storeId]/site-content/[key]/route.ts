import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string; key: string }> }
) {
    try {
        const { storeId, key } = await params;

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        if (!key) {
            return new NextResponse("Key is required", { status: 400 });
        }

        const siteContent = await prismadb.siteContent.findUnique({
            where: {
                storeId_key: { storeId, key },
            },
        });

        return NextResponse.json(siteContent);
    } catch (err) {
        console.log("[SITE_CONTENT_KEY_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ storeId: string; key: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();
        const { storeId, key } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        if (!key) {
            return new NextResponse("Key is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const siteContent = await prismadb.siteContent.upsert({
            where: {
                storeId_key: { storeId, key },
            },
            update: {
                value: body.value,
            },
            create: {
                storeId,
                key,
                value: body.value,
            },
        });

        return NextResponse.json(siteContent);
    } catch (err) {
        console.log("[SITE_CONTENT_KEY_PUT]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ storeId: string; key: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const { storeId, key } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        if (!key) {
            return new NextResponse("Key is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const siteContent = await prismadb.siteContent.delete({
            where: {
                storeId_key: { storeId, key },
            },
        });

        return NextResponse.json(siteContent);
    } catch (err) {
        console.log("[SITE_CONTENT_KEY_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}
