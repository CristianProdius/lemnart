import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prismadb from "@/lib/prismadb";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();
        const { storeId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const { items } = body as { items: { id: string; sortOrder: number }[] };

        if (!items || !Array.isArray(items)) {
            return new NextResponse("Items array is required", { status: 400 });
        }

        await Promise.all(
            items.map((item) =>
                prismadb.blogPost.update({
                    where: { id: item.id },
                    data: { sortOrder: item.sortOrder },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        console.log("[BLOG_POSTS_REORDER]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}
