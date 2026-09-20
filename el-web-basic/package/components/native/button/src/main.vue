<!--
 * @Author: 段丽军
 * @Date: 2021-09-27 16:24:00
 * @LastEditTime: 2022-11-22 18:17:18
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/button/src/main.vue
-->
<!--
  组件属性
  按钮类型（type）：默认按钮（default）、主按钮（primary）、功能按钮（oper）、文本主按钮（text-primary）、文本默认按钮（text-default）
  按钮尺寸（size）：默认尺寸（default）、中尺寸（medium）、小按钮（small）、超小按钮（mini）
  按钮图标（icon）：String
  最小宽度（min-width）：Boolean ｜ Number ｜ String
  按钮禁用（disabled）：Boolean
  按钮边框（border）：Boolean
  加载状态（loading）：Boolean

  组件事件
  点击事件（click）

  组件插槽
  默认插槽（default）
-->
<template>
  <button
    @click="handleClick"
    :disabled="disabled"
    :autofocus="autofocus"
    :type="nativeType"
    :class="{
    'e-button-n': true,
    'e-button-n--type-default': typeComputed === 'default',
    'e-button-n--type-default-border': typeComputed === 'default' && border,
    'e-button-n--type-primary': typeComputed === 'primary',
    'e-button-n--type-oper': typeComputed === 'oper',
    'e-button-n--type-disabled': ['default', 'primary', 'oper'].includes(typeComputed) && (disabled || loading),
    'e-button-n--type-text-d': typeComputed === 'text-default',
    'e-button-n--type-text-p': typeComputed === 'text-primary',
    'e-button-n--type-text-disabled': ['text-default', 'text-primary'].includes(typeComputed) && (disabled || loading),
    'e-button-n--size-mini': sizeComputed === 'mini',
    'e-button-n--size-small': sizeComputed === 'small',
    'e-button-n--size-medium': sizeComputed === 'medium',
    'e-button-n--size-default': sizeComputed === 'default',
  }"
    :style="{
      ...minWidthComputed,
      flexDirection: (iconPosition === 'left' ? 'row' : 'row-reverse'),
    }">
    <i v-if="!loading" :class="'iconfont '+icon " :style="{
      fontSize: '24px',
      transform: `rotate(${foldOptions}deg)`,
      transition: '.3s all',
      ...iconMarginComputed,
      }"/>
    <i v-else class="el-icon-loading" style="margin-right: 4px;"/>
    <slot/>
  </button>
</template>

