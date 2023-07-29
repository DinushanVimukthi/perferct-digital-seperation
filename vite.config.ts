import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{
    alias:{
        "@": "/src",
        "@router": "/src/router",
        "@components": "/src/components",
        "@pages": "/src/pages",
        "@store": "/src/store",
        "@utils": "/src/utils",
        "@assets": "/src/assets",
        "@type": "/src/types",
        "@Layout": "/src/Layout",
    }
  }
})
