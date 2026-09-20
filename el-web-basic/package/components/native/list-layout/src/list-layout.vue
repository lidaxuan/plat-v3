<!--
 * @Author: 段丽军
 * @Date: 2022-09-05 16:10:24
 * @LastEditTime: 2022-10-20 16:20:11
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/list-layout/src/list-layout.vue
-->
<script lang="jsx">
import EListLayoutItemN from './list-layout-item.vue';
import Tab from './tab.vue';
import ETipsN from './tips.vue';
import Form from './form.vue';

import { listSlotNames, itemSlotNames } from './data/index.js';
import getSlot from './mixins/getSlot.js';
import actionAsyncMethod from './mixins/actionAsyncMethod.js';
import scrollUtil from './utils/scrollUtil.js';
import { gou as globalOperUtil }  from './utils/globalOperUtil.js';
export default {
  name: 'EListLayoutN',
  components: {
    EListLayoutItemN,
    ETipsN,
    Form,
  },
  props: {
    tabs: {
      type: Array,
      default: _=> [],
    },
    activeName: {
      type: String,
      default: '',
    },
    isCustomCondition: {
      type: Boolean,
      default: false,
    }
  },
  mixins: [getSlot, actionAsyncMethod],
  data() {
    return {
      listSlotNames,
      itemSlotNames,
      newActiveName: null,
      debounceTimeout: null,
    };
  },
  mounted() {
    this.initScroll();
    this.initGlobalOper();
  },
  methods: {
    initScroll() {
      this.$nextTick(() => {
        this.actionAsyncMethod(scrollUtil.init?.bind(scrollUtil, { el: this.$el })); // 初始化滚动监听
      });
    },
    initGlobalOper() {
      this.$nextTick(() => {
        const { getSlot, listSlotNames, itemSlotNames } = this;
        const globalOperSlot = getSlot.bind(this, listSlotNames.globalOper);
        const moduleQueryForm = getSlot(listSlotNames.moduleQueryForm, { queryFormAttr: {} }) || getSlot(listSlotNames.moduleQueryFormOper),
          queryForm = getSlot(itemSlotNames.queryForm, { queryFormAttr: {} }) || getSlot(itemSlotNames.queryFormOper);
        
        let displayType = 'list';
        if(moduleQueryForm || !queryForm) {
          displayType = 'list';
        } else if(queryForm) {
          displayType = 'item';
        }
        this.actionAsyncMethod(globalOperUtil?.init?.bind(globalOperUtil, { globalOperSlot, displayType }));
      });
    },
    // 防抖 执行函数
    debounceActionMethod(method, time) {
      if(this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
      this.debounceTimeout = setTimeout(() => {
        method();
      }, time || 100)
    },
    changeActiveName(val) {
      scrollUtil.destroyed(); // 销毁滚动监听
      this.initScroll(); // 初始化
      this.$emit('update:activeName', val);
    },
    renderModuleTop() {
    const {
      listSlotNames, // 模块内容插槽集合
      getSlot, // 
    } = this;
      const slot = getSlot(listSlotNames.moduleTop);
      return slot ? slot : null;
    },
    renderModule() {
      const { 
        listSlotNames, // 模块内容插槽集合
        itemSlotNames,
        getSlot,
        query,
        reset,
        customCondition,
        isCustomCondition
      } = this;

      const slotModule = getSlot(listSlotNames.module);
      if(slotModule) {
        return slotModule;
      } else {
        // item 需要的插槽 透传
        const itemSlots = {};
        for (let key in itemSlotNames) {
          const slotName = itemSlotNames[key];
          itemSlots[slotName] = (attr) => getSlot(slotName, attr);
        }
        return <EListLayoutItemN scopedSlots={itemSlots} useType="single" onQuery={ query } onCustomCondition={ customCondition } isCustomCondition={ isCustomCondition } onReset={ reset }/>;
      }
    },
    query() {
      this.$emit('query');
    },
    reset() {
      this.$emit('reset');
    },
    customCondition() {
      this.$emit('customCondition');
    },
  },
  render() {
    const {
      listSlotNames, // 模块内容插槽集合
      getSlot, // 
      tabs,
      activeName,
      changeActiveName,
      renderModuleTop,
      renderModule,
      query,
      reset,
      customCondition,
      isCustomCondition
    } = this;

    // tab 属性
    const tabProps = {
      tabs,
      activeName
    };
    
    // form 插槽内容
    const formSlots = {
      form: (attr) => getSlot(listSlotNames.moduleQueryForm, attr),
      'form-oper': (attr) => getSlot(listSlotNames.moduleQueryFormOper, attr),
    };

    const defaultSlot = getSlot(listSlotNames.default);

    return (
      <div class="e-list-layout">
        {/* tab */}
        <Tab props={tabProps} onChangeActiveName={ (val)=> changeActiveName(val) }>
          {getSlot(listSlotNames.tab)}
        </Tab>
        {/* tips */}
        <ETipsN>{getSlot(listSlotNames.moduleTips)}</ETipsN>
        {/* query-form */}
        <Form scopedSlots={formSlots} onQuery={ query } onReset={ reset } onCustomCondition={ customCondition } isCustomCondition={ isCustomCondition } type="list"/>
        {/* module-top */}
        {renderModuleTop()}
        {/* module */}
        {renderModule()}
        {defaultSlot}
      </div>
    );
  },
  beforeDestroy() {
    scrollUtil.destroyed(); // 销毁滚动监听
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../style/list-layout/common.scss';
@import '../../../../style/list-layout/list.scss';
</style>