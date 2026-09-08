<template>
  <div class="my-component">
    111111111
    <el-button type="primary">123</el-button>

    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'

// ref 响应式变量
const count = ref(0)
const title = ref('这是一个 Vue3 代码片段')

// reactive 响应式对象
const state = reactive({
  name: 'Vue3',
  age: 3
})

// computed 计算属性
const doubled = computed(() => count.value * 2)

// 方法
function increment() {
  count.value++
}

// watch 监听
watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} -> ${newVal}`)
})

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
  width: 100%;
  height: 100%;
}
</style>
