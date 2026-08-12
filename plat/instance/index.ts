/*
 * @Description:
 * @Author: 李大玄
 * @Date: 1985-10-26 16:15:00
 * @FilePath: /framework/plat/src/instance/index.ts
 * @LastEditors: 李大玄
 * @LastEditTime: 2025-01-02 10:34:55
 */
import {createApp} from 'vue'
import App from '../pages/App.vue'
import {createService, platCreateService} from '../service/index.js';


import utils, {isGoToLogin} from '../utils/index.ts';
import {loadMenus, loadUserInfo} from "../utils/auth.ts";
import {useSystemConfig} from "../store/systemConfig.js";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from "element-plus";
import IconClass from "../components/icon/IconClass.vue";
import IconSvg from "../components/icon/IconSvg.vue";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "../assets/base/reset/index.scss";
import 'element-plus/dist/index.css'
import {createRouter} from "plat@/router/index.ts";
import {useRouter, useRoute} from 'vue-router';
import _ from "lodash";
import {baseLayoutConfig} from "plat@/baseConfig.js";

const hasAuthority = function (sourceStr: string) {
  let authorities = '';
  const reg = new RegExp(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/, 'g');
  authorities = sourceStr.replace(reg, '');
  authorities = authorities.toLowerCase();
  let authCodeArr = store.getters.authCodeArr;
  authCodeArr = authCodeArr.map((item) => {
    return item.toLowerCase();
  });

  return authorities.split(',').some((itemS) => {
    let code = itemS
      .split(':')
      .map((item, index) => {
        if (index > 0) {
          item = _.capitalize(item)
        }
        return item;
      })
      .join('');
    return authCodeArr.includes(code);
  });
};


export function initMixin(EWebPlat) {
  let platBaseConfig = {};
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  const app = createApp(App);
  let router = null;
  EWebPlat.prototype.beforeInit = (config) => {
    app.config.globalProperties.$hasAuthority = hasAuthority;
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
    app.component("icon-svg", IconSvg);
    app.component("icon-class", IconClass);

    app.use(pinia)

    router = createRouter(config);
    app.use(router)

    app.use(ElementPlus)
    app.mount('#app')
    const systemConfig = useSystemConfig();
    platBaseConfig = config;
    systemConfig.setAppConfig(config);
    utils.addLinkArr(["http://localhost:9998/plat-v3.umd.js"])
    utils.addLinkArr(config.iconLink)
    isGoToLogin(config.appConfig, () => {
      EWebPlat.prototype.init(config, router);
    });
  }

  EWebPlat.prototype.init = async function (config: any, router: ReturnType<typeof createRouter>) {
    const systemConfig = useSystemConfig();
    // 仅在首次登录时加载菜单和用户信息，刷新时复用 localStorage 缓存
    if (!systemConfig.menusConfig.leftMenus.length) {
      await loadMenus(config)
      loadUserInfo(config)
      const systemConfig = useSystemConfig();
      router.push("/" + systemConfig.menusConfig.activeMenuCode);
    }

    console.log("router", router );

    this.LoadModulesStoreKey = `${window.__sso}-${config.appConfig.packageName}-loadModulesList`;
    // --------------------------------
    const ModulesList = localStorage.getItem(this.LoadModulesStoreKey);
    if (ModulesList) {
      this.loadResources(JSON.parse(ModulesList));
    }

    if (config.layoutSetting) {
      const obj = Object.assign({}, baseLayoutConfig, config.layoutSetting || {});
      systemConfig.resetLayoutConfig(obj);
    }

  }

  // 原型上绑定  axios 动态API
  EWebPlat.prototype.platService = (api, params, otherParams) => {
    return platCreateService(api, params, otherParams, platBaseConfig.serviceConfig);
  }


  EWebPlat.prototype.registerMoudle = function (module) { //模块工程代码加载完，主动调用此接口，平台再回设模块的init方法，完成模块的初始化
    console.log("registerMoudle", module);
    // module.init && module.init(this);
    // this.platConfig = Object.assign({}, this.platConfig || {}, module || {});
    EWebPlat.prototype.addMoudleRoutes(module.routers || []);
  }

  //模块的init初始化方法中，调用些方法 动态添加router路由
  EWebPlat.prototype.addMoudleRoutes = function (routers: unknown[]) {
    for (const route of routers) {
      router.addRoute('Entry', route);
    }
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
    const linkArr = modules.map(item => item.src);
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
