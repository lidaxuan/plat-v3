<!--
 * @Author: 赵春旭
 * @Date: 2021-06-2 14:10:32
 * @LastEditTime: 2021-09-10 15:46:23
 * @LastEditors: 段丽军
 * @Description: In User Settings Edit
 * @FilePath: /el-web-basic/package/components/secondary-packaging/tree/src/main.vue
-->

<template>
  <el-tree v-bind="$attrs" v-on="$listeners" :props="props">
    <span slot-scope="{node, data}" class="tree-content" v-if="isShowIcon('el-icon') && showIcon">
      <template v-if="icon">
        <i :class="icons.document" v-if="!data[props.children]"></i>
        <i :class="icons.folderOpen" v-else-if="node.expanded"></i>
        <i :class="icons.folder" v-else></i>
      </template>
      <span>{{node.label}}</span>
    </span>
    <span slot-scope="{node, data}" class="tree-content" v-else-if="isShowIcon('icon-') && showIcon">
      <template v-if="icon">
        <i :class="['iconfont', icons.document]" v-if="!data[props.children]"></i>
        <i :class="['iconfont', icons.folderOpen]" v-else-if="node.expanded"></i>
        <i :class="['iconfont', icons.folder]" v-else></i>
      </template>
      <span>{{node.label}}</span>
    </span>
    <span slot-scope="{node, data}" class="tree-content" v-else-if="isShowIcon('data:image') && showIcon">
      <template v-if="icon">
        <img :src="icons.document" v-if="!data[props.children]" />
        <img :src="icons.folderOpen" v-else-if="node.expanded" />
        <img :src="icons.folder" v-else />
      </template>
      <span>{{node.label}}</span>
    </span>
    <span v-else>
      {{node.label}}
    </span>
  </el-tree>
</template>
<script>
export default {
  name: 'ETreeSp',
  data() {
    return {

    }
  },
  props: {
    icon: {
      type: Boolean,
      default: false
    },
    /* 配置树图标 */
    icons: { // 支持iconfont、el-icon、img
      type: Object,
      default: () => ({
        folder: 'el-icon-folder',
        folderOpen: 'el-icon-folder-opened',
        document: 'el-icon-document',
      })
    },
    /* 配置项 */
    props:{
      type: Object,
    },
    /* 是否展示icon */
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    isShowIcon(str) {
      for(let i of Object.values(this.icons)) {
        if(!i.startsWith(str)) return false
      }
      return true
    },
  }
}
</script>
