<!--
 * @Description:
 * @Author: 李大玄
 * @Date: 2022-08-30 18:37:15
 * @FilePath: /framework/ui/components/layouts/index.vue
 * @LastEditors: 李大玄
 * @LastEditTime: 2025-02-21 09:53:55
-->

<template>
  <div class="layout flex jc-between position-r" height="100%">
{{appConfig}}
    <el-container v-if="$route.meta && $route.meta.fullScreen" class="overflow-y-a position-r layout-container position-a" :style="styleObj" width="100%" height="100%">
      <transition name="left-to-right" mode="out-in" appear>
        <keep-alive>
          <router-view v-if="$route.meta && $route.meta.keepAlive"></router-view>
        </keep-alive>
      </transition>
      <router-view v-slot="{ Component, route }">
        <transition name="left-to-right" mode="out-in" appear>
          <component v-if="!route.meta || !route.meta.keepAlive" :is="Component"/>
        </transition>
      </router-view>


    </el-container>

    <el-container v-else class="overflow-y-a position-r layout-container position-a" :style="styleObj" width="100%" height="100%">
      <el-aside class="position-r overflow-i layout-elaside" :width="isCollapse ? '66px' : '200px'">
        <div class="br-1 layout-aside">
          <div class="h-66 layout-aside-box" width="100%">
            <template v-if="!$slots.logo">
              <div :class="['layout-aside-boxIcon position-r', 'h-66 flex ai-center', 'pl-20', isCollapse ? 'w-66' : '']">
                <template v-if="!$slots.appIcon">
                  <icon-class :icon-class="`${appConfig.logoIconFont || 'icon-A-A7'}`" class="mr-10" font="28" color="var(&#45;&#45;layoutBeacon)"/>
                </template>
                <template v-else>
                  <slot name="appIcon"></slot>
                </template>
                <div align="left" class="mt-5 flex flex-column" v-if="!isCollapse">
                  <div font-weight="600" class="w-95" font="18">{{ appConfig.appName }}</div>
                  <div align="left" font-weight="600" font="12" class="little-font">{{ appConfig.enAppName || "EASYLIAO TECHNOLOGY" }}</div>
                </div>
              </div>
            </template>
            <template v-else>
              <slot name="logo"></slot>
            </template>
          </div>

          <LayoutSide class="layout-menu" :isCollapse="isCollapse" :class="[isCollapse ? 'w-66' : '']" style="height: calc(100% - 68px)"/>
        </div>
        <!-- 折叠按钮  == 0 顶部有菜单   == 1 无折叠按钮-->
        <div class="layout-aside-collapse position-a" v-if="systemConfig.layoutConfig.menuLayout == 0" @click="collapseChage">
          <div class="w-27 h-27 flex jc-center ai-center layout-aside-collapseBtn">
            <el-button round size="mini">
              <i font-weight="600" :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
            </el-button>
          </div>
        </div>
        <!-- 折叠按钮 -->
      </el-aside>
      <el-main class="p-0 position-r overflow-h" height="100%">
        <el-header class="layout-nav h-66 pl-15 pr-15" width="100%">
          <LayoutHeader>
            <template v-if="$slots.headerRight" v-slot:headerRight>
              <slot name="headerRight"></slot>
            </template>
            <template v-slot:actionBar>
              <slot name="actionBar"></slot>
            </template>
          </LayoutHeader>
        </el-header>
        <LayoutTag v-if="systemConfig.layoutConfig.showTag" style="border-top: 1px solid rgba(0, 0, 0, 0.1); z-index: 1"/>

        <div id="layout-main" :class="['layout-main pt-15 plr-15 overflow-a position-r']" :style="getMainStyle()">
          <LayoutBreadcrumb v-if="systemConfig.layoutConfig.showBreadcrumb" class="mb-15"/>
          <template v-if="$slots && $slots.content">
            <slot name="content"></slot>
          </template>
          <template v-else>
            <transition name="left-to-right" mode="out-in" appear>
              <keep-alive>
                <router-view v-if="$route.meta && $route.meta.keepAlive"></router-view>
              </keep-alive>
            </transition>
            <transition name="left-to-right" mode="out-in" appear>
              <router-view v-if="!$route.meta || !$route.meta.keepAlive"></router-view>
            </transition>
          </template>
        </div>
      </el-main>
    </el-container>

  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import LayoutSide from './src/LayoutSide.vue'
import LayoutHeader from './src/layoutHeader/index.vue'

import LayoutTag from './src/LayoutTag.vue'
import LayoutBreadcrumb from './src/LayoutBreadcrumb.vue'
import colorSetting from './layoutColorSetting.js'


import {useSystemConfig} from "../store/systemConfig";
const systemConfig = useSystemConfig();

console.log(12313, systemConfig.appConfig)
const appConfig = computed(() => systemConfig.appConfig)

let isCollapse = ref(systemConfig.layoutConfig.sideCollapse)

const styleObj = ref<Record<string, string>>({})

const getMainStyle = () => {
  return {height: 'calc(100% - 66px)'}
}

const collapseChage = () => {
  isCollapse.value = !isCollapse.value
  systemConfig.setLayoutConfig("sideCollapse", isCollapse);
}

const comSetColor = (value: string) => {
  colorSetting.setLayoutColor(value)
  colorSetting.isThemeLayout(systemConfig.layoutConfig.themeLayout, value)
}

onMounted(() => {
  comSetColor(systemConfig.layoutConfig.themeColor)
})
</script>

<style lang="scss" scoped>
@use '../assets/base/common/index.scss';
@use '../assets/style/home/layouts.scss';
</style>
