import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [
        'motion/react', 
        'lucide-react',
        /^figma:asset\/.+/ // ИГНОРИРОВАТЬ ВСЕ figma:asset импорты
      ]
    }
  },
  publicDir: 'public'
})
