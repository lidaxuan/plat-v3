/*
 * @Description: 应用配置 Pinia Store
 * @Author: 李大玄
 * @Date: 2022-07-07 13:56:14
 */
import { defineStore } from 'pinia'

export const useAppConfigStore = defineStore('appConfig', {
  state: () => ({
    appName: '',
    appConfig: {} as Record<string, unknown>,
  }),

  actions: {
    setAppConfig(appConfig: Record<string, unknown> = {}) {
      for (const key in appConfig) {
        ;(this as any)[key] = appConfig[key]
      }
    },
  },
})