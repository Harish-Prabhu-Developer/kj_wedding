import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Dev proxy: forward /api, /wedding/api, /admin to XAMPP if needed
    proxy: {
      '/wedding/api': {
        target: 'http://localhost',
        changeOrigin: false,
      },
      '/api': {
        target: 'http://localhost/wedding',
        changeOrigin: false,
      },
    },
  },
})
