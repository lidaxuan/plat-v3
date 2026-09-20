<!--
 * @Author: 赵春旭
 * @Date: 2021-08-26 14:56:36
 * @LastEditTime: 2022-01-25 19:21:20
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/secondary-packaging/big-data-select/src/main.vue
-->
/*
 * @Author: chunxu.Zhao
 * @Date: 2021-08-30 17:44:20
 * @Last Modified by: chunxu.Zhao
 * @Last Modified time: 2021-09-01 11:22:15
 */
<template>
<div>
  <el-select
    ref="self"
    v-model="valueId"
    :clearable="clearable"
    @clear="clear"
    :disabled="disabled"
    :filterable="filterable"
    :filter-method="filterMethod"
    popper-class="pop"
    v-bind="$attrs"
    v-el-select-loadmore="loadMore(num)"
    @change="change"
    style="width: 100%">
    <div
      v-for="item of selData"
      :key="item[props.value]"
      @mouseenter="handleOptionMouseEnter($event, item)"
      @mouseleave="handleOptionMouseLeave"
      :style="styleObj">
      <el-option
        :label="item[props.label]"
        :value="item[props.value]">
        <slot v-bind="{ option: item }"/>
      </el-option>
    </div>
  </el-select>

  <el-tooltip
    :effect="tooltipEffect"
    placement="top"
    ref="tooltip"
    :content="tooltipContent">
    <span/>
  </el-tooltip>
