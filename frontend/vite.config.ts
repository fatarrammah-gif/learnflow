import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Vite configuration — sets up the dev server and build tool
export default defineConfig({
  plugins: [react()],  // Enables React JSX transform and Fast Refresh
  resolve: {
    alias: {
      // "@/" now maps to the "src/" folder
      // So "import X from '@/components/Button'" → "import X from './src/components/Button'"
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // In development, requests to /api/... are forwarded to the backend on port 8000
      // This avoids CORS issues during local development
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
