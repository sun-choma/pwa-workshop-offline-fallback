import { Workbox } from "workbox-window";

export type WorkboxInstance = Workbox | undefined;

export interface WorkerContext {
  worker: WorkboxInstance;
}