</div>
</template>
<script>
/*import Vue from "vue";
Vue.directive(
  'el-select-loadmore', {
    bind(el, binding, vnode) {
      const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
      SELECTWRAP_DOM.addEventListener('scroll', function () {
        const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
        if (condition) {
          vnode.context.type = 'bottom'
          binding.value()
        } else if(this.scrollTop == 0) {
          vnode.context.type = 'top'
          binding.value()
        }
      });
    }
  }
)*/
// import { getStyle } from 'element-ui/src/utils/dom';
export default {
  name: 'EBigDataSelectSp',
  model: {
    prop: 'value',
    event: 'change',
  },
  data () {
    return {
      originalData: [],
      selData: [],
      relSelData: [],
      startNum: 0,
      endNum: 0,
      type: 'bottom',
      valueId: void 0,
      tooltipContent: void 0,
      loadTimeout: void 0,
      styleObj: void  0,
    }
  },
  props: {
    data: {
      required: true,
      type: Array
    },
    value: {
      required: true,
      // type: [ String, Number ],
      default: void 0
    },
    props: {
      type: Object,
      default:() => {
        return {
          value: 'value',
          label: 'label',
          maxWidth: void 0
        }
      }
    },
    num: { // 初始展示的数量，以及每次加载的数量，页面展示总量为num*2 (默认10，num需要>=8 因为el-select默认8条以上才有滚动条)
      type: Number,
      default: 10
    },
    filterable: {
      default: true,
      type: Boolean
    },
    clearable: {
      default: true,
      type: Boolean
    },
    disabled: {
      default: false,
      type: Boolean
    },
    showOverflowTooltip: {
      default: false,
      type: Boolean
    },
    tooltipEffect: {
      type: String,
      default: 'dark'
    }
  },
  watch: {
    data: {
      handler(val) {
        this.relSelData = val.slice(0)
        this.originalData = val.slice(0)
        // 初始只展示num条
        this.endNum = this.num
        this.selData = this.relSelData.slice(this.startNum,this.num)
        if(this.valueId && !(this.selData.map(item => item[this.props.value]).includes(this.valueId))){ // 回显数据不在初始num数据内的情况
          this.originalData.forEach((item,index) => {
            if(item[this.props.value] == this.valueId) {
              this.startNum = index - Math.floor(this.num / 2)
              this.endNum = index + Math.floor(this.num / 2)
              this.selData = this.relSelData.slice(this.startNum,this.endNum)
            }
          })
        }
      },
      immediate: true
    },
    value: {
      handler(val) {
        if(this.valueId !== val) {
          this.valueId = val;
        }
      },
      immediate: true
    },
  },
  mounted() {
    // 设置下拉框宽度
    this.styleObj = {
      maxWidth: this.showOverflowTooltip && !this.maxWidth ?
        this.$refs.self?.$el?.getBoundingClientRect().width+'px' :
        this.maxWidth
    }
  },
  methods: {
    loadMore(n){
      return () => {
        let dom = document.querySelector('.pop .el-select-dropdown__wrap')
        if(this.type == 'bottom') {
          if(this.endNum >= this.relSelData.length) return;
          this.endNum += n;
          if(this.endNum - this.startNum > this.num * 2) { //滚到底
            this.startNum += this.num
            if(this.endNum >= this.relSelData.length) { // 到底边界处理
              this.endNum = this.relSelData.length;
              this.startNum = (this.endNum - this.num * 2) > 0 ? this.endNum - this.num * 2 : 0;
            }
            this.selData = this.relSelData.slice(this.startNum, this.endNum)
            dom.scrollTo(0, dom.scrollTop - dom.scrollHeight / 2 ); // 滚动到底后滚动条放置中间
          } else {
            if(this.endNum >= this.relSelData.length) { // 到底边界处理
              this.endNum = this.relSelData.length;
              this.startNum = (this.endNum - this.num * 2) > 0 ? this.endNum - this.num * 2 : 0;
            }
            this.selData = this.relSelData.slice(this.startNum,this.endNum)
          }
        } else if(this.type == 'top') {
          if(this.startNum == 0) return;
          this.startNum -= this.num;
          this.endNum -= this.num;
          if(this.startNum < 0) {
            this.startNum = 0
            this.endNum = this.startNum + this.num * 2
            this.selData = this.relSelData.slice(this.startNum, this.endNum)
          } else {
            this.selData = this.relSelData.slice(this.startNum, this.endNum)
            dom.scrollTo(0, dom.scrollHeight / 2 ); // 滚动到顶后滚动条放置中间
          }
        }
      }
    },
    filterMethod(query) {
      this.startNum = 0;
      this.endNum = this.startNum + this.num;
      let options = this.originalData.filter(item => {
        return item[this.props.label].toLowerCase()
          .indexOf(query.toLowerCase()) > -1;
      });
      this.relSelData = JSON.parse(JSON.stringify(options))
      this.selData = this.relSelData.slice(this.startNum,this.endNum)
    },
    clear() {
      this.filterMethod('')
    },
    change(val) {
      this.$emit('change', val);
    },
    handleOptionMouseEnter($event, item) {
      if(!this.showOverflowTooltip) { return; }
      if(this.loadTimeout) {
        clearTimeout(this.loadTimeout)
      }
      this.loadTimeout = setTimeout(()=> {
        this.$refs.tooltip.hide();
        // 选项元素
        const elOption = $event.target.children?.[0];
        const elOptionWidth = elOption.getBoundingClientRect().width;
        const padding = (parseInt(getStyle(elOption, 'paddingLeft'), 10) || 0) +
          (parseInt(getStyle(elOption, 'paddingRight'), 10) || 0);

        // 选项内容元素
        let elOptionSpan = elOption.children?.[0];
        const elOptionSpanWidth = elOptionSpan.getBoundingClientRect().width;

        // 内容长度超出 父级元素
        if(elOptionWidth-padding < elOptionSpanWidth) {
          this.$refs.tooltip.referenceElm = elOption;
          this.tooltipContent = item[this.props.label];
          this.$refs.tooltip.show();
        }
      }, 500);
    },
    handleOptionMouseLeave() {
      if(!this.showOverflowTooltip) { return; }
      if(this.loadTimeout) {
        clearTimeout(this.loadTimeout)
      }
      this.$refs.tooltip.hide();
    },
  }
}
</script>
