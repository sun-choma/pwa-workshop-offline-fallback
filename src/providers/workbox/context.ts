import { createContext } from "react";

import { WorkerContext } from "./types.ts";

export const Context = createContext<WorkerContext>({
  worker: undefined,
});
