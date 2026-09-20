/*
 * @Author: 段丽军
 * @Date: 2021-05-21 14:29:25
 * @LastEditTime: 2021-10-18 17:25:47
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/container-list/index.ts
 */
import EContainerListN from './src/main.vue';

/* istanbul ignore next */
EContainerListN.install = function(Vue) {
  Vue.component(EContainerListN.name, EContainerListN);
};

export default EContainerListN;
