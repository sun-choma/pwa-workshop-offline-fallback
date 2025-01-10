import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Workbox } from "workbox-window";

import { WorkboxInstance } from "./types.ts";
import { Context } from "./context.ts";

export function WorkerProvider({ children }: { children: ReactNode }) {
  const [worker, setWorker] = useState<WorkboxInstance>();

  const contextValue = useMemo(() => ({ worker }), [worker]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const sw = new Workbox(
        import.meta.env.MODE === "production" ? "/sw.js" : "/dev-sw.js?dev-sw",
        { type: "module", scope: "/" },
      );
      setWorker(sw);
      sw.register();
    }
  }, []);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
