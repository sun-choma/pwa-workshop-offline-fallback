import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /** Plugin for serving/building service worker from  sw.ts file
     *  Extends args from WorkboxWebpackPlugin and provides additional settings */
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      injectRegister: false,
      devOptions: {
        enabled: true,
        type: "module",
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
      },
      manifest: {
        name: "Offline PWA Example",
        start_url: "/",
        theme_color: "#BD34FE",
        icons: [
          {
            src: `/pwa-logo.svg`,
            sizes: "800x800",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: "./",
  build: {
    outDir: "./build",
    emptyOutDir: true,
  },
});
