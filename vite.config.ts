import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      "@neo4j-nvl/layout-workers/lib/cosebilkent-layout/CoseBilkentLayout.worker.js`",
    ],
  },
});
