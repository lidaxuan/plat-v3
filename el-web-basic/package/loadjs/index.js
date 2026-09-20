/*
 * @Author: 段丽军
 * @Date: 2021-11-26 10:17:51
 * @LastEditTime: 2021-12-20 14:32:20
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/loadjs/index.ts
 */
module.exports = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    lodash: '_',
    'element-ui': 'ELEMENT',
    "vuedraggable": "vuedraggable",
    "sortable": "Sortable",
    // "vxe-table": "VXETable",
    // "xe-utils": "XEUtils",
    'window.wangEditor': 'wangEditor',
  },
  // cdn的css链接
  css: [
    // '//statics.easyliao.com/vue/element-ui/2.15.3/theme-chalk/index.css',
  ],
  // cdn的js链接
  js: [
    '//statics.easyliao.com/web/vue/element-ui/2.15.3/index.ts',
    '//statics.easyliao.com/web/public/plugin/lodash/4.17.21/lodash.min.js',

    '//statics.easyliao.com/web/el-web-basic/vuedraggable/Sortable.min.js',
    '//statics.easyliao.com/web/el-web-basic/vuedraggable/dist/vuedraggable.umd.js',
    '//statics.easyliao.com/web/el-web-basic/wangeditor/wangEditor.min.js',
  ]
}
