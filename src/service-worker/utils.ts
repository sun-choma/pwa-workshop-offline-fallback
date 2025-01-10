const DEFAULT_CACHE_NAME = "my-cache-storage";

function toAbsoluteUrl(urlString: string) {
  return new URL(
    urlString,
    typeof window === "undefined"
      ? self.location.origin
      : window.location.origin,
  );
}

export async function addToCache(params: {
  resources: string[];
  cacheName?: string;
  includes?: RegExp[];
}) {
  const cacheName = params.cacheName || DEFAULT_CACHE_NAME;

  // Removing duplicates
  const processedUrls = new Set();
  // Due to vite bundling everything into scripts -> need to validate requested file extension
  const resources = params.resources.filter((resourceUrl) => {
    const url = toAbsoluteUrl(resourceUrl);
    const isCorrectExtension = params.includes
      ? params.includes.some((regex) => regex.test(url.pathname))
      : true;

    const isMatching = isCorrectExtension && !processedUrls.has(url.toString());
    if (isMatching) processedUrls.add(url.toString());
    return isMatching;
  });

  // Filter resources that are not present in cache
  const resourcesMask = await Promise.all(
    resources.map(async (resourceUrl) => {
      const isIncluded = await caches.match(resourceUrl);
      return !isIncluded;
    }),
  );
  const resourcesToCache = resources.filter((_, index) => resourcesMask[index]);

  const isAlreadyCached = resourcesToCache.length === 0;
  let hasSucceeded = false;
  let hasFailed = false;
  let details = "Dont worry, it's already in cache";

  if (!isAlreadyCached) {
    try {
      // caching resources absent in current cache
      const cache = await caches.open(cacheName);
      await cache.addAll(
        resourcesToCache.map((resourceUrl) =>
          toAbsoluteUrl(resourceUrl).toString(),
        ),
      );
      hasSucceeded = true;
      details = "Cached successfully!";
    } catch (error: unknown) {
      hasFailed = true;
      if (error instanceof Error) details = error.message;
      else details = "Unknown error";
    }
  }

  return {
    hasSucceeded,
    hasFailed,
    details,
  };
}
