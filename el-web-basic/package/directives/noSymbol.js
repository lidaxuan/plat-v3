const noSymbol = {
  inserted: function (el, binding) {
    const reg = /[`@#$%^&*￥]/g;
    const input = el.getElementsByTagName("input")[0];
    input.onkeyup = function () {
      input.value = input.value.replace(reg, "");

      trigger(input, "input");
    };
    input.onblur = function () {
      input.value = input.value.replace(reg, "");
      trigger(input, "input");
    };
  },
};

const trigger = (el, type) => {
  const e = document.createEvent("HTMLEvents");
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
};
export default noSymbol;
