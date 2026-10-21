<template>
  <div class="my-component">
    <Application>
<!--      <template #appIcon>-->
<!--        123-->
<!--      </template>-->

<!--      <template #actionBar>-->
<!--        actionBar-->
<!--      </template>-->
      <template #content>
        <router-view v-slot="{ Component, route }">
          <transition name="left-to-right" mode="out-in" appear>
            <keep-alive v-if="route.meta && route.meta.keepAlive">
              <component :is="Component" :key="route.fullPath"/>
            </keep-alive>
            <component v-else :is="Component" :key="route.fullPath" />
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
})

onUnmounted(() => {
})
</script>

<style scoped>
.my-component {
  background: #f9f9f9;
  width: 100%;
  height: 100%;
}
</style>
