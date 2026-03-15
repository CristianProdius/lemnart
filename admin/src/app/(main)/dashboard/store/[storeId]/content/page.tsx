import prismadb from "@/lib/prismadb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ContentTabs } from "./_components/content-tabs";

const ContentPage = async ({
    params,
}: {
    params: Promise<{ storeId: string }>;
}) => {
    const { storeId } = await params;

    const blogPosts = await prismadb.blogPost.findMany({
        where: { storeId },
        orderBy: { sortOrder: "asc" },
    });

    const blogPostRows = blogPosts.map((post) => ({
        ...post,
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
    }));

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Heading
                title="Content Manager"
                description="Manage your blog posts and site page content."
            />
            <Separator />
            <ContentTabs blogPosts={blogPostRows} />
        </div>
    );
};

export default ContentPage;
