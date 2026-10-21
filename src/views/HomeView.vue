<!--
 * @Description:  首页
 * @Author: lijixuan
 * @Date: 2026-10-19 18:45:11
 * @FilePath: src/views/HomeView.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-10-19 18:45:11
-->
<template>
  <div class="home-view" v-loading="loading">
    <div class="table-card">
      <e-table-sp height="100%" :tableColumnData="tableColumnData" :data="tableData">
        <template #useStatus="scope">
          {{ scope.row.useStatus }}
        </template>
      </e-table-sp>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, watch, onMounted, onUnmounted} from 'vue'

const loading = ref(false)
const tableColumnData = [
  {label: '序号', type: "index"},
  {width: 120, label: '工单编号', prop: "ticketNo"},
  {width: 140, label: '工单标题', prop: "title"},
  {width: 100, label: '工单类型', prop: "ticketType"},
  {width: 100, label: '工单状态', prop: "status"},
  {width: 100, label: '紧急程度', prop: "priority"},
  {width: 120, label: '提交人', prop: "submitUserName"},
  {width: 120, label: '提交人账号', prop: "submitUserAccount"},
  {width: 140, label: '提交人部门', prop: "submitDeptName"},
  {width: 140, label: '受理人', prop: "handlerUserName"},
  {width: 140, label: '受理部门', prop: "handlerDeptName"},
  {width: 160, label: '来源渠道', prop: "sourceChannel"},
  {width: 180, label: '问题分类一级', prop: "categoryFirst"},
  {width: 180, label: '问题分类二级', prop: "categorySecond"},
  {width: 180, label: '问题分类三级', prop: "categoryThird"},
  {width: 200, label: '问题描述', prop: "description"},
  {width: 160, label: '关联产品', prop: "productName"},
  {width: 160, label: '关联项目', prop: "projectName"},
  {width: 160, label: '关联客户', prop: "customerName"},
  {width: 140, label: '客户联系方式', prop: "customerPhone"},
  {width: 160, label: '附件', prop: "attachList", type: "slot"},
  {width: 180, label: '创建时间', prop: "createTime"},
  {width: 180, label: '更新时间', prop: "updateTime"},
  {width: 180, label: '受理时间', prop: "acceptTime"},
  {width: 180, label: '预计完成时间', prop: "expectFinishTime"},
  {width: 180, label: '实际完成时间', prop: "actualFinishTime"},
  {width: 120, label: '处理时长(小时)', prop: "handleDuration"},
  {width: 120, label: '耗时状态', prop: "overTimeFlag"},
  {width: 140, label: '关闭人', prop: "closeUserName"},
  {width: 180, label: '关闭时间', prop: "closeTime"},
  {width: 160, label: '关闭原因', prop: "closeReason"},
  {width: 120, label: '满意度', prop: "satisfaction"},
  {width: 160, label: '评价内容', prop: "evaluateContent"},
  {width: 120, label: '标签', prop: "tagList", type: "slot"},
  {width: 140, label: '上一处理人', prop: "prevHandlerName"},
  {width: 140, label: '流转次数', prop: "transferCount"},
  {width: 160, label: '是否转派', prop: "isTransfer"},
  {width: 160, label: '是否重复工单', prop: "isRepeat"},
  {width: 160, label: '关联父工单', prop: "parentTicketNo"},
  {width: 160, label: '关联子工单数量', prop: "childTicketCount"},
  {width: 180, label: '备注', prop: "remark"},
  {width: 160, label: '操作', slotName: "operation"}
]

/**
 * 生成随机工单列表数据
 * @param count 生成条数
 */
