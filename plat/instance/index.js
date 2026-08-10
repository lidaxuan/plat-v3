/*
 * @Description:
 * @Author: 李大玄
 * @Date: 1985-10-26 16:15:00
 * @FilePath: /framework/plat/src/instance/index.ts
 * @LastEditors: 李大玄
 * @LastEditTime: 2025-01-02 10:34:55
 */
import {createService, platCreateService} from '../service/index.js';
// import {platIconLink} from './baseConfig.js';
import utils, {isGoToLogin} from '../utils/index.ts';
// import {useSystemConfig} from "plat@/store/systemConfig.ts";
import {loadMenus, loadUserInfo} from "../utils/auth.ts";
import {useSystemConfig} from "../store/systemConfig.js";


export function initMixin(EWebPlat) {
  let platBaseConfig = {};
  EWebPlat.prototype.beforeInit = (config) => {
    const systemConfig = useSystemConfig();
    platBaseConfig = config;
    systemConfig.setAppConfig(config);
    utils.addLinkArr(config.iconLink)
    isGoToLogin(config.appConfig, () => {
      // this.init(config);
      EWebPlat.prototype.init(config);
    });
  }

  EWebPlat.prototype.init = function (platConfig) {
    loadMenus(platConfig)
    loadUserInfo(platConfig)


    // this.service = createService(platConfig.serviceConfig);
    // this.LoadModulesStoreKey = `${window._baseEnvDT || window.ReferEnv}-${platConfig.storeKey}-loadModulesList`;
    // this.setData(platConfig);
    // --------------------------------
    // const ModulesList = localStorage.getItem(this.LoadModulesStoreKey);
    // if (ModulesList) {
    //   this.loadResources(JSON.parse(ModulesList));
    // }


    // this.app = createApp(this);
    //
    // // 存储 appConfig 到 Pinia store
    // this.appConfigStore.setAppConfig(platConfig.appConfig);
    //
    // // 存储 layoutSetting 到 Pinia store
    // if (platConfig.layoutSetting) {
    //   const currentSetting = { ...this.userStore.layoutSetting };
    //   if (platConfig.layoutSetting.tag !== undefined) {
    //     currentSetting.tag.value = String(platConfig.layoutSetting.tag);
    //   }
    //   if (platConfig.layoutSetting.breadcrumb !== undefined) {
    //     currentSetting.breadcrumb.value = String(platConfig.layoutSetting.breadcrumb);
    //   }
    //   this.userStore.setLayoutSetting(currentSetting);
    // }
    //
    // platConfig.init && platConfig.init(this);
  }

  // 原型上绑定  axios 动态API
  EWebPlat.prototype.platService = (api, params, otherParams) => {
    return platCreateService(api, params, otherParams, platBaseConfig.serviceConfig);
  }


  EWebPlat.prototype.registerMoudle = function (module) { //模块工程代码加载完，主动调用此接口，平台再回设模块的init方法，完成模块的初始化
    module.init && module.init(this);
    // this.platConfig = Object.assign({}, this.platConfig || {}, module || {});
  }

  //模块的init初始化方法中，调用些方法 动态添加router路由
  EWebPlat.prototype.addMoudleRoutes = function (routes) {
    //调用router动态添加路由
    const oldRoutes = this.router.options.routes;
    for (let i = 0; i < oldRoutes.length; i++) {
      if (oldRoutes[i].path == '/') {
        oldRoutes[i].children = oldRoutes[i].children.concat(routes);
      }
    }
    this.router.addRoutes([].concat(oldRoutes || []));
  }

  //模块的init初始化方法中，调用此方法，动态注册api 服务
  EWebPlat.prototype.addMoudleService = function (servicesConfig) {
    //操作service对象，动态添加service数据
    const service = createService(servicesConfig);
    service.install(Vue);
  }

  EWebPlat.prototype.addMoudleStore = function (storeConfig) {

  }

  // 动态创建连接 加载资源
  EWebPlat.prototype.loadResources = function (modules = []) {
    const linkArr = modules.map(item => {
      return item.src;
    });
    utils.addLinkArr(linkArr, true);
  }

  // 加载icon连接
  EWebPlat.prototype.createLineByJs = function (linkArr = []) {
    utils.addLinkArr(linkArr, true);
  }

  // 在plat 初始化的时候 将数据设置
  EWebPlat.prototype.setData = function (platConfig) {
    this.platConfig = Object.assign({}, platConfig || {});
    this.routes = [].concat(platConfig.routes || []);
    this.appConfig = Object.assign({}, platConfig.appConfig || {});
    this.navEnums = [].concat(platConfig.navEnums || []);
    this.storeKey = platConfig.storeKey ? platConfig.storeKey : this.storeKey; // 避免误操作
    //根据platConfig数据动态加载模块a,b
    this.loadResources([].concat(platConfig.moudles || []));
    document.title = platConfig.appConfig.pageTitle || '易聊系统';
    if (JSON.parse(sessionStorage.getItem(platConfig.storeKey))) {
      const menus = [].concat(JSON.parse(sessionStorage.getItem(platConfig.storeKey)).layoutMenus.nomalMenu || []);
      this.creatOtherProductSrcList(menus);
    }
  }


  // 在平台增加 模块
  EWebPlat.prototype.addMoudleComponents = function (Components) {
    for (const key in Components) {
      Vue.component(key, Components[key]);
    }
  }

  // 此方法用于修改密码抽屉是否展示 如何展示 等等
  EWebPlat.prototype.updatePassword = function (params) {
    this.homeStore.setUpdatePassword(params);
  }

  EWebPlat.prototype.creatOtherProductSrcList = function (menus) {
    let umdLibName = '';
    if (this.platConfig.appConfig && this.platConfig.appConfig.packageName) {
      umdLibName = this.platConfig.appConfig.packageName;
    }
    const productNames = utils.getProductId(menus).filter(item => {
      return item != umdLibName
    });
    let moudles = [];

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
