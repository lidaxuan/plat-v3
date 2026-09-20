/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-09-02 15:40:27
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /code/el-web-basic/package/components/secondary-packaging/big-data-select/index.ts
 */
import EBigDataSelectSp from './src/main.vue';

/* istanbul ignore next */
EBigDataSelectSp.install = function(Vue) {
  Vue.component(EBigDataSelectSp.name, EBigDataSelectSp);
};

export default EBigDataSelectSp;
