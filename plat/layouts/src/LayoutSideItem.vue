<template>
  <!--    el-menu--collapse类要判断  不然功能会缺失-->
  <div class="menutree">
    <template v-for="menu in menuData" :key="menu.id">
      <el-sub-menu :key="menu.id" :index="menu.code" v-if="menu.children && menu.children.length" :class="['level' + menu.level]">
        <template #title>
          <div :class="['dom' + menu.level, 'mr-10', ]" height="100%">
            <icon-class :class="{'p-7': menu.icon ? true: false}" :icon-class="menu.icon || ''" font="18" color="var(--layoutSideMenuColor7E84A3)"/>
            <span class="ellipsis w-120 d-inline-block" :class="[systemConfig.layoutConfig.menuLayout == 1 ? 'pl-17' : 'pl-7']">{{ menu.name }}</span>
            <div class="line d-i"></div>
          </div>
        </template>
        <!--  递归-->
        <LayoutSideItem :menuData="menu.children"></LayoutSideItem>
      </el-sub-menu>
      <el-menu-item :key="menu.id" :index="menu.code" v-else :disabled="menu.disabled" :class="['item' + menu.level]">
        <div :class="['itemDom' + menu.level, (menu.level == '0' && systemConfig.layoutConfig.menuLayout == 1)  ? 'pl-29' : 'pl-19']" height="100%">
          <icon-class :class="{'p-7': menu.icon ? true: false}" v-if="menu.icon" :icon-class="menu.icon || ''" font="18"/>
          <span class="ellipsis w-120 d-i" :class="[(systemConfig.layoutConfig.menuLayout == 1 && menu.level == 2) ? 'pl-17' : '']">{{ menu.name }}</span>
        </div>
        <div class="line d-i"></div>
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
@import "../../assets/base/common/index";

@mixin step() {
  ::v-deep .el-submenu__title {
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

    &:focus,
    &:hover {
      // background-color: var(--layoutSideMenuColorFFF) !important;
    }
  }
}

@mixin com($step) {
  .level#{$step} {
    @include step();
  }
  .itemDom#{$step} {
    padding-left: 3px;
  }
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
        // color: var(--layoutSideMenuSelected) !important;
        background-color: var(--layoutSideMenuColorF9F8FD) !important;
        border-radius: 8px;
      }
    }
  }
}

/*多级选中展开时*/
@for $step from 1 through 5 {
  .level#{$step} {
    .dom#{$step},
    .item#{$step} {
      padding-left: $step * 20+23px;
    }
  }
  @include com($step);
}

::v-deep .el-menu {
  background: none;
}

