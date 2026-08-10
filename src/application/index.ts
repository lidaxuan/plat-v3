/*<!--
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-08-05 18:35:31
 * @FilePath: src/application/index.ts
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-08-05 18:35:31
-->*/
// __webpack_public_path__ = window.static_url || window.url || "";

// import Vue from "vue";
// import "./watchError.js";
// import getters from "@/store/getters";

// import {routes} from "@/router";
// import utils from "plat@/src/utils";
// import {fotmatterEnum} from "./enums";

// import "../static/css/system-dropdown.scss";
// import "../static/css/en-system.scss";
// import "../static/css/el-theme.css";
// import ELCONFIG from "@/utils/config/lang/index";
// import initConfig from "@/utils/config/initConfig";
// import menusQunfeng from "./enums-qunfeng";
// import ScrollUp from "@/utils/directive/scrollUp";
// import WheelX from "@/utils/directive/wheelX";
// import RightKey from "@/utils/directive/rightKey";
// import CloseOnScroll from "@/utils/directive/close-on-scroll";
// import {mixinProto} from '@/utils/mixinProto';
// import {loginUrl} from "./loginConfig";

const iconLinkArr = [
    "//at.alicdn.com/t/c/font_2735677_jf1lwq8yzk8.js", //   BEACON基础库
    "//at.alicdn.com/t/c/font_2735677_jf1lwq8yzk8.css", //   BEACON基础库
    "//at.alicdn.com/t/c/font_4313697_gvkdwra2dg.css", // 群峰重点项目 font_4313697_lk2jjwwvd38
    "//at.alicdn.com/t/c/font_4313697_gvkdwra2dg.js", // 群峰重点项目
];

// window.ELCONFIG = ELCONFIG;
import EWebPlat from "plat@/index.ts"
window.EWebPlat = EWebPlat;


// 网页直接入口,没有嵌iframe
// const urlParams = parseUrlParams(window.location.href) || {};
// // 简化核心逻辑：有参数就覆盖存储，无则不处理
// if (urlParams.accountEnv) {
//     sessionStorage.setItem('accountEnv', urlParams.accountEnv);
// }

import "plat@/assets/base/reset/index.scss";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '../App.vue'
import router from '../router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import menusQunfeng from "./enums-qunfeng";
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
import IconClass from "plat@/components/icon/IconClass.vue";
import IconSvg from "plat@/components/icon/IconSvg.vue";
const app = createApp(App)
import apiMap from "../api/index.ts";
import {responseError, requestSuccess, responseSuccess} from "./serviceExpand.js";

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.component("icon-svg", IconSvg);
app.component("icon-class", IconClass);
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')



import { useMenusStore } from 'plat@/store/useMenusStore'
import utils from "plat@/utils/index.ts"


async function createAppFn(accountEnv = "test") {
    // const apiMap = import.meta.glob('../api/index.ts', { eager: true });
    // const modules = import.meta.glob('../api/*', { eager: true });
    window["xxxxxApiMap"] = apiMap;
    console.log(apiMap.authEupms.getPerUserMenus)
    // console.log(apiMap)
    // const apiMap = require("../api");
    // const files = require.context("../store/modules", false, /\.js$/);
    const baseUrl = {
        "test": "/im-gateway/webcall/view/",
        "prd19": "/im-gateway/webcall/view/",
        "group2-prd4": "/webcall/view/",
        "group-prd3": "/webcall/view/",
        "group2-prd2": "/webcall/view/",
        "group-prd1": "/webcall/view/",
        "group-prd5": "/im-gateway/webcall/view/"
    };
    const config = {
        appConfig: {
            appName: "易聊科技",
            welcomeMessage: "欢迎登录群峰后台管理系统",
            logoIconFont: "icon-doutuilogo",
            enAppName: "EASYLIAO TECHNOLOGY",
            pageTitle: "",
            appId: 10000,
            jumpContext: baseUrl[accountEnv] || "/im-gateway/webcall/view", // /data-config/view/base
            packageName: "web-client-view"
        },
        iconLink:  iconLinkArr,
        apiMap: {
            navEnums: apiMap.authEupms.getPerUserMenus,
            // userInfo: apiMap.default.im.getUserInfo
        },
        customerMenus: menusQunfeng,
        serviceConfig: {
            apiConfig: [],
            // apiMap: apiMap.default,
            responseSuccess,
            responseError,
            requestSuccess
        },

        // directives:  // 指令 如果项目需要可以传入, 没有既不需要传
        // 菜单 如果需要菜单配置 就不会走接口请求
        /*routes: [],
        loginUrl: '',
        storeConfig: {
            // modules: utils.readFile(files), getters,
            // plugins: [
            //   createPersistedState({
            //     key: "xasxaxaxsa",
            //     storage: window.localStorage //选择 sessionStorage 进行存储
            //   })
            // ],
            storage: window.sessionStorage
        },
        showLoginStatus: true,
        storeKey: initConfig.storeKey,
        */
        layoutSetting: {
            tag: false,
            breadcrumb: true
        },
        // uiDropdown: initConfig.uiDropdown,
        menuConfig: { // 用来格式化获取到的菜单 后续功能在增加
            formatterMenu: (val) => {
                // if (window.$CONFIG.lang == "cn") {
                //     const codeList = ["channel"];
                //
                //     const enums = menusQunfeng.map(item => {
                //         if (codeList.includes(item.code)) {
                //             item.srcName = "private-messenger-web-view";
                //         }
                //         return item;
                //     });
                //     return enums;
                // } else if (window.$CONFIG.lang == "en") {
                //     localStorage.setItem("menusList", JSON.stringify(val));
                //     const data = fotmatterEnum(val);
                //     return data;
                // }
                return menusQunfeng;
            }
        },
        obtainUserName(val) {
            // if (window.$CONFIG.lang == "cn") {
            //     return val.nickName + "(" + val.userId + ")";
            // } else if (window.$CONFIG.lang == "en") {
            //     return val.realName; // val.userId;
            // }
            // return val.nickName + "(" + val.userId + ")";
        },
        obtainCompanyName(val) {
            // if (window.$CONFIG.lang == "cn") {
            //     return "公司ID: " + val.companyId;
            // } else if (window.$CONFIG.lang == "en") {
            //     return "companyID: " + val.companyId;
            // }
        },
        // userInfo: {
        //   userName: "李大玄",
        //   userId: "110"
        // },

        init(vm) {
            // const layoutSetting = vm.store.state.user.layoutSetting;
            // layoutSetting.color.value = "#3585FB";
            // vm.store.dispatch("setLayoutSetting", Object.assign({}, layoutSetting));
            // Vue.prototype.$ELCONFIG = ELCONFIG;
            // mixinProto(Vue, vm);
            // Vue.prototype.$ELEMENT = {size: 'small'};
            // window.ERegisterComponents(Vue);
        }
    }
    EWebPlat.beforeInit(config);
}

createAppFn();


