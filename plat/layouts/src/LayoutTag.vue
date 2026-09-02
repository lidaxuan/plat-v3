<template>
  <div class="tags-el" ref="tags">
    <el-tabs v-model="valueCode" type="card" closable @tab-remove="removeTab" @tab-click="tabClick">
      <el-tab-pane v-for="(item, index) in layoutTag" :key="index" :label="item.name" :name="item.code"/>
    </el-tabs>
<!--    {{layoutTag}}-->
    <div class="tags-close-box">
      <el-tooltip class="item" effect="dark" content="设置" placement="bottom">
        <el-dropdown @command="handleTags" trigger="click">
          <icon-class class="cursor-p" icon-class="icon-D1-B2" font="24" :color="'#7E84A3'"/>
          <template #dropdown>
            <el-dropdown-menu size="small" slot="dropdown" class="tags">
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
import {useMenusStore} from '../../store/useMenusStore'

const route = useRoute()
const router = useRouter()
const menusStore = useMenusStore()

const layoutTag = computed(() => menusStore.layoutTag)

const dropdownArr = [
  {command: 'l', name: '关闭左侧', icon: 'Back'},
  {command: 'r', name: '关闭右侧', icon: 'Right'},
  {command: 'c', name: '关闭当前', icon: 'Close'},
  {command: 'o', name: '关闭其他', icon: 'Files'}
]

const valueCode = ref('')

const getValueCode = () => {
  const query = {...route}
  return (query.path as string).replace('/', '').split('/')[0] || String(query.name)
}

watch(() => route, () => {
          valueCode.value = getValueCode()
        }, {deep: true, immediate: true}
)

const removeTab = (val: string) => {
  if (layoutTag.value.length <= 1) {
    return
  }
  const newLayoutTag = [...layoutTag.value] as any[]
  const index = newLayoutTag.findIndex((item: any) => item.code === val)
  newLayoutTag.splice(index, 1)
  menusStore.setLayoutTag(newLayoutTag)

  if (valueCode.value === val) {
    let path: string
    if (index < newLayoutTag.length) {
      path = newLayoutTag[index]?.path
    } else {
      path = newLayoutTag[newLayoutTag.length - 1]?.path
    }
    router.push(path)
  }
}

const tabClick = (val: any) => {
  router.push('/' + val.$options.propsData.name)
}

const closeOther = () => {
  const obj = layoutTag.value.find((item: any) => item.code === valueCode.value)
  menusStore.setLayoutTag([obj])
}

const closeCru = () => {
  removeTab(valueCode.value)
}

const comFun = (type: string) => {
  let layoutTagArr: any[] = []
  const index = (layoutTag.value as any[]).findIndex((item: any) => item.code === valueCode.value)
  if (type === 'l') {
    layoutTagArr = (layoutTag.value as any[]).splice(index)
  } else if (type === 'r') {
    layoutTagArr = (layoutTag.value as any[]).splice(0, index + 1)
  }
  menusStore.setLayoutTag(layoutTagArr)
}

const handleTags = (command: string) => {
  if (command === 'o') {
    closeOther()
  } else if (command === 'c') {
    closeCru()
  } else if (['l', 'r'].includes(command)) {
    comFun(command)
  }
}
</script>

<style lang="scss">
.tags.el-popper[x-placement^='bottom'] .popper__arrow {
  display: none !important;
}

.tags.el-popper[x-placement^='bottom'] {
  margin-top: 18px !important;
}

.tags.el-popper {
  top: 88px !important;
}
</style>
<style lang="scss" scoped>

.tags-el {
  position: relative;
  height: 47px;
  display: flex;
  align-items: center;
  overflow: hidden;
  //padding: 0px 55px 0px 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: #ffffff;
  box-shadow: 0px 4px 4px 0px rgba(21, 34, 50, 0.08);

  .el-tabs {
    overflow-x: hidden;
    height: 24px;
  }

  :deep(.el-tabs--card > .el-tabs__header),
  :deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
    border: none;
    margin: 0;
  }

  :deep(.el-tabs--card > .el-tabs__header .el-tabs__item:first-child) {
    border-left: 1px solid #e4e7ed;
  }

  :deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
    border-bottom: 1px solid #e4e7ed;
    outline: none;
  }

  :deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
    border-bottom: 1px solid #e4e7ed;
    outline: none;
    background: #f1f4fa;
    color: #344563 !important;
  }

  :deep(.el-tabs__item) {
    height: 24px;
    line-height: 21px;
    margin-left: 5px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    font-size: 12px;

    &:hover {
      background: #f1f4fa;
      color: #344563;
      padding: 0 20px !important;
    }

    &:hover > .el-icon-close,
    .el-icon-close:hover {
      background-color: #7d8dbf;
      color: #fff;
    }
  }

  :deep(.is-active) {
    .el-icon-close,
    .el-icon-close:hover {
      color: #fff;
      background-color: #7d8dbf;
    }

    &:focus {
      border-color: #e4e7ed;
    }
  }

  :deep(.el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close) {
    width: 14px;
    height: 14px;
    line-height: 14px;
  }

  :deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
    transition: none;
  }

  :deep(.el-tabs__nav-next),
  :deep(.el-tabs__nav-prev) {
    line-height: 30px;
  }

  :deep(.el-tabs__item:focus.is-active.is-focus:not(:active)) {
    box-shadow: none;
  }

  :deep(.el-tabs--top.el-tabs--border-card > .el-tabs__header .el-tabs__item),
  :deep(.el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item),
  :deep(.el-tabs--top .el-tabs--left > .el-tabs__header .el-tabs__item),
  :deep(.el-tabs--top .el-tabs--right > .el-tabs__header .el-tabs__item),
  :deep(.el-tabs--bottom.el-tabs--border-card > .el-tabs__header .el-tabs__item),
  :deep(.el-tabs--bottom.el-tabs--card > .el-tabs__header .el-tabs__item),
  :deep(.el-tabs--bottom .el-tabs--left > .el-tabs__header .el-tabs__item),
  :deep(.el-tabs--bottom .el-tabs--right > .el-tabs__header .el-tabs__item) {
    padding: 0 8px;
  }

  .tags-close-box {
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    padding-top: 1px;
    text-align: center;
    display: flex;
    justify-content: left;
    align-content: center;
    width: 44px;
    //height: 38px;
    //line-height: 38px;
    z-index: 10;

    .el-icon-refresh {
      margin-right: 10px;
    }
  }
}
</style>
