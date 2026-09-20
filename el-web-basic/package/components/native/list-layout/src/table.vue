<!--
 * @Author: 段丽军
 * @Date: 2022-09-08 17:48:13
 * @LastEditTime: 2022-10-27 11:30:25
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/list-layout/src/table.vue
-->
<script lang="jsx">
import getSlot from './mixins/getSlot.js';
import actionAsyncMethod from './mixins/actionAsyncMethod.js';

import scrollUtil from './utils/scrollUtil.js';
import { tbs as tableAndBBarScroll, attrs as tbsAttrs } from './utils/tableAndBBarScroll.js';
export default {
  // data() {
  //   return {
  //     top: 0,
  //   };
  // },
  mounted() {
    this.$nextTick(() => {
      // 初始化「table」浮动相关
      this.actionAsyncMethod(scrollUtil?.addWatch?.bind(scrollUtil, 'change', ({ parentTop }) => {
        this.tableScrollUtil(parentTop);
      }));

      // 初始化「底栏滚动条」相关
      const { width: bodyWidth } = document.querySelector('.el-table__header-wrapper .el-table__header')?.getBoundingClientRect() || {};
      this.actionAsyncMethod(tableAndBBarScroll?.setButtomBarConfig?.bind(tableAndBBarScroll, {bodyWidth}));

      // 横向滚动「底栏滚动条」时，联动触发「table」滚动
      this.actionAsyncMethod(tableAndBBarScroll.addWatch.bind(tableAndBBarScroll, tbsAttrs.btts, ({ tableScrollLeft }) => {
        document.querySelector('.el-table__body-wrapper').scrollLeft = tableScrollLeft;
      }));

      // 横向滚动「table」时，联动触发「底栏滚动条」滚动
      this.$nextTick(() => {
        const elTableBody = document.querySelector('.el-table__body-wrapper');
        if(elTableBody) {
          elTableBody.addEventListener('scroll', (e)=> {
            tableAndBBarScroll.setTableScrollLeft(e.target.scrollLeft);
          });
        }
      });
    });
  },
  mixins: [getSlot, actionAsyncMethod],
  methods: {
    // 滚动浮动表头工具
    tableScrollUtil(top) {
      const dom = document.querySelector('.el-table');
      if (!dom) {
        return;
      }

      const { left, width } = dom.getBoundingClientRect() || {};

      const elTable = document.querySelector('.el-table__header-wrapper');
      const elTableFixed = document.querySelector('.el-table__fixed .el-table__fixed-header-wrapper');
      const elTableFixedRight = document.querySelector('.el-table__fixed-right .el-table__fixed-header-wrapper');
      const elTableFixedRightHeader = document.querySelector('.el-table__fixed-right .el-table__header');

      if (dom.getBoundingClientRect().top <= top) {
        document.querySelector('.el-table__body-wrapper').scrollLeft -= 1;
        document.querySelector('.el-table__body-wrapper').scrollLeft += 1;

        if (!document.querySelector('.zhanweitablehead')) {
          const zhanwei = document.createElement('div');
          zhanwei.className = 'zhanweitablehead';
          zhanwei.style.width = elTable.getBoundingClientRect().width + 'px';
          zhanwei.style.height = elTable.getBoundingClientRect().height + 'px';
          dom.insertBefore(zhanwei, dom.children[0]);
        }
        if (elTable) {
          elTable.style.position = 'fixed';
          elTable.style.zIndex = '1000';
          elTable.style.top = top+'px';
          elTable.style.left = left+'px';
          elTable.style.width = dom.getBoundingClientRect().width + 'px';
          elTable.style.overflow = 'hidden';
          elTable.style.borderTop = '1px solid rgb(235, 238, 245)';
        }
        if (elTableFixed) {
          elTableFixed.style.borderLeft = '1px solid #EBEEF5';
          elTableFixed.style.position = 'fixed';
          elTableFixed.style.zIndex = '10000';
          elTableFixed.style.top = top+'px';
          elTableFixed.style.left = left+'px';
          elTableFixed.style.width = `calc(${document.querySelector('.el-table__fixed').style.width} + 1px)`;
          elTableFixed.style.overflow = 'hidden';
          elTableFixed.style.borderTop = '1px solid rgb(235, 238, 245)';
        }
        if (elTableFixedRight) {
          const fixedRight = document.querySelector('.el-table__fixed-right');
          const { width: rightWidth } = fixedRight.getBoundingClientRect();
          elTableFixedRight.style.width =  `calc(${fixedRight.style.width} + 1px)`;
          elTableFixedRight.style.position = 'fixed';
          elTableFixedRight.style.zIndex = '10000';
          elTableFixedRight.style.top = top+'px';
          elTableFixedRight.style.height = elTable.getBoundingClientRect().height + 'px';
          elTableFixedRight.style.left = (left+width-rightWidth-1)+'px';
          elTableFixedRight.style.overflow = 'hidden';
          elTableFixedRightHeader.style.position = 'absolute';
          elTableFixedRightHeader.style.right = '0';
          elTableFixedRight.style.borderTop = '1px solid rgb(235, 238, 245)';
        }
      } else {
        if (!dom) {
          return
        }
        if (document.querySelector('.zhanweitablehead')) {
          document.querySelector('.el-table').removeChild(document.querySelector('.zhanweitablehead'));
        }
        if (elTable) {
          elTable.style = {};
        }
        if (elTableFixed) {
          elTableFixed.style = {};
        }
        if (elTableFixedRight) {
          elTableFixedRight.style = {};
        }
        if (elTableFixedRightHeader) {
          elTableFixedRightHeader.style.position = 'initial';
        }
      }
    },
    resize() {
      // this.tableScrollUtil();
    },
  },
  render() {
    const { getSlot, resize } = this;
    const slot = getSlot('default', {
      queryTableAttr: {
        border: true,
        ref: "queryTable"
      },
    });
    return slot ? (<div class="e-list-layout-container" v-resize={(e) => resize(e)}>{slot}</div>) : null;
  },
  beforeDestroy() {
    tableAndBBarScroll.destroyed(); // 销毁
  }
}
</script>
<style lang="scss" scoped>
  .e-list-layout-container {
    padding-bottom: 0!important;

    // 隐藏 table滚动条
    ::v-deep .el-table {
      .el-table__fixed::before, .el-table__fixed-right::before {
        height: 0!important;
      }
      .el-table__body-wrapper {
        scrollbar-width: none; /* firefox */
        // -ms-overflow-style: none; /* IE 10+ */
        &::-webkit-scrollbar {
          display: none; /* Chrome Safari */
        }
      }
    }
  }

  .is-scrolling-left ~ .el-table__fixed-right,
  .is-scrolling-middle ~ .el-table__fixed-right {
    .el-table__fixed-header-wrapper {
      border-left: 2px solid #d6d6d657;
    }
  }
  .is-scrolling-right ~ .el-table__fixed,
  .is-scrolling-middle ~ .el-table__fixed {
    .el-table__fixed-header-wrapper {
      border-right: 2px solid #d6d6d657;
    }
  }
  
</style>