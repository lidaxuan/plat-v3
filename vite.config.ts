import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'


const vm = require("vm");
const {execSync} = require("child_process");
const remoteJsUrl = "https://views.easyliao.com/el-base-utils/view/v1.0.0/elBaseUtils.min.js";

function fetchProxyConfigSync(region = "cn", env = "test") {
  try {
    const jsContent = execSync(`curl -s --max-time 5 -H "Cache-Control: no-cache" -H "Pragma: no-cache" ${remoteJsUrl}`, {encoding: "utf-8"});
    // 执行 JS 获取 module.exports.getConfig
    const sandbox = {
      module: {}, exports: {}, window: {
        __sso: env,
        $CONFIG: {
          lang: region,
          suffixText: "Config"
        },
        DOMPurify: {
          addHook: () => {
          }
        }
      }
    };
    vm.createContext(sandbox);
    vm.runInContext(jsContent, sandbox);
    const config = sandbox.window.ELBaseUtils?.PROXY_CONFIG_v3;
    if (!config) throw new Error("未获取到 PROXY_CONFIG");
    return config;
  } catch (err) {
    console.error(`❌ 拉取远程配置失败: ${err.message}`);
    return "";
  }
}

const isDev = process.env.NODE_ENV == "development";
let proxyConfig = null;
if (isDev) {
// 获取最终 proxy 配置
  proxyConfig = fetchProxyConfigSync("cn", "test") || "";
}
const resolve = {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    'plat@': fileURLToPath(new URL('./plat', import.meta.url)),
  },
}

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  // Library 模式：vite build --mode library
  if (mode === 'library') {
    return {
      resolve,
      plugins: [vue(), vueJsx()],
      css: {
        preprocessorOptions: {
          scss: {
            silenceDeprecations: ['import', 'global-builtin'],
          },
          sass: {
            silenceDeprecations: ['import', 'global-builtin'],
          },
        },
      },
      build: {
        lib: {
          // entry: fileURLToPath(new URL('./plat/index.ts', import.meta.url)),
          entry: fileURLToPath(new URL('./src/application/lib.ts', import.meta.url)),
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

  // ==================== 默认 App 模式 ====================
  // 环境映射：mode 决定构建目标
  const envMap: Record<string, { base: string; outDir: string }> = {
    production: { base: '/', outDir: 'dist' },
    test:       { base: '/', outDir: 'dist-test' },
    staging:    { base: '/', outDir: 'dist-staging' },
  };
  const envConfig = envMap[mode] || envMap.production;

  return {
    base: envConfig.base,
    plugins: [vue(), vueJsx(), vueDevTools()],
    resolve,
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import', 'global-builtin'],
        },
        sass: {
          silenceDeprecations: ['import', 'global-builtin'],
        },
      },
    },
    server: {
      proxy: proxyConfig || {},
    },
    build: {
      outDir: envConfig.outDir,
      assetsDir: 'static',
      sourcemap: mode !== 'production',
      // 分 chunk 策略
      rollupOptions: {
        external: [
          'vue',
          'vue-router',
          'pinia',
          'pinia-plugin-persistedstate',
          'element-plus',
          '@element-plus/icons-vue',
          'nprogress',
        ],
        output: {
          globals: {
            vue: 'Vue',
            'vue-router': 'VueRouter',
            pinia: 'Pinia',
            'element-plus': 'ElementPlus',
            nprogress: 'NProgress',
          },
        },
      },
    },
  }
})
