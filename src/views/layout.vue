<template>
  <div class="my-component">
    <Application>
      <template #appIcon>
        123
      </template>
      <template #headerRight>
        headerRight
      </template>
      <template #actionBar>
        actionBar
      </template>
      <template #appIcon>
        123
      </template>
      <template #content>
        <router-view v-slot="{ Component, route }">
          <transition name="left-to-right" mode="out-in" appear>
            <keep-alive v-if="route.meta && route.meta.keepAlive">
              <component :is="Component"/>
            </keep-alive>
            <component v-else :is="Component"/>
          </transition>
        </router-view>
      </template>
    </Application>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, watch, onMounted, onUnmounted} from 'vue'
import Application from "plat@/layouts/index.vue";

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})

onUnmounted(() => {
  console.log('组件已卸载')
})
</script>

<style scoped>
.my-component {
  padding: 20px;
  background: #f9f9f9;
}
</style>
