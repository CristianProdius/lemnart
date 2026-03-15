"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Dot,
  Line,
  XAxis,
  YAxis,
} from "recharts";

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
import type { TrendsData } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";

const trendsChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Cumulative Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface AnalyticsRevenueTrendsProps {
  data: TrendsData;
}

export function AnalyticsRevenueTrends({ data }: AnalyticsRevenueTrendsProps) {
  // Build cumulative orders for the line
  let cumulative = 0;
  const chartData = data.chartData.map((w) => {
    cumulative += w.orders;
    return { ...w, cumulativeOrders: cumulative };
  });

  const ordersValues = chartData.map((p) => p.cumulativeOrders);
  const ordersMin = Math.min(...ordersValues, 0);
  const ordersMax = Math.max(...ordersValues, 1);

  const growthSign = data.metrics.growthRate >= 0 ? "+" : "";

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
        <CardDescription>12-week revenue with cumulative orders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricChip
            label="Monthly Revenue"
            value={formatCurrency(data.metrics.monthlyRevenue, {
              noDecimals: true,
            })}
            note="last 30 days (paid)"
          />
          <MetricChip
            label="Pending Revenue"
            value={formatCurrency(data.metrics.pendingRevenue, {
              noDecimals: true,
            })}
            note="unpaid orders"
          />
          <MetricChip
            label="Growth"
            value={`${growthSign}${data.metrics.growthRate.toFixed(1)}%`}
            note="2nd half vs 1st half"
          />
        </div>
        <ChartContainer config={trendsChartConfig} className="h-68 w-full">
          <ComposedChart
            data={chartData}
            margin={{ left: 4, right: 8, top: 8, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeOpacity={0.25}
            />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tickFormatter={(value) =>
                formatCurrency(value, { noDecimals: true })
              }
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={60}
              domain={[0, "auto"]}
            />
            <YAxis
              yAxisId="orders"
              hide
              domain={[ordersMin, ordersMax * 1.2]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="var(--color-revenue)"
              fillOpacity={0.22}
              stroke="var(--color-revenue)"
              strokeOpacity={0.35}
              radius={[5, 5, 0, 0]}
              barSize={14}
            />
            <Line
              type="monotone"
              yAxisId="orders"
              dataKey="cumulativeOrders"
              name="Cumulative Orders"
              strokeOpacity={0}
              strokeWidth={0}
              stroke="var(--color-orders)"
              isAnimationActive={false}
              dot={({ payload, ...props }) => (
                <Dot
                  key={`${payload.period}-orders`}
                  cx={props.cx}
                  cy={props.cy}
                  r={3.5}
                  fill="var(--color-orders)"
                  stroke="var(--color-orders)"
                  strokeWidth={7}
                  strokeOpacity={0.08}
                />
              )}
              activeDot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function MetricChip({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-md border bg-muted/35 px-3 py-2.5">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-semibold text-lg tabular-nums">{value}</p>
      <p className="text-muted-foreground text-xs">{note}</p>
    </div>
  );
}
