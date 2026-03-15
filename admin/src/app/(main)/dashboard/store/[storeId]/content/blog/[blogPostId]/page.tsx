import prismadb from "@/lib/prismadb";
import { BlogPostForm } from "./_components/blog-post-form";

const BlogPostPage = async ({
    params,
}: {
    params: Promise<{ storeId: string; blogPostId: string }>;
}) => {
    const { blogPostId } = await params;

    const blogPost =
        blogPostId === "new"
            ? null
            : await prismadb.blogPost.findUnique({
                  where: { id: blogPostId },
              });

    const storeUrl = process.env.FRONTEND_STORE_URL || "http://localhost:3002";

    return (
        <div className="flex-1">
            <BlogPostForm initialData={blogPost} storeUrl={storeUrl} />
        </div>
    );
};

export default BlogPostPage;
