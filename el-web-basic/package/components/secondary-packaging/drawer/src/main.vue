<template>
  <el-drawer class="e-drawer" v-bind="$attrs" @close="close" :append-to-body="appendToBody" :wrapper-closable="false">
    <template #title>
      <div class="e-drawer-title">
        <div :class="['e-drawer-title-icon', 'icon', 'iconfont', titleIcon]" :style="{fontSize: titleIconSize, color: titleIconColor, background: titleIconBg}" align="center"/>
        <div class="e-drawer-title-name">{{ title }}</div>
      </div>
    </template>
    <slot/>
    <template #footer v-if="isFooter">
      <div class="left">
        <slot name="footer-left"></slot>
      </div>
      <div class="right">
        <slot name="footer" v-if="footerIsShow"></slot>
        <div v-else>
          <el-button size="default" min-width @click="emit('close')">{{ cancelButtonText }}</el-button>
          <el-button size="default" :loading="confirmLoading" type="primary" min-width @click="$emit('confirm')">{{ confirmButtonText }}</el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup name="e-drawer-sp">
import {ref, onMounted, useAttrs, computed, useSlots} from 'vue';


const attrs = useAttrs();
const emit = defineEmits(['close', 'confirm']);

const props = defineProps({
  inner: {
    type: Boolean,
    default: false,
  },
  contentPadding: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "默认标题",
  },
  titleIconSize: {
    type: String,
    default: "40px",
  },
  titleIcon: {
    type: String,
    default: "icon-E-E1",
  },
  titleIconColor: {
    type: String,
    default: "#fff",
  },
  titleIconBg: {
    type: String,
    default: "var(--layoutBeacon)",
  },
  footerBtnPosition: {
    type: String,
    default: "right",
  },
  footerHeight: {
    type: String,
    default: "80px",
  },
  appendToBody: {
    type: Boolean,
    default: true,
  },
  isFooter: {
    type: Boolean,
    default: true,
  },
  confirmButtonText: {
    type: String,
    default: '确认',
  },
  cancelButtonText: {
    type: String,
    default: '取消',
  },
  confirmLoading: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();
const footerIsShow = computed(() => !!slots['footer'])
onMounted(() => {

});
</script>

<style lang="scss">
.e-drawer {
  .el-drawer__header {
    margin-bottom: 0;
    border-bottom: 1px solid #D8D8D8;
    height: 68px;
    padding: 0 24px;

    .e-drawer-title {
      display: flex;
      align-items: center;

      .e-drawer-title-name {
        font-weight: bold;
        font-size: 18px;
        color: #344563;
        margin-left: 10px;
      }

      .e-drawer-title-icon {
        display: inline-block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        border-radius: 14px;
        font-size: 25px;
        color: #ffffff;
      }
    }
  }

  .el-drawer__footer {
    padding-top: 20px;
    background: #FFFFFF;
    box-shadow: 0px 0px 10px 0px #CDD3EC;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

</style>
