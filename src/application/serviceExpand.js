/*
 * @Description:
 * @Author: 李大玄
 * @Date: 2022-08-24 10:14:43
 * @FilePath: /web-framework-demo/src/application/serviceExpand.js
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-08-24 10:15:21
 */

// import ELEMENT from "element-ui";
// import auth from "plat/src/utils/auth";

// import {jumpLogin} from "./loginConfig";

export function storageFun(msg) {
  ELEMENT.MessageBox.alert(msg, window.ELCONFIG.TipText, {
    confirmButtonText: window.ELCONFIG.ConfirmText,
    callback: () => {
      // jumpLogin();
    }
  });
}

export function responseSuccess(res) {
  let data = res.data;
  switch (data.code) {
    case 200:
      break;
    default:
      break;
  }
  if (window.ELBaseUtils && window.ELBaseUtils.xssSanitizePayload) {
    return window.ELBaseUtils.xssSanitizePayload(res.data || "");
  }
  return res.data;
}

export function responseError(err) {
  let data = err.response.data;
  if (window.$CONFIG.lang == "en") {
    data.msg = window.ELCONFIG.serviceCode[data.code] || data.msg;
    err.response.data = data;
  }
  if (err.response.status === 401) {
    if (data.code != 90003) {
      storageFun(data.msg || window.ELCONFIG.serviceCode["401"]);
    }
  }
  return err;
}

export function requestSuccess(config) {
  if (EWebPlat.store.getters.token) {
    config.headers["Authorization"] = EWebPlat.store.state.user.token;
  }
  if (window.EWebPlat.injectSystemApiParams) {
    window.EWebPlat.injectSystemApiParams(config);
  }
  return config;
}
