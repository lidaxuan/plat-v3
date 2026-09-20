/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-09-10 15:56:18
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/scroll-pane/index.ts
 */
import EScrollPaneN from './src/main.vue';

/* istanbul ignore next */
EScrollPaneN.install = function(Vue) {
  Vue.component(EScrollPaneN.name, EScrollPaneN);
};

export default EScrollPaneN;
