/*
 * @Author: 李大玄
 * @Date: 2021-04-27 17:09:44
 * @LastEditTime: 2021-09-16 15:02:47
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/editor/index.ts
 */
import EEditorN from './src/main.vue';

/* istanbul ignore next */
EEditorN.install = function(Vue) {
  Vue.component(EEditorN.name, EEditorN);
};

export default EEditorN;
