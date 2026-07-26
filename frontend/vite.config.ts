import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // Forward all /api/* calls to Spring Boot — do NOT rewrite the path
      // because the backend now serves from /api context path
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    watch: {
      // Exclude locked/busy files that crash the watcher on Windows
      ignored: ['**/public/*.jpg', '**/public/*.png', '**/public/*.jpeg'],
    },
  },
})
