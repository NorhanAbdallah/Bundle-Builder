import type { ProductOption } from "./types";

export interface BundleTotals {
  subtotal: number;
  total: number;
  savings: number;
}

export function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function calculateTotals(
  options: ProductOption[],
  quantities: Record<string, number>
): BundleTotals {
  return options.reduce<BundleTotals>(
    (acc, option) => {
      const quantity = quantities[option.id] ?? 0;
      const base = option.price * quantity;
      const compare = (option.compareAtPrice ?? option.price) * quantity;
      acc.total += base;
      acc.subtotal += compare;
      acc.savings += compare - base;
      return acc;
    },
    { subtotal: 0, total: 0, savings: 0 }
  );
}
