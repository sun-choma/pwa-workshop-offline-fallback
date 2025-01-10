import { clientsClaim } from "workbox-core";
import { setCatchHandler, setDefaultHandler } from "workbox-routing";
import { NetworkOnly } from "workbox-strategies";

import { RejectFetchPlugin } from "@/plugins/rejectFetch";
import {
  CACHE_ALL_EVENT,
  CACHE_CSS_EVENT,
  CACHE_HTML_EVENT,
  REMOVE_CACHE_EVENT,
} from "@/constants.ts";
import { addToCache } from "@/service-worker/utils.ts";
import { DevManifestPlugin } from "@/plugins/devManifest";

declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: {
    revision: string | null;
    url: string;
  }[];
  __DEV_MANIFEST: string[];
};

const CACHE_NAME = "pwa-cache-storage";

setDefaultHandler(
  new NetworkOnly({
    plugins: [
      new RejectFetchPlugin({
        rejectOffline: true,
      }),
      // This plugin enables caching capabilities for dev mode. It tracks all files being requested by web app,
      // so caching mechanism can store some of them later
      new DevManifestPlugin(),
    ],
  }),
);

// Fallback logic on network error (no connection etc.)
setCatchHandler(async (params) => {
  // In case of html page being requested (initial load) returning index page
  //  else try to find requested resource in cache
  const requestedResource =
    params.request.destination === "document"
      ? await caches.match("index.html")
      : await caches.match(params.request.url);
  if (requestedResource) return requestedResource;
  else return Response.error();
});

// For the sake of simplicity - activate SW as soon as it's ready
// (Not recommended in most practical scenarios)
clientsClaim();

self.addEventListener("message", async (event) => {
  const resources =
    process.env.NODE_ENV === "development"
      ? self.__DEV_MANIFEST
      : structuredClone(self.__WB_MANIFEST).map((entry) => entry.url);

  switch (event.data.type) {
    case CACHE_HTML_EVENT: {
      const response = await addToCache({
        resources,
        includes: [/^[^.]+$|.+\.(?:html|ts|tsx|js|jsx|mjs)$/],
        cacheName: CACHE_NAME,
      });

      event.ports[0].postMessage(response);
      break;
    }
    case CACHE_CSS_EVENT: {
      const response = await addToCache({
        resources,
        includes: [/\.(?:css|scss)$/],
        cacheName: CACHE_NAME,
      });

      event.ports[0].postMessage(response);
      break;
    }

    case CACHE_ALL_EVENT: {
      const response = await addToCache({
        resources,
        cacheName: CACHE_NAME,
      });

      event.ports[0].postMessage(response);
      break;
    }

    case REMOVE_CACHE_EVENT: {
      const wasDeleted = await caches.delete(CACHE_NAME);

      event.ports[0].postMessage({
        hasSucceeded: wasDeleted,
        hasFailed: !wasDeleted,
        details: wasDeleted ? "Cache cleared successfully" : "Cache not found",
      });
      break;
    }
  }
});

self.addEventListener("install", () => {
  console.log("[SW] Service worker installed!");
});
