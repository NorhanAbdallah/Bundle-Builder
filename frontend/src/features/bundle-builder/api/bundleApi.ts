import type { BundleConfigResponse, BundleOptionsResponse } from "../../../entities/bundle/types";

// Local: Vite proxy (`/api`). Production: set VITE_API_BASE to your Render API URL.
const apiBase = import.meta.env.VITE_API_BASE ?? "/api/bundle";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function fetchBundleOptions() {
  return getJson<BundleOptionsResponse>(`${apiBase}/options`);
}

export function fetchBundleConfig() {
  return getJson<BundleConfigResponse>(`${apiBase}/config`);
}
