<!--
 * @Description: 工单工作台
 * @Author: lijixuan
 * @Date: 2026-10-13 10:15:53
 * @FilePath: src/views/workOrderWorkbench/index.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-10-13 10:15:53
-->
<template>
  <div class="work-order-workbench">

    <div class="top-tip flex ai-center jc-between">
      <div class="tip-title">工单状态</div>
      <div class="tip-content">全部工单 · 点击卡片筛选</div>
    </div>

    <div class="sums-total flex ai-center jc-between">
      <div class="sum-item" v-for="item in totalTypeMenu">
        <div class="sum-title">{{ item.name }}</div>
        <div class="sum-value">{{ item.value }}</div>
      </div>
    </div>

    <div class="left-list">
      <div class="left-list-item line">
        <div class="item-title">工单列表</div>
        <div class="item-content">
          <el-button type="primary">Primary Button</el-button>
        </div>
      </div>
      <div class="search">
        <el-input placeholder="请输入内容" v-model="input" clearable></el-input>
        <el-select v-model="select">
          <el-option label="选项一" value="1"></el-option>
          <el-option label="选项二" value="2"></el-option>
        </el-select>
        <el-button type="primary">Primary Button</el-button>
      </div>
    </div>

    <e-table-sp height="500px" :tableColumnData="tableColumnData" :data="tableData">
      <template #groupId="scope">
        {{ scope.row.groupId }}345
      </template>
      <template #oper="scope">
        <el-button type="danger">Danger</el-button>
      </template>
    </e-table-sp>


    <e-drawer-sp title="123" :isFooter="!false" v-model="visible" @close="drawerClose">
      <template #default="scope">
        <div v-for="item in 20" :key="item" type="primary">{{ item }}</div>
      </template>

      <template #footer-left>
        <el-button @click="visible = false">111</el-button>
        <el-button type="primary" @click="visible = false">确22定</el-button>
      </template>
      <!--      <template #footer>-->
      <!--        <el-button @click="visible = false">33</el-button>-->
      <!--        <el-button type="primary" @click="visible = false">44</el-button>-->
      <!--      </template>-->
    </e-drawer-sp>

    <e-dialog-sp title="22" v-model="dialogVisible">
      <template #default="scope">
        <div v-for="item in 40" :key="item" type="primary">{{ item }}</div>
      </template>

      <template #footer>
        <el-button @click="visible = false">33</el-button>
        <el-button type="primary" @click="visible = false">44</el-button>
      </template>
    </e-dialog-sp>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'

// ref 响应式变量
const count = ref(0)
const title = ref('这是一个1 Vue3 代码片段')
const visible = ref(false)
const dialogVisible = ref(false)
const totalTypeMenu = ref([
        { name: '全部', value: 100 , code: 'all'},
        { name: '待分配', value: 50 , code: 'pending'},
        { name: '已驳回', value: 30 , code: 'rejected'},
        { name: '处理中', value: 30 , code: 'processing'},
        { name: '待确认', value: 30 , code: 'pendingConfirmation'},
        { name: '已关闭', value: 20 , code: 'closed'},
        { name: '已做废', value: 20 , code: 'cancelled'},
])
const tableColumnData = [
  { width: 230, label: '账号昵称', prop: "thirdName"},
  { label: '启用状态', prop: "useStatus"},
  { label: '账号状态', prop: "status"},
  { label: '客服分组', slotName: "groupId"},
  { label: '席位到期时间', prop: "effectiveTime", tips: '席位是您在易聊购买的可授权账号数量及有效期，席位到期请联系易聊客服进行续期' },
  { label: '授权失效时间', prop: 'invalidTime', tips: '账号到期前需要重新授权，否则会影响机器人接待'},
  { width: 180, label: '操作', slotName: 'oper', fixed: 'right' }
]
const tableData = ref([
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' },
])
// reactive 响应式对象
const state = reactive({
  name: 'Vue3',
  age: 3
})

function drawerClose() {
  visible.value = false
}

// computed 计算属性
const doubled = computed(() => count.value * 2)

// 方法
function increment() {
  count.value++
}

// watch 监听
watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} -> ${newVal}`)
})

// 生命周期
onMounted(() => {
})

onUnmounted(() => {
})
</script>

<style scoped>
.work-order-workbench {
  padding: 10px;
  background: #f9f9f9;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .top-tip {
    padding: 10px;
    background: #fff;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 14px;
    .tip-title {
      font-weight: bold;
      color: #333;
    }
    .tip-content {
      color: #999;
    }
  }
}
</style>
