import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params;
        const { searchParams } = new URL(req.url);
        const published = searchParams.get("published");

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        const blogPosts = await prismadb.blogPost.findMany({
            where: {
                storeId,
                ...(published === "true" ? { isPublished: true } : {}),
            },
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json(blogPosts);
    } catch (err) {
        console.log("[BLOG_POSTS_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function POST(
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

        if (!body.title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        if (!body.slug) {
            return new NextResponse("Slug is required", { status: 400 });
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

        const blogPost = await prismadb.blogPost.create({
            data: {
                storeId,
                title: body.title,
                slug: body.slug,
                excerpt: body.excerpt || "",
                content: body.content || "",
                coverImage: body.coverImage || "",
                category: body.category || "",
                readTime: body.readTime || "",
                authorName: body.authorName || "",
                authorRole: body.authorRole || "",
                isPublished: body.isPublished || false,
                sortOrder: body.sortOrder || 0,
                publishedAt: body.publishedAt || null,
            },
        });

        return NextResponse.json(blogPost);
    } catch (err) {
        console.log("[BLOG_POSTS_POST]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}
