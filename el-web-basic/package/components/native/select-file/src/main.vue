<!--
 * @Author: 段丽军
 * @Date: 2021-08-13 11:31:33
 * @LastEditTime: 2021-10-27 17:19:01
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/select-file/src/main.vue
-->
<template>
  <div style="width: 100%;">
    <!-- 按钮 开始 -->
    <div @click="$refs.file.click()">
      <slot/>
      <input
        type="file"
        ref="file"
        style="display: none;"
        @change="change"
        :accept="accept"/>
    </div>
    <!-- 按钮 结束 -->

    <!-- 提示 开始 -->
    <div class="tip">
      <slot name="tip"/>
    </div>
    <!-- 提示 结束 -->

    <!-- 列表 开始 -->
    <div v-if="value" class="item">
      <span
        class="item-name">
        {{value.name}}
      </span>
      <span
        class="el-icon-close"
        @click="$refs.file.value = null; $emit('change', null);"/>
    </div>
    <!-- 列表 结束 -->
  </div>
</template>

<script>
let sizeType = ['KB', 'MB', 'GB'];
export default {
  name: 'ESelectFileN',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: File,
      default: null
    },
    accept: {
      type: String,
      default: null
    },
    fileSize: {
      type: [String, Number],
      default: null,
      validator: val => {
        return val == null ||
        !isNaN(val) || !isNaN(parseInt(val)) || 
        ( sizeType.some(item=> item === val.slice(val.length-2)) && parseInt(val.slice(0, val.length-2)) )
      }
    },
  },
  watch: {
    value(val) {
      if(this.$refs.file.value && !val) {
        this.$refs.file.value = null;
      }
    },
  },
  methods: {
    checkMsg(fileSize) {
      if(this.fileSize) {
        let limitFileSize = this.fileSize;
        // 纯数字
        if(!isNaN(limitFileSize)) {
          if(fileSize > limitFileSize) {
            return false;
          }
        }
        // KB
        else if(limitFileSize.slice(limitFileSize.length-2) === sizeType[0]) {
          if(fileSize > limitFileSize.slice(0, limitFileSize.length-2) * 1024) {
            return false;
          }
        }
        // MB
        else if(limitFileSize.slice(limitFileSize.length-2) === sizeType[1]) {
          if(fileSize > limitFileSize.slice(0, limitFileSize.length-2) * 1024 * 1024) {
            return false;
          }
        }
        // GB
        else if(limitFileSize.slice(limitFileSize.length-2) === sizeType[2]) {
          if(fileSize > limitFileSize.slice(0, limitFileSize.length-2) * 1024 * 1024 * 1024) {
            return false;
          }
        }
      }
      return true;
    },
    change(event) {
      let file = event.target.files[0];
      if(!file) { return; }

      if(!this.checkMsg(file.size)) {
        this.$message.info('大小超了');
        return;
      }
      this.$emit('change', file);
    }
  }
}
</script>

<style scoped>
.tip {
  font-size: 12px;
  color: #606266;
  line-height: 20px;
  margin-top: 7px;
}
.item {
  padding: 0 5px;
  margin-top: 5px;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: all .3s;
  cursor: pointer;
}
.item:hover {
  background-color: #F5F7FA;
}
.item-name {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.el-icon-close {
  transition: all .3s;
}
.el-icon-close:hover {
  color: red;
}
</style>