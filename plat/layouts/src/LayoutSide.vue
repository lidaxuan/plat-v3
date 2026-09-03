<!--
 * @Description: 侧边栏菜单（竖向布局渲染全量；上左布局渲染当前顶级菜单的子级）
 * @Author: lidaxuan
 * @Date: 2026-09-02 16:39:11
 * @FilePath: plat/layouts/src/LayoutSide.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-02 16:39:11
-->
<template>
  <div class="">
    <el-menu :default-active="activeMenuCode" :unique-opened="true" height="100%" class="pt-10 overflow-y-a" :collapse-transition="false" @select="handleSelect" :collapse="props.isCollapse">
      <LayoutSideItem :menuData="sideMenus" :is-collapse="props.isCollapse" :class="props.isCollapse ? 'el-menu--collapse' : ''"/>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useRouter} from 'vue-router'
import _ from 'lodash'
import LayoutSideItem from './LayoutSideItem.vue'
import findData from '../../utils/findData.js'
import {useSystemConfig} from '../../store/systemConfig'

/** 菜单项结构（与 systemConfig.menusConfig.normalMenu 元素一致） */
interface MenuItem {
  id: string | number
  code: string
  name: string
  icon?: string | null
  disabled?: boolean
  children?: MenuItem[] | null

  [key: string]: unknown
}

const systemConfig = useSystemConfig()
const router = useRouter()
const props = defineProps<{ isCollapse: boolean }>()

/** 顶级菜单（来自 store，竖向布局下直接渲染它） */
const topMenus = computed<MenuItem[]>(() => systemConfig.menusConfig.normalMenu)
/** 当前激活菜单 code（el-menu 的 default-active 锚点） */
const activeMenuCode = computed(() => systemConfig.menusConfig.activeMenuCode)
/** 当前布局：0 竖向 / 1 上左 */
const menuLayout = computed(() => systemConfig.layoutConfig.menuLayout)

/** 在菜单树中查找包含指定 code 的顶级菜单（命中子级时返回其顶级祖先） */
const findTopMenuByCode = (menus: MenuItem[], code: string): MenuItem | undefined => {
  for (const menu of menus) {
    if (menu.code === code) return menu
    if (menu.children?.length && findTopMenuByCode(menu.children, code)) {
      return menu // 子树命中，返回顶级祖先
    }
  }
  return undefined
}

/** 上左布局：取当前激活菜单所属顶级菜单的子级，作为左侧渲染列表 */
const getActiveTopMenuChildren = (): MenuItem[] => {
  const topItem = _.cloneDeep(findTopMenuByCode(topMenus.value, activeMenuCode.value))
  if (!topItem) return []
  // 有子级：渲染其 children
  if (topItem.children?.length) return topItem.children
  // 无子级（单级菜单）：把自身放回左侧渲染
  delete topItem.icon
  return [topItem]
}

/** 过滤掉占位用的 disabled 项 */
const excludeDisabled = (menus: MenuItem[]): MenuItem[] => {
  return menus.filter(item => item.disabled !== true)
}

/** 左侧最终渲染的菜单列表 */
const sideMenus = computed<MenuItem[]>(() => {
  let rawMenus: MenuItem[] = []
  if (menuLayout.value === 0) {
    // 竖向：渲染全量顶级菜单
    rawMenus = topMenus.value
  } else if (menuLayout.value === 1) {
    // 上左：渲染当前顶级菜单的子级，并过滤占位项
    rawMenus = excludeDisabled(getActiveTopMenuChildren())
  }
  return findData.levelFun(rawMenus, menuLayout.value)
})

/** 点击菜单：跳转路由并同步激活菜单 */
const handleSelect = (code: string) => {
  router.push('/' + code)
  systemConfig.setMenusConfig('activeMenuCode', code)
  systemConfig.setLayoutTag(code);
}
</script>

<style lang="scss" scoped>
.el-menu {
  border-right: none;
  box-shadow: 2px 4px 4px 0px rgba(21, 34, 50, 0.08);
  background-color: var(--layoutSideMenuBg);

  .isCollapseMore {
    bottom: 77px;
    left: 50%;
    margin-left: -13px;
    background: #f9f8fd;
  }
}
</style>
