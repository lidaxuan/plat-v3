/*
 * @Description:
 * @Author: 李大玄
 * @Date: 1985-10-26 16:15:00
 * @FilePath: /framework/plat/src/instance/index.ts
 * @LastEditors: 李大玄
 * @LastEditTime: 2025-01-02 10:34:55
 */
import {createApp} from 'vue'
import type {PlatConfig} from 'plat@/index.ts'
import App from '../pages/App.vue'
import {createService, platCreateService} from '../service/index.js';

import utils, {isGoToLogin} from '../utils/index.ts';
import {loadMenus, loadUserInfo} from "../utils/auth.ts";
import {useSystemConfig, setPersistKeyPrefix} from "../store/systemConfig.js";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from "element-plus";
import IconClass from "../components/icon/IconClass.vue";
import IconSvg from "../components/icon/IconSvg.vue";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "../assets/base/reset/index.scss";
import 'element-plus/dist/index.css'
import {createRouter} from "plat@/router/index.ts";
import _ from "lodash";
import {baseLayoutConfig} from "plat@/baseConfig.js";

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

// FIXME: store 变量未定义，hasAuthority 需要重构为从 Pinia store 获取 authCodeArr
const hasAuthority = function (sourceStr: string): boolean {
  let authorities = '';
  const reg = new RegExp(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/, 'g');
  authorities = sourceStr.replace(reg, '');
  authorities = authorities.toLowerCase();
  // @ts-expect-error store 未定义，待重构
  let authCodeArr = store.getters.authCodeArr;
  authCodeArr = authCodeArr.map((item: string) => {
    return item.toLowerCase();
  });

  return authorities.split(',').some((itemS: string) => {
    let code = itemS
      .split(':')
      .map((item: string, index: number) => {
        if (index > 0) {
          item = _.capitalize(item)
        }
        return item;
      })
      .join('');
    return authCodeArr.includes(code);
  });
};


/**
 * 初始化 EWebPlat 原型方法
 * pinia / app / router 定义在外层闭包中，供所有原型方法共享访问，
 * 这是正确的做法——它们作为框架内部状态，不需要暴露为实例属性，
 * 也避免了模块级全局变量的污染。
 */
