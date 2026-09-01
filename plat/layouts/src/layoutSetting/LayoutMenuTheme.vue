<!--
 * @Description:
 * @Author: 李大玄
 * @Date: 1985-10-26 16:15:00
 * @FilePath: /framework/ui/components/layouts/src/layoutSetting/LayoutMenuTheme.vue
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-08-11 09:48:19
-->
<template>
  <div>
    <div class="flex jc-between">
      <div class="w-140 h-82 br-4 layout cursor-p" @click="layoutClick(0)">
        <div class="w-128 h-16 br-2 mt-6 flex jc-left ai-center layoutHeader layoutColor-EAEDF7">
          <div :class="['w-3 h-3', index > 0 ? 'ml-2' : 'ml-4']" :key="index" :style="{ 'border-radius': '50%', 'background-color': point }" v-for="(point, index) in pointList" />
        </div>
        <div class="flex jc-between plr-6 mt-4">
          <div class="w-20 h-50 br-2 layoutColor-6359CA"></div>
          <div class="w-104 h-50 br-2 layoutColor-EAEDF7"></div>
        </div>
      </div>
      <div class="w-140 h-82 br-4 layout cursor-p" @click="layoutClick(1)">
        <div class="w-128 h-16 br-2 mt-6 flex jc-left ai-center layoutHeader layoutColor-EAEDF7">
          <div :class="['w-3 h-3', index > 0 ? 'ml-2' : 'ml-4']" :key="index" :style="{ 'border-radius': '50%', 'background-color': point }" v-for="(point, index) in pointList" />
          <div class="w-104 h-16 br-2 ml-3 layoutColor-6359CA"></div>
        </div>
        <div class="flex jc-between plr-6 mt-4">
          <div class="w-20 h-50 br-2 layoutColor-6359CA"></div>
          <div class="w-104 h-50 br-2 layoutColor-EAEDF7"></div>
        </div>
      </div>
    </div>
    <div class="flex jc-between mt-12 layoutColor-6F82B3" align="center" font-weight="500" font="14">
      <div class="w-140" font-weight="500">默认极简</div>
      <div class="w-140" font-weight="500">左侧+顶部</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {useSystemConfig} from "../../../store/systemConfig";


const systemConfig = useSystemConfig();
const layoutSetting = ref(systemConfig.layoutConfig.menuLayout)
const pointList = systemConfig.layoutConfig.pointList;

const layoutClick = (v: string) => {
  layoutSetting.value = v;
  systemConfig.setLayoutConfig('menuLayout', v);
}
</script>

<style lang="scss" scoped>
.layout {
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px #d1dcf5;
  &Header {
    margin: auto;
  }
  &Color-EAEDF7 {
    background-color: #eaedf7;
  }
  &Color-6F82B3 {
    color: #6f82b3;
  }
  &Color-6359CA {
    background-color: var(--layoutMain-6359CA);
  }
}
</style>
