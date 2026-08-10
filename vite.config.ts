import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

const resolve = {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    'plat@': fileURLToPath(new URL('./plat', import.meta.url)),
  },
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Library 模式：vite build --mode library
  if (mode === 'library') {
    return {
      resolve,
      plugins: [vue(), vueJsx()],
      build: {
        lib: {
          entry: fileURLToPath(new URL('./plat/index.ts', import.meta.url)),
          name: 'PlatV3',
          formats: ['es', 'umd'],
          fileName: (format) => `plat-v3.${format}.js`,
        },
        rollupOptions: {
          // 外部化依赖，不打包进 library
          external: [
            'vue',
            'vue-router',
            'pinia',
            'pinia-plugin-persistedstate',
            'element-plus',
            'nprogress',
          ],
          output: {
            // UMD 模式下提供全局变量映射
            globals: {
              vue: 'Vue',
              'vue-router': 'VueRouter',
              pinia: 'Pinia',
              'element-plus': 'ElementPlus',
              nprogress: 'NProgress',
            },
          },
        },
        cssCodeSplit: false,
      },
    }
  }

  // 默认 App 模式
  return {
    plugins: [vue(), vueJsx(), vueDevTools()],
    resolve,
  }
})