.menutree {
  background-color: var(--layoutSideMenuBg);

  .el-menu-item * {
    // vertical-align: top;
  }

  ::v-deep .el-submenu__title,
  ::v-deep .el-menu-item {
    text-align: left;
    height: 44px;
    line-height: 44px;
  }

  /*收起时 隐藏二级菜单中第一个*/
  .el-menu--inline .is-disabled {
    display: none;
  }

  .el-submenu span,
  .el-menu-item span {
    // padding-left: 10px;
    color: var(--layoutSideMenuColor7E84A3);
    font-weight: 500;
  }

  ::v-deep .el-menu-item {
    padding: 0;
    transition: none;
    min-width: 183px;
    border-radius: 0 14px 14px 0;

    .itemDom0 {

    }

    .itemDom1 {
      padding-left: 0; // 有个小差距
      span {
        // margin-left: 14px;
      }
    }

    .itemDom2 {
      span {
        margin-left: 7px;
      }
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
        width: 2px;
        height: 20px;
        position: absolute;
        right: -10px;
        top: 12px;
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

  ::v-deep .el-submenu__title {
    padding: 0 !important;

    &:hover {
      span,
      i {
        color: var(--layoutSideMenuColor344563);
      }

      span {
        font-weight: 600;
        color: var(--layoutSideMenuSelected) !important;
      }

      .iconfont {
        color: var(--layoutSideMenuSelected) !important;
        background: none;
        border-radius: 8px;
      }
    }
  }

  /*初始边距*/
  .level0 {
    margin-bottom: 10px;

    ::v-deep .el-submenu__title:hover {
      background-color: var(--layoutSideMenuColorF9F8FD-rgba) !important;
    }

    ::v-deep .el-submenu__title i {
      color: var(--layoutSideMenuColorArrow);
    }

    .dom0 {
      &:hover {
        color: var(--layoutSideMenuSelected) !important;

        .line {
          width: 2px;
          height: 20px;
          position: absolute;
          right: 0px;
          top: 12px;
          background-color: var(--layoutSideMenuColorF9F8FD-rgba);
        }
      }
    }

    /*选中展开时*/
    &.is-active,
    &.is-active.is-opened {
      .dom0 {
        span {
          color: var(--layoutSideMenuSelected);
        }


      }

      .el-submenu__title {
        &:hover {
          background-color: var(--layoutSideMenuColorFFF);
        }

        &:focus span,
        &:hover span,
        &:focus i,
        &:hover i {
          color: $-color-344563;
        }
      }

      ::v-deep .el-submenu__title .iconfont {
        color: var(--layoutSideMenuSelected) !important;
        border-radius: 8px;
      }

      // ::v-deep .el-submenu__title {
      //   span,
      //   i,
      //   &:hover span,
      //   &:focus span,
      //   &:hover i,
      //   &:focus i {
      //     // color: var(--layoutSideMenuColorFFF);
      //   }
      // }
    }
  }

  /*没有子级的第一级*/
  .item0 {
    padding-left: 0px !important;
    margin-bottom: 10px;
    // 因为有个问题 层级问题
    span {
      padding-left: 7px !important;
    }

    &:focus {
      background: none;
    }

    &:hover {
      background-color: var(--layoutSideMenuColorF9F8FD-rgba);
      border-radius: 0 14px 14px 0;
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
        border-radius: 8px;
      }
    }

    // 展开 一级 没有二级图标颜色
    .itemDom0 {
      i {
        color: var(--layoutSideMenuColor7E84A3) !important;
      }
    }

    &.is-active {
      .itemDom0 {
        border-radius: 0 14px 14px 0;
        background-color: var(--layoutSideMenuSelected);

        // 展开图标颜色
        span,
        i {
          color: var(--layoutSideMenuColorFFF) !important;
          // color: pink !important;
        }

        .line {
          width: 2px;
          height: 20px;
          position: absolute;
          right: 0px;
          top: 12px;
          background-color: var(--layoutSideMenuSelected);
        }
      }
    }
  }
}

/*收起*/
/*顺序不能乱*/
.el-menu--collapse {
  width: 66px;

  .level0 {
    .dom0 {
      border-radius: 0;
      background: none !important;

      &:hover {
        .iconfont,
        i {
          color: var(--layoutSideMenuSelected) !important;
          background: var(--layoutSideMenuColorF9F8FD-rgba) !important;
          border-radius: 8px;
        }
      }
    }

    &.is-active,
    &.is-active.is-opened {
      .el-submenu__title {
        span,
        i {
          color: var(--layoutSideMenuSelected) !important;
        }

        .dom0 {
          background: none !important;
          min-width: 183px;
          // 收起 鼠标移入
          &:hover {
            .iconfont {
              border-radius: 8px;
            }
          }
        }
      }

      ::v-deep .el-submenu__title .iconfont {
        border-radius: 8px;
      }
    }
  }

  @for $step from 1 through 5 {
    .item#{$step} {
      padding-left: 0px !important;
    }
  }
  /*没有子集*/
  .item0 {
    &:hover {
      .iconfont,
      i {
        color: var(--layoutSideMenuSelected) !important;
        background: var(--layoutSideMenuColorF9F8FD-rgba) !important;
        border-radius: 8px;
      }
    }

    &.is-active {
      .itemDom0 {
        span,
        i {
          color: var(--layoutSideMenuSelected) !important;
          color: var(--layoutSideMenuColorFFF) !important;
        }

        .iconfont {
          background: var(--layoutSideMenuSelected) !important;
          border-radius: 8px;
        }
      }
    }
  }
}

.el-menu--vertical {
  @for $step from 1 through 4 {
    .dom#{$step} {
      padding-left: 20px !important;
    }
    .itemDom#{$step} {
      padding-left: 0px !important;

      &:hover {
        background-color: $-color-F9F8FD;
        border-radius: 0 14px 14px 0;
        margin-right: 10px;
      }
    }
  }
}
</style>
