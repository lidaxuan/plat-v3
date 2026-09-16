/*
 * @Description: Plat 平台核心入口
 * @Author: lidaxuan
 * @Date: 2026-09-04 15:27:36
 * @FilePath: plat/index.ts
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-16
*/
import type { App } from 'vue';
import type { Router } from 'vue-router';
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

// ==================== EWebPlat 类 ====================

/**
 * Plat 平台实例
 *
 * 实例字段（app/router 等）由 beforeInit 在运行时赋值，
 * 原型方法（beforeInit/init/registerMoudle 等）由 initMixin 挂载。
 */
class EWebPlat {
  /** Vue 应用实例，由 beforeInit 创建 */
  app: App | undefined;
  /** Vue Router 实例，由 beforeInit 创建 */
  router: Router | undefined;
  /** 预留：Pinia store 引用（当前未使用，Pinia 通过 useXxxStore() 访问） */
  store: Record<string, unknown> = {};
  /** 应用配置快照 */
  appConfig: AppConfig = {
    appName: '',
    welcomeMessage: '',
    pageTitle: '',
    appId: undefined,
    jumpContext: '',
  };
  /** 平台初始化配置，由 beforeInit 传入 */
  platConfig: PlatConfig = {};
  /** UMD 模块列表在 localStorage 的 key，由 init 设置 */
  loadModulesStoreKey = '';
}

/**
 * 原型方法声明（interface 声明合并）
 *
 * useDefineForClassFields: true 下，class 内声明的无初始值字段会被初始化为 undefined，
 * 遮蔽原型方法。改用 interface 声明合并可避免自有属性遮蔽原型方法。
 */
interface EWebPlat {
  beforeInit(config: PlatConfig): void;
  init(platConfig: PlatConfig, router?: unknown): void | Promise<void>;
  registerMoudle(module: { init?: (plat: EWebPlat) => void }): void;
  addMoudleRoutes(routers: unknown[]): void;
  loadResources(modules?: { src: string }[]): void;
  createLineByJs(linkArr?: string[]): void;
  platService(api: unknown, params: unknown, otherParams?: unknown): Promise<unknown>;
  addMoudleComponents(Components: Record<string, unknown>): void;
  updatePassword(params: { visible: boolean; showClose: boolean }): void;
  createOtherProductSrcList(menus: unknown[]): void;
}

initMixin(EWebPlat);

const EWebPlatInstance = new EWebPlat();

export default EWebPlatInstance;
