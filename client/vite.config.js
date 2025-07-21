import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000', // Proxy API requests in dev mode
    }
  }
})
