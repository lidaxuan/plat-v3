<!--
 * @Author: 赵春旭
 * @Date: 2021-08-26 14:56:36
 * @LastEditTime: 2021-09-10 15:38:20
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/secondary-packaging/select-tree/src/main.vue
-->


<template>
  <el-select v-model="valueTitle" :clearable="clearable" @clear="clearHandle" ref="select" :placeholder="placeholder">
    <el-input
      class="selectInput"
      :placeholder="placeholder"
      v-model="filterText">
    </el-input>

    <el-option :value="valueTitle" :label="valueTitle" class="options">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick">
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
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "ESelectTreeSp",
  props:{
    /* 配置项 */
    props:{
      type: Object,
      default:() =>
        ({
          value: 'id',
          label: 'name',
          children: 'children'
        })
    },
    /* el-tree渲染数据*/
    options: {
      type: Array,
      default: () => []
    },
    /* 初始值 */
    value: { // .sync方式
      type: Number,
      default: () => null
    },
    /* 是否可清空 */
    clearable: {
      type: Boolean,
      default: true
    },
    /* 是否每次只打开一个同级树节点展开 */
    accordion: {
      type: Boolean,
      default: false
    },
    /* placeholder */
    placeholder:{
      type: String,
      default: () => '请输入内容'
    },
    /* 是否展示全路径 */
    showAllLevels: {
      type: Boolean,
      default: () => false
    },
    /* 是否展示icon */
    showIcon: {
      type: Boolean,
      default: true
    },
    icon: {
      type: Boolean,
      default: false,
    },
    /* 配置树图标 */
    icons: { // 支持iconfont、el-icon、img
      type: Object,
      default: () => ({
        folder: 'el-icon-folder',
        folderOpen: 'el-icon-folder-opened',
        document: 'el-icon-document',
      })
    }
  },
  data() {
    return {
      filterText: '',
      valueId:this.value,
      valueTitle:'',
      defaultExpandedKey:[],
      parentList:[]
    }
  },
  mounted() {
    this.initHandle()
  },
  methods: {
    isShowIcon(str) {
      for(let i of Object.values(this.icons)) {
        if(!i.startsWith(str)) return false
      }
      return true
    },
    // 初始化值
    initHandle() {
      if(this.valueId){
        if(this.showAllLevels) {
          let currentNode = this.$refs.selectTree.getNode(this.valueId)
          this.valueTitle = this.getTreeNode(currentNode).length == 1?this.parentList[0]:this.parentList.reverse().join('/')
        } else {
          this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label]     // 设置文字显示
        }
        this.$refs.selectTree.setCurrentKey(this.valueId)      // 设置选中
        this.defaultExpandedKey = [this.valueId]    // 里面给设置默认展开
      }
      this.initScroll()
    },
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach(ele => ele.style.width = 0)
      })
    },
    // 切换选项
    handleNodeClick(node) {
      if(this.showAllLevels){
        this.parentList = []
        let currentNode = this.$refs.selectTree.getNode(node.id)
        this.valueTitle = this.getTreeNode(currentNode).length == 1?this.parentList[0]:this.parentList.reverse().join('/')
      }else{
        this.valueTitle = this.$refs.selectTree.getNode(node.id).data[this.props.label]
      }
      this.valueId = node[this.props.value]
      this.$emit('update:value',this.valueId)
      this.$refs.select.blur() // 让下拉框收起
    },
    getTreeNode(node) { //递归
      if (node.label !== undefined) {
        // this.parentList所有父级节点的codeItem信息
        this.parentList.push(node.data[this.props.label]);
        this.getTreeNode(node.parent);
        return this.parentList
      }
    },
    // 清除选中
    clearHandle(){
      this.valueTitle = ''
      this.valueId = null
      this.clearSelected()
      this.$emit('update:value',null)
    },
    /* 清空选中样式 */
    clearSelected(){
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach((element)=>element.classList.remove('is-current'))
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[this.props.label].indexOf(value) !== -1;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.selectTree.filter(val);
    }
  },
};
</script>

<style lang="scss" scoped>
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-select-dropdown__item.selected{
    font-weight: normal;
  }
  ul li ::v-deep .el-tree .el-tree-node__content{
    height:auto;
    padding: 0 20px;
  }
  .el-tree-node__label{
    font-weight: normal;
  }
  .el-tree ::v-deep .is-current .el-tree-node__label{
    color: #409EFF;
    font-weight: 700;
  }
  .el-tree ::v-deep .is-current .el-tree-node__children .el-tree-node__label{
    color:#606266;
    font-weight: normal;
  }
  .selectInput{
    padding: 0 5px;
    box-sizing: border-box;
  }
  .tree-content{
    i,img{
      margin-right: 4px;
    }
    img{
      width: 16px;
      height: 16px;
    }
  }
</style>
<style lang="scss">
// 滚动条的宽度
::-webkit-scrollbar {
  width: 10px; // 横向滚动条
  height: 10px; // 纵向滚动条 必写
}
// 滚动条的滑块
::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover{
  background: #ccc;
}
::-webkit-scrollbar-track {background-color:#f0f6ff;}
</style>
