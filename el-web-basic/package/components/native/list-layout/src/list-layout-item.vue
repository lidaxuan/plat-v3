<!--
 * @Author: 段丽军
 * @Date: 2022-09-05 16:10:05
 * @LastEditTime: 2022-10-20 17:12:59
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/list-layout/src/list-layout-item.vue
-->
<script lang="jsx">
import ETipsN from './tips.vue';
import Form from './form.vue';
import Table from './table.vue';
import OperBar from './oper-bar.vue';
import BottomBar from './bottom-bar.vue';
import Aside from './aside.vue';
import { itemSlotNames } from './data/index.js';

import getSlot from './mixins/getSlot.js';
export default {
  name: "EListLayoutItemN",
  components: {
    ETipsN,
    Form,
    Table,
    OperBar,
    BottomBar,
    Aside,
  },
  props: {
    background: {
      type: Boolean,
      default: null,
    },
    padding: {
      type: Boolean,
      default: null,
    },
    // 使用方式: multi 多模块 (单独使用, 默认值); single 单模块 (嵌入list-layout使用);
    useType: {
      type: String,
      default: "multi",
    },
    isCustomCondition: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [getSlot],
  data() {
    return {
      itemSlotNames,
      createElement: null,
    };
  },
  methods: {
    query() {
      this.$emit('query');
    },
    reset() {
      this.$emit('reset');
    },
    customCondition() {
      this.$emit('customCondition');
    },
    asideContent(asideSlot, asideTopSlot) {
      // 获取插槽函数
      const { getSlot } = this;

      // 判断是否存在左侧布局
      const aside = getSlot(asideSlot),
        asideTop = getSlot(asideTopSlot);
      if(aside || asideTop) {
        // aside 插槽
        const asideSlots = {
          aside: (attr) => getSlot(asideSlot, attr),
          'aside-top': (attr) => getSlot(asideTopSlot, attr),
        };
        return <Aside scopedSlots={asideSlots}/>;
      }
      return;
    },
    mainContent() {
      const {
        itemSlotNames, // 插槽名称
        getSlot, // 获取插槽函数
        query,
        reset,
        customCondition,
        isCustomCondition
      } = this;

      // form 插槽
      const formSlots = {
        form: (attr) => getSlot(itemSlotNames.queryForm, attr),
        'form-oper': (attr) => getSlot(itemSlotNames.queryFormOper, attr),
      };

      // oper-bar 插槽
      const operBarSlots = {
        default: (attr) => getSlot(itemSlotNames.operBar, attr),
      };

      // table 插槽
      const tableSlots = {
        default: (attr) => getSlot(itemSlotNames.queryTable, attr),
        aside: (attr) => getSlot(itemSlotNames.tableAside, attr),
        'aside-top': (attr) => getSlot(itemSlotNames.tableAsideTop, attr)
      };

      // buttom-bar 底栏插槽
      const bottomBarSlots = {
        'table-oper': (attr) => getSlot(itemSlotNames.tableOper, attr),
        'table-oper-b': (attr) => getSlot(itemSlotNames.tableOperB, attr),
        page: (attr) => getSlot(itemSlotNames.tablePage, attr),
      };

      const defaultSlot = getSlot('default');

      return (
        <div class="e-list-layout-item">
          {/* tips */}
          <ETipsN>{getSlot(itemSlotNames.tips)}</ETipsN>
          {/* query-form */}
          <Form scopedSlots={formSlots} onQuery={ query } onReset={ reset } onCustomCondition={ customCondition } isCustomCondition={ isCustomCondition } type="item"/>
          {/* oper-bar */}
          <OperBar scopedSlots={operBarSlots}/>
          {/* table */}
          <Table scopedSlots={tableSlots}/>
          {/* table-oper/table-oper-b/table-page */}
          <BottomBar scopedSlots={bottomBarSlots}/>
          {defaultSlot}
        </div>
      );
    },
  },
  render() {
    const {
      itemSlotNames,
      asideContent, // 
      mainContent // 
    } = this;
    const asideContentRes = asideContent(itemSlotNames.aside, itemSlotNames.asideTop);
    if(asideContentRes) {
      return (
        <div class="e-list-layout-aside-item">
          {asideContentRes}
          {mainContent()}
        </div>
      );
    } else {
      return mainContent();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../style/list-layout/common.scss';
@import '../../../../style/list-layout/item-list.scss';
.e-list-layout-aside-item {
  display: flex;
  .e-list-layout-item {
    flex: 1;
    min-width: 0;
  }
}
</style>
