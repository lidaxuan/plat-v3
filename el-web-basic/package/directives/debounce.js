/*
 * @Author: 李继玄
 * @Date: 2021-08-20 15:59:46
 * @LastEditTime: 2021-08-27 14:49:06
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /code/el-web-basic/package/directives/debounce.js
 */
const debounce = {
  inserted: function (el, binding) {
    let time = parseInt(el.attributes['debounceTime'].value);
    let timer
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        binding.value()
      }, time || 500)
    })
  },
}

export default debounce