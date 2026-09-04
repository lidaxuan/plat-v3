/*<!--
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-08-05 18:35:31
 * @FilePath: src/application/index.ts
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-08-05 18:35:31
-->*/
// __webpack_public_path__ = window.static_url || window.url || "";

import * as Vue from 'vue';
import EWebPlat from "plat@/index.ts";

window.Vue = Vue;
window.EWebPlat = EWebPlat;
import menusQunfeng from "./enums.ts";
import {responseError, requestSuccess, responseSuccess} from "./serviceExpand";
import apiMap from "../api/index.ts";
import {resetRouterBeforeEach, routerChildren} from "@/router";
import {useSystemConfig} from "plat@/store/systemConfig";

const iconLinkArr = [
  "//at.alicdn.com/t/c/font_2735677_jf1lwq8yzk8.js", //   BEACON基础库
  "//at.alicdn.com/t/c/font_2735677_jf1lwq8yzk8.css", //   BEACON基础库
  "//at.alicdn.com/t/c/font_4313697_gvkdwra2dg.css", // 群峰重点项目 font_4313697_lk2jjwwvd38
  "//at.alicdn.com/t/c/font_4313697_gvkdwra2dg.js", // 群峰重点项目
];
window["platV3ApiMap"] = apiMap;

async function createAppFn(accountEnv: string = "test"): Promise<void> {
  // const apiMap = import.meta.glob('../api/index.ts', { eager: true });
  // const modules = import.meta.glob('../api/*', { eager: true });
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
  } as {
    [_: string]: string
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
      packageName: "plat-v3-client-view"
    },
    iconLink: iconLinkArr,
    apiMap: {
      userEnums: apiMap.authEupms!.getPerUserMenus,
      userInfo: apiMap.im!.getUserInfo
    },
    customerMenus: menusQunfeng,
    serviceConfig: {
      apiConfig: [],
      // apiMap: apiMap.default,
      responseSuccess,
      responseError,
      requestSuccess
    },
    routers: routerChildren,
    resetRouterBeforeEach,
    storeConfig: {
      storage: window.sessionStorage
    },
    layoutSetting: {
      showTag: true,
      showBreadcrumb: true
    },
    showLoginStatus: true,
    handleDropdownList: [
      {id: "userStatusOnline", name: "在线", icon: "icon-zaixianzhuangtai system-dropdown-online", disabled: false},
      {id: "userStatusLeave", name: "离开", icon: "icon-zaixianzhuangtai system-dropdown-leave", disabled: false},
      {id: "userStatusBusy", name: "忙碌", icon: "icon-zaixianzhuangtai system-dropdown-busy", disabled: false},
      {id: "personelSetting", name: "个人设置", icon: "icon-a-UserIcon"},
      {id: "bindPhone", name: "绑定手机号", icon: "icon-bangdingshoujihao"},
      {id: "userLogout", name: "退出登录", icon: "icon-C-C11"},
      {id: "exitingTheCloud", name: "同时退出云端", icon: "icon-C-C11"},
    ],
    menuConfig: { // 用来格式化获取到的菜单 后续功能在增加
      formatterMenu: (val: any[]) => {
        console.log("val", val)
        // if (window.$CONFIG.lang == "cn") {
        //     const codeList = ["channel"];
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
        return val;
      }
    },
    obtainUserName(val: Record<string, any>): string {
      // if (window.$CONFIG.lang == "cn") {
      //     return val.nickName + "(" + val.userId + ")";
      // } else if (window.$CONFIG.lang == "en") {
      //     return val.realName; // val.userId;
      // }
      // return val.nickName + "(" + val.userId + ")";
      return ''
    },
    obtainCompanyName(val: Record<string, any>): string {
      // if (window.$CONFIG.lang == "cn") {
      //     return "公司ID: " + val.companyId;
      // } else if (window.$CONFIG.lang == "en") {
      //     return "companyID: " + val.companyId;
      // }
      return ''
    },
    init(vm: any) {
    }
  } as EWebPlat.EWebPlatConfig;
  EWebPlat.beforeInit(config);
}

createAppFn();
fetchUserLoginState();

export async function fetchUserLoginState() {
  // @ts-ignore
  const res: any = await window.EWebPlat.platService(platV3ApiMap.im.getUserInfo);
  if (res.code) {
    return;
  }
  // userLoginStatus[res.data.userId] = {
  //   ...res.data,
  //   clientList: res.data.clientTypes || [],
  //   userName: res.data.realName
  // };
  useSystemConfig().setUserLoginStatus(res.data.runningStatus as boolean);
}
