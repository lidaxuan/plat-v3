/*
 * @Description: 用户信息与布局设置 Pinia Store
 * @Author: 李大玄
 * @Date: 2022-07-07 13:56:14
 */

import {ref, computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import {baseLayoutConfig} from "../baseConfig";

/** persist key 前缀，由 beforeInit 在 useSystemConfig 调用前设置 */
let _persistKeyPrefix = '';
/** persist 存储介质，默认 localStorage，由 beforeInit 设置 */
let _persistStorage: Storage = localStorage;

export function setPersistKeyPrefix(prefix: string): void {
  _persistKeyPrefix = prefix;
}

export function setPersistStorage(storage: Storage): void {
  _persistStorage = storage;
}

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
  const handleDropdownList = ref<string[]>([]);
  const setAppConfig = (val: any) => {
    appConfig.value = Object.assign({}, val.appConfig);
    handleDropdownList.value = val.handleDropdownList;
  }

  const layoutConfig = ref(baseLayoutConfig);
  const setLayoutConfig = (key: string, val: any) => {
    (layoutConfig.value as Record<string, any>)[key] = val;
  };
  const resetLayoutConfig = (val: any) => {
    layoutConfig.value = Object.assign({}, val);
  };

  const menusConfig = reactive({
    normalMenu: [],
    activeMenuCode: "",
    authCodeArr: [] as string[],
  });

  const setMenusConfig = (key: keyof typeof menusConfig, val: any) => {
    (menusConfig as Record<string, any>)[key] = val;
  };

  const setUserLoginStatus = (val: boolean) => {

  }

  /** 退出登录：清除用户数据，保留项目配置 */
  const clearUserData = () => {
    setToken(null);
    setUserMsg({});
    setMenusConfig('normalMenu', []);
    setMenusConfig('activeMenuCode', '');
    setMenusConfig('authCodeArr', []);
  };

  return {
    appConfig, handleDropdownList, setAppConfig,
    userMsg, setUserMsg,
    token, setToken,
    layoutConfig, setLayoutConfig, resetLayoutConfig,
    menusConfig, setMenusConfig,
    clearUserData,
  };
}, {
  persist: {
    key: (id: string) => _persistKeyPrefix ? `${_persistKeyPrefix}_${id}` : id,
    // 用 getter 动态读取 _persistStorage，保证 setPersistStorage 之后能生效
    get storage(): Storage {
      return _persistStorage;
    },
  }
});

/*persist: {
  key: 'my-counter',              // 自定义 key，默认是 store id
  storage: sessionStorage,         // 指定存储方式，默认 localStorage
  pick: ['count'],                 // 只持久化 count，不存 doubleCount
  // omit: ['doubleCount'],        // 或者用 omit 排除
}*/
