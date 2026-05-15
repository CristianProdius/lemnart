import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  format,
  startOfWeek,
  subDays,
} from "date-fns";

import prismadb from "@/lib/prismadb";
import { calculateOrderTotal, orderItemRevenue } from "@/lib/utils";

type OrderWithItems = Awaited<
  ReturnType<typeof prismadb.order.findMany<{
    include: {
      orderItems: { include: { product: true } };
      configuredItems: true;
    };
  }>>
>[number];

// ─── Overview ──────────────────────────────────────────────────────────────────

export type OverviewData = {
  revenue: number;
  revenueChange: number;
  previousRevenue: number;
  chart: Array<{ day: string; revenue: number }>;
  metrics: {
    pendingOrders: number;
    unpaidRevenue: number;
    paymentRate: number;
    avgOrderValue: number;
  };
};

export async function getOverviewData(
  storeId: string,
  from: Date,
  to: Date
): Promise<OverviewData> {
  const rangeMs = to.getTime() - from.getTime();
  const prevFrom = new Date(from.getTime() - rangeMs);
  const prevTo = new Date(from.getTime() - 1);

  const [currentOrders, previousOrders] = await Promise.all([
    prismadb.order.findMany({
      where: { storeId, createdAt: { gte: from, lte: to } },
      include: {
        orderItems: { include: { product: true } },
        configuredItems: true,
      },
    }),
    prismadb.order.findMany({
      where: { storeId, createdAt: { gte: prevFrom, lte: prevTo } },
      include: {
        orderItems: { include: { product: true } },
        configuredItems: true,
      },
    }),
  ]);

  const paidCurrent = currentOrders.filter((o) => o.isPaid);
  const revenue = paidCurrent.reduce(
    (sum, o) => sum + calculateOrderTotal(o),
    0
  );
  const previousRevenue = previousOrders
    .filter((o) => o.isPaid)
    .reduce((sum, o) => sum + calculateOrderTotal(o), 0);

  const revenueChange =
    previousRevenue > 0
      ? ((revenue - previousRevenue) / previousRevenue) * 100
      : revenue > 0
        ? 100
        : 0;

  // Build daily chart
  const days = eachDayOfInterval({ start: from, end: to });
  const dayMap = new Map<string, number>();
  for (const d of days) dayMap.set(format(d, "yyyy-MM-dd"), 0);
  for (const order of paidCurrent) {
    const key = format(order.createdAt, "yyyy-MM-dd");
    dayMap.set(key, (dayMap.get(key) ?? 0) + calculateOrderTotal(order));
  }
  const chart = days.map((d) => ({
    day: format(d, "MMM d"),
    revenue: Math.round((dayMap.get(format(d, "yyyy-MM-dd")) ?? 0) * 100) / 100,
  }));

  // Metrics
  const pendingOrders = currentOrders.filter((o) => !o.isPaid).length;
  const unpaidRevenue = currentOrders
    .filter((o) => !o.isPaid)
    .reduce((sum, o) => sum + calculateOrderTotal(o), 0);
  const totalOrders = currentOrders.length;
  const paymentRate = totalOrders > 0 ? (paidCurrent.length / totalOrders) * 100 : 0;
  const totalRevenue = currentOrders.reduce(
    (sum, o) => sum + calculateOrderTotal(o),
    0
  );
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    revenue,
    revenueChange,
    previousRevenue,
    chart,
    metrics: { pendingOrders, unpaidRevenue, paymentRate, avgOrderValue },
  };
}

// ─── Store Overview Cards ────────────────────────────────────────────────────

export type StoreOverviewCardsData = {
  totalRevenue: number;
  totalRevenueChange: number;
  totalOrders: number;
  totalOrdersChange: number;
  uniqueCustomers: number;
  uniqueCustomersChange: number;
  avgOrderValue: number;
  avgOrderValueChange: number;
};

