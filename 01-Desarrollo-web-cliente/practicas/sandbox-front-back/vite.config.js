import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// La clave del sandbox: el navegador pide siempre a Vite (mismo origen, sin
// CORS) y SOLO las rutas que empiezan por /api se reenvian al backend.
// Por eso en el front se hacen fetch("/api/...") RELATIVOS, nunca
// "http://localhost:3001/...".
//
// El target tiene que ser el mismo puerto que usa server/server.js (PORT).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
})