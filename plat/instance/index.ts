/*
 * @Description: EWebPlat 原型方法实现
 * @Author: lidaxuan
 * @Date: 2026-09-01 16:20:54
 * @FilePath: plat/instance/index.ts
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-16
*/

import { createApp } from 'vue';
import type { Router } from 'vue-router';
import type { PlatConfig } from '../index';
import App from '../pages/App.vue';
import { platCreateService } from '../service';
import utils, { isGoToLogin, setElementThemeColor } from '../utils';
import { loadMenus, loadUserInfo } from '../utils/auth';
import { useSystemConfig, setPersistKeyPrefix, setPersistStorage } from '../store/systemConfig';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import IconClass from '../components/icon/IconClass.vue';
import IconSvg from '../components/icon/IconSvg.vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import '../assets/base/reset/index.scss';
import 'element-plus/dist/index.css';
import { createRouter } from '../router';
import _ from 'lodash';
import { baseLayoutConfig } from '../baseConfig';

// ==================== 类型 ====================

/** 模块注册参数 */
interface ModuleConfig {
  init?: (plat: Record<string, unknown>) => void;
  routers?: unknown[];
  [key: string]: unknown;
}

/** 资源模块描述 */
interface ResourceModule {
  name?: string;
  src: string;
}

/** 原型方法的 this 上下文（实例字段 + 自身原型方法） */
interface EWebPlatThis {
  platConfig: PlatConfig;
  loadModulesStoreKey: string;
  loadResources(modules?: ResourceModule[]): void;
  addMoudleRoutes(routers: unknown[]): void;
}

// ==================== 权限校验 ====================

// FIXME: store 变量未定义，hasAuthority 需重构为从 Pinia store 获取 authCodeArr
const hasAuthority = (sourceStr: string): boolean => {
  const reg = new RegExp(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：""【】、；''，。、]/, 'g');
  // @ts-expect-error store 未定义，待重构
  const authCodeArr: string[] = store.getters.authCodeArr.map((item: string) => item.toLowerCase());
  const authorities = sourceStr.replace(reg, '').toLowerCase();

  return authorities.split(',').some((itemS: string) => {
    const code = itemS.split(':').map((item: string, index: number) =>
      index > 0 ? _.capitalize(item) : item
    ).join('');
    return authCodeArr.includes(code);
  });
};

// ==================== initMixin ====================

/**
 * 初始化 EWebPlat 原型方法
 *
 * pinia / app / router 为闭包内变量，由 beforeInit 创建后供所有原型方法共享。
 * 这三个对象是框架内部状态，不暴露为实例属性，避免模块级全局变量污染。
 *
 * 时序约定：beforeInit 必须先于 init / addMoudleRoutes 调用，
 * 否则 router 闭包变量尚未赋值。
 */
