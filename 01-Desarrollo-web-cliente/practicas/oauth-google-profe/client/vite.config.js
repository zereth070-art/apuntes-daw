import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// El front corre en 5173 y la API en 3000. Con el proxy, las peticiones a
// /api se reenvian al backend: mismo origen => sin problemas de CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
