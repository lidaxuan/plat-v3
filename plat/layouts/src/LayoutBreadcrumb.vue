<!--
 * @Description: 面包屑 — 基于当前激活菜单 code 渲染菜单路径链
 * @Author: lidaxuan
 * @Date: 2026-09-01 18:34:48
 * @FilePath: plat/layouts/src/LayoutBreadcrumb.vue
-->
<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/" class="mt-0">
      <el-breadcrumb-item
        v-for="(name, index) in breadcrumbNames"
        :key="index + '-breadcrumb'"
      >
        {{ name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">

import { computed } from 'vue'
import utils from '../../utils'
import { useSystemConfig } from 'plat@/store/systemConfig'

const systemConfig = useSystemConfig()

/**
 * 以 activeMenuCode 为锚点，从 leftMenus 树中递归查找并收集路径链
 * 未找到时显示 ["--"]，无激活菜单时显示占位
 */
const breadcrumbNames = computed<string[]>(() => {
  const { leftMenus, activeMenuCode } = systemConfig.menusConfig
  if (!activeMenuCode || !leftMenus.length) return ['--']
  const found = utils.getMenuItem(leftMenus, activeMenuCode, [])
  return found?.menuModules?.length ? found.menuModules : ['--']
})
</script>

<style lang="scss" scoped>
.breadcrumb {
  color: var(--layoutBreadcrumbCol);
  background: #eff1f4;
  padding: 10px 20px 0;
}

:deep(.el-breadcrumb__inner), :deep(.el-breadcrumb__separator) {
  font-size: 12px;
  font-weight: 400;
}
</style>
