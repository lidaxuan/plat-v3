/*
 * @Author: 段丽军
 * @Date: 2021-05-21 14:29:25
 * @LastEditTime: 2021-12-24 15:16:34
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/secondary-packaging/detail/index.ts
 */
import EDetailSp from './src/main.vue';

/* istanbul ignore next */
EDetailSp.install = function(Vue) {
  Vue.component(EDetailSp.name, EDetailSp);
};

export default EDetailSp;
