const debounce = {
  mounted: function (el, binding) {
    let time = parseInt(el.attributes['debounceTime'].value);
    // 定时器挂载el，避免局部变量无法清理
    el._debounceTimer = null
    el._debounceClick = () => {
      if (el._debounceTimer) {
        clearTimeout(el._debounceTimer)
      }
      el._debounceTimer = setTimeout(() => {
        binding.value()
      }, time || 500)
    }
    el.addEventListener('click', el._debounceClick)
  },
  unmounted(el) {
    clearTimeout(el._debounceTimer)
    el.removeEventListener('click', el._debounceClick)
    delete el._debounceTimer
    delete el._debounceClick
  }
}
export default debounce

