<template>
  <div class="my-component">
    111111111
    <el-button type="primary">123</el-button>
    <el-input v-model="title"></el-input>
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <e-button-n :loading="true" type="oper" @click="visible = true">抽屉</e-button-n>
    <el-button  type="warning" @click="dialogVisible = true">dialogVisible</el-button>

    <e-table-sp height="100%" :tableColumnData="tableColumnData" :data="tableData">
      <template #groupId="scope">
        {{ scope.row.groupId }}345
      </template>
      <template #oper="scope">
        <el-button type="danger">Danger</el-button>
      </template>
    </e-table-sp>
<!--    <el-table ref="singleTableRef" :data="tableData" highlight-current-row style="width: 100%">-->
<!--      <el-table-column type="index" width="50" />-->
<!--      <el-table-column property="date" label="Date" width="120" />-->
<!--      <el-table-column property="name" label="Name" width="120" />-->
<!--      <el-table-column property="address" label="Address" />-->
<!--    </el-table>-->

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
const title = ref('这是一个 Vue3 代码片段')
const visible = ref(false)
const dialogVisible = ref(false)
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
  { thirdName: '张三', useStatus: '启用', status: '正常', groupId: '1', effectiveTime: '2023-04-01', invalidTime: '2023-04-02' }
])
// reactive 响应式对象
const state = reactive({
  name: 'Vue3',
  age: 3
})

function drawerClose() {
  console.log(1111)
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
  console.log('组件已挂载')
})

onUnmounted(() => {
  console.log('组件已卸载')
})
</script>

<style scoped>
.my-component {
  padding: 20px;
  background: #f9f9f9;
  width: 100%;
  height: 100%;
}
</style>
