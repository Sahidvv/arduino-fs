import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // Abre el reporte automáticamente
      gzipSize: true, // Calcula el tamaño gzip
      brotliSize: true, // Calcula el tamaño brotli
    }),
  ],build: {
    rollupOptions: {
      output: {
        manualChunks: {
          html2canvas: ['html2canvas'],
          jspdf: ['jspdf'],
          dateFns: ['date-fns'],
          recharts: ['recharts'],
        },
      },
    },
  },
})
