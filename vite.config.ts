import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import vueSetupExtend from "vite-plugin-vue-setup-extend"

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
    'basic@': fileURLToPath(new URL('./el-web-basic', import.meta.url)),
  },
}

const versionMap = {
  test: 'v1.0.0',
  pre: 'v1.0.0',
  prod: 'v1.0.0',
} as {
  [key: string]: string;
};

// https://vite.dev/config/
export default defineConfig(({mode}) => {

  return {
    base: '/',
    plugins: [vue(), vueJsx(), vueDevTools(), vueSetupExtend()],
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
      lib: {
        entry: fileURLToPath(new URL('./src/application/lib.ts', import.meta.url)),
        name: 'PlatV3',
        formats: ['es', 'umd'],
        fileName: (format) => `plat-v3.${format}.js`,
      },
      outDir: `dist/${versionMap[mode]}`,
      assetsDir: 'static',
      sourcemap: mode !== 'production',
      cssCodeSplit: false,
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
