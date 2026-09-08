/*
 * @Description: 
 * @Author: lidaxuan
 * @Date: 2026-09-08 10:04:47
 * @FilePath: plat/directives/index.js
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-08 10:04:47
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
