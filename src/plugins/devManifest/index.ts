import type {
  RequestWillFetchCallbackParam,
  WorkboxPlugin,
} from "workbox-core/types";

declare let self: ServiceWorkerGlobalScope & {
  __DEV_MANIFEST: string[];
};

/**
 * Plugin for enabling dev mode precaching
 * Due to served dev mode bundles being different from production (svg icons being loaded as JS bundles etc.)
 * some differences are to be expected. Since it's practically impossible to imitate prod build behaviour in
 * dev mode, this plugin aims to give a basic understanding of resources requested on initial load
 */
export class DevManifestPlugin implements WorkboxPlugin {
  constructor() {
    self.__DEV_MANIFEST = [];
  }

  async requestWillFetch(params: RequestWillFetchCallbackParam) {
    if (process.env.NODE_ENV === "development") {
      const url = new URL(params.request.url);

      let targetUrl =
        url.origin === self.location.origin
          ? url.href.replace(url.origin, "").slice(1)
          : url.href;
      if (targetUrl === "") targetUrl = "index.html";

      self.__DEV_MANIFEST.push(targetUrl);
    }
    return params.request;
  }
}
