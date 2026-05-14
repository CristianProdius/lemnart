import { subDays } from "date-fns";

import { getOverviewData, getStoreOverviewCards } from "@/lib/analytics";
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

  const now = new Date();
  const ninetyDaysAgo = subDays(now, 90);

  const [cardsData, overviewData, blogPosts] = await Promise.all([
    getStoreOverviewCards(storeId),
    getOverviewData(storeId, ninetyDaysAgo, now),
    prismadb.blogPost.findMany({
      where: { storeId },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const chartData = overviewData.chart.map((entry) => ({
    date: entry.day,
    revenue: entry.revenue,
  }));

  const blogPostRows = blogPosts.map((post) => ({
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards data={cardsData} />
      <ChartAreaInteractive data={chartData} />
      <ContentTabs blogPosts={blogPostRows} />
    </div>
  );
}