export function initMixin(EWebPlat: { prototype: Record<string, any> }): void {
  let platBaseConfig: PlatConfig = {};
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  const app = createApp(App);
  let router: Router;

  // ==================== beforeInit ====================
  EWebPlat.prototype.beforeInit = (config: PlatConfig): void => {
    app.config.globalProperties.$hasAuthority = hasAuthority;
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
    app.component('icon-svg', IconSvg);
    app.component('icon-class', IconClass);

    setPersistKeyPrefix(`${config.env}-${config.appConfig?.packageName || ''}`);
    setPersistStorage(config.storeConfig?.storage || localStorage);

    app.use(pinia);
    router = createRouter(config);
    app.use(router);
    app.use(ElementPlus);
    app.mount('#app');

    const systemConfig = useSystemConfig();
    platBaseConfig = config;
    systemConfig.setAppConfig(config);

    // dev 模式下加载本地 UMD library 用于模块注册调试
    // utils.addLinkArr(['http://localhost:2332/plat-v3.umd.js']);
    utils.addLinkArr(config.iconLink || []);
    isGoToLogin(config.appConfig || {}, () => {
      EWebPlat.prototype.init(config);
    });
    setElementThemeColor(systemConfig.layoutConfig.themeColor);
  };

  // ==================== init ====================
  EWebPlat.prototype.init = async function (this: EWebPlatThis, config: PlatConfig): Promise<void> {
    const systemConfig = useSystemConfig();

    // 首次登录：加载菜单和用户信息、应用初始布局配置
    // 刷新时复用 localStorage 缓存，不重置 activeMenuCode / layoutConfig / 其他持久化状态
    if (!systemConfig.menusConfig.normalMenu.length) {
      let menus = await loadMenus(config);
      loadUserInfo(config);
      // 仅首次登录时应用 config.layoutSetting 作为初始布局，刷新时保留用户运行时修改的布局配置
      if (config.layoutSetting) {
        const obj = Object.assign({}, baseLayoutConfig, config.layoutSetting || {});
        systemConfig.resetLayoutConfig(obj);
      }
      EWebPlat.prototype.createOtherProductSrcList(config, menus);
    }

    // 如果当前是根路径，跳到激活菜单对应的路由，避免首次进入空白页
    const currentPath = router.currentRoute.value.path;
    const targetCode = systemConfig.menusConfig.activeMenuCode;
    if (currentPath === '/' && targetCode) {
      setTimeout(() => { router.push('/' + targetCode); }, 0);
    }

    // 刷新时重新加载 UMD 模块（脚本需要重新注入 DOM）
    this.loadModulesStoreKey = `${config.env}-${config.appConfig?.packageName}-loadModulesList`;
    const modulesList = localStorage.getItem(this.loadModulesStoreKey);
    if (modulesList) {
      this.loadResources(JSON.parse(modulesList));
    }
  };

  // ==================== platService ====================
  /** 原型上绑定 axios 动态 API */
  EWebPlat.prototype.platService = (api: unknown, params: unknown, otherParams?: unknown): Promise<unknown> => {
    return platCreateService(api, params, otherParams, platBaseConfig.serviceConfig);
  };

  // ==================== registerMoudle ====================
  /** 模块工程代码加载完，主动调用此接口，平台再回设模块的 init 方法，完成模块的初始化 */
  EWebPlat.prototype.registerMoudle = function (this: EWebPlatThis, module: ModuleConfig): void {
    // module.init && module.init(this);
    // this.platConfig = Object.assign({}, this.platConfig || {}, module || {});
    this.addMoudleRoutes(module.routers || []);
  };

  // ==================== addMoudleRoutes ====================
  /** 模块的 init 初始化方法中调用，动态添加 router 路由 */
  EWebPlat.prototype.addMoudleRoutes = function (routers: any[]): void {
    for (const route of routers) {
      router.addRoute('Entry', route);
    }
  };

  // ==================== loadResources ====================
  /** 动态创建连接，加载资源 */
  EWebPlat.prototype.loadResources = function (this: EWebPlatThis, modules: ResourceModule[] = []): void {
    const linkArr = modules.map(item => item.src);
    utils.addLinkArr(linkArr, true);
  };

  // ==================== createLineByJs ====================
  /** 加载 icon 连接 */
  EWebPlat.prototype.createLineByJs = function (linkArr: string[] = []): void {
    utils.addLinkArr(linkArr, true);
  };

  // ==================== createOtherProductSrcList ====================
  EWebPlat.prototype.createOtherProductSrcList = function (platConfig: PlatConfig, menus: any[]): void {
    let umdLibName = '';
    if (platConfig.appConfig && platConfig.appConfig.packageName) {
      umdLibName = platConfig.appConfig.packageName;
    }
    const productNames = utils.getProductId(menus).filter((item: string) => item !== umdLibName);
    const moudles: ResourceModule[] = [];

    const env = window._baseEnvDT || window.ReferEnv || window.__sso;
    const base = window.ssoEnums[env];
    const referVersion = Object.assign({}, window.referVersion || {}, platConfig.referVersion || {});
    for (let i = 0; i < productNames.length; i++) {
      const item = productNames[i];
      const projectVersion = Object.assign({}, referVersion[item as string] || {});
      moudles.push({
        name: item,
        src: `${base}/${item}/${projectVersion[env]}/${item}.umd.js?${Math.random()}`,
      });
    }
    localStorage.setItem(this.loadModulesStoreKey, JSON.stringify(moudles));
    this.loadResources(moudles);
  };
}
