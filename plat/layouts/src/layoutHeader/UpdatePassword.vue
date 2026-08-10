<!--
 * @Author: 段丽军
 * @Date: 2021-08-18 11:00:41
 * @LastEditTime: 2023-07-18 14:37:14
 * @LastEditors: 李大玄
 * @Description:
 * @FilePath: /framework/ui/components/layouts/src/layoutHeader/UpdatePassword.vue
-->
<template>
  <el-drawer
    :visible.sync="visible"
    :show-close="showClose"
    title="修改密码"
    titleIcon="icon-E-E13"
    footerBtnPosition="right"
    :append-to-body="true"
    :before-close="closeMsg"
    size="552px"
  >
    <el-form :model="form" ref="form" :rules="rules" size="small" label-position="top">
      <el-form-item prop="oldPassword" label="原密码">
        <el-input v-model="form.oldPassword" type="password" min-length="6" max-length="20" placeholder="请输入原密码" />
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码">
        <el-input v-model="form.newPassword" type="password" min-length="6" max-length="20" placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item prop="confirmPassword" label="确认密码">
        <el-input v-model="form.confirmPassword" type="password" min-length="6" max-length="20" placeholder="请输入确认密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <e-button-n size="default" v-if="showClose" min-width @click="closeMsg">取消</e-button-n>
      <e-button-n size="default" :loading="submitLoading" type="primary" min-width @click="submit">确定</e-button-n>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import EWebPlat from '../../../index'


const visible = ref(false)
const showClose = ref(true)
const form = ref({
  oldPassword: undefined as string | undefined,
  newPassword: undefined as string | undefined,
  confirmPassword: undefined as string | undefined,
})
const rules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
}
const submitLoading = ref(false)



const checkMsg = () => {
  const f = form.value
  const newPassword = (f.newPassword || '').trim()

  if (newPassword.length < 6) {
    return false
  }
  if (newPassword.length > 20) {
    return false
  }
  if (newPassword.includes('#') || newPassword.includes(' ')) {
    return false
  }
  if (newPassword !== (f.confirmPassword || '').trim()) {
    return false
  }
  return true
}

const submit = async () => {
  const formRef = (window as any).$refs?.form
  if (!formRef) return
  const valid2 = await new Promise((resolve) => formRef.validate((valid: boolean) => resolve(valid)))
  if (!valid2 || !checkMsg()) {
    return
  }

  const f = form.value
  const params = {
    oldPassword: (f.oldPassword || '').trim(),
    newPassword: (f.newPassword || '').trim(),
  }

  submitLoading.value = true
  let res: any
  try {
    res = await EWebPlat.platService(EWebPlat.platConfig.apiMap?.updatePassword as any, params)
    submitLoading.value = false
  } catch (error) {
    submitLoading.value = false
    console.error(error)
    return
  }
  if (!(res && (res.status == 1 || res.code == 0))) {
    return
  }
  close()
}

const closeMsg = () => {
  if (!showClose.value) {
    return
  }
  const { $confirm } = window as any
  if ($confirm) {
    $confirm('确认取消操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        close()
      })
      .catch(() => {})
  }
}

const close = () => {
  form.value = {
    oldPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined,
  }
  const formRef = (window as any).$refs?.form
  if (formRef) formRef.resetFields()
  visible.value = false
  EWebPlat.updatePassword({
    visible: false,
    showClose: true,
  })
}
</script>

<style lang="scss" scoped>
.task-item + .task-item {
  margin-top: 15px;
}
</style>
