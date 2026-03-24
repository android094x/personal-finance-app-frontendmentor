import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    ssr: "src/index.ts",
    outDir: "dist",
    target: "node24",
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
  },
  ssr: {
    target: "node",
    noExternal: [],
  },
  optimizeDeps: {
    exclude: ["custom-env"],
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
});
