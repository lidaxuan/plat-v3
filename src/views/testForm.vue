<template>
  <div class="generated-form-page">
    <el-card class="generated-form-card" shadow="hover" header="表单">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="userName" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入userName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="mobile" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入mobile" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="age" prop="age">
              <el-input-number v-model="form.age" placeholder="请输入age" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="status" prop="status">
              <el-select v-model="form.status" placeholder="请选择status" style="width: 100%">
                <el-option label="ENABLE" :value="&quot;ENABLE&quot;" />
                <el-option label="DISABLE" :value="&quot;DISABLE&quot;" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="tags" prop="tags">
              <el-select v-model="form.tags" multiple collapse-tags collapse-tags-tooltip placeholder="请选择tags" style="width: 100%">
                <el-option label="A" :value="&quot;A&quot;" />
                <el-option label="B" :value="&quot;B&quot;" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider content-position="left">list</el-divider>
            <div
                    v-for="(item, idx) in form.list"
                    :key="idx"
                    class="array-item"
            >
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="a" prop="list.${idx}.a" :rules="[{ required: true, message: '请输入a', trigger: 'blur' }]">
                    <el-input-number v-model="item.a" placeholder="请输入a" controls-position="right" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="b" prop="list.${idx}.b" :rules="[{ required: true, message: '请输入b', trigger: 'blur' }]">
                    <el-input-number v-model="item.b" placeholder="请输入b" controls-position="right" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="c" prop="list.${idx}.c">
                    <el-input-number v-model="item.c" placeholder="请输入c" controls-position="right" style="width: 100%" />
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="array-item-footer">
                <el-button type="danger" plain size="small" @click="removeListItem(idx)">删除此行</el-button>
              </div>
            </div>
            <el-button class="add-btn" size="small" @click="addListItem">新增一行</el-button>
          </el-col>
          <el-col :span="12">
            <el-form-item label="enable" prop="enable">
              <el-switch v-model="form.enable" active-text="开启" inactive-text="关闭" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="createTime" prop="createTime">
              <el-date-picker v-model="form.createTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择createTime" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="remark" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入remark" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="form-actions">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
const statusOptions = ["ENABLE","DISABLE"]
const tagsOptions = ["A","B"]
const formRef = ref(null)

const form = reactive({  userName: '',
  mobile: '',
  age: undefined,
  status: '',
  tags: [],
  list: [
    {
      a: undefined,
      b: undefined,
      c: undefined
    }
  ],
  enable: false,
  createTime: '',
  remark: ''})

const rules = {
  userName: [{ required: true, message: '请输入userName', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入mobile', trigger: 'blur' }],
  age: [{ required: true, message: '请输入age', trigger: 'blur' }],
  status: [{ required: true, message: '请选择status', trigger: 'change' }]
}

function addListItem() {
  form.list.push({ a: undefined, b: undefined, c: undefined })
}
function removeListItem(index) {
  form.list.splice(index, 1)
}
async function submit() {
  try {
    await formRef.value.validate()
    console.log('submit:', form)
    ElMessage.success('校验通过')
  } catch (e) {
    ElMessage.warning('请先完善必填项')
  }
}

function reset() {
  formRef.value?.resetFields()
}
</script>

<style scoped>
/* 页面容器：居中 + 轻灰背景 */
.generated-form-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100%;
}

/* 表单卡片 */
.generated-form-card {
  max-width: 1080px;
  margin: 0 auto;
  border-radius: 8px;
  border: none;
}

.generated-form-card :deep(.el-card__header) {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 1px solid #f0f0f0;
}

/* 数组块：卡片化（浅灰底 + 虚线边框 + 内边距） */
.array-item {
  position: relative;
  padding: 16px 16px 48px;
  margin-bottom: 12px;
  background: #fafbfc;
  border: 1px dashed #e4e7ed;
  border-radius: 6px;
}

.array-item-footer {
  position: absolute;
  right: 12px;
  bottom: 10px;
}

/* 新增按钮：全宽虚线 */
.add-btn {
  margin-top: 4px;
  border-style: dashed;
  width: 100%;
}

/* 按钮区：右对齐 + 顶部分割线 */
.form-actions {
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}
</style>
