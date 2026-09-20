<!--
 * @Author: 段昭昭
 * @Date: 2021-08-26 14:56:36
 * @LastEditTime: 2021-09-07 15:22:33
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/secondary-packaging/big-data-select-batch/src/main.vue
-->
<template>
  <div class="select-panel-own">
    <el-popover popper-class="selectPanel" placement="bottom" width="462" @show="loadData" trigger="click">
      <div>
        <el-autocomplete class="inline-input" v-model="valueSelf" size="mini" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect" clearable>
          <template slot-scope="{ item }">
            <div class="name">
              {{ item.label}} > {{item.children[0].label}}
            </div>
          </template>

        </el-autocomplete>
        <el-checkbox v-model="isCheckedAll" @change="getCheckedStatus">全选</el-checkbox>
      </div>
      <div class="select-section">

        <div class="section-department">
          <el-checkbox-group v-model="checkList" @change="getVal">
            <ul>
              <li v-for="item in options" :key="item.value">
                <el-checkbox :label="item.value" :class="{'allSelected' :selectObj[item.value] && selectObj[item.value].length >0 && customList[item.value].length > selectObj[item.value].length,
                                }">{{item.label}}</el-checkbox>
                <span @click="loadData(item.value)" class="el-icon-arrow-right" :class="activeDept && activeDept == item.value? 'active' : ''"></span>
              </li>
            </ul>
          </el-checkbox-group>

        </div>
        <div class="section-customer" v-show="customList[activeDept]">
          <vxe-table ref="customer" :scroll-y="{gt: 100}" height="280" row-id="value" :data="customList[activeDept]" @checkbox-change="selectChangeEvent" :show-header="false" :checkbox-config="{checkStrictly: true, trigger: 'row'}">
            <vxe-table-column key="value" type="checkbox" width="40"></vxe-table-column>
            <vxe-table-column field="label"></vxe-table-column>
          </vxe-table>
        </div>
      </div>
      <div class="el-input__inner lazy-cascader-input" slot="reference">
        <span class="lazy-cascader-placeholder">
        </span>
        <div v-show="allCount">
          <el-tag type="info">{{currentLable}}</el-tag>
          <el-tag type="info">
            +{{allCount}}
          </el-tag>

        </div>
        <i @mouseover="mouseOver" @mouseleave="mouseLeave" :class="iconType" class="el-close" @click="empty">
        </i>
      </div>
    </el-popover>
  </div>
</template>

