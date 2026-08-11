/*
 * @Description: 用户信息与布局设置 Pinia Store
 * @Author: 李大玄
 * @Date: 2022-07-07 13:56:14
 */

import {ref, computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import {baseLayoutConfig} from "../baseConfig";

export interface LayoutSetting {
  tag: { value: string; disabled: boolean }
  breadcrumb: { value: string; disabled: boolean }
  themeLayout: { value: string }
  color: { value: string; pickerColor: string }
  layout: { value: string }
  tableSetting: { rowHeight: string; tableStyle: string }
}

export const useSystemConfig = defineStore('systemConfig', () => {
  const token = ref("" as string | null);
  const setToken = (val: string | null = null) => {
    token.value = val;
  };

  const userMsg = ref({} as Record<string, unknown>);
  const setUserMsg = (val: Record<string, unknown> = {}) => {
    userMsg.value = Object.assign({}, val);
  };

  const appConfig = ref({} as Record<string, any>);
  const setAppConfig = (val: any) => {
    appConfig.value = Object.assign({}, val.appConfig);
  }

  let layoutConfig = reactive(baseLayoutConfig);
  const setLayoutConfig = (key: keyof typeof layoutConfig, val: any) => {
    (layoutConfig as Record<string, any>)[key] = val;
  };
  const resetLayoutConfig = (val: any) => {
    layoutConfig = Object.assign({}, val);
    console.log(layoutConfig)
  };

  const menusConfig = reactive({
    leftMenus: [],
    topMenus: [],
    activeMenuCode: "",
    authCodeArr: [] as string[],
  });

  const setMenusConfig = (key: keyof typeof menusConfig, val: any) => {
    (menusConfig as Record<string, any>)[key] = val;
  };



  return {
    appConfig, setAppConfig,
    userMsg, setUserMsg,
    token, setToken,
    layoutConfig, setLayoutConfig, resetLayoutConfig,
    menusConfig, setMenusConfig
  };
}, {
  persist: true
});

/*persist: {
  key: 'my-counter',              // 自定义 key，默认是 store id
  storage: sessionStorage,         // 指定存储方式，默认 localStorage
  pick: ['count'],                 // 只持久化 count，不存 doubleCount
  // omit: ['doubleCount'],        // 或者用 omit 排除
}*/
