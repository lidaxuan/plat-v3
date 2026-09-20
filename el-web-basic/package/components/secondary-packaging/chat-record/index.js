/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-08-27 16:19:44
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /code/el-web-basic/package/components/secondary-packaging/chat-record/index.ts
 */
import EChatRecordSp from './src/main.vue';

/* istanbul ignore next */
EChatRecordSp.install = function(Vue) {
  Vue.component(EChatRecordSp.name, EChatRecordSp);
};

export default EChatRecordSp;
