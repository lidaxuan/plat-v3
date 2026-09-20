/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-08-20 15:48:19
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /code/el-web-basic/package/components/secondary-packaging/drawer/index.ts
 */
import ELDrawerSp from './src/main.vue';

/* istanbul ignore next */
ELDrawerSp.install = function(Vue) {
  Vue.component(ELDrawerSp.name, ELDrawerSp);
};

export default ELDrawerSp;
