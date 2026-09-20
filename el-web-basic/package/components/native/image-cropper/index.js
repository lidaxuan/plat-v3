/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-08-27 16:50:25
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /code/el-web-basic/package/components/native/image-cropper/index.ts
 */
import EImageCropperN from './src/main.vue';
// import { TabPane } from 'element-ui';

/* istanbul ignore next */
EImageCropperN.install = function(Vue) {
  Vue.component(EImageCropperN.name, EImageCropperN);
};

export default EImageCropperN;
