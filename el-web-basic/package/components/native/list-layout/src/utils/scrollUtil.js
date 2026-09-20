/*
 * @Author: 段丽军
 * @Date: 2022-09-09 17:16:03
 * @LastEditTime: 2022-10-20 16:08:13
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /list-layout/src/utils/scrollUtil.js
 */

const obj = {
  el: null, // 监听元素
  // 初始化
  init({ el }) {
    this.el = el; // 获取监听元素
    this.initScroll(); // 初始化滚动监听
    this.initResize(); // 初始化resize监听
  },
  // 销毁监听
  destroyed() {
    this.el = null; // 去掉监听元素
    this.watchList = {}; // 去掉监听事件集合
  },
  // 初始化滚动监听
  initScroll() {
    if(!this.el) {
      return;
    }
    this.el.parentElement.onscroll = (e) => this.scroll(e);
  },
  // 滚动
  scroll(e) {
    this.actionWatch('scroll', e); // 指定滚动监听
    this.chagne(); // 执行变化监听
  },
  // 初始化resize监听
  initResize() {
    if(!this.el) {
      return;
    }

    let timer = null;
    const resizeObserver = new ResizeObserver(entries => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        this.resize(entries[0].contentRect);
      }, 100);
    });
    resizeObserver.observe(this.el);
    window.onresize = () => this.resize();
  },
  // 元素resize
  resize() {
    this.actionWatch('resize'); // 执行resize监听
    this.chagne(); // 执行变化监听
  },
  // 变化监听「包括：滚动、元素resize」
  chagne() {
    this.actionWatch('change');
  },

  // 监听集合
  watchList: {},
  // 添加监听
  addWatch(type, fun) {
    if(this.watchList[type]) {
      this.watchList[type].push(fun);
    } else {
      this.watchList[type] = [fun];
    }
  },
  // 删除监听
  removeWatch(type, fun) {
    if(this.watchList[type]) {
      const index = this.watchList[type].findIndex(item=> item === fun);
      if(index > -1) {
        this.watchList[type].splice(index, 1);
      }
    }
  },
  // 执行监听
  actionWatch(type, e) {
    // 指定监听类型，没有添加监听；监听元素不存在；不执行计算操作；
    if(!this.watchList[type] || this.watchList[type].length === 0 || !this.el) {
      return;
    }

    // 内容部分元素
    const el = this.el,
    // 内容父级元素
    parent = el.parentElement,
    // parentTop：内容父级距离顶部距离
    { top: parentTop } = parent.getBoundingClientRect();

    // 内容超出视口 低栏开始浮动
    const isFloatButtom = !(parent.scrollHeight - parent.scrollTop <= parent.offsetHeight);

    // 触发监听
    this.watchList[type].forEach(item => item({ isFloatButtom, parentTop, event: e }))
  },
};

export default obj;