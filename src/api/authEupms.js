/*
 * @Description:
 * @Author: 李大玄
 * @Date: 2022-08-08 17:47:04
 * @FilePath: \hw-web-client-view\src\api\authEupms.js
 * @LastEditors: chunxu.Zhao
 * @LastEditTime: 2024-09-10 15:29:40
 */
// https://test19.easyliao.net/auth-eupms/doc.html#/default/AI%E8%B4%A6%E5%8F%B7%E7%AE%A1%E7%90%86/pageManualUserListUsingGET
export default {
  getPerUserMenus: {
    url: "/per/user-menus/10000",
    method: "get"
  },
  configUpdate: {
    url: "/web/phone/bind",
    method: "post"
  },
  webPhoneSendcode: {
    url: "/web/phone/sendcode",
    method: "post"
  },
  webPhoneBindinfo: {
    url: "/web/phone/bindinfo",
    method: "post"
  },
  baseUserAiCreate: {
    url: "/base/user/ai/create",
    method: "post"
  },
  changeSite: {
    url: "/web/company/change/site",
    method: "post"
  },
  getCompanyInfo: {
    url: "/web/company/info",
    method: "get"
  },
  manualUserList: {
    url: "/base/user/manual-user-list",
    method: "get"
  },
  reservedUser: {
    url: "/base/user/reserved-user",
    method: "post"
  },
  // 获取AI用户信息
  aiUser: {
    url: "/base/user/ai-user",
    method: "get"
  },
  baseUserAiCreateInit: {// 创建AI账号信息
    url: "/base/user/ai/create-init",
    method: "post"
  },
  baseUserAiDelDestroy: {// 删除
    url: "/base/user/ai/del-destroy",
    method: "post"
  },
  baseUserAiModify: { // 修改
    url: "/base/user/ai/modify",
    method: "post"
  },
  baseUserAiPageList: { // 列表
    url: "/base/user/ai/page-list",
    method: "get"
  },
  baseUserManualUserList: { //
    url: "/base/user/manual-user-list",
    method: "get"
  },
  baseUserAiExistsName: { //
    url: "/base/user/ai/exists-name",
    method: "get"
  },
  baseUserAiList: { // ai 下拉
    url: "/base/user/ai/list",
    method: "get"
  }
};