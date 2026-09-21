export default {
  mounted: function (el, binding) {
    const input = el.tagName.toLowerCase() === 'input' ? el : el.getElementsByTagName("input")[0];
    if (!input) return;
    // 传参用自定义字符，不传使用默认
    const filterChars = Array.isArray(binding.value) ? binding.value : ['`','@','#','$','%','^','&','*','￥'];
    const reg = new RegExp(`[${filterChars.join('')}]`, 'g');

    el._noSymbolHandler = function () {
      input.value = input.value.replace(reg, "");
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    input.addEventListener('input', el._noSymbolHandler);
    input.addEventListener('blur', el._noSymbolHandler);
  },
  unmounted(el) {
    const input = el.tagName.toLowerCase() === 'input' ? el : el.getElementsByTagName("input")[0];
    if (input && el._noSymbolHandler) {
      input.removeEventListener('input', el._noSymbolHandler);
      input.removeEventListener('blur', el._noSymbolHandler);
    }
    delete el._noSymbolHandler;
  },
};
