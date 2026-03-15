import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string; slug: string }> }
) {
    try {
        const { storeId, slug } = await params;

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        if (!slug) {
            return new NextResponse("Slug is required", { status: 400 });
        }

        const blogPost = await prismadb.blogPost.findUnique({
            where: {
                storeId_slug: { storeId, slug },
            },
        });

        return NextResponse.json(blogPost);
    } catch (err) {
        console.log("[BLOG_POST_SLUG_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}
