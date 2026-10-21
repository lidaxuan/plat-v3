<!--
 * @Description: 问题分类
 * @Author: lijixuan
 * @Date: 2026-10-13 11:05:31
 * @FilePath: src/views/systemSetting/problemCategory/index.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-10-13 11:05:31
-->
<template>
  <div class="problem-category">
    <div class="page-tip">初始分类来自桌面技术输入表：8个一级、62个二级；另补充“杀毒软件拦截”“缓存空间问题”2项。分类可停用，不物理删除，历史工单保留原分类快照。</div>

    <div class="flex" style="height: calc(100% - 50px)">
      <div class="left flex flex-column mr-20">
        <div class="title flex jc-between ai-center">
          一级问题
          <el-icon @click="addFirstQuestion">
            <Plus/>
          </el-icon>
        </div>
        <div class="question-list flex-1">
          <div v-for="(item, index) in questionList" :key="index" class="question-item" @click="handleClick(item)" :class="{'active': firstQuestionItem?.id === item.id}">
            <div class="w-80">{{ item.name }}</div>
            {{ item.nums }}
          </div>
        </div>
      </div>

      <div class="right flex-1">
        <div class="title">
          <div class="top flex jc-between ai-center">
            <div class="name">
              {{ firstQuestionItem?.name || '一级问题' }}
            </div>

            <div class="left-btns">
              <el-button type="primary">编辑一级</el-button>
              <el-button type="primary">停用一级</el-button>
              <el-button type="primary">新增子问题</el-button>
            </div>
          </div>
          <div class="tip" v-if="firstQuestionItem?.nums">
            {{ firstQuestionItem?.nums }} 个子问题 · 修改分类名称不覆盖历史工单
          </div>
        </div>

        <div class="second-question-list">
          <div v-for="(item, index) in secondQuestionList" :key="index" class="question-item flex jc-between ai-center">
            <div class="title">
              <div class="w-80">{{ item.title }}</div>
              <div class="desc">{{ item.desc }}</div>
            </div>
            <div class="handle">
              <el-button type="text">编辑</el-button>
              <el-button type="text">停用</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <e-dialog-sp title="新增一级问题" v-model="dialogVisible">
      <el-form ref="form" :model="createForm" label-width="120px" :rules="rules">
        <el-form-item label="问题分类名称" prop="title">
          <el-input v-model="createForm.title"></el-input>

          <div class="tip">新工单使用最新分类；已提交工单保留当时的分类文字，避免历史内容丢失。</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="dialogVisible = false">确定</el-button>
      </template>
    </e-dialog-sp>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, watch, onMounted, onUnmounted} from 'vue'

const questionList = ref([
  {name: '问题分类1', nums: 10, id: 1},
  {name: '问题分类2', nums: 20, id: 2},
  {name: '问题分类3', nums: 30, id: 3},
  {name: '问题分类4', nums: 30, id: 4},
  {name: '问题分类5', nums: 30, id: 5},
  {name: '问题分类6', nums: 30, id: 6},
  {name: '问题分类7', nums: 30, id: 7},
  {name: '问题分类8', nums: 30, id: 8},
  {name: '问题分类9', nums: 30, id: 9},
  {name: '问题分类10', nums: 30, id: 10},
  {name: '问题分类11', nums: 30, id: 11},
  {name: '问题分类12', nums: 30, id: 12},
  {name: '问题分类13', nums: 30, id: 13},
])

const firstQuestionItem = ref<any>(null)

const secondQuestionList = ref([
  {title: '子问题1', desc: '这是子问题1', id: 1},
  {title: '子问题2', desc: '这是子问题2', id: 2},
  {title: '子问题3', desc: '这是子问题3', id: 3},
  {title: '子问题4', desc: '这是子问题4', id: 4},
  {title: '子问题5', desc: '这是子问题5', id: 5},
  {title: '子问题6', desc: '这是子问题6', id: 6},
  {title: '子问题7', desc: '这是子问题7', id: 7},
  {title: '子问题8', desc: '这是子问题8', id: 8},
  {title: '子问题9', desc: '这是子问题9', id: 9},
  {title: '子问题10', desc: '这是子问题10', id: 10},
])

const dialogVisible = ref(false)
const createForm = reactive({
  title: ''
})

const rules = {
  title: [
    {required: true, message: '请输入问题分类名称', trigger: 'blur'}
  ]
}


// 方法
function handleClick(item: any) {
  firstQuestionItem.value = item
}

function addFirstQuestion() {
}


</script>

<style scoped>
.problem-category {
  background: #fff;

  .page-tip {
    padding: 10px;
    color: #505050;
    font-size: 14px;
    background: #f9f9f9;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .left {
    width: 200px;
    background: #fff;
    border-radius: 4px;
    height: 100%;
    .title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 10px;
    }

    .question-list {
      overflow-y: auto;
      height: 100%;

      .question-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 10px;
        font-size: 14px;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s;
        &:hover {
          background-color: #edf3ff;
          color: #2665ed;
        }

        &.active {
          background-color: #edf3ff;
          color: #2665ed;
        }
      }
    }
  }

  .right {
    .second-question-list {
      overflow-y: auto;
      height: 100%;
      .question-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 10px;
        font-size: 14px;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s;
        &:hover {
          background-color: #edf3ff;
        }
        .title {
          font-size: 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s;
          &:hover {
            background-color: #edf3ff;
          }
        }
      }
    }

  }
}
</style>
