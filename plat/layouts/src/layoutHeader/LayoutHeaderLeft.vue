<!--
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-08-07 11:31:41
 * @FilePath: plat/layouts/src/layoutHeader/LayoutHeaderLeft.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-08-07 11:31:41
-->
<template>
  <div class="layoutMenu" ref="layoutMenu">
    <el-menu ref="menu" :collapse-transition="true"
             :unique-opened="true" :default-active="defaultActiveHorizontalMenu" mode="horizontal">
      <el-menu-item v-for="(menu, index) in menus" :key="menu.id" class="flex ai-center"
                    @click="handleSelect(String(menu.code))" :index="String(menu.id)"
      >
        <icon-class :icon-class="menu.icon" :class="{ 'mr-10': menu.icon ? true : false }" font="18" color="var(--layoutTopMenuCol)"/>
        <span class="menuName">{{ menu.name }}</span>
      </el-menu-item>

      <el-sub-menu v-if="afterEnums.length">
        <template #title>
          <icon-class icon-class="icon-yijidaohang-gengduo" class="mr-10" font="18" color="var(--layoutTopMenuCol)"/>
          <span class="menuName">更多</span>
        </template>
        <el-menu-item v-for="item in afterEnums" :key="item.id" :index="String(item.id)" @click="handleSelect(String(item.code))">
          <icon-class :icon-class="item.icon" :class="{ 'mr-8': item.icon ? true : false }" font="18" color="var(--layoutTopMenuCol)"/>
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
import {useMenusStore} from '../../../store/useMenusStore'

const router = useRouter()
const menusStore = useMenusStore()

const nomalMenu = computed(() => menusStore.nomalMenu)
const defaultActiveHorizontalMenu = computed(() => menusStore.defaultActiveHorizontalMenu)

const layoutMenu = ref<HTMLElement | null>(null)
const menus = ref<any[]>([])
const afterEnums = ref<any[]>([])

const getFirst = (nomalMenu: any[]): string | undefined => {
  if (!nomalMenu || !Array.isArray(nomalMenu) || !nomalMenu[0]) {
    return undefined
  }
  let first
  if (nomalMenu[0].disabled) {
    // 修复：数组只有一项时 nomalMenu[1] 不存在保护
    if (!nomalMenu[1]) return undefined
    first = nomalMenu[1]
  } else {
    first = nomalMenu[0]
  }

  if (!first.children || first.children.length === 0) {
    return first.code
  }
  return getFirst(first.children)
}

const handleSelect = (key: string) => {
  console.log(key)
  const findItem = nomalMenu.value.find((item: any) => item.code === key)
  // 修复：不再包数组，直接传对象数组，找不到直接return，防止 push('/undefined')
  if (!findItem) return
  const menuItem = getFirst([findItem])
  console.log("menuItem", menuItem)
  if (!menuItem) return
  router.push('/' + menuItem)
}

let _handleResize: (() => void) | null = null

const formatterEnum = () => {
  menus.value = _.cloneDeep(nomalMenu.value)
  nextTick(() => {
    if (!layoutMenu.value) return
    const boxWidth = layoutMenu.value.getBoundingClientRect().width
    const childrenNodes = Array.from(layoutMenu.value.children[0].children) as HTMLElement[]
    // 修复：过滤掉 el-sub-menu「更多」节点，不参与宽度计算
    const lis = childrenNodes.filter(el => !el.classList.contains('el-submenu'))

    afterEnums.value = []
    let sumWidth = 0
    let index = 0

    for (let i = 0; i < lis.length; i++) {
      const itemWidth = lis[i].getBoundingClientRect().width
      sumWidth = itemWidth + sumWidth
      if (sumWidth >= boxWidth) {
        index = i - 1
        break
      }
    }
    // 修复边界：index <=0 代表全部放不下，不要splice(-1)乱删
    if (index > 0) {
      afterEnums.value = menus.value.splice(index)
    } else {
      afterEnums.value = []
    }
  })
}

// 监听store菜单变化，自动重新折叠
watch(nomalMenu, () => {
  formatterEnum()
}, {deep: true})

onMounted(() => {
  formatterEnum()
  // 防抖处理resize
  _handleResize = _.debounce(() => {
    formatterEnum()
  }, 120)
  window.addEventListener('resize', _handleResize)
})

onBeforeUnmount(() => {
  if (_handleResize) {
    window.removeEventListener('resize', _handleResize)(_handleResize as any).cancel?.()
  }
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

      i {
        color: #7e84a3 !important;
      }

      .menuName {
        color: var(--layoutTopMenuCol);
      }

      &.is-active {
        color: #6359ca !important;

        i {
          color: #6359ca !important;
        }
      }

      &:hover:not(.is-active) {
        color: #000 !important;
      }

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

    .el-submenu {
      height: 100%;

      .menuName {
        color: var(--layoutTopMenuCol);
      }

      .el-submenu__title {
        margin-top: 3px;
        height: calc(100% - 3px);
      }

      & > .el-submenu__title:hover {
        background: var(--layoutTopMenuBg);
      }

      &:hover i,
      &:hover span {
        color: var(--layoutTopMenuIsActive) !important;
      }

      &.is-active {
        .el-submenu__title {
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
    padding: 10px 0;

    .el-menu-item {
      margin-bottom: 10px;
      padding: 0 20px;
    }
  }
}
</style>
