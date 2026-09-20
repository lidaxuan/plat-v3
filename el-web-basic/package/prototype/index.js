export const bindPrototype = (Vue, ELEMENT) => {
  Vue.prototype.$EConfirm = (content, title, options) => {
    const params = {
      customClass: "del-message-box",
      iconClass: "del-message-box-icon",
      ...options,
    };
    return ELEMENT.MessageBox.confirm(content, title, params);
  };
};
