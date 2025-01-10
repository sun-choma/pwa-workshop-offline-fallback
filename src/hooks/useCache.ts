import { useCallback, useState } from "react";

import { useServiceWorker } from "@/providers/workbox/useServiceWorker.tsx";
import {
  CACHE_ALL_EVENT,
  CACHE_CSS_EVENT,
  CACHE_HTML_EVENT,
  REMOVE_CACHE_EVENT,
} from "@/constants.ts";
import { toaster } from "@/components/ui/toaster.tsx";

interface CacheResponse {
  hasSucceeded?: boolean;
  hasFailed?: boolean;
  details?: string;
}

function notifyResponse(res: CacheResponse) {
  toaster.create({
    title: res.hasSucceeded ? "Done!" : res.hasFailed ? "Failed :(" : "Oops!",
    type: res.hasSucceeded ? "success" : res.hasFailed ? "error" : "warning",
    description: res.details,
  });
}

export function useCache() {
  const [isLoading, setLoading] = useState(false);
  const { worker } = useServiceWorker();

  const notifyWorker = useCallback(
    async (type: string) => {
      if (worker) {
        setLoading(true);
        const response: CacheResponse = await worker.messageSW({
          type,
        });
        notifyResponse(response);
        setLoading(false);
      }
    },
    [worker],
  );

  const addHtmlCache = useCallback(
    () => notifyWorker(CACHE_HTML_EVENT),
    [notifyWorker],
  );
  const addCssCache = useCallback(
    () => notifyWorker(CACHE_CSS_EVENT),
    [notifyWorker],
  );
  const addAllResourcesCache = useCallback(
    () => notifyWorker(CACHE_ALL_EVENT),
    [notifyWorker],
  );
  const clearCache = useCallback(
    () => notifyWorker(REMOVE_CACHE_EVENT),
    [notifyWorker],
  );

  return {
    addHtmlCache,
    addCssCache,
    addAllResourcesCache,
    clearCache,
    isLoading,
  };
}