function generateTicketList(count: number) {
  const ticketTypes = ['问题工单', '需求工单', '故障工单', '咨询工单', '变更工单']
  const statusList = ['待受理', '处理中', '待确认', '已完成', '已关闭', '已驳回']
  const priorityList = ['低', '中', '高', '紧急']
  const channelList = ['PC端', '小程序', 'APP', '电话', '邮件']
  const category1 = ['系统问题', '功能需求', '硬件故障', '咨询服务', '变更申请']
  const category2 = ['登录异常', '页面报错', '新增功能', '数据修复', '权限问题']
  const category3 = ['账号锁定', '接口超时', '报表导出', '菜单配置', '审批流']
  const satisfactionList = ['非常满意', '满意', '一般', '不满意', '非常不满意']
  const booleanList = [true, false]

  const result = []
  const now = Date.now()

  for (let i = 1; i <= count; i++) {
    const createTs = now - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
    const updateTs = createTs + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
    const acceptTs = createTs + Math.floor(Math.random() * 24 * 60 * 60 * 1000)
    const expectFinishTs = createTs + Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000)
    const actualFinishTs = Math.random() > 0.4 ? expectFinishTs + Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000) : null
    const closeTs = actualFinishTs ? actualFinishTs + Math.floor(Math.random() * 86400000) : null

    const item = {
      ticketNo: `WD${String(i).padStart(8, '0')}`,
      title: `工单【${i}】${category1[Math.floor(Math.random() * category1.length)]}问题`,
      ticketType: ticketTypes[Math.floor(Math.random() * ticketTypes.length)],
      status: statusList[Math.floor(Math.random() * statusList.length)],
      priority: priorityList[Math.floor(Math.random() * priorityList.length)],
      submitUserName: ['张三', '李四', '王五', '赵六', '陈七'][Math.floor(Math.random() * 5)],
      submitUserAccount: `user${1000 + i}`,
      submitDeptName: ['研发部', '运维部', '市场部', '财务部', '客服中心'][Math.floor(Math.random() * 5)],
      handlerUserName: ['小明', '小红', '小杰', '阿凯', '阿琳'][Math.floor(Math.random() * 5)],
      handlerDeptName: ['运维一组', '产品组', '后端开发', '测试组'][Math.floor(Math.random() * 4)],
      sourceChannel: channelList[Math.floor(Math.random() * channelList.length)],
      categoryFirst: category1[Math.floor(Math.random() * category1.length)],
      categorySecond: category2[Math.floor(Math.random() * category2.length)],
      categoryThird: category3[Math.floor(Math.random() * category3.length)],
      description: '用户反馈页面加载缓慢，部分接口偶发超时，需要排查服务器资源情况。',
      productName: ['OA系统', '工单平台', 'CRM客户系统', '财务ERP'][Math.floor(Math.random() * 4)],
      projectName: ['一期迭代项目', '二期优化项目', '运维保障项目'][Math.floor(Math.random() * 3)],
      customerName: ['A科技有限公司', 'B贸易集团', 'C互联网公司'][Math.floor(Math.random() * 3)],
      customerPhone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      attachList: Math.random() > 0.5 ? [{name: '截图.png', url: 'xxx'}] : [],
      createTime: new Date(createTs).toLocaleString(),
      updateTime: new Date(updateTs).toLocaleString(),
      acceptTime: new Date(acceptTs).toLocaleString(),
      expectFinishTime: new Date(expectFinishTs).toLocaleString(),
      actualFinishTime: actualFinishTs ? new Date(actualFinishTs).toLocaleString() : '',
      handleDuration: (Math.random() * 48).toFixed(2),
      overTimeFlag: booleanList[Math.floor(Math.random() * 2)],
      closeUserName: closeTs ? ['管理员A', '管理员B'][Math.floor(Math.random() * 2)] : '',
      closeTime: closeTs ? new Date(closeTs).toLocaleString() : '',
      closeReason: closeTs ? '问题已修复，客户确认完成' : '',
      satisfaction: actualFinishTs ? satisfactionList[Math.floor(Math.random() * satisfactionList.length)] : '',
      evaluateContent: actualFinishTs ? '处理速度较快，解决了我的问题。' : '',
      tagList: ['线上故障', '紧急'].slice(0, Math.floor(Math.random() * 2) + 1),
      prevHandlerName: Math.random() > 0.6 ? ['老处理员1', '老处理员2'][Math.floor(Math.random() * 2)] : '',
      transferCount: Math.floor(Math.random() * 4),
      isTransfer: booleanList[Math.floor(Math.random() * 2)],
      isRepeat: booleanList[Math.floor(Math.random() * 2)],
      parentTicketNo: Math.random() > 0.7 ? `WD${String(i + 100).padStart(8, '0')}` : '',
      childTicketCount: Math.floor(Math.random() * 5),
      remark: Math.random() > 0.4 ? '需要持续跟进客户反馈' : '',
    }
    result.push(item)
  }
  return result
}

const tableData = ref([...generateTicketList(10)])


onMounted(() => {
})

onUnmounted(() => {
})
</script>

<style lang="scss" scoped>
.home-view {
  //padding: 24px;
  //background-color: #f5f7fa;
  min-height: 100%;
  height: 100%;
  flex: 1;

  .table-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
    padding: 16px;
    height: 100%;
  }
}
</style>
