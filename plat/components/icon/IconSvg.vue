<!--
 * @version: v1.2.0
 * @Author: 范庆龙
 * @Date: 2021-08-13 14:49:42
 * @LastEditors: 范庆龙
 * @LastEditTime: 2021-08-19 17:07:17
 * @FilePath: \my-project\src\components\icon\IconSvg.vue
-->
<template>
  <div>
    <svg
      class="svg-icon icon-font"
      aria-hidden="true"
      :style="{ width: size, height: size }"
    >
      <use :xlink:href="iconName" />
    </svg>
    <slot />
  </div>
</template>

<script>
export default {
  name: "IconSvg",
  props: {
    //  使用icon的图标类型
    iconClass: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "16px",
    },
  },
  computed: {
    iconName() {
      return `#${this.iconClass}`;
    },
  },
};
</script>

<style>
.svg-icon {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
