<!--
 * @Description: 已完成
 * @Author: lidaxuan
 * @Date: 2026-08-07 11:23:37
 * @FilePath: plat/layouts/src/layoutSetting/index.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-08-07 11:23:37
-->

<template>
  <div class="setting">
    <div class="">
      <div class="flex ai-center mb-21">
        <div class="settingLine"></div>
        <div font="14" class="ml-8 settingName">菜单布局</div>
      </div>

      <LayoutMenuTheme></LayoutMenuTheme>
    </div>
    <div class="mtb-30 h-1 br-1 settingBg-EAECF0"/>

    <div class="">
      <div class="flex ai-center mb-21">
        <div class="settingLine"></div>
        <div font="14" class="ml-8 settingName">主题布局</div>
      </div>

      <LayoutTheme></LayoutTheme>
    </div>
    <div class="mtb-30 h-1 br-1 settingBg-EAECF0"/>
    <div class=" mt-34">
      <div class="flex ai-center mb-21">
        <div class="settingLine"></div>
        <div font="14" class="ml-8 settingName">主题色系</div>
      </div>
      <div class="flex ai-center">
        <div v-for="(item, index) in colorList" :key="index" font="13"
             class="w-23 h-23 br-4 mr-10 cursor-p flex ai-center jc-center"
             :style="{ background: item.color, opacity: item.opacity, color: '#fff', display: 'flex' }"
             @click="clickColorChange(item)"
        >
          <el-icon v-if="themeColor == item.color">
            <Check/>
          </el-icon>
        </div>
      </div>
    </div>
    <div class="mtb-30 h-1 br-1 settingBg-EAECF0"/>

    <div class="mb-24 flex jc-between ai-center">
      <div class="flex ai-center">
        <div class="settingLine"></div>
        <div font="14" class="ml-8 settingName">标签页</div>
      </div>
      <el-switch v-model="showTag" @change="tagChange" width="60px" inline-prompt />
    </div>

    <div class="flex jc-between ai-center">
      <div class="flex ai-center">
        <div class="settingLine"></div>
        <div font="14" class="ml-8 settingName">位置导航（面包屑）</div>
      </div>
      <el-switch v-model="showBreadcrumb" @change="breadcrumbChange" width="60px" inline-prompt/>
    </div>

    <div class="mtb-30 h-1 br-1 settingBg-EAECF0"/>

    <div class="radio-box">
      <div class="flex ai-center mb-21">
        <div class="settingLine"></div>
        <div font="14" class="ml-8 settingName">表格设置</div>
      </div>

      <div class="title mb-20">行高设置</div>

      <el-radio-group v-model="tableRowHeight" @change="tableSetting('tableRowHeight', $event)" class="mb-30">
        <el-radio label="small">舒适</el-radio>
        <el-radio label="mini">紧凑</el-radio>
        <el-radio label="medium">宽松</el-radio>
      </el-radio-group>

      <div class="title mb-20">表格样式</div>
      <el-radio-group v-model="tableStyle" @change="tableSetting('tableStyle', $event)" class="mb-30">
        <el-radio label="minimalist">极简分隔</el-radio>
        <el-radio label="border">边框分隔</el-radio>
        <el-radio label="stripe">条纹分隔</el-radio>
      </el-radio-group>

    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import LayoutTheme from './LayoutTheme.vue'
import LayoutMenuTheme from './LayoutMenuTheme.vue'
import colorSetting from '../../layoutColorSetting.js'
import {useSystemConfig} from "../../../store/systemConfig";

const systemConfig = useSystemConfig()

const colorList = systemConfig.layoutConfig.themeColorList;
const themeColor = ref(systemConfig.layoutConfig.themeColor);
const showTag = ref(systemConfig.layoutConfig.showTag);
const showBreadcrumb = ref(systemConfig.layoutConfig.showBreadcrumb);
const tableRowHeight = ref(systemConfig.layoutConfig.tableRowHeight);
const tableStyle = ref(systemConfig.layoutConfig.tableStyle);

// 初始化
colorSetting.serRootStyle('root', '--layoutPickerBrNone', '1px solid #999');

// 主题色系
const clickColorChange = (v: { color: string; opacity: number }) => {
  themeColor.value = v.color;
  systemConfig.setLayoutConfig('themeColor', v.color);
  colorSetting.setLayoutColor(v.color);
  colorSetting.isThemeLayout(systemConfig.layoutConfig.themeLayout, v.color);
  colorSetting.serRootStyle('root', '--layoutPickerBrNone', '1px solid #999');
}
// 标签页
const tagChange = (v: string) => {
  systemConfig.setLayoutConfig('showTag', v);
}
// 面包屑
const breadcrumbChange = (v: string) => {
  systemConfig.setLayoutConfig('showBreadcrumb', v);
}

// 表格设置
const tableSetting = (key: string, val: string) => {
  systemConfig.setLayoutConfig(key, val);
}
</script>

<style lang="scss" scoped>
.setting {
  &Line {
    width: 2px;
    height: 14px;
    background: #6f82b3;
  }

  &Bg-EAECF0 {
    background: #eaecf0;
  }

  &Name {
    color: #6f82b3;
  }

  .title {
    font-size: 12px;
    font-weight: 400;
    color: #606266;
  }

  .radio-box {
    ::v-deep .el-radio__label {
      display: inline-block;
      width: 60px;
    }
  }
}
</style>
