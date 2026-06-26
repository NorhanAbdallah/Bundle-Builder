import { useEffect, useState } from "react";
import type { BundleConfigResponse, ProductOption } from "../../../entities/bundle/types";
import { fetchBundleConfig, fetchBundleOptions } from "../api/bundleApi";

interface BundleDataState {
  items: ProductOption[];
  config: BundleConfigResponse | null;
  loading: boolean;
  error: string | null;
}

export function useBundleData(): BundleDataState {
  const [data, setData] = useState<BundleDataState>({
    items: [],
    config: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchBundleOptions(), fetchBundleConfig()])
      .then(([optionsResponse, configResponse]) => {
        if (!mounted) return;
        setData({
          items: optionsResponse.options,
          config: configResponse,
          loading: false,
          error: null
        });
      })
      .catch((error: Error) => {
        if (!mounted) return;
        setData((current) => ({ ...current, loading: false, error: error.message }));
      });
    return () => {
      mounted = false;
    };
  }, []);

  return data;
}