<script>
// import { customerList } from './data'
// let _ = require("lodash");
export default {
  name: "EBigDataSelectBatchSp",
  props: {
    value: {
      type: Object,
      default: () => { },
    },
    valueList: {
      type: Array,
      default: () => [],
    },
    fieldArray: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      valueSelf: '',
      disabled: false,
      iconType: 'el-icon-arrow-down',
      checkList: [],
      options: [],
      customList: {},
      selectObj: {},
      activeDept: '',//当前展示部门
      s_customer: '',
      s_customerList: [],
      oldSelected: [],
      allCount: '',
      labels: [],
      currentLable: '',
      firstDeptId: '',
      isCheckedAll: false,
    }
  },
  watch: {
    value(val) {
      if (JSON.stringify(val) == "") {
        this.selectAll()
        this.isCheckedAll = true
      } else {
        this.isCheckedAll = false
        this.selectObj = val;
        this.checkList = Object.keys(val);
        this.getLabel()
      }

    },
    checkList(newVal, oldVal) {
      this.oldSelected = oldVal;
    },
    valueList: {
      handler: function (val) {
        this.s_customerList = val
      },
      immediate: true
    },
    valueSelf(val) {
      console.log(val, 'watch')
    }
  },
  computed: {
    // exportPer() {
    //   return {
    //     s_customer: customerList
    //   };
    // },
    // customerArray() {
    //   return this.s_customerList;
    // }
  },
  mounted() {
    let obj = {}
    let labels = {}
    this.$nextTick(() => {
      this.s_customerList.map(item => {
        this.options.push({ value: item.value, label: item.label })
        let arr = []
        let labelItem = {}
        if (item.children && item.children.length) {
          item.children.forEach(self => {
            arr.push({ value: self.value, label: self.label })
            labelItem[self.value] = { value: self.value, label: self.label }
          })
        }

        obj[item.value] = arr
        labels[item.value] = { value: labelItem, label: item.label }
      })

      this.customList = obj;
      this.options.splice(0, 1)
      delete this.customList['-2']
      this.labels = labels;
    })


  },
  methods: {
    init(val) {
      if (JSON.stringify(val) == "") {
        this.selectAll()
        this.isCheckedAll = true
      } else {
        this.isCheckedAll = false
        this.selectObj = val;
        this.checkList = Object.keys(val);
        this.getLabel()
      }
    },
    delCustomer(val) {
      this.activeDept = this.checkList[0]
      if (this.selectObj[this.activeDept] && this.selectObj[this.activeDept].length) {
        this.$refs.customer.loadData(this.customList[this.activeDept])
        let obj = JSON.parse(JSON.stringify(this.selectObj))
        obj[this.activeDept].splice(0, 1)
        this.$set(this.selectObj, this.activeDept, obj[this.activeDept])
        this.$nextTick(() => {
          this.$refs.customer.loadData(this.customList[this.activeDept])
        })
        this.$forceUpdate();

      }
      if (this.selectObj[this.activeDept] && this.selectObj[this.activeDept].length == 0) {
        delete this.selectObj[this.activeDept]
        this.checkList.splice(0, 1)
      }
      this.getLabel()
    },
    getLabel() {
      let num = 0
      for (let item in this.selectObj) {
        if (this.selectObj[item].length) {
          num += this.selectObj[item].length
        }
      }
      let key = Object.keys(this.checkList)[0]
      this.firstDeptId = key;
      this.allCount = num; //总共选中的客服数量
      if (num) {
        //当前label取选中的第一个部门下面的第一个客服
        let index = this.checkList.findIndex(item => this.selectObj[item] && this.selectObj[item].length > 0)
        this.currentLable = this.selectObj[this.checkList[index]][0].label;
      } else {
        this.currentLable = ''
      }
      if (this.isCheckedAll) {
        this.currentLable = '全选'
        this.$emit('getSelected', {})
      } else {
        this.$emit('getSelected', this.selectObj)
      }

    },
    getVal(val) {
      if (val.length > this.oldSelected.length) {
        //新增
        this.loadData(val[val.length - 1], 'all')
      } else {
        //删除
        this.isCheckedAll = false;
        var a = new Set(this.oldSelected);
        var b = new Set(val);
        var difference = [...new Set([...a].filter(x => !b.has(x)))]; // {1}

        this.$refs.customer.loadData(this.customList[difference[0]])
        // this.$set(this.selectObj,difference[0],[]);
        delete this.selectObj[difference[0]]
        this.$refs.customer.clearCheckboxRow()
        this.activeDept = difference[0]
        this.$forceUpdate();
      }
      this.getLabel()
    },
    loadData(val, status) {
      this.activeDept = val ? val : '';
      if (val) {
        this.activeDept = val;
        if (status == 'all') {
          //点击一级全选
          this.selectObj[val] = this.customList[this.activeDept]
          this.$refs.customer.loadData(this.customList[val])
          // this.$refs.customer.setAllCheckboxRow(true)
          this.$refs.customer.setCheckboxRow(this.customList[this.activeDept], true)
        } else if (status == 'cancel') {
          //取消全选
          if (this.selectObj[val]) {
            this.selectObj[val].length = 0
          }
          this.delDep(this.activeDept)
          // this.$refs.customer.setCheckboxRow([],true)
          this.$refs.customer.clearCheckboxRow()
        } else {
          //查看子集客服
          this.$refs.customer.loadData(this.customList[val])
          this.$refs.customer.clearCheckboxRow()
          if (this.selectObj[this.activeDept] && this.selectObj[this.activeDept].length) {
            //部门下面有
            setTimeout(() => {
              let arr = []
              this.customList[this.activeDept].forEach((f, indxe) => {
                this.selectObj[this.activeDept].forEach((v, idx) => {
                  if (f.value == v.value) {
                    arr.push(f)
                  }
                })
              })
              this.$refs.customer.setCheckboxRow(arr, true)
              this.$forceUpdate();
            }, 100)
          }
        }
      } else {
        this.activeDept = '';
        this.$refs.customer.loadData([])
      }

    },
    selectChangeEvent({ checked, records }) {
      if (checked) {
        if (this.checkList.indexOf(this.activeDept) == -1) {
          this.checkList.push(this.activeDept)
        }
      }
      this.$set(this.selectObj, this.activeDept, records);
      this.$forceUpdate();
      if (this.selectObj[this.activeDept].length == 0) {
        //取消勾选 判断是否达到取消全选的状态
        this.delDep(this.activeDept, 'right')
      }
      this.getLabel()
    },
    delDep(val, status) {

      let arr = status == 'right' ? [...new Set(this.checkList)] : [...new Set(this.oldSelected)]
      let idx = arr.findIndex((item, index) => {
        return item == val
      })
      if (status == 'right' && idx > -1) {
        arr.splice(idx, 1)
      }
      this.checkList = arr;


    },
    querySearch(val, callback) {
      if (val) {
        let arr = [];
        this.s_customerList.forEach(item => {
          if (item.children && item.children.length) {
            let arr2 = item.children.filter(v => {
              if (v.label) {
                return v.label.indexOf(val) > -1
              }
            })
            if (arr2.length) {
              arr2.map(v => {
                v.value = v.value
                v.label = v.label
                arr.push({ label: item.label, value: item.value, children: [v] })
              })
            }
          }
        })
        callback(arr)
      }
    },
    handleSelect(val) {
      this.valueSelf = val.children[0].label;
      this.activeDept = val.value;
      if (this.selectObj[this.activeDept] && this.selectObj[this.activeDept].length) {
        this.selectObj[this.activeDept].push(val.children[0])
      } else {
        this.$set(this.selectObj, this.activeDept, val.children);
        this.checkList.push(val.value)
      }
      this.getLabel()
      this.loadData(val.value)
    },
    mouseLeave() {
      this.iconType = 'el-icon-arrow-down'
    },
    mouseOver() {
      this.iconType = 'el-icon-circle-close'
    },
    empty() {
      this.checkList = [];
      this.selectObj = {}
      this.allCount = 0;
      this.isCheckedAll = false;
      this.$emit('getSelected', {
        fieldArray: this.fieldArray,
        val: {}
      })
      this.$refs.customer.clearCheckboxRow()
    },
    selectAll() {

      this.isCheckedAll = true;
      this.options.forEach(item => {
        this.checkList.push(item.value)
      })
      this.selectObj = _.cloneDeep(this.customList);
      this.getLabel()
    },
    getCheckedStatus(val) {
      if (val) {
        this.selectAll()
      } else {
        this.empty()
      }
    }
  }
}
</script>


