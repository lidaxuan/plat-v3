

<template>
  <div class="page">
    <div class="top">顶部，内容多少不确定</div>
    <div class="bottom height-auto">
      <div class="right">
        <div class="right-top height-auto" v-auto-height>
          顶部（自适应）<br />
          内容再多也不会撑破布局，超出会滚动。
        </div>
        <div class="right-bottom">底部，内容高度确定</div>
      </div>

      <div class="left">
        <div class="left-top">
          顶部，内容多少不确定 <br>
          顶部，内容多少不确定 <br>
          顶部，内容多少不确定 <br>
          顶部，内容多少不确定 <br>
          顶部，内容多少不确定 <br>
          顶部，内容多少不确定 <br>
          顶部，内容多少不确定 <br>
        </div>
        <div class="left-bottom height-auto" v-auto-height1>
          底部（自适应）<br />
          内容再多也不会撑破布局，超出会滚动。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const vAutoHeight = {
  mounted(el, binding) {
    const parent = el.parentElement
    if (!parent) return
    // 保存原样式，卸载时恢复
    el._prevStyle = {
      height: el.style.height,
      minHeight: el.style.minHeight,
    }
    const options = binding.value || {}
    const gap = options.gap || 0
    const offset = options.offset || 0
    const exclude = new Set(options.exclude || [])
    const calc = () => {
      const siblings = [...parent.children].filter(
              (child) => child !== el && !exclude.has(child)
      )
      const used = siblings.reduce((sum, child) => {
        const style = getComputedStyle(child)
        return (
                sum +
                child.offsetHeight +
                parseFloat(style.marginTop || 0) +
                parseFloat(style.marginBottom || 0)
        )
      }, 0)
      const h = parent.clientHeight - used - gap - offset
      el.style.height = Math.max(h, 0) + 'px'
      el.style.minHeight = '0'
    }
    const ro = new ResizeObserver(calc)
    ro.observe(parent)
    ;[...parent.children].forEach((c) => ro.observe(c))
    const mo = new MutationObserver(calc)
    mo.observe(parent, { subtree: true, childList: true, attributes: true })
    el._ro = ro
    el._mo = mo
    el._bindingValue = binding.value
    calc()
  },
  updated(el, binding) {
    el._bindingValue = binding.value
    el._ro?.disconnect()
    el._mo?.disconnect()
    vAutoHeight.mounted(el, binding)
  },
  unmounted(el) {
    el._ro?.disconnect()
    el._mo?.disconnect()
    if (el._prevStyle) {
      el.style.height = el._prevStyle.height
      el.style.minHeight = el._prevStyle.minHeight
    }
  },
}

import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import {useRouter} from "vue-router";


// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})

onUnmounted(() => {
  console.log('组件已卸载')
})
</script>

<style scoped>

/* ============ 1. 页面：纵向 flex 容器 ============ */
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 8px;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
}

/* ============ 2. bottom：吃掉 page 的剩余高度，同时自己是横向容器 ============ */
.bottom {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: row;
  gap: 8px;
}

/* ============ 3. 左右两栏：平分宽度，各自纵向排列 ============ */
.bottom > .left,
.bottom > .right {
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fafafa;
  border-radius: 6px;
  padding: 8px;
}

/* ============ 4. 通用规则：谁有 height-auto，谁吃掉剩余空间 ============ */
/*.height-auto {
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
}*/

/* ============ 5. 视觉样式（可忽略，仅用于演示） ============ */
.top,
.right-top,
.right-bottom,
.left-top,
.left-bottom {
  padding: 12px;
  background: #e8f0fe;
  border-radius: 6px;
  border: 1px solid #c6dafc;
  color: #1a56db;
  font-size: 14px;
}

.right-bottom,
.left-bottom {
  background: #fef3c7;
  border-color: #fcd34d;
  color: #92400e;
}
</style>
