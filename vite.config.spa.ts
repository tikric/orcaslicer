// vite.config.spa.ts — Vite config for building a static SPA for GitHub Pages
// This bypasses TanStack Start's SSR/Nitro and builds a pure client-side SPA.
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default {
  root: resolve(__dirname),
  base: "/orcaslicer/",
  plugins: [react(), tsConfigPaths(), tailwindcss()],
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "spa-index.html"),
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
};
