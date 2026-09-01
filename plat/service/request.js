/*
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-09-01 16:56:40
 * @FilePath: plat/service/request.js
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-01 16:56:40
*/
import {useSystemConfig} from "../store/systemConfig.js";
import {redirectToLogin} from "../utils/index.ts";
import {ElMessageBox} from 'element-plus';

function getApiUrl(params, api) {
  let url = api.url;
  if (params.splicingParams) {
    url = `${url}/${params.splicingParams}`;
  }
  if (params.beforeParams) {
    url = params.beforeParams + url;
  }
  return url;
}

export function _FormData(params, flag) {
  let newParams;
  if (flag === "form-data") {
    newParams = new FormData();
  } else {
    newParams = new URLSearchParams();
  }
  for (let i in params) {
    newParams.append(i, params[i]);
  }
  return newParams;
}

export function storageFun(msg) {
  ElMessageBox.alert(msg, "提示", {
    confirmButtonText: "确定",
    callback: () => {
      redirectToLogin();
    }
  });
}

/**
 * get xxx/xxx?id=1 $api.method({id});
 * post xxx/xxx $api.method(id);
 * post xxx/xxx?id=1 $api.method({config:{params:{id}}})
 * /拼接 xxx/xxx/id  $api.method(id,{splicingParams:id});
 * formData xxx/xxx $api.method(id, {contentType:'x-form'}) || $api.method(id, {contentType:'form-data'})
 *
 */

const headersEnum = {
  "text/html": "text/html;charset=utf-8",
  "x-form": "application/x-www-form-urlencoded;charset=utf-8",
  "form-data": "multipart/form-data;charset=utf-8"
};

function formatterUrl(api, params) {
  let url = api.url;
  const reg = new RegExp(/[$].*/, 'g');
  if (!reg.test(url)) {
    return {api, params}
  }
  for (const key in params) {
    if (key.match(reg)) {
      api.url = api.url.replace(key, params[key])
      delete params[key];
    }
  }
  return {api, params};
}

export async function platServe(apiMap, query, otherParams, instance) {
  const data = formatterUrl(apiMap, query);
  let {api, params} = data;
  //params 请求参数 params 配置及个性传参
  // let { config = {}, splicingParams = undefined, beforeParams = undefined } = params;
  otherParams = Object.assign({}, otherParams || {});
  let {config = {}} = otherParams;
  // 拼接的参数
  // config 配置参数 object
  // contentType 请求头 str 可传入不同Content-Type （传入form-data 可使用formData对象接收参数）
  // splicingParams 默认undefined 传入str 将在url直接加参数
  // 接口contentType判断
  // otherParams.contentType
  if (otherParams.contentType || api.contentType) {
    config.headers = {
      "content-type": headersEnum[otherParams.contentType || api.contentType] || "application/json;charset=utf-8"
    };
    if (otherParams.contentType == "x-form" || api.contentType == "x-form") {
      // form-data对象
      params = _FormData(params);
    } else if (otherParams.contentType == "form-data" || api.contentType == "form-data") {
      params = _FormData(params, "form-data");
    }
  }
  // responseType: 'blob' 下载时用的
  // config.responseType = api.responseType || "";
  config.responseType = otherParams.responseType || (otherParams.config ? otherParams.config.responseType : '') || api.responseType || "";
  if (config && config.customHeader) {
    config.headers = Object.assign({}, config.headers, config.customHeader)
  }
  let response = {};
  //不同请求的判断get post put 根据后台接口需求而定
  if (api.method === "post" || api.method === "put" || api.method === "patch") {
    try {
      response = await instance[api.method](getApiUrl(otherParams, api), params, config);
    } catch (err) {
      response = err;
    }
  } else if (api.method === "delete" || api.method === "get") {
    config.params = params;
    try {
      response = await instance[api.method](getApiUrl(otherParams, api), config);
    } catch (err) {
      response = err;
    }
  }

  return response;
}

// 将axios 实例传过来 绑定两个切片
export const maxinService = function (Service, requestheader = {}, serviceConfig) {
  const systemConfig = useSystemConfig()
  // 请求拦截器的
  Service.interceptors.request.use(
    serviceConfig.requestSuccess ||
    function (config) {
      // if (EWebPlat.userStore.token) {
        config.headers["Authorization"] = systemConfig.token ?? "";
      // }
      for (const key in requestheader) {
        config.headers[key] = requestheader[key];
      }
      return config;
    },
    (err) => {
      return err;
    }
  );
  // http response 拦截器
  Service.interceptors.response.use(
    serviceConfig.responseSuccess || function (res) {
      let data = res.data;
      switch (data.code) {
        case 200:
          break;
        default:
          break;
      }
      return res.data;
    },
    serviceConfig.responseError || function (err) {
      if (err.response?.status === 401 || err.response?.status === 402) {
        const msg = err.response.data?.msg || "token失效，请重新登陆";
        storageFun(msg);
      }
      return err;
    }
  );
}
