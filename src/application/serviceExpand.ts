/*
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-09-01 16:55:53
 * @FilePath: src/application/serviceExpand.js
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-01 16:55:53
*/

import {ElMessage, ElMessageBox} from 'element-plus'
import {useSystemConfig} from "../../plat/store/systemConfig.js";
import {redirectToLogin} from "../../plat/utils/index";

export function storageFun(msg: string) {
  ElMessageBox.alert(msg, "提示", {
    confirmButtonText: "确认",
    callback: () => {
      redirectToLogin();
    }
  });
}

export function responseSuccess(res: any) {
  let data = res.data;
  switch (data.code) {
    case 200:
      break;
    default:
      break;
  }
  // if (window.ELBaseUtils && window.ELBaseUtils.xssSanitizePayload) {
  //   return window.ELBaseUtils.xssSanitizePayload(res.data || "");
  // }
  return res.data;
}

export function responseError(err: any) {
  let data = err.response.data;
  // if (window.$CONFIG.lang == "en") {
  //   data.msg = window.ELCONFIG.serviceCode[data.code] || data.msg;
  //   err.response.data = data;
  // }
  if (err.response.status === 401) {
    storageFun(data.msg || window.ELCONFIG.serviceCode["401"]);
  }
  return err;
}

export function requestSuccess(config: any) {
  const systemConfig = useSystemConfig();
  if (systemConfig.token) {
    config.headers["Authorization"] = systemConfig.token;
  }
  // if (window.EWebPlat.injectSystemApiParams) {
  //   window.EWebPlat.injectSystemApiParams(config);
  // }
  return config;
}
