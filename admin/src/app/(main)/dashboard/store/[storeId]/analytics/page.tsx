import { subDays, startOfDay } from "date-fns";

import {
  getOverviewData,
  getTrendsData,
  getTopPerformersData,
  getQuickStatsData,
  getOrderLedgerData,
} from "@/lib/analytics";

import { AnalyticsOverview } from "./_components/analytics-overview";
import { AnalyticsRevenueTrends } from "./_components/analytics-revenue-trends";
import { AnalyticsTopPerformers } from "./_components/analytics-top-performers";
import { AnalyticsQuickInsights } from "./_components/analytics-quick-insights";
import { AnalyticsOrdersLedger } from "./_components/analytics-orders-ledger";

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { storeId } = await params;
  const search = await searchParams;

  const today = startOfDay(new Date());
  const from = search.from ? new Date(search.from) : subDays(today, 29);
  const to = search.to ? new Date(search.to) : today;

  const [overview, trends, topPerformers, quickStats, orderLedger] =
    await Promise.all([
      getOverviewData(storeId, from, to),
      getTrendsData(storeId),
      getTopPerformersData(storeId),
      getQuickStatsData(storeId),
      getOrderLedgerData(storeId),
    ]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <AnalyticsOverview data={overview} from={from} to={to} />

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <AnalyticsRevenueTrends data={trends} />
          <AnalyticsTopPerformers data={topPerformers} />
        </div>
        <AnalyticsQuickInsights data={quickStats} />
      </div>

      <AnalyticsOrdersLedger data={orderLedger} />
    </div>
  );
}
