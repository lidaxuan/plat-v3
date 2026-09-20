/*
 * @Author: 李大玄
 * @Date: 2021-04-27 17:09:44
 * @LastEditTime: 2021-11-19 16:48:10
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/count-down/index.ts
 */
import ECountDownN from './src/main.vue';

/* istanbul ignore next */
ECountDownN.install = function(Vue) {
  Vue.component(ECountDownN.name, ECountDownN);
};

export default ECountDownN;
