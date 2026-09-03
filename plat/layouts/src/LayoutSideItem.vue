<!--
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-08-11 09:59:24
 * @FilePath: plat/layouts/src/LayoutSideItem.vue
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-08-11 09:59:24
-->
<template>
  <!--    el-menu--collapse类要判断  不然功能会缺失-->
  <div class="menutree">
    <template v-for="menu in menuData" :key="menu.id">
      <el-sub-menu :key="menu.id" :index="menu.code" v-if="menu.children && menu.children.length" :class="['level' + menu.level]">
        <template #title>
          <div :class="['dom' + menu.level, 'mr-10', ]" height="100%">
            <icon-class :class="{'p-7': menu.icon ? true: false}" :icon-class="menu.icon || ''" font="18" color="var(--layoutSideMenuColor7E84A3)"/>
            <span class="ellipsis w-120 d-inline-block" v-if="!isCollapse" :class="[systemConfig.layoutConfig.menuLayout == 1 ? 'pl-17' : 'pl-7']">{{ menu.name }}</span>
            <div class="line"></div>
          </div>
        </template>
        <!--  递归-->
        <LayoutSideItem :menuData="menu.children"></LayoutSideItem>
      </el-sub-menu>
      <el-menu-item :key="menu.id" :index="menu.code" v-else :disabled="menu.disabled" :class="['item' + menu.level]">
        <div :class="['itemDom' + menu.level, (menu.level == '0' && systemConfig.layoutConfig.menuLayout == 1)  ? 'pl-29' : 'pl-19']" height="100%">
          <icon-class :class="{'p-7': menu.icon ? true: false}" v-if="menu.icon" :icon-class="menu.icon || ''" font="18"/>
          <span class="ellipsis w-120" v-if="!isCollapse" :class="[(systemConfig.layoutConfig.menuLayout == 1 && menu.level == 2) ? 'pl-17' : '']">{{ menu.name }}</span>
        </div>
        <div class="line"></div>
      </el-menu-item>
    </template>
  </div>
</template>


<script setup lang="ts">
import {computed, onMounted} from 'vue'
import {useSystemConfig} from "../../store/systemConfig";

const systemConfig = useSystemConfig();
defineProps<{
  menuData: any[]
  isCollapse?: boolean
}>()

const setIcon = (getEl: string, setEl: string) => {
  const downlist = document.querySelectorAll('.menutree .' + getEl)
  for (let i = 0; i < downlist.length; i++) {
    const down = downlist[i].getAttribute('class')
    const classVal = down!.replace(getEl, setEl)
    downlist[i].setAttribute('class', classVal)
  }
}

onMounted(() => {
  setIcon('el-icon-arrow-down', 'el-icon-caret-bottom')
  setIcon('el-icon-arrow-right', 'el-icon-caret-right')
})
</script>

<style lang="scss">
/* ==================== 全局样式（非 scoped） ==================== */

.el-menu--popup {
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.08);
  border-radius: 0px !important;
}

.el-menu--vertical ul {
  margin-left: 1px;
}

.el-menu--vertical .el-menu {
  background: none !important;
}
</style>

<style lang="scss" scoped>
/* ==================== 变量 ==================== */

$menu-item-radius: 0 14px 14px 0;
$icon-radius: 8px;
$line-w: 2px;
$line-h: 20px;
$line-top: 12px;

/* ==================== Mixins ==================== */

@mixin sub-title-base {
  :deep(.el-sub-menu__title) {
    span,
    i {
      color: var(--layoutSideMenuColor7E84A3) !important;
    }

    &:focus span,
    &:focus i,
    &:hover span,
    &:hover i {
      color: var(--layoutSideMenuColor344563);
    }
  }
}

@mixin level-hover($step) {
  .dom#{$step},
  .item#{$step},
  .itemDom#{$step} {
    &:focus {
      background: none;
    }

    &:hover {
      color: var(--layoutSideMenuColor344563);
      background: none !important;

      span {
        color: var(--layoutSideMenuColor344563) !important;
        font-weight: 600 !important;
      }

      .iconfont {
        background-color: var(--layoutSideMenuColorF9F8FD) !important;
        border-radius: $icon-radius;
      }
    }
  }

  .itemDom#{$step} {
    padding-left: 3px;
  }
}

/* ==================== 通用层级规则 ==================== */

@for $step from 1 through 5 {
  .level#{$step} {
    @include sub-title-base;

    .dom#{$step},
    .item#{$step} {
      padding-left: $step * 20 + 23px;
    }
  }

  @include level-hover($step);
}

:deep(.el-menu) {
  background: none;
}

.el-menu--collapse {
  width: 66px;

  @for $step from 1 through 5 {
    .item#{$step} {
      padding-left: 0 !important;
    }
  }
}

/* ==================== 菜单容器 ==================== */

