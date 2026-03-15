import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TopPerformersData } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsTopPerformersProps {
  data: TopPerformersData;
}

export function AnalyticsTopPerformers({ data }: AnalyticsTopPerformersProps) {
  const hasData = data.topProducts.length > 0;

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <CardDescription>
          Best-selling products by revenue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={
              hasData
                ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 rounded-md font-medium"
                : "rounded-md font-medium"
            }
          >
            {hasData ? "Trending" : "No Data"}
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            {data.totalOrders} orders · {data.totalProducts} products
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            Top Category: {data.topCategory}
          </Badge>
        </div>

        {hasData && (
          <p className="text-muted-foreground text-xs">
            Revenue concentrated in top products. Focus on keeping these stocked
            and visible.
          </p>
        )}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {data.topProducts.slice(0, 3).map((product) => (
            <div
              key={product.name}
              className="space-y-1 rounded-md border bg-muted/20 px-2.5 py-2"
            >
              <p className="text-muted-foreground text-xs">{product.name}</p>
              <p className="font-semibold text-sm tabular-nums">
                {formatCurrency(product.revenue)}
              </p>
              <p className="text-muted-foreground text-xs">
                {product.unitsSold} units · {product.percentage.toFixed(1)}% of
                revenue
              </p>
            </div>
          ))}
          {data.topProducts.length === 0 && (
            <div className="col-span-3 rounded-md border bg-muted/20 px-3 py-4 text-center text-muted-foreground text-sm">
              No paid orders yet
            </div>
          )}
        </div>

        {data.configuratorInsights.topStyle && (
          <div className="space-y-1 rounded-md border border-dashed bg-muted/10 px-3 py-2.5">
            <p className="text-muted-foreground text-xs">
              Configurator insights
            </p>
            <p className="text-xs">
              Top style:{" "}
              <span className="font-medium">
                {data.configuratorInsights.topStyle}
              </span>
              {data.configuratorInsights.topColor && (
                <>
                  {" · "}Top color:{" "}
                  <span className="font-medium">
                    {data.configuratorInsights.topColor}
                  </span>
                </>
              )}
            </p>
            <p className="text-muted-foreground text-xs">
              Avg dimensions: {data.configuratorInsights.avgWidth}×
              {data.configuratorInsights.avgHeight}cm
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
