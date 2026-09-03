<template>
  <div class="tags-el" ref="tags">
    <el-tabs v-model="valueCode" type="card" closable @tab-remove="removeTab" @tab-click="tabClick">
      <el-tab-pane v-for="(item, index) in layoutTag" :key="index" :label="item.name" :name="item.code"/>
    </el-tabs>
    <div class="tags-close-box">
      <el-tooltip class="item" effect="dark" content="设置" placement="bottom">
        <el-dropdown @command="handleTags" trigger="click">
          <icon-class class="cursor-p pr-16 mt-2" icon-class="icon-D1-B2" font="24" :color="'#7E84A3'"/>
          <template #dropdown>
            <el-dropdown-menu size="small" class="tags">
              <el-dropdown-item v-for="item in dropdownArr" :key="item.command" :icon="item.icon" :command="item.command">{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useSystemConfig} from "plat@/store/systemConfig";

const systemConfig = useSystemConfig()
const router = useRouter()

const dropdownArr = [
  {command: 'l', name: '关闭左侧', icon: 'Back'},
  {command: 'r', name: '关闭右侧', icon: 'Right'},
  {command: 'c', name: '关闭当前', icon: 'Close'},
  {command: 'o', name: '关闭其他', icon: 'Files'}
]

const layoutTag = computed(() => systemConfig.menusConfig.layoutTags);
const valueCode = computed(() => systemConfig.menusConfig.activeMenuCode);

const removeTab = (val: string) => {
  if (layoutTag.value.length <= 1) {
    return
  }
  const newLayoutTag = [...layoutTag.value] as any[]
  const index = newLayoutTag.findIndex((item: any) => item.code === val)
  newLayoutTag.splice(index, 1)
  if (valueCode.value === val) {
    let path: string
    if (index < newLayoutTag.length) {
      path = newLayoutTag[index]?.code
    } else {
      path = newLayoutTag[newLayoutTag.length - 1]?.code
    }
    router.push(path)
  }
  systemConfig.setLayoutTags(newLayoutTag)
}

const tabClick = (val: any, event: any) => {
  systemConfig.setMenusConfig("activeMenuCode", val.props.name)
  router.push('/' + val.props.name);
}


const comFun = (type: string) => {
  let layoutTagArr: any[] = []
  const index = (layoutTag.value as any[]).findIndex((item: any) => item.code === valueCode.value)
  if (type === 'l') {
    layoutTagArr = (layoutTag.value as any[]).splice(index)
  } else if (type === 'r') {
    layoutTagArr = (layoutTag.value as any[]).splice(0, index + 1)
  }
  systemConfig.setLayoutTags(layoutTagArr)
}

const handleTags = (command: string) => {
  if (command === 'o') {
    const obj = layoutTag.value.find((item: any) => item.code === valueCode.value)
    systemConfig.setLayoutTags([obj])
  } else if (command === 'c') {
    removeTab(valueCode.value)
  } else if (['l', 'r'].includes(command)) {
    comFun(command)
  }
}
</script>

<style lang="scss">

</style>
<style lang="scss" scoped>
.tags-el {
  height: 47px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0px 4px 4px 0px rgba(21, 34, 50, 0.08);

  .el-tabs {
    overflow-x: hidden;

    :deep(.el-tabs__header) {
      border: none;
      margin: 0;

      .el-tabs__nav {
        border: none;

        .el-tabs__item {
          margin-top: 0px;
          height: 24px;
          margin-left: 5px;
          border: 1px solid #e4e7ed;
          border-radius: 4px;
          font-size: 12px;
          padding: 0 12px;

          &:first-child {
            border-left: 1px solid #e4e7ed;
          }

          &:hover {
            background: #f1f4fa;
            color: #344563;
          }

          &.is-active {
            border-bottom: 1px solid #e4e7ed;
            background: #f1f4fa;
            color: #344563 !important;
          }
        }
      }
    }
  }

  :deep(.el-tabs__nav-next), :deep(.el-tabs__nav-prev) {
    line-height: 30px;
    font-size: 14px;
    color: #000;
  }
}
</style>
