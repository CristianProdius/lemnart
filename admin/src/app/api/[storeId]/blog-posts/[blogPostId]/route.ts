import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string; blogPostId: string }> }
) {
    try {
        const { storeId, blogPostId } = await params;

        if (!blogPostId) {
            return new NextResponse("Blog post id is required", { status: 400 });
        }

        const blogPost = await prismadb.blogPost.findUnique({
            where: { id: blogPostId },
        });

        return NextResponse.json(blogPost);
    } catch (err) {
        console.log("[BLOG_POST_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ storeId: string; blogPostId: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();
        const { storeId, blogPostId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!blogPostId) {
            return new NextResponse("Blog post id is required", { status: 400 });
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

        const blogPost = await prismadb.blogPost.update({
            where: { id: blogPostId },
            data: {
                title: body.title,
                slug: body.slug,
                excerpt: body.excerpt,
                content: body.content,
                coverImage: body.coverImage,
                category: body.category,
                readTime: body.readTime,
                authorName: body.authorName,
                authorRole: body.authorRole,
                isPublished: body.isPublished,
                sortOrder: body.sortOrder,
                publishedAt: body.publishedAt,
            },
        });

        return NextResponse.json(blogPost);
    } catch (err) {
        console.log("[BLOG_POST_PATCH]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ storeId: string; blogPostId: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const { storeId, blogPostId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!blogPostId) {
            return new NextResponse("Blog post id is required", { status: 400 });
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

        const blogPost = await prismadb.blogPost.delete({
            where: { id: blogPostId },
        });

        return NextResponse.json(blogPost);
    } catch (err) {
        console.log("[BLOG_POST_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}
