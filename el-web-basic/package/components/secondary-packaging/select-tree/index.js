/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-08-17 14:43:04
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /code/el-web-basic/package/components/secondary-packaging/select-tree/index.ts
 */
import SelectTreeSp from './src/main.vue';
// import { TabPane } from 'element-ui';

/* istanbul ignore next */
SelectTreeSp.install = function(Vue) {
  Vue.component(SelectTreeSp.name, SelectTreeSp);
};

export default SelectTreeSp;