export function initMixin(EWebPlat: { prototype: Record<string, any> }): void {
  let platBaseConfig: PlatConfig = {};
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  const app = createApp(App);
  let router: ReturnType<typeof createRouter>;

  // ==================== beforeInit ====================
  EWebPlat.prototype.beforeInit = (config: PlatConfig): void => {
    app.config.globalProperties.$hasAuthority = hasAuthority;
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
    app.component("icon-svg", IconSvg);
    app.component("icon-class", IconClass);

    app.use(pinia)

    setPersistKeyPrefix(config.appConfig?.packageName || '');

    router = createRouter(config);
    app.use(router)

    app.use(ElementPlus)
    app.mount('#app')
    const systemConfig = useSystemConfig();
    platBaseConfig = config;
    systemConfig.setAppConfig(config);
    utils.addLinkArr(["http://192.168.161.159:2332/plat-v3.umd.js"])
    utils.addLinkArr(config.iconLink || [] as string[])
    isGoToLogin(config.appConfig || {}, () => {
      EWebPlat.prototype.init(config);
    });
  }

  // ==================== init ====================
  EWebPlat.prototype.init = async function (config: PlatConfig): Promise<void> {
    const systemConfig = useSystemConfig();
    // 仅在首次登录时加载菜单和用户信息，刷新时复用 localStorage 缓存
    if (!systemConfig.menusConfig.leftMenus.length) {
      await loadMenus(config)
      loadUserInfo(config)
      const systemConfig = useSystemConfig();
      router.push("/" + systemConfig.menusConfig.activeMenuCode);
    }

    this.LoadModulesStoreKey = `${window.__sso}-${config.appConfig?.packageName}-loadModulesList`;
    const ModulesList = localStorage.getItem(this.LoadModulesStoreKey);
    if (ModulesList) {
      this.loadResources(JSON.parse(ModulesList));
    }

    if (config.layoutSetting) {
      const obj = Object.assign({}, baseLayoutConfig, config.layoutSetting || {});
      systemConfig.resetLayoutConfig(obj);
    }
  }

  // ==================== platService ====================
  /** 原型上绑定 axios 动态 API */
  EWebPlat.prototype.platService = (api: unknown, params: unknown, otherParams?: unknown): Promise<unknown> => {
    return platCreateService(api, params, otherParams, platBaseConfig.serviceConfig);
  }

  // ==================== registerMoudle ====================
  /** 模块工程代码加载完，主动调用此接口，平台再回设模块的 init 方法，完成模块的初始化 */
  EWebPlat.prototype.registerMoudle = function (module: ModuleConfig): void {
    console.log("registerMoudle", module);
    // module.init && module.init(this);
    // this.platConfig = Object.assign({}, this.platConfig || {}, module || {});
    this.addMoudleRoutes(module.routers || []);
  }

  // ==================== addMoudleRoutes ====================
  /** 模块的 init 初始化方法中调用，动态添加 router 路由 */
  EWebPlat.prototype.addMoudleRoutes = function (routers: any[]): void {
    for (const route of routers) {
      router.addRoute('Entry', route);
    }
  }

  // ==================== addMoudleService ====================
  /** 模块的 init 初始化方法中调用，动态注册 API 服务 */
  // FIXME: service.install(Vue) 是 Vue 2 写法，Vue 3 中 Vue 构造函数不存在，需替换为 app.use(service)
  EWebPlat.prototype.addMoudleService = function (servicesConfig: unknown): void {
    const service = createService(servicesConfig);
    // service.install(Vue); // Vue 2 API，待迁移
  }

  // ==================== addMoudleStore ====================
  EWebPlat.prototype.addMoudleStore = function (storeConfig: unknown): void {
    // TODO: 实现动态 store 注册
  }

  // ==================== loadResources ====================
  /** 动态创建连接，加载资源 */
  EWebPlat.prototype.loadResources = function (modules: ResourceModule[] = []): void {
    const linkArr = modules.map(item => item.src);
    utils.addLinkArr(linkArr, true);
  }

  // ==================== createLineByJs ====================
  /** 加载 icon 连接 */
  EWebPlat.prototype.createLineByJs = function (linkArr: string[] = []): void {
    utils.addLinkArr(linkArr, true);
  }

  // ==================== setData ====================
  /** 在 plat 初始化时将数据设置到实例 */
  EWebPlat.prototype.setData = function (platConfig: PlatConfig): void {
    document.title = platConfig.appConfig?.pageTitle || '易聊系统';
    if (platConfig.storeKey && JSON.parse(sessionStorage.getItem(platConfig.storeKey) || 'null')) {
      const menus = [].concat(JSON.parse(sessionStorage.getItem(platConfig.storeKey)!).layoutMenus.nomalMenu || []);
      this.creatOtherProductSrcList(menus);
    }
  }

  // ==================== addMoudleComponents ====================
  /** 在平台注册全局组件 */
  // FIXME: Vue.component 是 Vue 2 写法，Vue 3 中应使用 app.component
  EWebPlat.prototype.addMoudleComponents = function (Components: Record<string, unknown>): void {
    for (const key in Components) {
      // Vue.component(key, Components[key]); // Vue 2 API，待迁移为 app.component
    }
  }

  // ==================== updatePassword ====================
  /** 控制修改密码抽屉的展示 */
  EWebPlat.prototype.updatePassword = function (params: { visible: boolean; showClose: boolean }): void {
    this.homeStore.setUpdatePassword(params);
  }

  // ==================== creatOtherProductSrcList ====================
  EWebPlat.prototype.creatOtherProductSrcList = function (menus: unknown[]): void {
    let umdLibName = '';
    if (this.platConfig.appConfig && this.platConfig.appConfig.packageName) {
      umdLibName = this.platConfig.appConfig.packageName;
    }
    const productNames = utils.getProductId(menus).filter((item: string) => {
      return item != umdLibName
    });
    let moudles: ResourceModule[] = [];

    const env = window._baseEnvDT || window.ReferEnv || window.__sso;
    const base = window.ssoEnums[env];
    const referVersion = Object.assign({}, window.referVersion || {}, this.platConfig.referVersion || {})
    for (let i = 0; i < productNames.length; i++) {
      let item = productNames[i];
      const projectVersion = Object.assign({}, referVersion[item] || {});
      moudles.push({name: item, src: `${base}/${item}/${projectVersion[env]}/${item}.umd.js?${Math.random()}`});
    }
    localStorage.setItem(this.LoadModulesStoreKey, JSON.stringify(moudles));
    this.loadResources(moudles);
  }
}
