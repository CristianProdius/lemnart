import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (str: string): string => {
  if (typeof str !== "string" || !str.trim()) return "?";

  return (
    str
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
};

export const formatter = new Intl.NumberFormat("en-US", {
  style: 'currency',
  currency: "USD"
});

/**
 * Compute the revenue contribution of a single OrderItem row.
 * Uses the immutable `unitPrice` snapshot × `quantity`.
 * Null `unitPrice` is treated as exceptional (logged, skipped) after the
 * unitPrice backfill — does NOT fall back to live `product.price`.
 *
 * Configured items have a single-row `unitPrice` (already a snapshot) and
 * implicit quantity=1; callers use `Number(ci.unitPrice)` directly.
 */
export function orderItemRevenue(
  oi: {
    id?: string;
    quantity?: number;
    unitPrice?: unknown | null;
    product?: { price?: unknown };
  },
  context?: { orderId?: string },
): number {
  if (oi.unitPrice == null) {
    console.warn('[ANALYTICS] OrderItem missing unitPrice — skipping from total', {
      orderId: context?.orderId,
      orderItemId: oi.id,
    });
    return 0;
  }
  const qty = typeof oi.quantity === 'number' && oi.quantity >= 1 ? oi.quantity : 1;
  return Number(oi.unitPrice) * qty;
}

export function calculateOrderTotal(order: {
  id?: string;
  orderItems: Array<{
    id?: string;
    quantity?: number;
    unitPrice?: unknown | null;
    product: { price: unknown };
  }>;
  configuredItems: Array<{ unitPrice: unknown }>;
}): number {
  const productTotal = order.orderItems.reduce(
    (total, oi) => total + orderItemRevenue(oi, { orderId: order.id }),
    0,
  );
  const configTotal = order.configuredItems.reduce(
    (total, ci) => total + Number(ci.unitPrice),
    0,
  );
  return productTotal + configTotal;
}

export function formatCurrency(
  amount: number,
  opts?: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    noDecimals?: boolean;
  },
) {
  const { currency = "USD", locale = "en-US", minimumFractionDigits, maximumFractionDigits, noDecimals } = opts ?? {};

  const formatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits: noDecimals ? 0 : minimumFractionDigits,
    maximumFractionDigits: noDecimals ? 0 : maximumFractionDigits,
  };

  return new Intl.NumberFormat(locale, formatOptions).format(amount);
}
