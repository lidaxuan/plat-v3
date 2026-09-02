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

/* ==================== Mixins ==================== */

// 右侧竖线指示器
@mixin line-indicator($right: 0px, $color: var(--layoutSideMenuSelected)) {
  content: " ";
  width: 2px;
  height: 20px;
  position: absolute;
  right: $right;
  top: 12px;
  background-color: $color;
}

// 图标圆角
@mixin icon-rounded {
  border-radius: $icon-radius;
}

// 图标悬停底色
@mixin icon-hover-bg {
  @include icon-rounded;
  background: var(--layoutSideMenuColorF9F8FD) !important;
}

// 图标选中色
@mixin icon-selected {
  color: var(--layoutSideMenuSelected) !important;
}

// 图标选中 + 圆角
@mixin icon-selected-rounded {
  @include icon-selected;
  @include icon-rounded;
}

// 收起态图标悬停
@mixin icon-collapse-hover {
  @include icon-selected;
  @include icon-rounded;
  background: var(--layoutSideMenuColorF9F8FD-rgba) !important;
}

// 文字悬停态
@mixin text-hover {
  color: var(--layoutSideMenuColor344563);
  span {
    color: var(--layoutSideMenuColor344563) !important;
    font-weight: 600 !important;
  }
}

// 子菜单标题文字颜色
@mixin submenu-title-color {
  :deep(.el-submenu__title) {
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

// 各级菜单项 hover/focus 通用样式
@mixin level-hover {
  &:focus {
    background: none;
  }

  &:hover {
    @include text-hover;
    background: none !important;

    .iconfont {
      @include icon-hover-bg;
    }
  }
}

// 为指定层级生成完整样式
@mixin level-styles($step) {
  .level#{$step} {
    @include submenu-title-color;
  }

  .itemDom#{$step} {
    padding-left: 3px;
  }

  .dom#{$step},
  .item#{$step},
  .itemDom#{$step} {
    @include level-hover;
  }
}

/* ==================== 多级菜单缩进（level1-5） ==================== */

@for $step from 1 through 5 {
  .level#{$step} {
    .dom#{$step},
    .item#{$step} {
      padding-left: $step * 20 + 23px;
    }
  }
  @include level-styles($step);
}

/* ==================== 菜单树容器 ==================== */

.el-menu {

  .menutree {
    :deep(.el-submenu__title),
    :deep(.el-menu-item) {
      text-align: left;
      height: 44px;
      line-height: 44px;
    }

    .el-menu--inline .is-disabled {
      display: none;
    }

    .el-submenu .el-menu-item {
      padding: 0;
      transition: none;
      min-width: 183px;
      border-radius: $menu-item-radius;

      .title {
        color: var(--layoutSideMenuColor7E84A3);
        font-weight: 500;
      }

      &.is-active {
        background: var(--layoutSideMenuSelected) !important;
        margin-right: 10px;

        &:after {
          @include line-indicator(-10px);
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

    :deep(.el-menu-item) {
      border-radius: $menu-item-radius;


      &.is-active {
        background: var(--layoutSideMenuSelected) !important;
        margin-right: 10px;

        .title {
          color: var(--layoutSideMenuColorFFF) !important;
        }

        &:after {
          @include line-indicator(-10px);
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
  }
}


.menutree {
  .el-sub-menu span,
  .el-menu-item span {
    color: var(--layoutSideMenuColor7E84A3);
    font-weight: 500;
  }

  // ===== 一级菜单（有子级） =====

  .level0 {
    margin-bottom: 10px;

    :deep(.el-submenu__title:hover) {
      background-color: var(--layoutSideMenuColorF9F8FD-rgba) !important;
    }

    :deep(.el-submenu__title i) {
      color: var(--layoutSideMenuColorArrow);
    }

    .dom0:hover {
      color: var(--layoutSideMenuSelected) !important;

      .line {
        @include line-indicator(0px, var(--layoutSideMenuColorF9F8FD-rgba));
      }
    }

    &.is-active,
    &.is-active.is-opened {
      .dom0 span {
        color: var(--layoutSideMenuSelected);
      }

      .el-submenu__title {
        &:hover {
          background-color: var(--layoutSideMenuColorFFF);
        }

        &:focus span,
        &:hover span,
        &:focus i,
        &:hover i {
          color: #344563;
        }
      }

      :deep(.el-submenu__title .iconfont) {
        @include icon-selected-rounded;
      }
    }
  }

  // ===== 一级菜单（无子级） =====

  .item0 {
    padding-left: 0px !important;
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
        @include icon-selected-rounded;
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
          @include line-indicator(0px);
        }
      }
    }
  }
  :deep(.el-sub-menu .el-sub-menu__title) {
    &:hover {
      background-color: var(--layoutSideMenuColorF9F8FD-rgba);
      border-radius: $menu-item-radius;
      margin-right: 10px !important;
      i {
        color: var(--layoutSideMenuColor344563);
      }
    }
  }

  .itemDom1 {
    i {
      display: none;
    }
  }
}

/* ==================== 收起状态 ==================== */
:deep(.el-menu--collapse) {
  width: 66px !important;
}

.el-menu--collapse {

  .level0 {
    .dom0 {
      border-radius: 0;
      background: none !important;

      &:hover {
        .iconfont,
        i {
          @include icon-collapse-hover;
        }
      }
    }

    &.is-active,
    &.is-active.is-opened {
      .el-submenu__title {
        span,
        i {
          @include icon-selected;
        }

        .dom0 {
          background: none !important;
          min-width: 183px;

          &:hover .iconfont {
            @include icon-rounded;
          }
        }
      }

      :deep(.el-submenu__title .iconfont) {
        @include icon-rounded;
      }
    }
  }
}
</style>
