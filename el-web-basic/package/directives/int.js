/*
 * @Author: 李继玄
 * @Date: 2021-08-20 15:59:46
 * @LastEditTime: 2021-08-26 16:06:51
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /code/el-web-basic/package/directives/int.js
 */
const int = {
  inserted: function (el, binding) {
    const input = el.getElementsByTagName('input')[0];
    input.onkeyup = function () {
      if (input.value.length === 1) {
        input.value = input.value.replace(/[^1-9]/g, '');
      } else {
        input.value = input.value.replace(/[^\d]/g, '');
      }
      trigger(input, 'input');
    };
    input.onblur = function () {
      if (input.value.length === 1) {
        input.value = input.value.replace(/[^1-9]/g, '');
      } else {
        input.value = input.value.replace(/[^\d]/g, '');
      }
      trigger(input, 'input');
    };
  },
}

const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
};

export default int