<style scoped lang="scss">
.select-panel-own {
  position: relative;
  z-index: 100;
  display: inline-block;
  /*width: 315px;*/
  // height: 33px;
  .el-tag {
    margin: 0 5px;
    height: 24px;
    float: left;
    margin-top: 3px;
  }
  .el-close {
    position: absolute;
    right: 10px;
    top: 9px;
    color: #ccc;
    cursor: pointer;
  }
  .lazy-cascader-input {
    width: 215px;
    border-radius: 4px;
    background: #fff;
    padding: 0 5px;
    cursor: pointer;
    position: relative;
    height: 32px;
    border: 1px solid #d7d7d7;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    .tags {
      height: 32px;
    }
  }
  .select-section {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 57px;
    padding: 10px;
  }
  .section-department,
  .section-customer {
    width: 200px;
    height: 260px;
    display: inline-block;
    border: 1px solid #ccc;
    padding: 10px;
    float: left;
  }
  .section-customer {
    margin-left: 5px;
  }
  ul {
    height: 250px;
    overflow: auto;
    padding: 0;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 16px;
        cursor: pointer;
      }
      span.active {
        color: #409eff;
      }
    }
  }
}

// /*滚动条整体部分*/
// ul::-webkit-scrollbar {
//   width: 2px;
//   height: 2px;
// }
// /*滚动条的轨道*/
// ul::-webkit-scrollbar-track {
//   background-color: #ccc;
// }
// /*滚动条里面的小方块，能向上向下移动*/
// ul::-webkit-scrollbar-thumb {
//   background-color: #333;
//   /*border-radius: 5px;*/
//   /*border: 1px solid #f1f1f1;*/
//   /*box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);*/
// }
// ul::-webkit-scrollbar-thumb:hover {
//   background-color: #b3b3b3;
// }
// ul::-webkit-scrollbar-thumb:active {
//   background-color: #969696;
// }
// /*边角，即两个滚动条的交汇处*/
// ul::-webkit-scrollbar-corner {
//   background-color: #ffffff;
// }
</style>
<style lang="scss">
.vxe-table .vxe-cell--checkbox .vxe-checkbox--icon:before {
  border-width: 1px;
}
// /*滚动条整体部分*/
// div::-webkit-scrollbar {
//   width: 10px;
//   height: 10px;
// }
// /*滚动条的轨道*/
// div::-webkit-scrollbar-track {
//   background-color: #e6e6e6;
// }
// /*滚动条里面的小方块，能向上向下移动*/
// div::-webkit-scrollbar-thumb {
//   background-color: #c8c8c8;
//   border-radius: 5px;
//   border: 1px solid #f1f1f1;
//   box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
// }
// div::-webkit-scrollbar-thumb:hover {
//   background-color: #b3b3b3;
// }
// div::-webkit-scrollbar-thumb:active {
//   background-color: #969696;
// }
// /*边角，即两个滚动条的交汇处*/
// div::-webkit-scrollbar-corner {
//   background-color: #ffffff;
// }
.selectPanel.el-popover {
  height: 360px;
  overflow: auto;
  .el-checkbox {
    vertical-align: middle;
  }
  .select-section {
    background-color: #fff;
    border-radius: 4px;
    width: 100%;
    height: 320px;
  }
  .el-autocomplete {
    width: 350px;
    margin-bottom: 10px;
  }
  .section-department,
  .section-customer {
    width: 200px;
    height: 280px;
    display: inline-block;
    border: 1px solid #ccc;
    padding: 10px;
    float: left;
  }
  .section-customer {
    margin-left: 5px;
  }
  ul {
    height: 280px;
    overflow: auto;
    padding: 0;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #eee;
      span {
        font-size: 16px;
        cursor: pointer;
      }
      span.active {
        color: #409eff;
      }
      .allSelected .el-checkbox__inner:before {
        content: "";
        position: absolute;
        display: block;
        background-color: #fff;
        height: 2px;
        transform: scale(0.5);
        left: 0;
        right: 0;
        top: 5px;
      }
      .cancelSelected .el-checkbox__inner:before {
        content: none;
      }
      .cancelSelected .el-checkbox__inner {
        background-color: #fff;
        border: 1px solid #dcdfe6;
      }
      .cancelSelected .el-checkbox__inner:after {
        -webkit-box-sizing: content-box;
        box-sizing: content-box;
        content: "";
        border: 1px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        -webkit-transform: rotate(45deg) scaleY(0);
        transform: rotate(45deg) scaleY(0);
        width: 3px;
        -webkit-transition: -webkit-transform 0.15s ease-in 0.05s;
        transition: -webkit-transform 0.15s ease-in 0.05s;
        transition: transform 0.15s ease-in 0.05s;
        transition: transform 0.15s ease-in 0.05s,
          -webkit-transform 0.15s ease-in 0.05s;
        -webkit-transform-origin: center;
        transform-origin: center;
      }
      .allSelected .el-checkbox__inner:after {
        content: none;
      }
    }
  }
}
</style>
