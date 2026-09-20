/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-12-02 17:13:35
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/count-to/index.ts
 */
import ECountToN from './src/main.vue';

/* istanbul ignore next */
ECountToN.install = function (Vue) {
  Vue.component(ECountToN.name, ECountToN);
};

export default ECountToN;
