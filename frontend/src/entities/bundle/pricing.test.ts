import { describe, expect, it } from "vitest";
import { calculateTotals, estimateMonthlyPayment, formatMoney } from "./pricing";
import type { ProductOption } from "./types";

const sampleItems: ProductOption[] = [
  {
    id: "a",
    name: "A",
    category: "cameras",
    price: 10,
    compareAtPrice: 15,
    defaultQuantity: 1,
    minQuantity: 0,
    maxQuantity: 2,
    imageUrl: ""
  }
];

describe("pricing", () => {
  it("calculates totals and savings", () => {
    const totals = calculateTotals(sampleItems, { a: 2 });
    expect(totals.total).toBe(20);
    expect(totals.subtotal).toBe(30);
    expect(totals.savings).toBe(10);
  });

  it("formats money", () => {
    expect(formatMoney(19.5)).toBe("$19.50");
  });

  it("estimates monthly financing", () => {
    expect(estimateMonthlyPayment(120)).toBe(10);
    expect(estimateMonthlyPayment(0)).toBe(0);
  });
});
