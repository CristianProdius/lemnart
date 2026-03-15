import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { QuickStatsData } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsQuickInsightsProps {
  data: QuickStatsData;
}

export function AnalyticsQuickInsights({ data }: AnalyticsQuickInsightsProps) {
  const totalBreakdown =
    data.breakdown.configured + data.breakdown.standard + data.breakdown.mixed;
  const configuredPct =
    totalBreakdown > 0
      ? Math.round((data.breakdown.configured / totalBreakdown) * 100)
      : 0;
  const standardPct =
    totalBreakdown > 0
      ? Math.round((data.breakdown.standard / totalBreakdown) * 100)
      : 0;
  const mixedPct =
    totalBreakdown > 0
      ? Math.round((data.breakdown.mixed / totalBreakdown) * 100)
      : 0;

  return (
    <Card className="h-full shadow-xs">
      <CardHeader>
        <CardTitle>Quick Insights</CardTitle>
        <CardDescription>
          Store activity at a glance
        </CardDescription>
      </CardHeader>

      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex h-full flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              label="Total orders"
              value={String(data.stats.totalOrders)}
            />
            <StatCard
              label="Total revenue"
              value={formatCurrency(data.stats.totalRevenue, {
                noDecimals: true,
              })}
              mono
            />
            <StatCard
              label="Unique customers"
              value={String(data.stats.uniqueCustomers)}
            />
            <StatCard
              label="Avg order value"
              value={formatCurrency(data.stats.avgOrderValue)}
              mono
            />
          </div>

          <div className="space-y-2 rounded-md border bg-muted/20 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs">Order breakdown</p>
              <Badge
                variant="outline"
                className="h-5 px-2 text-[11px] tabular-nums"
              >
                {totalBreakdown} total
              </Badge>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between rounded-md border bg-background/70 px-2.5 py-1.5">
                <span className="text-xs">Configured</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {data.breakdown.configured} orders · {configuredPct}%
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md border bg-background/70 px-2.5 py-1.5">
                <span className="text-xs">Standard</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {data.breakdown.standard} orders · {standardPct}%
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md border bg-background/70 px-2.5 py-1.5">
                <span className="text-xs">Mixed</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {data.breakdown.mixed} orders · {mixedPct}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-muted-foreground text-xs">
              Recent paid orders
            </p>

            {data.recentOrders.length > 0 ? (
              data.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="space-y-1 rounded-md border px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">
                      {formatCurrency(order.total)}
                    </span>
                    <Badge
                      variant="outline"
                      className="h-5 px-2 text-[11px]"
                    >
                      {order.createdAt}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {order.phone || "No phone"}
                  </p>
                  <p className="truncate text-xs">{order.products}</p>
                </div>
              ))
            ) : (
              <div className="rounded-md border px-3 py-4 text-center text-muted-foreground text-sm">
                No paid orders yet
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/20 px-3 py-2">
            <span className="text-muted-foreground text-xs">Pending</span>
            <span className="font-medium text-xs tabular-nums">
              {data.pendingCount} orders
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-md border bg-muted/20 px-2.5 py-2">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p
        className={
          mono
            ? "font-semibold text-base tabular-nums"
            : "font-semibold text-base"
        }
      >
        {value}
      </p>
    </div>
  );
}
