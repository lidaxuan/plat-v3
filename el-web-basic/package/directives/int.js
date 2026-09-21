// 触发input事件（替换废弃 createEvent）
const triggerInput = (el) => {
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

export default {
  mounted(el, binding) {
    // 取小数位数，binding.arg = 小数位数；不传 / :0 → 整数，禁止小数点
    const decimalCount = binding.arg ? Number(binding.arg) : 0
    const input = el.tagName.toLowerCase() === 'input' ? el : el.getElementsByTagName('input')[0]
    if (!input) return

    // 缓存到el，unmounted销毁用
    el._numberInput = input
    el._numberHandler = () => {
      let val = input.value
      if (decimalCount === 0) {
        // 整数模式：只允许数字，首位不能为0（长度>1）
        val = val.replace(/[^\d]/g, '')
        if (val.length > 1) {
          val = val.replace(/^0+/, '')
        }
      } else {
        // 小数模式：允许1个小数点，限制小数点后N位
        val = val.replace(/[^\d.]/g, '')
        // 只保留第一个小数点
        val = val.replace(/\.{2,}/g, '.')
        // 小数点后截断到decimalCount位
        val = val.replace(new RegExp(`(\\.\\d{${decimalCount}}).*`), '$1')
        // 禁止 .33 → 自动补 0.33；可选，不需要删掉这行
        // val = val.replace(/^\./, '0.')
      }
      input.value = val
      triggerInput(input)
    }

    // input实时监听，比keyup更好（粘贴、拖拽输入也能拦截）
    input.addEventListener('input', el._numberHandler)
  },
  unmounted(el) {
    const input = el._numberInput
    if (input && el._numberHandler) {
      input.removeEventListener('input', el._numberHandler)
    }
    delete el._numberInput
    delete el._numberHandler
  }
}
