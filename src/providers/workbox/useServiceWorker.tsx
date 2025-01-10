import { useContext } from "react";

import { Context } from "./context.ts";

export const useServiceWorker = () => useContext(Context);
