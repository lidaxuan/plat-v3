/*
 * @Author: 段丽军
 * @Date: 2022-09-09 10:49:39
 * @LastEditTime: 2022-10-20 14:38:32
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/list-layout/src/data/index.ts
 */

// layout-list 插槽名称
export const listSlotNames = {
  default: "default", // 默认
  globalOper: "global-oper", // 默认
  tab: "tab", // 默认
  moduleTips: "module-tips", // 默认
  moduleQueryForm: "module-query-form", // 默认
  moduleQueryFormOper: "module-query-form-oper", // 默认
  moduleTop: "module-top", // 默认
  module: "module", // 默认
};

// layout-list-item 插槽名称
export const itemSlotNames = {
  asideTop: "aside-top", // 左侧树-顶部
  aside: "aside", // 左侧树
  tips: "tips", // 提示信息
  queryForm: "query-form", // 查询表单
  queryFormOper: "query-form-oper", // 查询表单操作
  // tableAsideTop: "table-aside-top", // 表单树-顶部
  // tableAside: "table-aside", // 表单树
  operBar: "oper-bar", // 操作栏
  tableOper: "table-oper", // 列表操作
  tableOperB: "table-oper-b", // 列表操作-B
  queryTable: "query-table", // 查询列表
  tablePage: "table-page", // 列表分页
};
