/// <reference types="vite/client" />
/// <reference types="pinia-plugin-persistedstate" />

export {}

declare global {
  interface Window {
    // ========== elBaseUtils 注入 ==========
    ELBaseUtils: {
      LOCAL_PROXY_SERVICE_PATH: Record<string, string>;
      SERVICE_PATH: Record<string, string>;
      SERVICE_CONTEXT_MAP: Record<string, string>;
    };

    // ========== index.html 环境变量 ==========
    /** SSO 环境标识：test/pre/prod/group5/group6 */
    __sso: string;
    /** 可用环境列表 */
    __envList: string[];
    /** 基础环境 */
    _baseEnv: string;
    /** 动态覆盖的基础环境（可选） */
    _baseEnvDT?: string;
    /** 参考环境 */
    ReferEnv: string;
    /** 是否本地开发模式 */
    isLocal: boolean;
    /** 项目全局配置 */
    $CONFIG: {
      lang: string;
      projectName: string;
      version: string;
      suffixText: string;
      [key: string]: unknown;
    };
    /** 各 SSO 环境的登录跳转 URL */
    envLoginUrl: Record<string, string>;

    // ========== EWebPlat 平台实例 ==========
    EWebPlat: {
      platConfig: import('./plat/index').PlatConfig;
      beforeInit(config: import('./plat/index').PlatConfig): void;
      init(platConfig: import('./plat/index').PlatConfig, router?: unknown): void | Promise<void>;
      registerMoudle(module: {
        name?: string;
        routers?: unknown[];
        services?: unknown;
        stores?: unknown;
        Components?: Record<string, unknown>;
        init?: (plat: EWebPlat) => void;
      }): void;
      addMoudleRoutes(routers: unknown[]): void;
      addMoudleService(servicesConfig: unknown): void;
      addMoudleStore(storeConfig: unknown): void;
      loadResources(modules?: { src: string }[]): void;
      createLineByJs(linkArr?: string[]): void;
      setData(platConfig: import('./plat/index').PlatConfig): void;
      platService(api: unknown, params: unknown, otherParams?: unknown): Promise<unknown>;
      addMoudleComponents(Components: Record<string, unknown>): void;
      updatePassword(params: { visible: boolean; showClose: boolean }): void;
      creatOtherProductSrcList(menus: unknown[]): void;
      [key: string]: unknown;
    };
    [key: string]: any;
  }
}
