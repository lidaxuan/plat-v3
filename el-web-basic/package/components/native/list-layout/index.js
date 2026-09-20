/*
 * @Author: 段丽军
 * @Date: 2021-05-21 14:29:25
 * @LastEditTime: 2022-09-05 16:25:15
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/list-layout/index.ts
 */
import EListLayoutN from './src/list-layout.vue';

/* istanbul ignore next */
EListLayoutN.install = function(Vue) {
  Vue.component(EListLayoutN.name, EListLayoutN);
};

export default EListLayoutN;
