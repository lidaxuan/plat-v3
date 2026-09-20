/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-09-17 17:11:00
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/secondary-packaging/dialog/index.ts
 */
import EDialogSp from './src/main.vue';

/* istanbul ignore next */
EDialogSp.install = function(Vue) {
  Vue.component(EDialogSp.name, EDialogSp);
};

export default EDialogSp;
