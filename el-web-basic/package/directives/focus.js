const findEle = (parent, type) => {
  // 原逻辑：自身是目标标签返回自身，否则返回queryAll节点列表
  return parent.tagName.toLowerCase() === type ? parent : parent.querySelectorAll(type)
}
export default {
  mounted: function (el) {
    // 聚焦元素
    if (el.tagName === 'INPUT') {
      el.focus();
      return;
    }
    if (el.tagName === 'DIV') {
      let nodes = findEle(el, 'input');
      if (nodes && nodes.length) {
        nodes[0].focus();
      }
    }
  }
}

