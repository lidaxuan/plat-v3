/*
 * @Author: 段丽军
 * @Date: 2021-10-22 14:22:24
 * @LastEditTime: 2022-09-20 09:53:02
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/directives/resize.js
 */
const resize = {
  // bind (el, binding) { // el为绑定的元素，binding为绑定给指令的对象
  //   let width = '', height = '';
  //   const isReize = () => {
  //     const style = document.defaultView.getComputedStyle(el);
  //     if (width !== style.width || height !== style.height) {
  //       binding.value({ width: style.width, height: style.height });  // 关键(这传入的是函数,所以执行此函数)
  //     }
  //     width = style.width;
  //     height = style.height;
  //   }

  //   el.__vueSetInterval = setInterval(isReize, 300);
  // },
  // unbind (el) {
  //   clearInterval(el.__vueSetInterval);
  // }

  bind(el, binding) {
    let timer = null;
    const resizeObserver = new ResizeObserver(entries => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        binding.value && binding.value(entries[0].contentRect);
      }, 300);
    });
    resizeObserver.observe(el);
  },

}
export default resize
