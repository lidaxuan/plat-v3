<!--
 * @Author: 段丽军
 * @Date: 2021-11-25 10:40:07
 * @LastEditTime: 2022-08-25 14:42:55
 * @LastEditors: 李大玄
 * @Description:
 * @FilePath: /data-config-view/node_modules/el-ui/components/layouts/src/LayoutBreadcrumb.vue
-->
<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/" class="mt-0">
      <el-breadcrumb-item v-for="(parent, index) in breadcrumb.menuModules" :key="index + 'breadcrumb'">{{ parent }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMenusStore } from '../../store/useMenusStore'
import utils from '../../utils'

const route = useRoute()
const menusStore = useMenusStore()

const breadcrumb = computed(() => {
  return utils.getMenuItem(
    menusStore.nomalMenu,
    route.path.replace('/', '') || String(route.name),
    []
  ) || { menuModules: ['--'], menuItem: '--' }
})
</script>

<style lang="scss" scoped>
@import "../../assets/base/common/index";
.breadcrumb {
  color: var(--layoutBreadcrumbCol);
  background: #eff1f4;
  padding: 10px 20px 0;
}

::v-deep .el-breadcrumb__inner,
::v-deep .el-breadcrumb__separator {
  font-size: 12px;
  font-weight: 400;
  color: $-color-7D8DBF !important;
}
</style>
