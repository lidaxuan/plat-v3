/*
 * @Description:
 * @Author: 李大玄
 * @Date: 2022-06-22 18:17:24
 * @FilePath: /web-framework-demo/plat/directives/index.ts
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-07-08 09:24:49
 */
import utils from "../utils/index.ts";

const vueFiles = require.context("./src", true, /\.js$/);
const directives = utils.readFile(vueFiles);
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};
