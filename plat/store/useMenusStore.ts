/*
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-09-01 18:48:36
 * @FilePath: plat/store/useMenusStore.ts
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-01 18:48:36
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
    layoutTag: [] as unknown[],
    layoutTagId: [] as unknown[],
  }),

  actions: {

    setLayoutTag(layoutTag: unknown[] = []) {
      this.layoutTag = layoutTag.filter(Boolean)
    },
    setLayoutTagId(layoutTagId: unknown[] = []) {
      let layoutTag = this.layoutTag
      const index = layoutTag.findIndex((item: any) => (item as any).id === this.removeCurrentTagId)
      layoutTag = layoutTag.filter((item: any) => (item as any).id !== this.removeCurrentTagId)
      if (layoutTag.length > 0) {
        this.layoutTag = layoutTag
        if (this.removeCurrentTagId === this.defaultActiveMenu) {
          this.defaultActiveMenu = layoutTag[index] ? (layoutTag[index] as any).id : (layoutTag[layoutTag.length - 1] as any).id
        }
      }
      this.layoutTagId = layoutTagId
    },
  },
})
