import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Local dev: run `npm run worker:dev` (wrangler dev, default port
      // 8787) alongside `npm run dev` so /api/contact resolves to the
      // Worker without any CORS setup — the browser only ever sees the
      // Vite origin, matching how it'll behave in production.
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
