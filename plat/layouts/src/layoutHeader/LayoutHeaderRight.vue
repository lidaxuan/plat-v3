<!--
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-08-05 18:34:53
 * @FilePath: plat/layouts/src/layoutHeader/LayoutHeaderRight.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-08-05 18:34:53
-->
<template>
  <div class="flex ai-center">
    <slot name="actionBar"></slot>
    <icon-class :title="isFullscreen ? '全屏' : '取消全屏'" class="mr-40 cursor-p" :icon-class="isFullscreen ? 'icon-C-C6' : 'icon-C-C7'"
                @iconClick="isScreenFull" color="var(--layoutTopMenuCol)" font="24"/>

    <icon-class class="mr-44 cursor-p" icon-class="icon-C-C13" @iconClick="settingFun" font="24" color="var(--layoutTopMenuCol)"/>

    <div class="avatar-box mr-12" :class="loginStatus + '-status'">
      <div v-if="appConfig.avatarSrc" class="">
        <img style="border-radius: 50%; object-fit: cover" size="medium" class="w-32 h-32" :src="appConfig.avatarSrc"/>
      </div>

      <el-button v-else-if="!appConfig.avatarSrc && getUserName" type="primary" size="mini" font="14" class="w-32 h-32" circle>
        {{ getUserName ? getUserName.charAt(0) : "" }}
      </el-button>
    </div>

    <el-dropdown trigger="click" @command="handleCommand">
      <div class="el-dropdown-link">
        {{ getUserName || "" }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <div class="w-232 pt-15" v-if="getUserName">
            <div align="center" class="el-dropdown-name" font="16">{{ getUserName }}</div>
            <div align="center" class="ptb-5 el-dropdown-easyChat" font="12">{{ getCompany }}</div>
          </div>
          <el-dropdown-item v-for="item in dropdown" :key="item.id" :command="item.id" divided
                            style="font-weight: 600" class="flex ai-center pl-25" font="12" :class="{ 'status-active': item.id == loginStatus }"
                            :style="`cursor: ${item.disabled ? 'not-allowed' : 'pointer'}; color: ${item.disabled ? '#bbb' : ''}`">
            <icon-class :icon-class="item.icon" :font="item.font || '12'" color="var(&#45;&#45;layoutTopMenuCol)"/>
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!--    <UpdatePassword ref="UpdatePassword" />-->

    <el-drawer v-model="settingLayout" title="系统主题设置" size="396px" append-to-body footerBtnPosition="right"
               titleIconBg="var(--layoutMain-6359CA)" titleIcon="icon-E-E22" :isFooter="false" :contentPadding="false"
    >
      <LayoutSetting/>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {useUserStore} from '../../../store/useUserStore'
import UpdatePassword from './UpdatePassword.vue'
import EWebPlat from '../../../index'
import LayoutSetting from '../layoutSetting/index.vue'
import {useSystemConfig} from "../../../store/systemConfig";

const userStore = useUserStore()
const systemConfig = useSystemConfig()

const userMsg = computed(() => systemConfig.userMsg)
const appConfig = computed(() => systemConfig.appConfig)
const settingLayout = ref(false)


const getUserName = computed(() => {
  if (userMsg.value && (userMsg.value as any).realName) {
    return (userMsg.value as any).realName
  }
  // if (EWebPlat.platConfig?.obtainUserName) {
  //   return EWebPlat.platConfig.obtainUserName(userMsg.value) || '--'
  // }
  return ''
})

const getCompany = computed(() => {
  if (EWebPlat.platConfig?.obtainCompanyName) {
    return EWebPlat.platConfig.obtainCompanyName(userMsg.value) || '--'
  }
  return ''
})

const isFullscreen = ref(true)

const loginStatus = ref('')

const emit = defineEmits<{
  (e: 'setting', v: boolean): void
  (e: 'dropdownHandleCommand', command: string): void
}>()

const dropdown = computed(() => {

  // ([{id: '2', name: '修改密码', icon: 'icon-C-C8'}]) as any[]
  return systemConfig.handleDropdownList
})

const isScreenFull = () => {
  // if (!screenfull.isEnabled) {
  //   return false
  // }
  // screenfull.toggle()
  // isFullscreen.value = screenfull.isFullscreen
}

const settingFun = () => {
  settingLayout.value = true;
}

const handleCommand = (command: string) => {
  if (command === '2') {
    EWebPlat.updatePassword({visible: true, showClose: true})
  } else if (dropdown.value.map((item: any) => item.id).includes(command)) {
    if (command == loginStatus.value) {
      return
    }
    if ((EWebPlat as any).dropdownHandleCommand) {
      (EWebPlat as any).dropdownHandleCommand(command);
    }
  } else {
    emit('dropdownHandleCommand', command)
    if ((EWebPlat as any).dropdownHandleCommand) {
      (EWebPlat as any).dropdownHandleCommand(command);
    }
  }
}

onMounted(() => {

  (window as any).EWebPlat.setLoginStatus = (status: number) => {
    const obj: Record<number, string> = {
      1: 'userStatusOnline',
      2: 'userStatusBusy',
      3: 'userStatusLeave'
    }
    loginStatus.value = obj[status]
  }
  (window as any).EWebPlat.windowLogout = () => {
    // auth.jumpLogin({type: 'first'})
  }
})
</script>

<style lang="scss" scoped>
//@import "../../../assets/base/common/index";

.el-dropdown-link {
  color: var(--layoutTopMenuCol);
}

.el-dropdown-menu {
  border: none;

  .el-dropdown-name {
    font-weight: 600;
    //color: $-color-344563;
  }

  .el-dropdown-easyChat {
    font-weight: 400;
    color: #7e84a3;
  }

  .el-dropdown-menu__item {
    font-weight: 500;
    //color: $-color-344563;
  }


}

.avatar-box {
  position: relative;

  &:after {
    position: absolute;
    content: " ";
    display: block;
    bottom: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  &.userStatusOnline-status:after {
    background: #42d92a !important;
  }

  &.userStatusBusy-status:after {
    background: #f86b4f !important;
  }

  &.userStatusLeave-status:after {
    background: #7d8dbf !important;
  }
}


.userStatusOnline {
  background: #42d92a !important;
}

.userStatusBusy {
  background: #f86b4f !important;
}

.userStatusLeave {
  background: #7d8dbf !important;
}

.userStatusLeave {
  &::before {
    content: " ";
    background: #7D8DBF;
  }
}

</style>
