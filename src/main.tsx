import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { WorkerProvider } from "@/providers/workbox/WorkboxProvider.tsx";
import { Provider } from "@/components/ui/provider.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import App from "@/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WorkerProvider>
      <Provider>
        <App />
        <Toaster />
      </Provider>
    </WorkerProvider>
  </StrictMode>,
);
