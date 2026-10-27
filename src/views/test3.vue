<template>
  <div class="my-component">
    <SchemaFormGenerator />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import SchemaFormGenerator from '../components/schema-form-generator.vue';
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

// 生命周期
onMounted(() => {
})

onUnmounted(() => {
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
