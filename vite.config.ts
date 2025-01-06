import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/hotnet/",
  build: {
    outDir: "docs"
  },
  plugins: [vue()],
  server: {
    open: true,
    host: "0.0.0.0"
  }
})
