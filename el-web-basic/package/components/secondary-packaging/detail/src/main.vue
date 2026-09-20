<!--
 * @Author: 段丽军
 * @Date: 2021-12-23 09:57:33
 * @LastEditTime: 2022-08-12 19:52:29
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/secondary-packaging/detail/src/main.vue
-->
<template>
  <el-form size="small" label-position="top">
    <template v-for="(item, index) in itemsComputed">
      <el-form-item :label="item.label" :span="item.span || defaultSpan" v-if="item.displayValue" :key="index">
        <!--插槽内容 -->
        <template v-if="item.slotName">
          <slot :name="item.slotName" v-bind="item"/>
        </template>
        <!-- 空内容 -->
        <template v-else-if="!item.value">-</template>
        <!-- 富文本内容 -->
        <template v-else-if="item.type === 'editor'">
          <div class="editor-detail" v-container-src v-html="item.value"/>
        </template>
        <!-- 附件内容 -->
        <template v-else-if="item.type === 'fileList'">
          <el-link type="primary" :href="itemFile[item.filePath || 'filePath']" :key="indexFile"
            v-for="(itemFile, indexFile) in item.value || []" style="display: block;">
            {{ itemFile[item.fileName || 'fileName'] }}</el-link>
        </template>
        <!-- tag标签内容 -->
        <template v-else-if="item.type === 'tag'">
          <el-tag size="mini" :key="indexTag" :type="itemTag.type"
            v-for="(itemTag, indexTag) in item.value || []">{{ itemTag.text }}</el-tag>
        </template>
        <!-- 时间线 -->
        <template v-else-if="item.type === 'timeLine'">
          <el-timeline :reverse="item.timeLineReverse === undefined ">
            <el-timeline-item v-for="(itemTimeLine, indexTimeLine) in item.value" :key="indexTimeLine"
              v-bind="itemTimeLine">{{itemTimeLine.content}}</el-timeline-item>
          </el-timeline>
        </template>
        <!-- 列表内容 -->
        <!-- <template v-else-if="item.type === 'table'">
          <e-table-sp
            :tableColumnData="item.tableColumnData?item.tableColumnData:[]"
            :data="item.tableData?item.tableData:[]"/>
        </template> -->
        <!-- 其它内容 -->
        <template v-else> {{ item.value }} </template>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
export default {
  name: "EDetailSp",
  props: {
    items: {
      type: Array,
      default: ()=> []
    },
    detail: {
      type: Object,
      default: ()=> {}
    },
    defaultSpan: {
      type: Number,
      default: 12
    },
    display: {
      type: Function
    }
  },
  computed: {
    itemsComputed() {
      return this.items.map(item=> {
        let displayValue = true;

        if(item.display) {
          displayValue = item.display(this.detail);
        } else if(this.display && item.gdParam) {
          displayValue = this.display(this.detail, item.gdParam);
        }
        item.displayValue = displayValue;

        if(displayValue) {
          // 值控制
          let value;
          const { formatter, type } = item;
          if(formatter) {
            value = formatter(this.detail);
          } else {
            if(["fileList", "timeLine"].includes(type)) {
              value = this.getList(item);
            } else if(["tag"].includes(type)) {
              value = this.getTagList(item);
            } else {
              value = this.getValue(item);
            }
          }
          item.value = value;
        }
        return item;
      });
    }
  },
  methods: {
    getValue(item) {
      const value = this.detail?.[item.prop];
      if(!value) {
        return "-";
      }
      const type = Object.prototype.toString.call(value);
      if(type.toLowerCase().includes("array")) {
        return value.join("、");
      }
      return value;
    },
    getList(item) {
      return this.detail?.[item?.prop] || [];
    },
    getTagList(item) {
      return this.getList(item)?.map(item=> {
        let type = Object.prototype.toString.call(item).toLowerCase().substr(8);
        if(!type.includes("object")) {
          item = { text: item };
        }
        return item;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep.el-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 100%;
    padding: 0 5px;
    box-sizing: border-box;
    .el-select,.el-date-editor,.el-cascader {
      width: 100%;
    }
  }

  @for $i from 1 through 200 {
    .el-form-item[span="#{$i}"] {
      width: calc(100% / (24 / #{$i}));
    }
  }
}
</style>