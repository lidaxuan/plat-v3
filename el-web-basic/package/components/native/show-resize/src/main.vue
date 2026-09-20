<!--
 * @Description: 
 * @Author: 李大玄
 * @Date: 2021-11-11 16:55:40
 * @FilePath: /el-web-basic/package/components/native/show-resize/src/main.vue
-->

<template>
  <div :class="['resize-box']">
    <template v-for="(item, index) in directionArr">
      <div :key="index" v-if="moveDefault[item] && !disabled" :class="`common block-${item}`" :data-type="item" @mousedown.prevent="mousedownHanlder" />
    </template>
    <slot />
  </div>
</template>

<script>
const directionArr = ['t', 'l', 'r', 'b', 'tl', 'tr', 'bl', 'br'];

export default {
  name: 'EShowResizeN',
  props: {
    max: {
      type: Object,
      default: function () {
        return {
          width: 0,
          height: 0,
        };
      },
      validator: function (obj) {
        if (typeof obj.width === 'number' || typeof obj.height === 'number') {
          if (obj.width >= 0 && obj.height >= 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
    },
    min: {
      type: Object,
      default: () => {
        return {
          width: 0,
          height: 0,
        };
      },
      validator: function (obj) {
        if (typeof obj.width === 'number' || typeof obj.height === 'number') {
          if (obj.width >= 0 && obj.height >= 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
    },
    move: {
      type: Object,
      default: () => {
        return {};
      },
    },
    speed: {
      type: Number,
      default: 1,
      validator: function (num) {
        return num >= 1;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    move: {
      handler(newVal, oldVal) {
        const directionObj = {};
        for (let i = 0; i < directionArr.length; i++) {
          directionObj[directionArr[i]] = true;
        }
        this.moveDefault = Object.assign({}, directionObj, newVal)
      },
      deep: true, // 深度
      immediate: true, // 立即执行
    },
  },
  data() {
    return {
      directionArr,
      moveDefault: {},
    };
  },
  created() {
    document.body.addEventListener('mouseup', this.mouseupHanlder);
  },
  destroyed() {
    document.body.removeEventListener('mouseup', this.mouseupHanlder);
  },
  methods: {
    getStyle(element) {
      if (element.currentStyle) {
        return element.currentStyle;
      } else {
        return getComputedStyle(element, false);
      }
    },
    // 八个元素拖拽
    mousedownHanlder(event) {
      let { cursor } = this.getStyle(event.target);
      this.dataType = event.target.getAttribute('data-type');
      this.event = event;
      document.body.addEventListener('mousemove', this.mousemoveHandler);
      document.body.style.cursor = cursor;
    },
    // 绑定事件
    mouseupHanlder() {
      document.body.removeEventListener('mousemove', this.mousemoveHandler);
      document.body.style.cursor = 'default';
    },
    // 移动事件
    mousemoveHandler(event) {
      if (this.disabled) {
        return;
      }
      let { width, height } = this.getStyle(this.$el);
      width = parseInt(width);
      height = parseInt(height);
      this[this.dataType]({ event, width, height });
      this.event = event;
    },
    // top 没问题
    t({ event, height }) {
      // 向上
      if (event.y > this.event.y) {
        const toTopHeight = height - (event.y - this.event.y) * this.speed;
        this.$el.style.height = this.min.height ? `${Math.max(this.min.height, toTopHeight)}px` : `${toTopHeight}px`;
      } else {
        const toBottomHeight = height + (this.event.y - event.y) * this.speed;
        this.$el.style.height = this.max.height ? `${Math.min(this.max.height, toBottomHeight)}px` : `${toBottomHeight}px`;
      }
    },
    // left 没问题
    l({ event, width }) {
      // 向右
      if (event.x > this.event.x) {
        const toRightWidth = width - (event.x - this.event.x) * this.speed;
        this.$el.style.width = this.min.width ? `${Math.max(this.min.width, toRightWidth)}px` : `${toRightWidth}px`;
      } else {
        // 向左
        const toLeftWidth = width + (this.event.x - event.x) * this.speed;
        this.$el.style.width = this.max.width ? `${Math.min(this.max.width, toLeftWidth)}px` : `${toLeftWidth}px`;
      }
    },
    // right 没问题
    r({ event, width }) {
      // 向右
      if (event.x > this.event.x) {
        const toRightWidth = width + (event.x - this.event.x) * this.speed;
        this.$el.style.width = this.max.width ? `${Math.min(this.max.width, toRightWidth)}px` : `${toRightWidth}px`;
      } else {
        // 向左
        const toLeftWidth = width - (this.event.x - event.x) * this.speed;
        this.$el.style.width = this.min.width ? `${Math.max(this.min.width, toLeftWidth)}px` : `${toLeftWidth}px`;
      }
    },
    // bottom 没问题
    b({ event, height }) {
      if (event.y > this.event.y) {
        const toTopHeight = height + (event.y - this.event.y) * this.speed;
        this.$el.style.height = this.max.height ? `${Math.min(this.max.height, toTopHeight)}px` : `${toTopHeight}px`;
      } else {
        const toBottomHeight = height - (this.event.y - event.y) * this.speed;
        this.$el.style.height = this.min.height ? `${Math.max(this.min.height, toBottomHeight)}px` : `${toBottomHeight}px`;
      }
    },
    tl({ event, width, height }) {
      this.t({ event, height });
      this.l({ event, width });
    },
    tr({ event, width, height }) {
      this.t({ event, height });
      this.r({ event, width });
    },
    bl({ event, width, height }) {
      this.b({ event, height });
      this.l({ event, width });
    },
    br({ event, width, height }) {
      this.b({ event, height });
      this.r({ event, width });
    },
  },
};
</script>
<style scoped>
.resize-box {
  position: relative;
  display: table;
  border: 1px solid #ccc;
}
.disabled .common {
  cursor: not-allowed;
}
.common {
  position: absolute;
  margin: auto;
}
/* 向上 */
.block-t {
  top: -5px;
  left: 0;
  right: 0;
  width: 100%;
  height: 10px;
  cursor: n-resize; /* 此光标指示矩形框的边缘可被向上（北）移动。 */
}
.block-l {
  top: 0;
  left: -5px;
  bottom: 0;
  width: 10px;
  height: 100%;
  cursor: w-resize; /** 此光标指示矩形框的边缘可被向左移动（西）。 */
}
.block-r {
  top: 0;
  right: -5px;
  bottom: 0;
  width: 10px;
  height: 100%;
  cursor: e-resize; /** 此光标指示矩形框的边缘可被向右（东）移动。 */
}
.block-b {
  left: 0;
  right: 0;
  bottom: -5px;
  width: 100%;
  height: 10px;
  cursor: s-resize; /** 此光标指示矩形框的边缘可被向下移动（南）。 */
}

.block-tl {
  width: 10px;
  height: 10px;
  top: -5px;
  left: -5px;
  cursor: nw-resize; /** 此光标指示矩形框的边缘可被向上及向左移动（北/西）。 */
}
.block-tr {
  width: 10px;
  height: 10px;
  top: -5px;
  right: -5px;
  cursor: ne-resize; /** 此光标指示矩形框的边缘可被向上及向右移动（北/东）。 */
}
.block-bl {
  width: 10px;
  height: 10px;
  bottom: -5px;
  left: -5px;
  cursor: sw-resize; /** 此光标指示矩形框的边缘可被向下及向左移动（南/西）。 */
}
.block-br {
  width: 10px;
  height: 10px;
  bottom: -5px;
  right: -5px;
  cursor: se-resize; /** 此光标指示矩形框的边缘可被向下及向右移动（南/东）。 */
}
</style>