export async function getStoreOverviewCards(
  storeId: string
): Promise<StoreOverviewCardsData> {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const sixtyDaysAgo = subDays(now, 60);

  const [currentOrders, previousOrders] = await Promise.all([
    prismadb.order.findMany({
      where: { storeId, createdAt: { gte: thirtyDaysAgo, lte: now } },
      include: {
        orderItems: { include: { product: true } },
        configuredItems: true,
      },
    }),
    prismadb.order.findMany({
      where: { storeId, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
      include: {
        orderItems: { include: { product: true } },
        configuredItems: true,
      },
    }),
  ]);

  const currentPaid = currentOrders.filter((o) => o.isPaid);
  const previousPaid = previousOrders.filter((o) => o.isPaid);

  const totalRevenue = currentPaid.reduce(
    (sum, o) => sum + calculateOrderTotal(o),
    0
  );
  const prevRevenue = previousPaid.reduce(
    (sum, o) => sum + calculateOrderTotal(o),
    0
  );

  const totalOrders = currentOrders.length;
  const prevTotalOrders = previousOrders.length;

  const currentPhones = new Set(
    currentOrders.map((o) => o.phone).filter(Boolean)
  );
  const prevPhones = new Set(
    previousOrders.map((o) => o.phone).filter(Boolean)
  );

  const avgOrderValue =
    currentPaid.length > 0 ? totalRevenue / currentPaid.length : 0;
  const prevAvgOrderValue =
    previousPaid.length > 0 ? prevRevenue / previousPaid.length : 0;

  const pctChange = (curr: number, prev: number) =>
    prev > 0 ? ((curr - prev) / prev) * 100 : curr > 0 ? 100 : 0;

  return {
    totalRevenue,
    totalRevenueChange: pctChange(totalRevenue, prevRevenue),
    totalOrders,
    totalOrdersChange: pctChange(totalOrders, prevTotalOrders),
    uniqueCustomers: currentPhones.size,
    uniqueCustomersChange: pctChange(currentPhones.size, prevPhones.size),
    avgOrderValue,
    avgOrderValueChange: pctChange(avgOrderValue, prevAvgOrderValue),
  };
}

// ─── Trends ────────────────────────────────────────────────────────────────────

export type TrendsData = {
  chartData: Array<{ period: string; revenue: number; orders: number }>;
  metrics: {
    monthlyRevenue: number;
    pendingRevenue: number;
    growthRate: number;
  };
};

export async function getTrendsData(
  storeId: string,
  weeks: number = 12
): Promise<TrendsData> {
  const to = new Date();
  const from = subDays(to, weeks * 7);

  const orders = await prismadb.order.findMany({
    where: { storeId, createdAt: { gte: from, lte: to } },
    include: {
      orderItems: { include: { product: true } },
      configuredItems: true,
    },
  });

  const weekStarts = eachWeekOfInterval(
    { start: from, end: to },
    { weekStartsOn: 1 }
  );

  const chartData = weekStarts.map((weekStart, idx) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weekOrders = orders.filter(
      (o) => o.isPaid && o.createdAt >= weekStart && o.createdAt <= weekEnd
    );
    return {
      period: `W${idx + 1}`,
      revenue: Math.round(
        weekOrders.reduce((sum, o) => sum + calculateOrderTotal(o), 0) * 100
      ) / 100,
      orders: weekOrders.length,
    };
  });

  // Last 30 days paid revenue
  const last30 = subDays(to, 30);
  const recentPaid = orders.filter(
    (o) => o.isPaid && o.createdAt >= last30
  );
  const monthlyRevenue = recentPaid.reduce(
    (sum, o) => sum + calculateOrderTotal(o),
    0
  );

  const pendingRevenue = orders
    .filter((o) => !o.isPaid)
    .reduce((sum, o) => sum + calculateOrderTotal(o), 0);

  // Growth: compare first half to second half of weeks
  const mid = Math.floor(chartData.length / 2);
  const firstHalf = chartData.slice(0, mid).reduce((s, w) => s + w.revenue, 0);
  const secondHalf = chartData.slice(mid).reduce((s, w) => s + w.revenue, 0);
  const growthRate =
    firstHalf > 0
      ? ((secondHalf - firstHalf) / firstHalf) * 100
      : secondHalf > 0
        ? 100
        : 0;

  return {
    chartData,
    metrics: { monthlyRevenue, pendingRevenue, growthRate },
  };
}

