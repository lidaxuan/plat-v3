/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-08-27 16:49:44
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /code/el-web-basic/package/components/native/preview-image/index.ts
 */
import PreviewImage from './src/main.vue';
// import { TabPane } from 'element-ui';

/* istanbul ignore next */
PreviewImage.install = function(Vue) {
  Vue.component(PreviewImage.name, PreviewImage);
};

export default PreviewImage;
