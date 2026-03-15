"use client";

import * as React from "react";

import { Download } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { Area, ComposedChart, XAxis, YAxis } from "recharts";

import { DateRangePicker } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { OverviewData } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsOverviewProps {
  data: OverviewData;
  from: Date;
  to: Date;
}

export function AnalyticsOverview({ data, from, to }: AnalyticsOverviewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleDateRangeChange = (value: DateRange | undefined) => {
    if (!value?.from || !value?.to) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", value.from.toISOString().split("T")[0]);
    params.set("to", value.to.toISOString().split("T")[0]);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold text-lg">Analytics</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker
            value={{ from, to }}
            onChange={handleDateRangeChange}
          />
          <Button variant="secondary">
            <Download />
            Export
          </Button>
        </div>
      </div>

      <SummaryRow data={data} />
    </div>
  );
}

function SummaryRow({ data }: { data: OverviewData }) {
  const revenueChartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const revenueValues = data.chart.map((point) => point.revenue);
  const minRevenue = Math.min(...revenueValues);
  const maxRevenue = Math.max(...revenueValues);
  const midpoint = (minRevenue + maxRevenue) / 2;
  const halfRange = Math.max((maxRevenue - minRevenue) * 1.6, 10);

  const changeSign = data.revenueChange >= 0 ? "+" : "";
  const changeDelta = data.revenue - data.previousRevenue;
  const changeDeltaSign = changeDelta >= 0 ? "+" : "";

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-2">
        <div>
          <div className="font-medium text-muted-foreground text-sm">
            Revenue
          </div>
          <div className="font-semibold text-4xl tabular-nums tracking-tight">
            {formatCurrency(data.revenue, { noDecimals: true })}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {changeSign}
            {data.revenueChange.toFixed(1)}%
          </Badge>
          <Badge variant="secondary">
            {changeDeltaSign}
            {formatCurrency(changeDelta, { noDecimals: true })}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
          <span>
            Previous {formatCurrency(data.previousRevenue, { noDecimals: true })}
          </span>
        </div>
        <div>
          <ChartContainer
            config={revenueChartConfig}
            className="h-10 w-full rounded-md border"
          >
            <ComposedChart
              data={data.chart}
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            >
              <XAxis dataKey="day" hide />
              <YAxis
                hide
                domain={[midpoint - halfRange, midpoint + halfRange]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="var(--color-revenue)"
                fillOpacity={0.14}
                stroke="var(--color-revenue)"
              />
            </ComposedChart>
          </ChartContainer>
          <span className="text-muted-foreground text-xs">Selected range</span>
        </div>
      </div>

      <Card className="py-4 shadow-xs lg:col-span-2">
        <CardHeader className="px-4">
          <CardTitle>Key Metrics</CardTitle>
          <CardDescription>
            Order and revenue signals for selected period
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:[&>div:first-child]:pl-0 lg:[&>div:last-child]:pr-0 lg:[&>div]:px-5">
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm">Pending Orders</div>
            <div className="font-semibold text-2xl tabular-nums">
              {data.metrics.pendingOrders}
            </div>
            <div className="text-muted-foreground text-xs">
              awaiting payment
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm">Unpaid Revenue</div>
            <div className="font-semibold text-2xl tabular-nums">
              {formatCurrency(data.metrics.unpaidRevenue, { noDecimals: true })}
            </div>
            <div className="text-muted-foreground text-xs">
              pending orders total
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm">Payment Rate</div>
            <div className="font-semibold text-2xl tabular-nums">
              {data.metrics.paymentRate.toFixed(1)}%
            </div>
            <div className="text-muted-foreground text-xs">
              paid / total orders
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm">
              Avg Order Value
            </div>
            <div className="font-semibold text-2xl tabular-nums">
              {formatCurrency(data.metrics.avgOrderValue)}
            </div>
            <div className="text-muted-foreground text-xs">
              across all orders
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
