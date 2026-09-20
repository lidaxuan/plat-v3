<!--
 * @Description:
 * @Author: lijixuan
 * @Date: 2026-09-17 16:38:31
 * @FilePath: el-web-basic/package/components/secondary-packaging/table/src/main.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-17 16:38:31
-->
<template>
  <div :class="`e-table-sp e-table-${sizeComputed}-sp`" :style="{height}">
    <div ref="operColumnRef" class="oper-column" v-if="oper">
      <i class="iconfont icon-D1-A6" style="font-size: 22px; cursor: pointer; color: #bbb;" @click="$emit('oper-click')"/>
    </div>

    <el-table v-bind="$attrs" :border="styleComputed === 'border'" :data="data" ref="tableRef" size="medium" :height="height"
              :row-class-name="rowClassNameComputed">
      <template v-for="(item, index) in columnsComputed || []" :key="index">
        <Column v-bind="item" v-if="item.display === undefined || item.display === true"
                :columnData="columnsComputed" :defaultValue="item.defaultValue" :globalDefaultValue="defaultValue"
                @filter-click="(prop) => $emit('filter-click', prop)">
          <template #[slotName]="scope" v-for="slotName in slotNames" :key="slotName">
            <slot :name="slotName" v-bind="scope" />
          </template>
        </Column>
      </template>
      <template #empty>
        <slot name="empty"/>
      </template>
    </el-table>
  </div>
</template>


<script setup name="e-table-sp">
import { ref, computed, watch, provide, onMounted, nextTick } from 'vue'
import Column from './Column.vue'

// ====================== props ======================
const props = defineProps({
  // table列数据
  tableColumnData: {
    type: Array,
    default: () => []
  },
  // table全局默认值
  defaultValue: null,
  // 操作按钮
  oper: {
    type: Boolean,
    default: false
  },
  // table数据
  data: {
    type: Array,
    default: () => []
  },
  // height
  height: {
    type: [Number, String],
    default: null
  },
  size: {
    validator: (value) => ['', 'small', 'medium', null].includes(value),
    default: null
  },
  rowClassName: {
    type: Function,
    default: null
  },
  tableStyle: {
    validator: (value) => ['minimalist', 'border', 'stripe', null].includes(value),
    default: null
  },
})

// ====================== emit ======================
// 原代码没有emit，这里留空，如果后续需要再加
const emit = defineEmits([])


// ====================== ref 模板引用 ======================
const tableRef = ref(null)
const operColumnRef = ref(null)

// ====================== 原 formatMethods table方法代理 ======================
const tableMethods = {}
const methodsList = ['clearSelection', 'toggleRowSelection', 'toggleAllSelection', 'toggleRowExpansion', 'setCurrentRow', 'clearSort', 'clearFilter', 'doLayout', 'sort'];
methodsList.forEach(item => {
  tableMethods[item] = function (...args) {
    if (tableRef.value) {
      tableRef.value[item](...args)
    }
  }
})

// 对外暴露方法，父组件可以通过 ref 调用 tableMethods
defineExpose({
  ...tableMethods,
  refresh,
  getWidth,
  formatSlotNames,
  setHeaderHeight,
})

// ====================== computed ======================
// 原 this.$store，如果你是pinia要改，这里保留原有写法
const $store = props.$store // 如果全局store，自行替换
const sizeComputed = computed(() => {
  return props.size || $store?.getters?.layoutSetting?.tableSetting?.rowHeight || "mini"
})

const styleComputed = computed(() => {
  return props.tableStyle || $store?.getters?.layoutSetting?.tableSetting?.tableStyle || "minimalist"
})

const slotNames = computed(() => {
  return formatSlotNames(props.tableColumnData)
})

const columnsComputed = computed(() => {
  return getWidth(props.tableColumnData)
})

watch(() => props.tableColumnData, () => {
  refresh()
}, { deep: true })

watch(() => props.data, () => {
  refresh()
})

