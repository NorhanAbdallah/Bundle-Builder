import type { BundleConfigResponse, BundleOptionsResponse } from "../../../entities/bundle/types";

const apiBase = "http://localhost:4000/api/bundle";

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
