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

/**
 * 版本号映射 —— 所有构建（应用 / 库）统一输出到 dist/<类型>/<版本号>/
 * 改这里即可控制各环境的版本号
 */
const versionMap: Record<string, string> = {
  production: 'latest',
  test: 'v1.0.0',
  pre: 'v1.0.0',
  prod: 'v1.0.0',
};

/** 库构建的 mode 前缀，形如 lib-test / lib-pre / lib-prod */
const LIB_MODE_PREFIX = 'lib-';

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  // 库构建 mode：lib-<env>；其余 mode 走应用构建（index.html 入口）
  const isLibBuild = mode.startsWith(LIB_MODE_PREFIX);
  // 从 lib-test 中取出环境名 test，用于匹配版本号
  const envKey = isLibBuild ? mode.slice(LIB_MODE_PREFIX.length) : mode;
  const version = versionMap[envKey] ?? 'v1.0.0';
  const outDir = `dist/${version}`;

  /** 库构建配置：产出 es / umd，外部依赖不打包 */
  const libBuildConfig = {
    lib: {
      entry: fileURLToPath(new URL('./src/application/lib.ts', import.meta.url)),
      name: 'PlatV3',
      formats: ['es', 'umd'] as const,
      fileName: (format: string) => `plat-v3.${format}.js`,
    },
    outDir,
    assetsDir: 'static',
    sourcemap: true,
    cssCodeSplit: false,
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
  };

  /** 应用构建配置：以 index.html 为入口，产出可部署的静态站点 */
  const appBuildConfig = {
    outDir,
    assetsDir: 'static',
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        // 去掉 chunk 文件名中的 hash 后缀
        chunkFileNames: 'static/[name].js',
        entryFileNames: 'static/[name].js',
        assetFileNames: 'static/[name].[ext]',
      },
    },
  };

  return {
    base: './',
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
      host: '0.0.0.0',
      proxy: proxyConfig || {},
    },
    build: isLibBuild ? libBuildConfig : appBuildConfig,
  }
})
