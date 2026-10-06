import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the display-p3 colour tokens: older CSS targets make esbuild lower color(display-p3 …) to hex.
    cssTarget: ['chrome111', 'edge111', 'firefox113', 'safari15'],
  },
})
