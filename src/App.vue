
<template>
  <RouterView/>
</template>
<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {useCounterStore} from "@/stores/counter";
import {ref} from 'vue'
import { storeToRefs } from 'pinia'
import Application from "@/../plat/layouts/index.vue"


const {count, doubleCount} = storeToRefs(useCounterStore());
const {increment} = useCounterStore();
const value1 = ref(true)
import HelloWorld from './components/HelloWorld.vue'
</script>

<style  lang="scss">
#app {
  height: 100%;
}
</style>
