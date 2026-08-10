/*
 * @Description: 
 * @Author: 李大玄
 * @Date: 1985-10-26 16:15:00
 * @FilePath: /framework/plat/src/directives/src/resize.js
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-08-29 17:11:17
 */
const resize = {
  bind(el, binding) {
    // el为绑定的元素，binding为绑定给指令的对象
    let width = "",
      height = "";
    const isReize = () => {
      const style = document.defaultView.getComputedStyle(el);
      if (width !== style.width || height !== style.height) {
        binding.value({ width: style.width, height: style.height }); // 关键(这传入的是函数,所以执行此函数)
      }
      width = style.width;
      height = style.height;
    };

    el.__vueSetInterval = setInterval(isReize, 300);
  },
  unbind(el) {
    clearInterval(el.__vueSetInterval);
  },
};
export default resize;
