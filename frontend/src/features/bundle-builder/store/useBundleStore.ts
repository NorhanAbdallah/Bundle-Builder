import { create } from "zustand";
import type { ProductOption } from "../../../entities/bundle/types";

const STORAGE_KEY = "bundle-builder-v1";

interface BundleState {
  quantities: Record<string, number>;
  initialized: boolean;
  initialize: (options: ProductOption[]) => void;
  increment: (option: ProductOption) => void;
  decrement: (option: ProductOption) => void;
}

function loadQty(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

function saveQty(qtyById: Record<string, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(qtyById));
}

export const useBundleStore = create<BundleState>((set, get) => ({
  quantities: {},
  initialized: false,
  initialize: (options) => {
    if (get().initialized) return;
    const savedQty = loadQty();
    const qtyMap = options.reduce<Record<string, number>>((acc, option) => {
      const savedValue = savedQty[option.id];
      const safeQty =
        typeof savedValue === "number"
          ? Math.min(option.maxQuantity, Math.max(option.minQuantity, savedValue))
          : option.defaultQuantity;
      acc[option.id] = safeQty;
      return acc;
    }, {});
    // Persist right after hydration so refreshes stay deterministic across sessions.
    saveQty(qtyMap);
    set({ quantities: qtyMap, initialized: true });
  },
  increment: (option) => {
    const quantities = { ...get().quantities };
    quantities[option.id] = Math.min(option.maxQuantity, (quantities[option.id] ?? 0) + 1);
    saveQty(quantities);
    set({ quantities });
  },
  decrement: (option) => {
    const quantities = { ...get().quantities };
    const minAllowed = option.required ? Math.max(1, option.minQuantity) : option.minQuantity;
    quantities[option.id] = Math.max(minAllowed, (quantities[option.id] ?? 0) - 1);
    saveQty(quantities);
    set({ quantities });
  }
}));
