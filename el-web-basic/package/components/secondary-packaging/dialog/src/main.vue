<template>
  <el-dialog v-bind="$attrs" draggable overflow :footer-align="footerBtnPosition">
    <!--    <template #title>-->
    <!--      <div class="e-dialog-title">{{ title }}</div>-->
    <!--    </template>-->

    <div class="eDialog__body" :style="{height: height}">
      <slot/>
    </div>

    <template #footer>
      <slot name="footer" v-if="footerIsShow"></slot>
      <div v-else>
        <el-button size="small" @click="emit('cancel')">{{ cancelText }}</el-button>
        <el-button size="small" type="primary" @click="emit('confirm')">{{ confirmText }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="e-dialog-sp">
import {ref, computed, useSlots} from 'vue'

const emit = defineEmits(['cancel', 'confirm'])
const props = defineProps({
  // title: {
  //   type: String,
  //   default: '默认标题'
  // },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  footerBtnPosition: {
    type: String,
    default: 'right'
  },
  height: {
    type: String,
    default: '400px'
  },
})
const slots = useSlots()
const footerIsShow = computed(() => !!slots.footer)
</script>

<style lang="scss">
.el-dialog {
  width: 540px;
  border-radius: 10px;
  padding-top: 0;

  .el-dialog__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 0 15px 0;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: -16px;
      bottom: 0;
      width: calc(100% + 32px);
      height: 1px;
      background: #eee;
    }

    .el-dialog__title {
      height: 24px;
    }

    .el-dialog__headerbtn {
      right: -10px;
      top: 3px;
    }
  }

  .el-dialog__body {
    padding: 10px 15px;
    overflow-x: auto;
  }
}
</style>
