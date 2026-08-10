import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
}, {
  persist: true
})

/*persist: {
  key: 'my-counter',              // 自定义 key，默认是 store id
  storage: sessionStorage,         // 指定存储方式，默认 localStorage
  pick: ['count'],                 // 只持久化 count，不存 doubleCount
  // omit: ['doubleCount'],        // 或者用 omit 排除
}*/
