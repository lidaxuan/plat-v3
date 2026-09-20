/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-08-26 14:59:21
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /code/el-web-basic/package/components/secondary-packaging/switch/index.ts
 */
import ESwitchSp from './src/main.vue';

/* istanbul ignore next */
ESwitchSp.install = function(Vue) {
  Vue.component(ESwitchSp.name, ESwitchSp);
};

export default ESwitchSp;
