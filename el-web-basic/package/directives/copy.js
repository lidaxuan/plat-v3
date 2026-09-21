export default {
  created(el, { value }) {
    el.$value = value
    el.handler = () => {
      if (!el.$value) {
        console.log('无复制内容')
        return
      }
      const textarea = document.createElement('textarea')
      textarea.readOnly = true
      textarea.style.cssText = 'position:absolute;left:-9999px'
      textarea.value = el.$value
      document.body.appendChild(textarea)
      textarea.select()
      const result = document.execCommand('Copy')
      result && console.log('复制成功')
      document.body.removeChild(textarea)
    }
    el.addEventListener('click', el.handler)
  },
  updated(el, { value }) {
    el.$value = value
  },
  unmounted(el) {
    el.removeEventListener('click', el.handler)
    delete el.$value
    delete el.handler
  },
}
