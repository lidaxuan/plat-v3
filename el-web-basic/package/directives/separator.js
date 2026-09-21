// 千分位格式化函数
const formatThousand = (num, separator = ',') => {
  const numArr = String(num).split('.');
  let x1 = numArr[0];
  const x2 = numArr.length > 1 ? '.' + numArr[1] : '';
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + separator + '$2');
  }
  return x1 + x2
}

export default {
  beforeMount(el, binding) {
    const { num, separator } = typeof binding.value === 'object' ? binding.value : { num: binding.value, separator: ',' }
    el.innerHTML = formatThousand(num, separator)
  },
  updated(el, binding) {
    const { num, separator } = typeof binding.value === 'object' ? binding.value : { num: binding.value, separator: ',' }
    el.innerHTML = formatThousand(num, separator)
  }
}

