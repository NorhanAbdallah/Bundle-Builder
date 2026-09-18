import { create } from "zustand";
import type { ProductOption } from "../../../entities/bundle/types";

const STORAGE_KEY = "bundle-builder-v2";

interface PersistedBundle {
  quantities: Record<string, number>;
  colors: Record<string, string>;
}

interface BundleState {
  quantities: Record<string, number>;
  colors: Record<string, string>;
  initialized: boolean;
  initialize: (options: ProductOption[]) => void;
  increment: (option: ProductOption) => void;
  decrement: (option: ProductOption) => void;
  selectPlan: (option: ProductOption, planOptions: ProductOption[]) => void;
  setColor: (optionId: string, color: string) => void;
}

function loadPersisted(): PersistedBundle {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { quantities: {}, colors: {} };
    const parsed = JSON.parse(raw) as PersistedBundle;
    return {
      quantities: parsed.quantities ?? {},
      colors: parsed.colors ?? {}
    };
  } catch {
    return { quantities: {}, colors: {} };
  }
}

function savePersisted(state: Pick<BundleState, "quantities" | "colors">) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ quantities: state.quantities, colors: state.colors })
  );
}

export const useBundleStore = create<BundleState>((set, get) => ({
  quantities: {},
  colors: {},
  initialized: false,
  initialize: (options) => {
    if (get().initialized) return;
    const saved = loadPersisted();
    const qtyMap = options.reduce<Record<string, number>>((acc, option) => {
      const savedValue = saved.quantities[option.id];
      const safeQty =
        typeof savedValue === "number"
          ? Math.min(option.maxQuantity, Math.max(option.minQuantity, savedValue))
          : option.defaultQuantity;
      acc[option.id] = safeQty;
      return acc;
    }, {});

    const colorMap = options.reduce<Record<string, string>>((acc, option) => {
      const savedColor = saved.colors[option.id];
      const fallback = option.colorOptions?.[0];
      if (savedColor && option.colorOptions?.includes(savedColor)) {
        acc[option.id] = savedColor;
      } else if (fallback) {
        acc[option.id] = fallback;
      }
      return acc;
    }, {});

    const next = { quantities: qtyMap, colors: colorMap };
    savePersisted(next);
    set({ ...next, initialized: true });
  },
  increment: (option) => {
    const quantities = { ...get().quantities };
    quantities[option.id] = Math.min(option.maxQuantity, (quantities[option.id] ?? 0) + 1);
    const next = { quantities, colors: get().colors };
    savePersisted(next);
    set(next);
  },
  decrement: (option) => {
    const quantities = { ...get().quantities };
    const minAllowed = option.required ? Math.max(1, option.minQuantity) : option.minQuantity;
    quantities[option.id] = Math.max(minAllowed, (quantities[option.id] ?? 0) - 1);
    const next = { quantities, colors: get().colors };
    savePersisted(next);
    set(next);
  },
  selectPlan: (option, planOptions) => {
    const quantities = { ...get().quantities };
    for (const plan of planOptions) {
      quantities[plan.id] = plan.id === option.id ? 1 : 0;
    }
    const next = { quantities, colors: get().colors };
    savePersisted(next);
    set(next);
  },
  setColor: (optionId, color) => {
    const colors = { ...get().colors, [optionId]: color };
    const next = { quantities: get().quantities, colors };
    savePersisted(next);
    set(next);
  }
}));
