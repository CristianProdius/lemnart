import prismadb from "@/lib/prismadb";
import { ChartAreaInteractive } from "../../default/_components/chart-area-interactive";
import { SectionCards } from "../../default/_components/section-cards";
import { ContentTabs } from "./content/_components/content-tabs";

export default async function StoreDashboardPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
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
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
      <ContentTabs blogPosts={blogPostRows} />
    </div>
  );
}
