<template>
  <div>
    <svg class="svg-icon icon-font" aria-hidden="true" :style="{ width: size, height: size }">
      <use :xlink:href="iconName" />
    </svg>
    <slot />
  </div>
</template>

<script>
export default {
  name: "IconSvg",
  props: {
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
