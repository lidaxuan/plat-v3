<!--
 * @Description: 系统设置
 * @Author: lijixuan
 * @Date: 2026-10-13 10:15:43
 * @FilePath: src/views/systemSetting/index.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-10-13 10:15:43
-->
<template>
  <div class="system-setting">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="问题分类" name="class"></el-tab-pane>
      <el-tab-pane label="人员角色" name="role"></el-tab-pane>
    </el-tabs>

    <ProblemCategory style="height: calc(100% - 40px)" v-if="activeName === 'class'"></ProblemCategory>
    <RoleManagement style="height: calc(100% - 40px)" v-if="activeName === 'role'"></RoleManagement>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import ProblemCategory from './problemCategory/index.vue'
import RoleManagement from './roleManagement/index.vue'
const activeName = ref("class")



// 生命周期
onMounted(() => {
})

onUnmounted(() => {
})
</script>

<style scoped>
.system-setting {
  padding: 20px;
  background: #fff;
  width: 100%;
  height: 100%;
}
</style>
