import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  // Port 3100 sudah masuk whitelist CORS `CORS_ORIGINS` backend.
  server: {
    port: 3100,
    strictPort: true,
  },
  preview: {
    port: 3100,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  build: {
    rolldownOptions: {
      onwarn(warning, warn) {
        // Skip eval warnings from react-jvectormap
        if (
          warning.code === "EVAL" &&
          warning.id?.includes("@react-jvectormap")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});
