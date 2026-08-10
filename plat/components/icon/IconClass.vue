<template>
  <i :class="['iconfont', iconTag]"
     :style="{ color: color, fontSize: fontSize + 'px' }"
     @click="iconClick"
  >
    <span :style="{
        fontSize: fontSize + 'px',
        color: color,
        paddingLeft: paddingLeft + 'px'
      }"
    ><slot
    /></span>
  </i>
</template>

<script>
export default {
  name: "iconFontClass",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#6359CA",
    },
    fontSize: {
      type: [String, Number],
      default: "14px",
    },
    paddingLeft: {
      type: [String, Number],
      default: "",
    },
  },
  computed: {
    iconTag() {
      return `icon ${this.iconClass}`;
    },
  },
  methods: {
    iconClick() {
      this.$emit("iconClick");
    },
  },
};
</script>

<style scoped>
.iconfont {
  font-family: "iconfont" !important;
  font-size: 18px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
