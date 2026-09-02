<!--
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-08-07 11:23:07
 * @FilePath: plat/layouts/src/layoutHeader/index.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-08-07 11:23:07
-->

<template>
  <div class="flex jc-between ai-center" height="100%">
    <div style="flex: 1" v-if="systemConfig.layoutConfig.menuLayout === 0"/>

    <template v-if="systemConfig.layoutConfig.menuLayout === 1">
      <LayoutHeaderLeft class="flex-1" v-if="systemConfig.layoutConfig.menuLayout === 1"/>
    </template>
    <div class="ml-80" :class="['flex', systemConfig.layoutConfig.menuLayout == 1 ? 'jc-between' : 'jc-end']">
      <template v-if="!$slots.headerRight">
        <LayoutHeaderRight v-bind="$attrs" v-on="$listeners">
          <template v-slot:actionBar>
            <slot name="actionBar"></slot>
          </template>
        </LayoutHeaderRight>
      </template>
      <template v-else>
        <slot name="headerRight"></slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import LayoutHeaderRight from './LayoutHeaderRight.vue'
import LayoutHeaderLeft from './LayoutHeaderLeft.vue'
import {useSystemConfig} from "../../../store/systemConfig";

const systemConfig = useSystemConfig();
</script>
