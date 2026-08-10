/*
 * @Description: 菜单与标签页 Pinia Store
 * @Author: 李大玄
 * @Date: 2022-07-07 13:56:14
 */
import { defineStore } from 'pinia'

export interface MenuItem {
  id: string
  icon?: string
  path?: string
  name: string
  code: string
  children?: MenuItem[] | null
  disabled?: boolean
  countId?: string
  srcName?: string
  level?: number
  [key: string]: unknown
}

export const useMenusStore = defineStore('layoutMenus', {
  state: () => ({
    nomalMenu: [] as MenuItem[],
    breadcrumb: [] as unknown[],
    sideMenu: [] as MenuItem[],
    defaultActiveMenu: '',
    authCodeArr: [] as string[],
    layoutTag: [] as unknown[],
    layoutTagId: [] as unknown[],
    defaultActiveHorizontalMenu: '',
    removeCurrentTagId: '',
  }),

  actions: {
    setBreadcrumb(breadcrumb: unknown[] = []) {
      this.breadcrumb = breadcrumb
    },
    setSideMenu(sideMenu: MenuItem[] = []) {
      this.sideMenu = sideMenu
    },
    setNomalMenu(nomalMenu: MenuItem[] = []) {
      this.nomalMenu = nomalMenu
    },
    setDefaultActiveMenu(defaultActiveMenu = '') {
      this.defaultActiveMenu = defaultActiveMenu
    },
    setRemoveCurrentTagId(removeCurrentTagId = '') {
      this.removeCurrentTagId = removeCurrentTagId
    },
    setDefaultActiveHorizontalMenu(defaultActiveHorizontalMenu = '') {
      this.defaultActiveHorizontalMenu = defaultActiveHorizontalMenu
    },
    setAuthCodeArr(authCodeArr: string[] = []) {
      this.authCodeArr = authCodeArr
    },
    setLayoutTag(layoutTag: unknown[] = []) {
      this.layoutTag = layoutTag.filter(Boolean)
    },
    setLayoutTagId(layoutTagId: unknown[] = []) {
      let layoutTag = this.layoutTag
      const index = layoutTag.findIndex(
        (item: any) => item.id === this.removeCurrentTagId
      )
      layoutTag = layoutTag.filter(
        (item: any) => item.id !== this.removeCurrentTagId
      )
      if (layoutTag.length > 0) {
        this.layoutTag = layoutTag
        if (this.removeCurrentTagId === this.defaultActiveMenu) {
          this.defaultActiveMenu = layoutTag[index]
            ? (layoutTag[index] as any).id
            : (layoutTag[layoutTag.length - 1] as any).id
        }
      }
      this.layoutTagId = layoutTagId
    },
  },
})