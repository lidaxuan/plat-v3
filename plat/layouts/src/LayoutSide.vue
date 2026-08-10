<!--
 * @Author: 段丽军
 * @Date: 2022-01-04 15:08:21
 * @LastEditTime: 2023-07-17 14:35:32
 * @LastEditors: 李大玄
 * @Description:
 * @FilePath: /framework/ui/components/layouts/src/LayoutSide.vue
-->
<template>
  <div class="">
    <el-menu
      :default-active="defaultActiveMenu"
      :unique-opened="true"
      height="100%"
      class="pt-10 overflow-y-a"
      :collapse-transition="false"
      @select="handleSelect"
      :collapse="props.isCollapse"
    >
      <LayoutSideItem :menuData="menuList" :is-collapse="props.isCollapse" :class="props.isCollapse ? 'el-menu--collapse' : ''" />
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import LayoutSideItem from './LayoutSideItem.vue'
import { useMenusStore } from '../../store/useMenusStore'
import findData from '../../utils/findData.js'
import {useSystemConfig} from "../../store/systemConfig";

const systemConfig  =  useSystemConfig();
const props = defineProps<{ isCollapse: boolean }>()

const router = useRouter()
const menusStore = useMenusStore()

const nomalMenu = computed(() => systemConfig.menusConfig.leftMenus)
const defaultActiveMenu = computed(() => systemConfig.menusConfig.activeMenuCode)
const defaultActiveHorizontalMenu = computed(() => menusStore.defaultActiveHorizontalMenu)

const menuList = computed(() => {
  let menuList: unknown[] = []
  const layout = systemConfig.layoutConfig.menuLayout
  // systemConfig.menusConfig.leftMenus
  // 竖向菜单
  if (layout === 0) {
    menuList = nomalMenu.value
  }
  // 横向菜单
  else if (layout === 1) {
    menuList = dufFun(getMenuModuleMenu())
  }
  return findData.levelFun(menuList, layout)
})

const dufFun = (setHomeSideMenu: any[]) => {
  return setHomeSideMenu.filter((item) => item.disabled !== true)
}

const getMenuModuleMenu = () => {
  const item = _.cloneDeep(
    nomalMenu.value.find((item: any) => item.countId === defaultActiveHorizontalMenu.value)
  )
  let children: any[] = []
  if (item && item.children) {
    children = item.children
  } else if (systemConfig.layoutConfig.menuLayout == 1 && item) {
    // 没有children 只有一级  上左布局时 给左边复制一个菜单
    delete (item as any).icon
    children = [item]
  }
  children = JSON.parse(JSON.stringify(children))
  return children
}

const handleSelect = (key: string) => {
  const obj = findData.getParentId(menuList.value, key)
  if (obj.path || obj.code || obj.uri) {
    router.push(obj.path || obj.code || obj.uri)
  }
  systemConfig.setMenusConfig('activeMenuCode', obj.code);
}
</script>

<style lang="scss" scoped>
//@import '../../assets/base/common/index';
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
