/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-08-20 15:52:30
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /code/el-web-basic/package/components/native/timer/index.ts
 */
import ETimerN from './src/main.vue';

/* istanbul ignore next */
ETimerN.install = function(Vue) {
  Vue.component(ETimerN.name, ETimerN);
};

export default ETimerN;
