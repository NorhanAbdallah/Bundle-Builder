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

/** Simple 12-month financing estimate for checkout display. */
export function estimateMonthlyPayment(total: number, months = 12): number {
  if (total <= 0) return 0;
  return Math.round((total / months) * 100) / 100;
}

export const CATEGORY_LABELS: Record<ProductOption["category"], string> = {
  cameras: "Cameras",
  plan: "Plan",
  sensors: "Sensors",
  accessories: "Accessories",
  extras: "Extras"
};

export const REVIEW_CATEGORY_ORDER: ProductOption["category"][] = [
  "cameras",
  "plan",
  "sensors",
  "accessories",
  "extras"
];
