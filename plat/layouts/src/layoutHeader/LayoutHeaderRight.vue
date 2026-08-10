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

    <!--    <el-dropdown class="mr-14" trigger="click" @command="handleCommand">

          <el-dropdown-menu slot="dropdown" class="p-0 popoverCard">
            <div class="w-232 pt-15" v-if="getUserName">
              <div align="center" class="el-dropdown-name" font="16">{{ getUserName }}</div>
              <div align="center" class="ptb-5 el-dropdown-easyChat" font="12">{{ getCompany }}</div>
            </div>

            <el-dropdown-item
                    v-for="item in dropdown"
                    :key="item.id"
                    style="font-weight: 600"
                    class="flex ai-center pl-55"
                    font="12"
                    :command="item.id"
                    divided
                    :class="{ 'status-active': item.id == loginStatus }"
                    :style="`cursor: ${item.disabled ? 'not-allowed' : 'pointer'}; color: ${item.disabled ? '#bbb' : ''}`"
            >
              <icon-class :icon-class="item.icon" :font="item.font || '12'" color="var(&#45;&#45;layoutTopMenuCol)"/>
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->


    <el-dropdown>
      <div class="el-dropdown-link">
        {{ getUserName || "" }}123
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item disabled>双皮奶</el-dropdown-item>
          <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
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
const dropdown = ref<any[]>([])
const loginStatusList = [
  {id: 'userStatusOnline', name: '在线', icon: 'icon-statua userStatusOnline', disabled: false},
  {id: 'userStatusBusy', name: '忙碌', icon: 'icon-statua userStatusBusy', disabled: false},
  {id: 'userStatusLeave', name: '离开', icon: 'icon-statua userStatusLeave', disabled: false}
]
const loginStatus = ref('')

const emit = defineEmits<{
  (e: 'setting', v: boolean): void
  (e: 'dropdownHandleCommand', command: string): void
}>()

const getDropdownList = (list: any[] = []) => {
  dropdown.value = [].concat(
          EWebPlat.platConfig.showLoginStatus ? loginStatusList : [],
          EWebPlat.platConfig.uiDropdown || {id: '2', name: '修改密码', icon: 'icon-C-C8'},
          list
  ) as any[]
}

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
      ;(EWebPlat as any).dropdownHandleCommand(command)
    }
  } else {
    emit('dropdownHandleCommand', command)
    if ((EWebPlat as any).dropdownHandleCommand) {
      ;(EWebPlat as any).dropdownHandleCommand(command)
    }
  }
}

onMounted(() => {
  (window as any).EWebPlat.updateDropdownList = (list: any) => {
    getDropdownList(list || userStore.logoutBtns)
  }
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
  getDropdownList(userStore.logoutBtns)
  if (userStore.loginStatus) {
    ;(window as any).EWebPlat.setLoginStatus(userStore.loginStatus)
  }
})
</script>

<style lang="scss" scoped>
@import "../../../assets/base/common/index";

.popoverCard.el-popper[x-placement^="bottom"] .popper__arrow {
  display: none !important;
}

.popoverCard.el-popper[x-placement^="bottom"] {
  margin-top: 18px !important;
}

.popoverCard.el-popper {
  top: 50px !important;
}

::v-deep .el-badge__content.is-fixed {
  top: 22px;
  right: 13px;
}

.el-dropdown-menu--medium .el-dropdown-menu__item.el-dropdown-menu__item--divided {
  margin-top: 0px;
}

.el-dropdown-menu__item i {
  margin-right: 8px;
}

.el-dropdown-menu--medium .el-dropdown-menu__item.el-dropdown-menu__item--divided:before {
  height: 0;
}

.el-dropdown-menu--medium .el-dropdown-menu__item {
  line-height: 37px;
  height: 37px;
}

.el-dropdown-link {
  color: var(--layoutTopMenuCol);
}

.btnName,
.btnName:hover,
.btnName:focus {
  background-color: var(--layoutTopMenuBtn);
  border-color: var(--layoutTopMenuBtn);
  color: var(--layoutTopMenuBtnCol);
}

.el-dropdown-menu {
  border: none;

  .el-dropdown-name {
    font-weight: 600;
    color: $-color-344563;
  }

  .el-dropdown-easyChat {
    font-weight: 400;
    color: #7e84a3;
  }

  .el-dropdown-menu__item {
    font-weight: 500;
    color: $-color-344563;
  }

  .el-dropdown-menu__item:not(.is-disabled):hover,
  .el-dropdown-menu__item:focus {
    background-color: var(--layoutMain-6359CA);
    color: $-color-ffffff;
    border-radius: 1px;

    &:hover ::v-deep i {
      color: $-color-ffffff !important;
    }
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

.status-active {
  background-color: var(--layoutMain-6359CA);
  color: #fff !important;
}

.icon-statua {
  width: 12px;
  height: 12px;
  border-radius: 50%;
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
</style>
