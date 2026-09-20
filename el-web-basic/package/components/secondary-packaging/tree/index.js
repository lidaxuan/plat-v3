/*
 * @Author: 段丽军
 * @Date: 2021-05-21 14:29:25
 * @LastEditTime: 2021-09-10 15:07:17
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/secondary-packaging/tree/index.ts
 */
import ETreeSp from './src/main.vue';

/* istanbul ignore next */
ETreeSp.install = function(Vue) {
  Vue.component(ETreeSp.name, ETreeSp);
};

export default ETreeSp;
