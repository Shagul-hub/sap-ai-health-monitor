import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/odata': {
        target: 'http://localhost:4004', // Your Node.js Backend Port
        changeOrigin: true,
        secure: false
      }
    }
  }
})