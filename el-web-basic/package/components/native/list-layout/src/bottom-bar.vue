<!--
 * @Author: 段丽军
 * @Date: 2022-09-13 18:27:04
 * @LastEditTime: 2022-10-27 11:30:09
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/list-layout/src/bottom-bar.vue
-->
<script lang="jsx">
import getSlot from './mixins/getSlot.js';
import actionAsyncMethod from './mixins/actionAsyncMethod.js';

import scrollUtil from './utils/scrollUtil.js';
import { tbs as tableAndBBarScroll, attrs as tbsAttrs } from './utils/tableAndBBarScroll.js';
export default {
  mixins: [getSlot, actionAsyncMethod],
  data() {
    return {
      isBottom: false,
    };
  },
  mounted() {
    const self = this;
    self.$nextTick(() => {
      // 注册滚动监听，未滚动到最底部时，浮动元素
      self.actionAsyncMethod(scrollUtil.addWatch.bind(scrollUtil, 'change', ({ isFloatButtom }) => {
        if(self.isBottom) {
          const floatBar = self.$refs.floatBar;
          if(floatBar) {
            if(isFloatButtom) {
              floatBar.style.position = 'fixed';
              floatBar.style.boxShadow = '#e3e3e3 0px 0px 10px';
            }
          } else {
            console.warn('list-layout-item -> bottom-bar: 浮动条不存在');
          }
        }
      }));

      // 注册监听，监听table组件列的总宽度。用于实现假滚动条
      self.actionAsyncMethod(tableAndBBarScroll.addWatch.bind(tableAndBBarScroll, tbsAttrs.ttbi, ({ bodyWidth, callback }) => {
        if(self.isBottom) {
          if(self.$refs.scrollBar){
            self.$refs.scrollBar.style.width = bodyWidth+'px';
          } else {
            console.warn('list-layout-item -> bottom-bar: 滚动条不存在');
          }
        }
        callback();
      }));

      // 横向滚动「table」时，联动触发「底栏滚动条」滚动
      self.actionAsyncMethod(tableAndBBarScroll.addWatch.bind(tableAndBBarScroll, tbsAttrs.ttbs, ({ tableScrollLeft }) => {
        if(self.isBottom) {
          if(self.$refs.scrollBox) {
            self.$refs.scrollBox.scrollLeft = tableScrollLeft;
          } else {
            console.warn('list-layout-item -> bottom-bar: 滚动条盒子不存在');
          }
        }
      }));

      // 横向滚动「底栏滚动条」时，联动触发「table」滚动
      if(self.isBottom) {
        if(self.$refs.scrollBox) {
          self.$refs.scrollBox.addEventListener('scroll', (e)=> {
            tableAndBBarScroll.setBBarScrollLeft(e.target.scrollLeft);
          });
        } else {
          console.warn('list-layout-item -> bottom-bar: 滚动条盒子不存在');
        }
      }
    });
  },
  methods: {
    // 容器宽度变化 改变 浮动条宽度
    containerResize() {
      if(this.$refs.container && this.$refs.floatBar) {
        const { width } = this.$refs.container.getBoundingClientRect() || {};
        this.$refs.floatBar.style.width = width+'px';
      }
    },
    // 浮动条高度变化 改变 容器高度
    floatResize() {
      if(this.$refs.container && this.$refs.floatBar) {
        const { height } = this.$refs.floatBar.getBoundingClientRect() || {};
        this.$refs.container.style.height = height+'px';
      }
    },
    renderScroll() {
      return (
        <div class="scroll-box" style="width: 100%; overflow: auto;" ref="scrollBox">
          <div style="height: 1px;" ref="scrollBar"/>
        </div>
      );
    },
    formatTableOper(tableOper, tableOperB) {
      const newTableOper = tableOper?.filter(item=>
        ["ElButton", "EButtonN"].includes(item?.componentOptions?.Ctor?.extendOptions?.name));
      const commandClick = (index)=> {
        newTableOper?.[index]?.componentOptions?.listeners?.click();
      }

      let tableOperDoc = newTableOper;
      if(newTableOper?.length > 2) {
        const displayButton =  newTableOper.splice(0, 2);
        tableOperDoc = (
          <div class="batch-oper">
            {displayButton}
            <el-dropdown trigger="click" onCommand={ (e)=> commandClick(e) }>
              <e-button-n size="mini" type="defalut" icon="icon-F-F18" style="margin-left: 10px;"/>
              <el-dropdown-menu slot="dropdown">
                {
                  newTableOper.map((item, index)=> (
                    <el-dropdown-item command={ index } disabled={item.componentOptions.propsData.disabled || item.componentOptions.propsData.loading}
                      icon={item.componentOptions.propsData.loading ? "el-icon-loading" : "iconfont "+item.componentOptions.propsData.icon}>
                      {item.componentOptions.children[0].text}</el-dropdown-item>
                  ))
                }
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        )
      }
      return (
        <div class="e-bottom-bar-oper">
          {tableOperDoc}
          {tableOperB ? [<div class="e-bottom-bar-oper-divider"/>, tableOperB] : null}
        </div>
      );
    },
  },
  render() {
    const { getSlot, formatTableOper, containerResize, floatResize, renderScroll } = this;
    const tableOperSlot = getSlot('table-oper', {
      buttonAttr: { size: "mini", type: "primary", minWidth: true },
    });
    const tableOperBSlot = getSlot('table-oper-b', {
      buttonAttr: { size: "mini", type: "primary", minWidth: true },
    });
    const pageSlot = getSlot('page', {
      tablePageAttr: {
        background: true,
        pageSizes: [15, 20, 50, 100],
        layout: "total, sizes, prev, pager, next, jumper",
        pagerCount: 5,
      },
    });

    this.isBottom = !!(tableOperSlot || tableOperBSlot || pageSlot);

    return this.isBottom ? (
      <div class="float-container" ref="container" v-resize={(e) => containerResize(e)}>
          <div class="e-list-layout-container e-bottom-bar" ref="floatBar" v-resize={(e) => floatResize(e)}>
            { renderScroll() }
            <div class="button-and-page">
              {formatTableOper(tableOperSlot, tableOperBSlot)}
              {pageSlot}
            </div>
          </div>
      </div>
    ) : null;
  }
}
</script>
<style lang="scss" scoped>
  @import '../../../../style/list-layout/common.scss';
  .float-container {
    width: 100%;
  }
  .e-bottom-bar {
    z-index: 10; bottom: 0;
    padding-top: 0;
    position: static;
    box-shadow: none;
    .scroll-box {
      margin-bottom: 10px;
    }
    .button-and-page {
      display: flex;
      justify-content: space-between;
      .e-bottom-bar-oper {
        display: flex;
        .batch-oper {
          display: flex;
          justify-content: flex-end;
        }
        .e-bottom-bar-oper-divider {
          width: 1px;
          height: 100%;
          background-color: #f1f1f1;
          margin: 0 10px;
        }
      }
    }
  }
</style>
