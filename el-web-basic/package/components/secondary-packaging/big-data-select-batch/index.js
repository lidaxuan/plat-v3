/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-09-02 15:36:04
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /code/el-web-basic/package/components/secondary-packaging/big-data-select-batch/index.ts
 */
import EBigDataSelectBatchSp from './src/main.vue';

/* istanbul ignore next */
EBigDataSelectBatchSp.install = function(Vue) {
  Vue.component(EBigDataSelectBatchSp.name, EBigDataSelectBatchSp);
};

export default EBigDataSelectBatchSp;
