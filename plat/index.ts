/*
 * @Description:
 * @Author: 李大玄
 * @Date: 1985-10-26 16:15:00
 * @FilePath: /framework/plat/src/index.ts
 * @LastEditors: 李大玄
 * @LastEditTime: 2024-08-19 09:50:10
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
interface PlatConfig {
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
  routers: unknown[] = [];
  store: Record<string, unknown> = {};
  userStore: Record<string, unknown> & { setToken: (token?: string | null) => void; setUserMsg: (userMsg?: Record<string, unknown>) => void; setLayoutSetting: (setting: unknown) => void; setLoginStatus: (data: string) => void; setLoginTrust: (data: string) => void; setLogoutBtns: (list?: unknown[]) => void; setNotify: (chromeNotify?: boolean) => void; setTableSetting: (tableSetting: Record<string, unknown>) => void; token: string | null; layoutSetting: Record<string, unknown>; userMsg: Record<string, unknown>; loginStatus: string; loginTrust: string; logoutBtns: unknown[]; messList: unknown[]; messNum: number; chromeNotify: boolean } = {} as any;
  menusStore: Record<string, unknown> & { setNomalMenu: (nomalMenu?: unknown[]) => void; setAuthCodeArr: (authCodeArr?: string[]) => void; setLayoutTag: (layoutTag?: unknown[]) => void; setDefaultActiveMenu: (defaultActiveMenu?: string) => void; setDefaultActiveHorizontalMenu: (defaultActiveHorizontalMenu?: string) => void; setBreadcrumb: (breadcrumb?: unknown[]) => void; setSideMenu: (sideMenu?: unknown[]) => void; setLayoutTagId: (layoutTagId?: unknown[]) => void; setRemoveCurrentTagId: (removeCurrentTagId?: string) => void; nomalMenu: unknown[]; authCodeArr: string[]; layoutTag: unknown[]; defaultActiveMenu: string; defaultActiveHorizontalMenu: string; breadcrumb: unknown[]; sideMenu: unknown[]; layoutTagId: unknown[]; removeCurrentTagId: string } = {} as any;
  appConfigStore: Record<string, unknown> & { setAppConfig: (appConfig?: Record<string, unknown>) => void; appConfig: Record<string, unknown>; appName: string } = {} as any;
  homeStore: Record<string, unknown> & { setRouteView: (routeView?: boolean) => void; setActionBar: (actionBar?: unknown[]) => void; setUpdatePassword: (updatePassword: { visible: boolean; showClose: boolean }) => void; routeView: boolean; actionBar: unknown[]; updatePassword: { visible: boolean; showClose: boolean }; easyDetail: unknown[] } = {} as any;
  storeKey: string = 'plat-store-key';
  navEnums: unknown[] = [];
  service: unknown = '';
  appConfig: AppConfig = {
    appName: '',
    welcomeMessage: '',
    pageTitle: '',
    appId: undefined,
    jumpContext: '',
  };
  platConfig: PlatConfig = {};
  LoadModulesStoreKey: string = '';
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
