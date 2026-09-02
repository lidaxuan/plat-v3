<!--
 * @Description: 顶部横向菜单（一级），溢出项收进"更多"子菜单
 * @Author: lidaxuan
 * @Date: 2026-09-02 16:15:36
 * @FilePath: plat/layouts/src/layoutHeader/LayoutHeaderLeft.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-02 16:15:36
-->
<template>
  <div class="layoutMenu" ref="layoutMenuRef">
    <el-menu :collapse-transition="true" :unique-opened="true" :default-active="activeTopMenuId" mode="horizontal">
      <el-menu-item v-for="menu in visibleMenus" :key="menu.id" :index="String(menu.id)" class="flex ai-center" @click="handleSelect(String(menu.code))">
        <icon-class :icon-class="menu.icon" :class="{ 'mr-10': !!menu.icon }" font="18" color="var(--layoutTopMenuCol)"/>
        <span class="menuName">{{ menu.name }}</span>
      </el-menu-item>

      <el-sub-menu v-if="overflowMenus.length">
        <template #title>
          <icon-class icon-class="icon-yijidaohang-gengduo" class="mr-10" font="18" color="var(--layoutTopMenuCol)"/>
          <span class="menuName">更多</span>
        </template>
        <el-menu-item v-for="item in overflowMenus" :key="item.id" :index="String(item.id)" @click="handleSelect(String(item.code))">
          <icon-class :icon-class="item.icon" :class="{ 'mr-8': !!item.icon }" font="18" color="var(--layoutTopMenuCol)"/>
          <span class="mt-3">{{ item.name }}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onBeforeUnmount, nextTick, watch} from 'vue'
import {useRouter} from 'vue-router'
import _ from 'lodash'
import {useSystemConfig} from '../../../store/systemConfig'

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

// ==================== 数据源 ====================

/** 顶级菜单（横向排布的一级菜单，来自 normalMenu） */
const topMenus = computed<MenuItem[]>(() => systemConfig.menusConfig.normalMenu)

/** 当前激活菜单所属顶级菜单 id，用于横向菜单高亮（与侧栏/面包屑共用 activeMenuCode 锚点） */
const activeTopMenuId = computed(() => {
  const {normalMenu, activeMenuCode} = systemConfig.menusConfig
  if (!activeMenuCode || !normalMenu.length) return ''
  const top = (normalMenu as MenuItem[]).find(item => containsCode(item, activeMenuCode))
  return top ? String(top.id) : ''
})

/** 判断菜单（含子树）中是否包含指定 code */
const containsCode = (menu: MenuItem, code: string): boolean => {
  if (menu.code === code) return true
  return !!menu.children?.some(child => containsCode(child, code))
}

// ==================== 溢出折叠 ====================

const layoutMenuRef = ref<HTMLElement | null>(null)
/** 容器放得下的菜单（正常显示） */
const visibleMenus = ref<MenuItem[]>([])
/** 放不下、收进"更多"的菜单 */
const overflowMenus = ref<MenuItem[]>([])

/** 按容器宽度把溢出的顶级菜单折叠进"更多"子菜单 */
const foldOverflowMenus = () => {
  visibleMenus.value = _.cloneDeep(topMenus.value)
  overflowMenus.value = []
  nextTick(() => {
    const container = layoutMenuRef.value
    console.log('foldOverflowMenus', container, visibleMenus.value, overflowMenus.value)
    if (!container) return
    const containerWidth = container.getBoundingClientRect().width
    // el-menu 根节点（ul）下的直接子项 li，过滤掉"更多"子菜单本身
    const itemNodes = Array.from(container.children[0]?.children ?? []) as HTMLElement[]
    const menuNodes = itemNodes.filter(el => !el.classList.contains('el-submenu'))

    let accumulatedWidth = 0
    let splitIndex = 0
    for (let i = 0; i < menuNodes.length; i++) {
      accumulatedWidth += menuNodes[i].getBoundingClientRect().width
      if (accumulatedWidth >= containerWidth) {
        splitIndex = i - 1
        break
      }
    }
    // splitIndex <= 0：要么全部放得下，要么第一个就放不下（极端窄），都不折叠
    console.log('splitIndex', splitIndex)
    if (splitIndex > 0) {
      overflowMenus.value = visibleMenus.value.splice(splitIndex)
    }
  })
}

// ==================== 交互 ====================

/** 取菜单树下第一个可点击（非 disabled 占位）叶子节点的 code */
const getFirstLeafCode = (menus: MenuItem[]): string | undefined => {
  if (!menus?.length) return undefined
  // 跳过占位用的 disabled 项（formatMenuTree 会为父级插入 disabled 占位）
  const first = menus[0].disabled ? menus[1] : menus[0]
  if (!first) return undefined
  if (!first.children?.length) return first.code
  return getFirstLeafCode(first.children)
}

/** 点击顶级菜单：跳到其第一个叶子路由，并同步激活菜单 */
const handleSelect = (code: string) => {
  const topItem = topMenus.value.find(item => item.code === code)
  if (!topItem) return
  const leafCode = getFirstLeafCode([topItem])
  if (!leafCode) return
  router.push('/' + leafCode)
  systemConfig.setMenusConfig('activeMenuCode', leafCode)
}

// ==================== 生命周期 ====================

const handleResize = _.debounce(foldOverflowMenus, 120)

watch(topMenus, foldOverflowMenus, {deep: true})

onMounted(() => {
  foldOverflowMenus()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  handleResize.cancel()
})
</script>

<style lang="scss" scoped>
.layoutMenu {
  height: 100%;

  :deep(.el-menu) {
    background: var(--layoutTopMenuBg);
    border-bottom: none;
    height: 100%;

    .el-menu-item {
      height: 100%;
      padding: 0 24px !important;
      background: var(--layoutTopMenuBg);
      color: #7e84a3 !important;

      .menuName {
        color: var(--layoutTopMenuCol);
      }

      &:hover:not(.is-active) {
        color: #000 !important;
      }

      // 激活 / 悬停态：图标与文字统一用主题色
      &.is-active i,
      &.is-active .menuName,
      &:hover i,
      &:hover .menuName {
        color: var(--layoutTopMenuIsActive) !important;
      }

      &.is-active .menuName,
      &:hover .menuName {
        font-weight: 600;
      }

      &.is-active {
        border: none;

        &::after {
          content: '' !important;
          position: absolute;
          bottom: 0;
          width: calc(100% - 40px);
          border-top: 3px solid var(--layoutTopMenuIsActive) !important;
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }
      }
    }

    .el-sub-menu {
      height: 100%;

      .menuName {
        color: var(--layoutTopMenuCol);
      }

      .el-sub-menu__title {
        margin-top: 3px;
        height: calc(100% - 3px);
      }

      & > .el-sub-menu__title:hover {
        background: var(--layoutTopMenuBg);
      }

      &:hover i,
      &:hover span {
        color: var(--layoutTopMenuIsActive) !important;
      }

      &.is-active {
        .el-sub-menu__title  {
          i {
            color: var(--layoutTopMenuIsActive) !important;
          }

          .menuName {
            color: var(--layoutTopMenuIsActive) !important;
          }

          border: none;
          position: relative;

          &::after {
            content: '' !important;
            position: absolute;
            bottom: 0;
            left: 20px;
            width: calc(100% - 40px);
            border-top: 3px solid var(--layoutTopMenuIsActive) !important;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
          }
        }
      }
    }
  }

  :deep(.el-menu--horizontal) {

    .el-menu-item {
      margin-bottom: 10px;
      padding: 0 20px;
    }
  }
}
</style>
