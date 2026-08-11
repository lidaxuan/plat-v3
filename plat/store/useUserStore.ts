/*
 * @Description: 用户信息与布局设置 Pinia Store
 * @Author: 李大玄
 * @Date: 2022-07-07 13:56:14
 */
import { defineStore } from 'pinia'

export interface LayoutSetting {
  tag: { value: string; disabled: boolean }
  breadcrumb: { value: string; disabled: boolean }
  themeLayout: { value: string }
  color: { value: string; pickerColor: string }
  layout: { value: string }
  tableSetting: { rowHeight: string; tableStyle: string }
}

interface UserState {
  userMsg: Record<string, unknown>
  token: string | null
  messList: unknown[]
  messNum: number
  chromeNotify: boolean
  loginStatus: string
  loginTrust: string
  logoutBtns: unknown[]
  layoutSetting: LayoutSetting
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userMsg: {} as Record<string, unknown>,
    token: null as string | null,
    messList: [] as unknown[],
    messNum: 0,
    chromeNotify: false,
    loginStatus: '',
    loginTrust: '',
    logoutBtns: [] as unknown[],
    layoutSetting: {
      tag: { value: '0', disabled: false },
      breadcrumb: { value: '0', disabled: false },
      themeLayout: { value: '' },
      color: { value: '', pickerColor: '' },
      layout: { value: '' },
      tableSetting: { rowHeight: '', tableStyle: '' },
    } as LayoutSetting,
  }),

  actions: {
    setToken(token: string | null = null) {
      this.token = token
    },
    setUserMsg(userMsg: Record<string, unknown> = {}) {
      this.userMsg = userMsg
    },
    setLayoutSetting(layoutSetting: Partial<LayoutSetting>) {
      this.layoutSetting = Object.assign({}, this.layoutSetting, layoutSetting)
    },
    setNotify(chromeNotify: boolean = false) {
      this.chromeNotify = chromeNotify
    },
    setTableSetting(tableSetting: Partial<LayoutSetting['tableSetting']>) {
      this.layoutSetting.tableSetting = Object.assign(
        {},
        this.layoutSetting.tableSetting,
        tableSetting,
      )
    },
    setLoginStatus(data: string) {
      this.loginStatus = data
    },
    setLoginTrust(data: string) {
      this.loginTrust = data
    },
    setLogoutBtns(list: unknown[] = []) {
      this.logoutBtns = [].concat(list as [])
    },
  },
})
