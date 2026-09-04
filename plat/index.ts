/*
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-09-04 15:27:36
 * @FilePath: plat/index.ts
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-04 15:27:36
*/
import { initMixin } from './instance';

// ==================== 类型声明 ====================

/** 应用配置 */
interface AppConfig {
  appName: string;
  welcomeMessage: string;
  pageTitle: string;
  appId: number | undefined;
  jumpContext: string;
  packageName?: string;
  [key: string]: unknown;
}

/** 平台初始化配置 */
export interface PlatConfig {
  appConfig?: AppConfig;
  routers?: unknown[];
  navEnums?: unknown[];
  storeKey?: string;
  storeConfig?: Record<string, unknown>;
  serviceConfig?: Record<string, unknown>;
  iconLink?: string[];
  moudles?: { name: string; src: string }[];
  layoutSetting?: Record<string, unknown>;
  loginUrl?: string;
  referVersion?: Record<string, unknown>;
  uiDropdown?: unknown;
  showLoginStatus?: boolean;
  actionBar?: unknown[];
  apiMap?: Record<string, unknown>;
  obtainUserName?: (userMsg: unknown) => string;
  obtainCompanyName?: (userMsg: unknown) => string;
  init?: (vm: EWebPlat) => void;
  [key: string]: unknown;
}

/** EWebPlat 实例 */
class EWebPlat {
  app: unknown = '';
  router: unknown = '';
  store: Record<string, unknown> = {};
  appConfig: AppConfig = {
    appName: '',
    welcomeMessage: '',
    pageTitle: '',
    appId: undefined,
    jumpContext: '',
  };
  platConfig: PlatConfig = {};
}

/** 通过 initMixin 挂载到原型的方法，使用 interface 声明避免自有属性遮蔽原型 */
interface EWebPlat {
  beforeInit(config: PlatConfig): void;
  init(platConfig: PlatConfig, router?: unknown): void;
  registerMoudle(module: { init?: (plat: EWebPlat) => void }): void;
  addMoudleRoutes(routers: unknown[]): void;
  addMoudleService(servicesConfig: unknown): void;
  addMoudleStore(storeConfig: unknown): void;
  loadResources(modules?: { src: string }[]): void;
  createLineByJs(linkArr?: string[]): void;
  setData(platConfig: PlatConfig): void;
  platService(api: unknown, params: unknown, otherParams?: unknown): Promise<unknown>;
  addMoudleComponents(Components: Record<string, unknown>): void;
  updatePassword(params: { visible: boolean; showClose: boolean }): void;
  creatOtherProductSrcList(menus: unknown[]): void;
}

initMixin(EWebPlat);

const EWebPlatInstance = new EWebPlat();

export default EWebPlatInstance;
