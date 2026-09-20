/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-12-03 16:14:25
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/count-time/index.ts
 */
import ECountTimeN from './src/main.vue';

/* istanbul ignore next */
ECountTimeN.install = function (Vue) {
  Vue.component(ECountTimeN.name, ECountTimeN);
};

export default ECountTimeN;
