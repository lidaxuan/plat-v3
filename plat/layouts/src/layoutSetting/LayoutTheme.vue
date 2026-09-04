<template>
  <div>
    <div class="flex jc-between">
      <div class="w-140 h-82 br-4 layout cursor-p" @click="layoutThemeClick(0)">
        <div class="w-128 h-16 br-2 mt-6 flex jc-left ai-center layoutHeader layoutColor-EAEDF7">
          <div :class="['w-3 h-3', index > 0 ? 'ml-2' : 'ml-4']" :key="index" :style="{ 'border-radius': '50%', 'background-color': point }" v-for="(point, index) in pointList" />
        </div>
        <div class="flex jc-between plr-6 mt-4">
          <div class="w-20 h-50 br-2 layoutColor-EAEDF7">
            <div class="mt-6 w-18 h-8 layoutColor-6359CA" style="border-radius: 0px 67px 67px 0px" />
          </div>
          <div class="w-104 h-50 br-2 layoutColor-EAEDF7"></div>
        </div>
      </div>
      <div class="w-140 h-82 br-4 layout cursor-p" @click="layoutThemeClick(1)">
        <div class="w-128 h-16 br-2 mt-6 flex jc-left ai-center layoutHeader layoutColor-EAEDF7">
          <div :class="['w-3 h-3', index > 0 ? 'ml-2' : 'ml-4']" :key="index" :style="{ 'border-radius': '50%', 'background-color': point }" v-for="(point, index) in pointList" />
        </div>
        <div class="flex jc-between plr-6 mt-4">
          <div class="w-20 h-50 br-2 layoutColor-6359CA"></div>
          <div class="w-104 h-50 br-2 layoutColor-EAEDF7"></div>
        </div>
      </div>
    </div>
    <div class="flex jc-between mt-12 layoutColor-6F82B3" align="center" font-weight="500" font="14">
      <div class="w-140" font-weight="500">默认极简</div>
      <div class="w-140" font-weight="500">左侧菜单</div>
    </div>
    <div class="flex jc-between mt-20">
      <div class="w-140 h-82 br-4 layout cursor-p" @click="layoutThemeClick(2)">
        <div class="w-128 h-16 br-2 mt-6 flex jc-left ai-center layoutHeader layoutColor-6359CA">
          <div :class="['w-3 h-3', index > 0 ? 'ml-2' : 'ml-4']" :key="index" :style="{ 'border-radius': '50%', 'background-color': point }" v-for="(point, index) in pointList" />
        </div>
        <div class="flex jc-between plr-6 mt-4">
          <div class="w-20 h-50 br-2 layoutColor-EAEDF7"></div>
          <div class="w-104 h-50 br-2 layoutColor-EAEDF7"></div>
        </div>
      </div>
      <div class="w-140 h-82 br-4 layout cursor-p" @click="layoutThemeClick(3)">
        <div class="flex jc-between p-6">
          <div class="w-20 h-70 br-2 flex jc-left layoutColor-6359CA">
            <div
              :class="['w-3 h-3 mt-3', index > 0 ? 'ml-2' : 'ml-4']"
              :key="index"
              :style="{ 'border-radius': '50%', 'background-color': point }"
              v-for="(point, index) in pointList"
            />
          </div>
          <div>
            <div class="w-104 h-16 br-2 layoutColor-EAEDF7"></div>
            <div class="w-104 h-50 br-2 mt-4 layoutColor-EAEDF7"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex jc-between mt-12 layoutColor-6F82B3" align="center" font="14">
      <div class="w-140" font-weight="500">顶部通栏</div>
      <div class="w-140" font-weight="500">左侧通栏</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useSystemConfig} from "../../../store/systemConfig";
import colorSetting from '../../layoutColorSetting';

const systemConfig = useSystemConfig();
const pointList = systemConfig.layoutConfig.pointList

const layoutThemeClick = (v: string) => {
  systemConfig.setLayoutConfig('themeLayout', v);
  colorSetting.isThemeLayout(systemConfig.layoutConfig.themeLayout, systemConfig.layoutConfig.themeColor);

}
</script>

<style lang="scss" scoped>
.layout {
  background: #fff;
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
