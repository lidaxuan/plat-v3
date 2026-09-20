/*
 * @Author: 李大玄
 * @Date: 2021-04-27 17:09:44
 * @LastEditTime: 2021-12-14 14:41:08
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/icon-font/index.ts
 */
// import Load from './src/load';
import IconFont from './src/main.vue';

/* istanbul ignore next */
IconFont.install = function(Vue) {
  // let iconFontUrl = Vue.prototype.$ELEMENT.iconFontUrl;
  // let type = Object.prototype.toString.call(iconFontUrl);
  // if(type.includes('String')) {
  //   Load(iconFontUrl);
  // } else if(type.includes('Array')) {
  //   iconFontUrl.forEach(item => {
  //     Load(item);
  //   });
  // }
  Vue.component(IconFont.name, IconFont);
};

export default IconFont;
