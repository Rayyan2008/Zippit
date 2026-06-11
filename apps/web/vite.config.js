import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    host: '0.0.0.0',
    allowedHosts: ['.vercel.run', 'localhost'],
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      port: 3000,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})