// ─── Top Performers ────────────────────────────────────────────────────────────

export type TopPerformersData = {
  topProducts: Array<{
    name: string;
    unitsSold: number;
    revenue: number;
    percentage: number;
  }>;
  topCategory: string;
  totalOrders: number;
  totalProducts: number;
  configuratorInsights: {
    topStyle: string | null;
    topColor: string | null;
    avgWidth: number;
    avgHeight: number;
  };
};

export async function getTopPerformersData(
  storeId: string
): Promise<TopPerformersData> {
  const orders = await prismadb.order.findMany({
    where: { storeId, isPaid: true },
    include: {
      orderItems: { include: { product: true } },
      configuredItems: true,
    },
  });

  // Aggregate product sales
  const productMap = new Map<
    string,
    { name: string; unitsSold: number; revenue: number }
  >();
  for (const order of orders) {
    for (const oi of order.orderItems) {
      const existing = productMap.get(oi.productId) ?? {
        name: oi.product.name,
        unitsSold: 0,
        revenue: 0,
      };
      const qty = typeof oi.quantity === "number" && oi.quantity >= 1 ? oi.quantity : 1;
      existing.unitsSold += qty;
      existing.revenue += orderItemRevenue(oi, { orderId: order.id });
      productMap.set(oi.productId, existing);
    }
  }

  // Aggregate configured item sales by styleName
  const styleMap = new Map<
    string,
    { name: string; unitsSold: number; revenue: number }
  >();
  for (const order of orders) {
    for (const ci of order.configuredItems) {
      const key = ci.styleName;
      const existing = styleMap.get(key) ?? {
        name: ci.styleName,
        unitsSold: 0,
        revenue: 0,
      };
      existing.unitsSold += 1;
      existing.revenue += Number(ci.unitPrice);
      styleMap.set(key, existing);
    }
  }

  // Merge and sort
  const allProducts = [
    ...Array.from(productMap.values()),
    ...Array.from(styleMap.values()),
  ];
  const totalRevenue = allProducts.reduce((s, p) => s + p.revenue, 0);
  const sorted = allProducts.sort((a, b) => b.revenue - a.revenue);
  const topProducts = sorted.slice(0, 5).map((p) => ({
    ...p,
    percentage: totalRevenue > 0 ? (p.revenue / totalRevenue) * 100 : 0,
  }));

  const topCategory = sorted[0]?.name ?? "N/A";

  // Configurator insights
  const allConfigured = orders.flatMap((o) => o.configuredItems);
  const styleCount = new Map<string, number>();
  const colorCount = new Map<string, number>();
  let totalWidth = 0;
  let totalHeight = 0;

  for (const ci of allConfigured) {
    styleCount.set(ci.styleName, (styleCount.get(ci.styleName) ?? 0) + 1);
    colorCount.set(ci.colorName, (colorCount.get(ci.colorName) ?? 0) + 1);
    totalWidth += Number(ci.width);
    totalHeight += Number(ci.height);
  }

  const topStyle = allConfigured.length > 0
    ? Array.from(styleCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    : null;
  const topColor = allConfigured.length > 0
    ? Array.from(colorCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    : null;

  const productCount = await prismadb.product.count({ where: { storeId } });

  return {
    topProducts,
    topCategory,
    totalOrders: orders.length,
    totalProducts: productCount,
    configuratorInsights: {
      topStyle,
      topColor,
      avgWidth: allConfigured.length > 0 ? Math.round(totalWidth / allConfigured.length) : 0,
      avgHeight: allConfigured.length > 0 ? Math.round(totalHeight / allConfigured.length) : 0,
    },
  };
}

// ─── Quick Stats ───────────────────────────────────────────────────────────────

export type QuickStatsData = {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    uniqueCustomers: number;
    avgOrderValue: number;
  };
  breakdown: {
    configured: number;
    standard: number;
    mixed: number;
  };
  recentOrders: Array<{
    id: string;
    phone: string;
    total: number;
    createdAt: string;
    products: string;
  }>;
  pendingCount: number;
};

export async function getQuickStatsData(
  storeId: string
): Promise<QuickStatsData> {
  const orders = await prismadb.order.findMany({
    where: { storeId },
    include: {
      orderItems: { include: { product: true } },
      configuredItems: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const paidOrders = orders.filter((o) => o.isPaid);
  const totalRevenue = paidOrders.reduce(
    (sum, o) => sum + calculateOrderTotal(o),
    0
  );

  const phones = new Set(orders.map((o) => o.phone).filter(Boolean));

  const avgOrderValue =
    paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  // Breakdown
  let configured = 0;
  let standard = 0;
  let mixed = 0;
  for (const o of orders) {
    const hasStandard = o.orderItems.length > 0;
    const hasConfigured = o.configuredItems.length > 0;
    if (hasStandard && hasConfigured) mixed++;
    else if (hasConfigured) configured++;
    else standard++;
  }

  // Recent 3 paid orders
  const recentOrders = paidOrders.slice(0, 3).map((o) => {
    const productNames = o.orderItems.map((oi) => oi.product.name);
    const configNames = o.configuredItems.map(
      (ci) => `${ci.styleName} (${ci.width}×${ci.height}cm)`
    );
    return {
      id: o.id,
      phone: o.phone,
      total: calculateOrderTotal(o),
      createdAt: format(o.createdAt, "MMM d, yyyy"),
      products: [...productNames, ...configNames].join(", ") || "No items",
    };
  });

  return {
    stats: {
      totalOrders: orders.length,
      totalRevenue,
      uniqueCustomers: phones.size,
      avgOrderValue,
    },
    breakdown: { configured, standard, mixed },
    recentOrders,
    pendingCount: orders.filter((o) => !o.isPaid).length,
  };
}

// ─── Order Ledger ──────────────────────────────────────────────────────────────

export type OrderLedgerRow = {
  id: string;
  products: string;
  customer: string;
  address: string;
  total: number;
  isPaid: boolean;
  createdAt: string;
  createdAtRaw: Date;
};

export type OrderLedgerData = {
  orders: OrderLedgerRow[];
  summary: {
    total: number;
    paid: number;
    pending: number;
    totalRevenue: number;
  };
};

export async function getOrderLedgerData(
  storeId: string
): Promise<OrderLedgerData> {
  const orders = await prismadb.order.findMany({
    where: { storeId },
    include: {
      orderItems: { include: { product: true } },
      configuredItems: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const rows: OrderLedgerRow[] = orders.map((o) => {
    const productNames = o.orderItems.map((oi) => oi.product.name);
    const configNames = o.configuredItems.map(
      (ci) => `${ci.styleName} (${ci.width}×${ci.height}cm)`
    );
    return {
      id: o.id,
      products: [...productNames, ...configNames].join(", ") || "No items",
      customer: o.phone || "Unknown",
      address: o.address || "N/A",
      total: calculateOrderTotal(o),
      isPaid: o.isPaid,
      createdAt: format(o.createdAt, "MMM d, yyyy"),
      createdAtRaw: o.createdAt,
    };
  });

  const paid = orders.filter((o) => o.isPaid);
  const totalRevenue = paid.reduce(
    (sum, o) => sum + calculateOrderTotal(o),
    0
  );

  return {
    orders: rows,
    summary: {
      total: orders.length,
      paid: paid.length,
      pending: orders.length - paid.length,
      totalRevenue,
    },
  };
}
