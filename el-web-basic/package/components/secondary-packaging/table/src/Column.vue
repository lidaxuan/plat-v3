<!--
 * @Author: 段丽军
 * @Date: 2021-06-2 14:10:32
 * @LastEditTime: 2022-09-05 10:09:19
 * @LastEditors: 段丽军
 * @Description: In User Settings Edit》Ú……
 * @FilePath: /el-web-basic/package/components/secondary-packaging/table/src/Column.vue
-->

<template>
  <el-table-column v-bind="$attrs">
    <template #header="scope">
      {{ $attrs.label }}
      <span v-if="!isEmpty(tips)">
          <el-tooltip effect="dark" :content="tips" placement="top">
            <strong class="el-icon-info"/>
          </el-tooltip>
        </span>
      <i v-if="$attrs.filterIcon" :class="[$attrs.filterIcon]" style="margin: 0 5px"
        :style="$attrs.filterIconColor ? { color: $attrs.filterIconColor } : {}"
        @click.stop="$emit('filter-click', $attrs.prop)"></i>
    </template>

    <template #default="scope" v-if="isEmpty($attrs.type)">
      <template v-if="$attrs.slotName || formatter || !isEmpty(scope.row[$attrs.prop]) ||
        !isEmpty($attrs.before) || !isEmpty($attrs.after) || !isEmpty(defaultValue) || !isEmpty(globalDefaultValue)">
        <slot :name="$attrs.slotName" v-bind="scope" v-if="!isEmpty($attrs.slotName)" />
        <template v-else-if="formatter">{{ formatter(scope.row, scope.column, scope.row[$attrs.prop], scope.$index) }}</template>
        <template v-else-if="!isEmpty(scope.row[$attrs.prop])">
          {{!isEmpty($attrs.before) ? $attrs.before : ''}}
          {{scope.row[$attrs.prop]}}
          {{!isEmpty($attrs.after) ? $attrs.after : ''}}
        </template>
        <template v-else>{{ !isEmpty(defaultValue) ? defaultValue : (!isEmpty(globalDefaultValue) ? globalDefaultValue : '') }}</template>
      </template>
    </template>

    <template v-if="$attrs.children && $attrs.children.length > 0">
      <template v-for="(item, index) in $attrs.children">
        <ETableColumnSp
          :key="index"
          v-if="item.display === undefined || item.display === true"
          v-bind="item"
          :columnData="columnData"
          :globalDefaultValue="globalDefaultValue"
        >
          <template #[slotName]="scope" v-for="slotName in fotmatSlotNames($attrs.children)">
            <slot :name="slotName" v-bind="scope" />
          </template>
        </ETableColumnSp>
      </template>
    </template>
  </el-table-column>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  columnData: {
    type: Array,
    default: (_) => [],
  },
  defaultValue: null,
  tips: null,
  globalDefaultValue: null,
  formatter: {
    type: Function,
  },
});

function isEmpty(val) {
  return val === null || val === undefined || val === "";
}

function fotmatSlotNames(arr) {
  let newArr = [];
  arr.forEach((item) => {
    if (item.slotName) {
      newArr.push(item.slotName);
    }
    let children = item.children;
    if (children && children.length) {
      newArr = [...newArr, ...fotmatSlotNames(children)];
    }
  });
  return newArr;
}
</script>


<style scoped>
</style>
