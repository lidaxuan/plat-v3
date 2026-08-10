/*
 * @Description:
 * @Author: chunxu.Zhao
 * @Date: 2024-04-07 16:25:13
 * @LastEditors: chunxu.Zhao
 * @LastEditTime: 2024-09-29 16:34:53
 * @FilePath: \hw-web-client-view\src\api\integrationWeb.js
 */
export default {
  // 获取列表
  // getAppStoreList: {
  //   url: "/app/store/list",
  //   method: "post"
  // },
  // 打开 获取跳转url
  // getZendeskAuthorizationUrl: {
  //   url: "/oauth/$1/auth-url/create",
  //   method: "post"
  // },
  // // 关闭
  // unbindZendeskAuthorization: {
  //   url: "/app/store/unbindAuthorization",
  //   method: "get"
  // },

  // inter 枚举tab
  getAppTypeList: {
    url: "/app/store/getAppType",
    method: "post"
  },
  // 获取应用列表
  getAppStoreList: {
    url: "/app/store/pageList",
    method: "post"
  },
  // 创建授权
  getAuthorizationUrl: {
    url: "/oauth/$1/auth-url/create",
    method: "post"
  },
  // 解除授权
  unbindAuthorization: {
    url: "/oauth/unbindAuthorization",
    method: "get"
  },
  // 账号列表
  getInterAccountList: {
    url: "/oauth/pageListByCompanyId",
    method: "post"
  },
  // 批量解除授权
  bathUnbindAuthorization: {
    url: "/oauth/batchRemoveAuth",
    method: "get"
  },
  // 应用授权启停状态修改
  updateAuthStatus: {
    url: "/oauth/updateAuthStatus",
    method: "get"
  },
  // 绑定AI分组
  bindInterAIGroup: {
    url: "/oauth/bindAIGroup",
    method: "post"
  },

  // page列表
  getInterPageList: {
    url: "/oauth/homepageList",
    method: "post"
  },
  // 解绑page 下所有
  unbindAccountHomepage: {
    url: "/oauth/unbindAccountHomepage",
    method: "get"
  },
  // 解绑page  单个
  unbindHomepage: {
    url: "/oauth/unbindHomepage",
    method: "get"
  },
  // page 开关
  updateHomepageBindStatus: {
    url: "/oauth/updateHomepageBindStatus",
    method: "get"
  }
};