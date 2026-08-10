/**
 * 自动聚合 ./ 目录下所有 API 模块，按模块名挂载到 newApiMap
 * 每个模块的 default export 格式：{ [apiName]: { url: string; method?: string; type?: string } }
 */

// ==================== 类型声明 ====================

/** 单个 API 配置项 */
interface ApiConfig {
  url: string;
  method?: string;
  type?: string;
}

/** 模块内的 API 映射 */
interface ApiModule {
  [apiName: string]: ApiConfig;
}

/** 按模块名聚合的原始 API 映射 */
interface ApiMap {
  [moduleName: string]: ApiModule;
}

/** 处理后的 API 配置项（type 已保证存在） */
interface ProcessedApiConfig extends ApiConfig {
  type: string;
}

/** 处理后的完整 API 映射 */
interface ProcessedApiMap {
  [moduleName: string]: Record<string, ProcessedApiConfig>;
}

// ==================== 全局引用 ====================

const { LOCAL_PROXY_SERVICE_PATH, SERVICE_PATH, SERVICE_CONTEXT_MAP } = window.ELBaseUtils;
const isDev = process.env.NODE_ENV === 'development';

// ==================== 模块加载 ====================

const modules = import.meta.glob<{ default: ApiModule }>('./*', { eager: true });

const ApiMap: ApiMap = Object.fromEntries(
  Object.entries(modules).map(([src, mod]) => {
      const match = src.match(/\/(.+)\./);
      if (!match) return null;
      const name = match[1].split('/')[0];
      return mod.default ? [name, { ...mod.default }] : null;
    }).filter((entry): entry is [string, ApiModule] => entry !== null)
);

// ==================== 处理 API 配置 ====================

const newApiMap: ProcessedApiMap = Object.fromEntries(
  Object.entries(ApiMap).map(([fileKey, content]) => {
    const processedContent = Object.fromEntries(
      Object.entries(content).map(([key, api]) => {
        const baseUrl = SERVICE_CONTEXT_MAP[fileKey] + api.url;
        const url = isDev ? (LOCAL_PROXY_SERVICE_PATH[fileKey] || LOCAL_PROXY_SERVICE_PATH.base) + baseUrl : SERVICE_PATH[fileKey] + baseUrl;

        return [
          key,
          {
            ...api,
            type: api.type || fileKey,
            url,
            method: api.method || 'get',
          } satisfies ProcessedApiConfig,
        ];
      })
    );

    return [fileKey, processedContent];
  })
);
export default newApiMap;