.menutree {
  background-color: var(--layoutSideMenuBg);

  :deep(.el-sub-menu__title),
  :deep(.el-menu-item) {
    text-align: left;
    height: 44px;
    line-height: 44px;
  }

  .el-menu--inline .is-disabled {
    display: none;
  }

  .el-sub-menu span,
  .el-menu-item span {
    color: var(--layoutSideMenuColor7E84A3);
    font-weight: 500;
  }

  :deep(.el-menu-item) {
    padding: 0;
    transition: none;
    min-width: 183px;
    border-radius: $menu-item-radius;

    .itemDom2 span {
      margin-left: 7px;
    }

    &.is-active {
      background: var(--layoutSideMenuSelected) !important;
      margin-right: 10px;

      span {
        margin-top: -3px !important;
        color: var(--layoutSideMenuColorFFF) !important;
        font-weight: 600;
      }

      .line {
        width: $line-w;
        height: $line-h;
        position: absolute;
        right: -10px;
        top: $line-top;
        background-color: var(--layoutSideMenuSelected);
      }
    }

    &.is-disabled {
      border-radius: 1px;
      border-bottom: 1px solid #cecece;
      font-weight: 500;
      color: #1d212f;
      opacity: 1;
      text-align: left;
      margin-right: 0;
    }
  }

  /* ----- 第一级·有子菜单 ----- */
  .level0 {
    margin-bottom: 10px;

    :deep(.el-sub-menu__title) {
      margin-right: 10px;
      border-radius: $menu-item-radius;

      &:hover {
        background-color: var(--layoutSideMenuColorF9F8FD-rgba) !important;

        span {
          color: var(--layoutSideMenuColor344563);
        }
      }
    }

    :deep(.el-sub-menu__title i) {
      color: var(--layoutSideMenuColorArrow);
    }

    .dom0:hover .line {
      width: $line-w;
      height: $line-h;
      position: absolute;
      right: 0;
      top: $line-top;
      background-color: var(--layoutSideMenuColorF9F8FD-rgba);
    }

    &.is-active,
    &.is-active.is-opened {
      .dom0 span {
        color: var(--layoutSideMenuSelected);
      }

      .el-sub-menu__title:hover {
        background-color: var(--layoutSideMenuColorFFF);
      }

      :deep(.el-sub-menu__title .iconfont) {
        color: var(--layoutSideMenuSelected) !important;
        border-radius: $icon-radius;
      }
    }

    /* 收起态 */
    .el-menu--collapse & {
      .dom0 {
        border-radius: 0;
        background: none !important;

        &:hover {
          .iconfont,
          i {
            color: var(--layoutSideMenuSelected) !important;
            background: var(--layoutSideMenuColorF9F8FD-rgba) !important;
            border-radius: $icon-radius;
          }
        }
      }

      &.is-active,
      &.is-active.is-opened {
        .el-sub-menu__title {
          span,
          i {
            color: var(--layoutSideMenuSelected) !important;
          }

          .dom0 {
            background: none !important;
            min-width: 183px;

            &:hover .iconfont {
              border-radius: $icon-radius;
            }
          }
        }

        :deep(.el-sub-menu__title .iconfont) {
          border-radius: $icon-radius;
        }
      }
    }
  }

  /* ----- 第一级·无子菜单 ----- */
  .item0 {
    padding-left: 0 !important;
    margin-bottom: 10px;

    span {
      padding-left: 7px !important;
    }

    &:focus {
      background: none;
    }

    &:hover {
      background-color: var(--layoutSideMenuColorF9F8FD-rgba);
      border-radius: $menu-item-radius;
      margin-right: 10px !important;

      span,
      i {
        color: var(--layoutSideMenuColor344563);
      }

      span {
        font-weight: 600;
      }

      .iconfont {
        color: var(--layoutSideMenuSelected) !important;
        border-radius: $icon-radius;
      }
    }

    .itemDom0 i {
      color: var(--layoutSideMenuColor7E84A3) !important;
    }

    &.is-active {
      .itemDom0 {
        border-radius: $menu-item-radius;
        background-color: var(--layoutSideMenuSelected);

        span,
        i {
          color: var(--layoutSideMenuColorFFF) !important;
        }

        .line {
          width: $line-w;
          height: $line-h;
          position: absolute;
          right: 0;
          top: $line-top;
          background-color: var(--layoutSideMenuSelected);
        }
      }
    }

    /* 收起态 */
    .el-menu--collapse & {
      &:hover {
        .iconfont,
        i {
          color: var(--layoutSideMenuSelected) !important;
          background: var(--layoutSideMenuColorF9F8FD-rgba) !important;
          border-radius: $icon-radius;
        }
      }

      &.is-active {
        .itemDom0 {
          span,
          i {
            color: var(--layoutSideMenuColorFFF) !important;
          }

          .iconfont {
            background: var(--layoutSideMenuSelected) !important;
            border-radius: $icon-radius;
          }
        }
      }
    }
  }
}

/* ==================== 弹出层 ==================== */

.el-menu--vertical {
  @for $step from 1 through 4 {
    .dom#{$step} {
      padding-left: 20px !important;
    }

    .itemDom#{$step}:hover {
      background-color: var(--layoutSideMenuColorF9F8FD);
      border-radius: $menu-item-radius;
      margin-right: 10px;
    }
  }
}
</style>
