/*
 * @Author: 段丽军
 * @Date: 2021-05-21 14:29:25
 * @LastEditTime: 2021-08-17 14:42:13
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /code/el-web-basic/package/components/secondary-packaging/table/index.ts
 */
import TableSp from './src/main.vue';

/* istanbul ignore next */
TableSp.install = function(Vue) {
  Vue.component(TableSp.name, TableSp);
};

export default TableSp;
