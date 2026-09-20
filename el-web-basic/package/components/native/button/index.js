/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-10-02 09:47:40
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/button/index.ts
 */
import EButtonN from './src/main.vue';

/* istanbul ignore next */
EButtonN.install = function(Vue) {
  Vue.component(EButtonN.name, EButtonN);
};

export default EButtonN;