<script>
let types = ['default', 'primary', 'oper', 'text-default', 'text-primary'];
let sizes = ['default', 'medium', 'small', 'mini'];
export default {
  name: "EButtonN",
  inject: {
    containerSize: {
      default: void 0,
    },
    containerType: {
      default: void 0,
    },
    containerMinWidth: {
      default: void 0,
    }
  },
  props: {
    type: {
      type: String,
      default: void 0,
      // validator: val=> types.includes(val),
    },
    icon: {
      type: String,
      default: void 0,
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator: val=> ['left', 'right'].includes(val),
    },
    size: {
      type: String,
      default: void 0,
      // validator: val=> sizes.includes(val),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: true,
    },
    minWidth: {
      type: [Boolean, Number, String],
      default: void 0,
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    autofocus: Boolean,
    isFold: {
      type: [Boolean, Object],
      default: true,
      // { isFold: false, foldDeg: 0, unfoldDeg: 90 }
    },
  },
  data() {
    return {
    }
  },
  computed: {
    typeComputed() {
      return types.includes(this.type) ? this.type : (this.containerType || 'default');
    },
    sizeComputed() {
      return ['text-default', 'text-primary'].includes(this.typeComputed) ? '' :
        sizes.includes(this.size) ? this.size : (this.containerSize || 'default');
    },

    minWidthComputed() {
      let newMinWidth = '';
      let type = Object.prototype.toString.call(this.minWidth);
      let minWidth = ['Boolean', 'String', 'Number'].includes(type.slice(8, -1)) ?
        this.minWidth : (this.containerMinWidth || false);
      type = Object.prototype.toString.call(minWidth);

      if(type.includes('Boolean') && minWidth &&
        types.slice(0, 3).includes(this.typeComputed)) {
        if(this.sizeComputed === sizes[0]) {
          newMinWidth = '84px';
        } else if(sizes.slice(1, 3).includes(this.sizeComputed)) {
          newMinWidth = '114px';
          if(this.sizeComputed === sizes[2] &&
            types.slice(0, 2).includes(this.typeComputed)) {
            newMinWidth = '56px';
          }
        } else if(this.sizeComputed === sizes[3]) {
          newMinWidth = '94px';
        }
      }
      else if(type.includes('String')) {
        newMinWidth = minWidth;
      }
      else if(type.includes('Number')) {
        newMinWidth = minWidth+'px';
      }
      return { minWidth: newMinWidth };
    },
    iconMarginComputed() {
      return ['text-default', 'text-primary'].includes(this.typeComputed) && this.icon && this.$slots.default && this.$slots.default.length > 0 ?
        (this.iconPosition === 'left' ? { marginRight: '4px'} : {marginLeft: '4px'}) : {};
    },
    foldOptions() {
      let type = Object.prototype.toString.call(this.isFold).toLowerCase();
      if(type.endsWith('boolean]')) {
        return this.isFold ? 0 : -180;
      } else if(type.endsWith('object]')) {
        let { isFold, foldDeg, unfoldDeg } = this.isFold;
        return isFold ? foldDeg : unfoldDeg;
      } 
      return 0;
    },
  },
  methods: {
    handleClick(evt) {
      if(this.loading || this.disabled) { return; }
      this.$emit('click', evt);
    }
  }
}
</script>

<style lang="scss" scoped>
  .e-button-n {
    vertical-align: bottom;
    font-weight: 500;
    // display: inline-block;
    // text-align: center;
    // min-width: 200px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: fit-content;
    transition: .1s;
  }
  .e-button-n + .e-button-n {
    margin-left: 10px;
  }
  .e-button-n--type-default {
    border: 1px solid #FFFFFF;
    background-color: #FFFFFF;
    color: #666666;
    cursor: pointer;
    box-sizing: border-box;
    &:active {
      background-color: #F4F5FC;
      border-color: #F4F5FC;
    }
  }
  .e-button-n--type-default-border {
    border-color: #E3EAF3;
    &:active {
      background-color: #F4F5FC;
      border-color: #E3EAF3;
    }
  }

  .e-button-n--type-primary {
    border: 1px solid #6359CA;
    background-color: #6359CA;
    color: white;
    cursor: pointer;
    box-sizing: border-box;
    &:hover {
      background-color: #4B43A0;
      border-color: #4B43A0;
    }
    &:active {
      background-color: #574FA9;
      border-color: #574FA9;
    }
  }

  .e-button-n--type-oper {
    // border: 1px solid #7C90FF;
    // background-color: #7C90FF;
    border: 1px solid #6359CA;
    background-color: #6359CA;
    color: white;
    cursor: pointer;
    box-sizing: border-box;
  }

  .e-button-n--type-disabled {
    border-color: #E3EAF3!important;
    background-color: #F7F8FB!important;
    color: #909CA8!important;
    cursor: not-allowed;
    &:hover {
      border-color: #E3EAF3!important;
      background-color: #F7F8FB!important;
    }
    &:active {
      border-color: #E3EAF3!important;
      background-color: #F7F8FB!important;
    }
  }

  .e-button-n--type-text-d {
    border: none;
    background: none;
    color: #ACB2C9;
    cursor: pointer;
    box-sizing: border-box;
    line-height: 20px;
    font-size: 14px;
    padding: 0;
    min-height: 20px;
    &:hover {
      // color: #7C90FF;
      color: #6359CA;
    }
  }

  .e-button-n--type-text-p {
    border: none;
    background: none;
    // color: #7C90FF;
    color: #6359CA;
    cursor: pointer;
    box-sizing: border-box;
    line-height: 20px;
    font-size: 14px;
    padding: 0;
    min-height: 20px;
  }

  .e-button-n--type-text-disabled {
    color: #BBBBBB!important;
    cursor: not-allowed;
    &:hover {
      color: #BBBBBB!important;
    }
    &:active {
      color: #BBBBBB!important;
    }
  }

  .e-button-n--size-default {
    line-height: 24px;
    padding: 9px 12px;
    border-radius: 4px;
    font-size: 14px;
    min-height: 44px;
  }
  .e-button-n--size-default.e-button-n--type-primary {
    border: 1px solid #6C70DC;
    background-color: #6C70DC;
    &:hover {
      background-color: #5459AC;
      border-color: #5459AC;
    }
    &:active {
      background-color: #6167C6;
      border-color: #6167C6;
    }
  }

  .e-button-n--size-medium {
    line-height: 24px;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    min-height: 38px;
  }
  .e-button-n--size-small {
    line-height: 24px;
    padding: 3px 12px;
    border-radius: 4px;
    font-size: 14px;
    min-height: 32px;
  }
  .e-button-n--size-mini {
    line-height: 24px;
    padding: 1px 10px;
    border-radius: 4px;
    font-size: 12px;
    min-height: 28px;
  }
</style>
