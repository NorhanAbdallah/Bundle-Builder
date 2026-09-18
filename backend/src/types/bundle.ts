export type BundleCategory = "cameras" | "sensors" | "accessories" | "plan" | "extras";

export interface ProductOption {
  id: string;
  name: string;
  description?: string;
  category: BundleCategory;
  price: number;
  compareAtPrice?: number;
  required?: boolean;
  defaultQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  imageUrl: string;
  badge?: string;
  colorOptions?: string[];
}

export interface BundleStep {
  id: string;
  title: string;
  category: BundleCategory;
  /** When set, the step shows products from all listed categories. */
  categories?: BundleCategory[];
  defaultExpanded?: boolean;
}

export interface BundleOptionsResponse {
  options: ProductOption[];
}

export interface BundleConfigResponse {
  steps: BundleStep[];
  checkoutLabel: string;
}
