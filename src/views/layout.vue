<template>
  <div class="my-component">
    <Application>
<!--      <template #appIcon>-->
<!--        123-->
<!--      </template>-->

<!--      <template #actionBar>-->
<!--        actionBar-->
<!--      </template>-->


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
  background: #f9f9f9;
  width: 100%;
  height: 100%;
}
</style>
