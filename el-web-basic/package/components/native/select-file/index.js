/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-08-13 11:31:51
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /code/el-web-basic/package/components/native/select-file/index.ts
 */
import SelectFile from './src/main.vue';
// import { TabPane } from 'element-ui';

/* istanbul ignore next */
SelectFile.install = function(Vue) {
  Vue.component(SelectFile.name, SelectFile);
};

export default SelectFile;