// ====================== onMounted ======================
onMounted(() => {
  setHeaderHeight()
})

// ====================== methods 全部转成setup函数 ======================
function rowClassNameComputed(params) {
  if (props.rowClassName) {
    return props.rowClassName(params);
  }
  if (styleComputed.value === "stripe" && params.rowIndex % 2 === 0) {
    return "table-background";
  }
}

function getWidth(arr = [], level = 0) {
  if (!Array.isArray(arr)) {
    return [];
  }
  // 浅拷贝数组，防止修改原props数据
  const list = arr.map(item => ({ ...item }));
  const span = document.createElement("span");
  span.style.visibility = "hidden";
  span.style.position = "absolute";
  span.style.whiteSpace = "nowrap"; // 保证文字不换行，测量宽度准确
  document.body.appendChild(span);

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    span.innerText = `${item?.before || ""}${item?.label || ""}${item?.after || ""}`;
    if (!item.minWidth && !item.width) {
      if (item.slotName === "oper") {
        item.width = 140;
      }
      if (item.type === "selection") {
        item.width = 55;
      }
      if (item.type === "index") {
        item.width = 70;
      }
      let textWidth = Math.floor(span.getBoundingClientRect().width) || 50;
      item.minWidth = textWidth + 50;
      // 最后一列增加宽度
      if (props.oper && list.length - 1 === i && level === 0) {
        item.minWidth += 20;
      }
      if (item.sortable) {
        item.minWidth += 24;
      }
      if (item.tips) {
        item.minWidth += 14;
      }
      if (item["show-overflow-tooltip"] !== false && !item["show-overflow-tooltip"]) {
        item["show-overflow-tooltip"] = true;
      }
    }
    // 递归处理子列，赋值替换children
    if (item?.children?.length > 0) {
      item.children = getWidth(item.children, level + 1);
    }
  }
  document.body.removeChild(span);
  return list;
}


// 获取所有插槽
function formatSlotNames(arr) {
  return arr.reduce((count, item) => {
    if (item.slotName) {
      count.push(item.slotName);
    }
    if (item.children) {
      count = [...count, ...formatSlotNames(item.children)];
    }
    return count;
  }, []);
}

// 刷新列表
function refresh() {
  if (tableRef.value) {
    tableRef.value.doLayout();
  }
}

function getElementsByClassName(className, children) {
  if (!className || !children) {
    return;
  }
  for (var i = 0; i < children.length; i++) {
    const item = children[i]
    if (item?.className?.includes && item?.className?.includes(className)) {
      return item;
    } else {
      const result = getElementsByClassName(className, item?.children);
      if (result) {
        return result;
      }
    }
  }
}

function setHeaderHeight() {
  nextTick(() => {
    const table = tableRef.value;
    if (!table) return
    const el = getElementsByClassName("el-table__header-wrapper", table.$el.children);
    if (operColumnRef.value) {
      operColumnRef.value.style.height = (el.getBoundingClientRect().height - 2) + 'px';
    }
  })
}
</script>


<style type="scss" scoped>

.e-table-sp {
  position: relative;
  //overflow: hidden;
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  max-width: 100%;
  background-color: #FFFFFF;
  font-size: 14px;
  color: #606266;
}

::v-deep .el-table .switchEl {
  justify-content: center !important;
  height: auto !important;
}

::v-deep .el-table .switchEl .el-switch {
  margin: 0 !important;
  margin-right: 5px !important;
}


.el-table-oper-column {
  position: absolute;
  top: 20px;
  right: 25px;
  z-index: 5;
  background-color: #FFFFFF;
}

.oper-column {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 1px;
  right: 1px;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
}

.e-table-mini-sp ::v-deep .el-table tr {
  height: 38px;
}

.e-table-small-sp ::v-deep .el-table tr {
  height: 48px;
}

.e-table-medium-sp ::v-deep .el-table tr {
  height: 58px;
}

::v-deep .el-table .table-background {
  background-color: #f1f4fa;
}
</style>
