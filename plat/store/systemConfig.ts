/*
 * @Description: 用户信息与布局设置 Pinia Store
 * @Author: 李大玄
 * @Date: 2022-07-07 13:56:14
 */

import {ref, computed, reactive} from 'vue'
import {defineStore} from 'pinia'

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

        const appConfig = ref({} as Record<string, any>);
        const setAppConfig = (val: any) => {
            appConfig.value = Object.assign({}, val.appConfig);
        }

        const layoutConfig = reactive({
            showBreadcrumb: true,
            showTag: true,
            themeLayout: 0, // 0 1 2 3
            themeColor: '#409eff',
            menuLayout: 0, // 0: 默认布局 1: 顶部菜单
            sideCollapse: false,
            pointList: ['#FF5750', '#FFBD2E', '#29CC41'],
            themeColorList: [
                {color: '#6359CA', opacity: 1},
                {color: '#2F54EB', opacity: 1},
                {color: '#3585FB', opacity: 1},
                {color: '#05C3D9', opacity: 1},
                {color: '#2FB7AA', opacity: 1},
                {color: '#4BBD13', opacity: 1},
                {color: '#FF9E44', opacity: 1},
                {color: '#FF6602', opacity: 1},
                {color: '#F5212D', opacity: 1},
                {color: '#F04DAB', opacity: 1},
            ],
            tableRowHeight: "small", // small   mini   medium
            tableStyle: "minimalist", // minimalist  border  stripe
        });
        const setLayoutConfig = (key: string, val: any) => {
            layoutConfig[key] = val;
        };

        const menusConfig = reactive({
            leftMenus: [],
            topMenus: [],
            activeMenuCode: "",
            authCodeArr: [] as string[],
        });

        const setMenusConfig = (key: string, val: any) => {
            menusConfig[key] = val;
        };

        return {
            appConfig, setAppConfig,
            token, setToken,
            layoutConfig, setLayoutConfig,
            menusConfig, setMenusConfig
        };
    },
    {
        persist: true
    }
);

/*persist: {
  key: 'my-counter',              // 自定义 key，默认是 store id
  storage: sessionStorage,         // 指定存储方式，默认 localStorage
  pick: ['count'],                 // 只持久化 count，不存 doubleCount
  // omit: ['doubleCount'],        // 或者用 omit 排除
}*/
