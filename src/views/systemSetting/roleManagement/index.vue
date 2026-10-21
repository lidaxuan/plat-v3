<!--
 * @Description: 角色管理
 * @Author: lijixuan
 * @Date: 2026-10-16 15:45:35
 * @FilePath: src/views/systemSetting/roleManagement/index.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-10-16 15:45:35
-->
<template>
  <div class="role-management">
    <div class="tip">账号沿用 BOSS / 产研；工单角色独立分配。新账号默认普通角色，由初始超管手动授权；支持设置多名超管。这里不创建账号、不调整其他系统权限。</div>

    <div class="top flex ai-center jc-between">
      <div class="left">
        <div class="title">人员与权限</div>
        <div class="text">只保留普通角色、超级管理员。部门用于岗位识别与研发转派限制，不扩大查看范围。</div>
      </div>
      <el-button type="primary">保存角色配置</el-button>
    </div>

    <e-table-sp height="500px" :tableColumnData="tableColumnData" :data="tableData">
      <template #useStatus="scope">
        {{ scope.row.useStatus }}345
      </template>
      <template #status="scope">
        <el-select v-model="scope.row.status">
          <el-option label="正常" value="正常"></el-option>
          <el-option label="禁用" value="禁用"></el-option>
        </el-select>
      </template>
    </e-table-sp>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'

// ref 响应式变量
const count = ref(0)
const title = ref('这是一个1 Vue3 代码片段')
const visible = ref(false)
const tableColumnData = [
  { width: 230, label: '账号', prop: "thirdName"},
  { label: '所属部门', slotName: "useStatus"},
  { label: '工单角色', slotName: "status"},
  { label: '数据范围', prop: "groupId"},
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

</script>

<style scoped>
.role-management {
  height: 100%;
  overflow-y: auto;

  .tip {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
    border: 1px solid #eaeaea;
  }

  .top {
    margin-bottom: 20px;
    .left {
      .title {
        font-size: 16px;
        font-weight: 500;
      }
      .text {
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
