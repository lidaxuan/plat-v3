<!--
 * @version: v1.2.0
 * @Author: 范庆龙
 * @Date: 2021-08-13 15:10:34
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-07-28 19:57:14
 * @FilePath: /data-config-view/node_modules/el-ui/components/icon/IconCode.vue
-->
<template>
  <div>
    <i class="icon iconfont" v-html="iconTag" />
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "iconUnicode",
  props: {
    iconType: {
      type: String,
      required: true,
    },
  },
  computed: {
    iconTag() {
      return `&#${this.iconType};`;
    },
  },
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "iconfont"; /* Project id 2735677 */
  src: url("//at.alicdn.com/t/font_2735677_1qiwpr5mzne.woff2?t=1635500435250")
      format("woff2"),
    url("//at.alicdn.com/t/font_2735677_1qiwpr5mzne.woff?t=1635500435250")
      format("woff"),
    url("//at.alicdn.com/t/font_2735677_1qiwpr5mzne.ttf?t=1635500435250")
      format("truetype");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
</style>
