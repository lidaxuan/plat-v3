/*
 * @Description:
 * @Author: 李大玄
 * @Date: 1985-10-26 16:15:00
 * @FilePath: /framework/plat/src/service/index.ts
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-09-27 11:47:27
 */
import _ from 'lodash';
import axios from "axios";
import { platServe, maxinService } from "./request.js";
const isDev = process.env.NODE_ENV == 'development';

function formatterApi(apiOpt) {
  let apiOptions = _.cloneDeep(apiOpt);
  let firstStr = '',
    context = '';
  // 匹配 域名 是否存在 例如 http://test-prd18.easyliao.net
  const matchDominRes = apiOptions.url.match(/^(http|https):\/\/(www.)?(\w+(-?)(\.)?)+(:[0-9]{1,4})?/);
  // 匹配 代理上下文 是否存在
  const matchProxyRes = apiOptions.url.match(/\/.*?\//);
  if (matchDominRes && matchDominRes.length) {
    context = matchDominRes[0] || '';
  } else if (matchProxyRes && matchProxyRes.length) {
    firstStr = matchProxyRes[0] || '';
    context = `/${firstStr.replace(/\//g, '')}`;
    const reg = new RegExp(context, 'g');
    apiOptions.url = apiOptions.url.replace(reg, '');
  }
  // requestheader 请求头
  return { apiOptions, context, requestheader: apiOpt.requestheader || {} };
}

// 公共方法 创建 axios.create
function axiosCreate(localContext, requestheader, serviceConfig) {
  const axiosInstance = axios.create({
    baseURL: isDev ? localContext || '' : '', // 判断本地环境还是线上环境
    timeout: 600000 // 请求超时时间
  });
  maxinService(axiosInstance, requestheader, serviceConfig);
  return axiosInstance;
}

function serveApi(instance, name, ApiMap) {
  let service = ApiMap[name]; // 找到对应的接口对象 也就是 api 文件夹下的
  const HttpList = {}; //包裹请求的容器
  for (let key in service) {
    //params 请求参数 obj 配置及个性传参
    HttpList[key] = function (params, otherParams) {
      // 本地环境需要处理  线上环境不需要处理
      const { apiOptions } = formatterApi(service[key]);
      const api = isDev ? apiOptions : service[key];
      return platServe(api, params, otherParams, instance);
    };
  }
  return HttpList;
}


function getApiArr(apiConfig, apiMap) {
  let apiArr = [];
  apiConfig.forEach((item) => {
    const instance = {
      http: item.http,
      //          本地环境需要代理 线上不需要代理地址
      fun: serveApi(axiosCreate(isDev ? item.proxyContext || '' : ''), item.name, { ...apiMap })
    };
    apiArr.push(instance);
  });
  return apiArr;
}

// 老版封装
export function createService(config) {
  const { apiConfig = [], apiMap = {}, } = config;
  const apiArr = getApiArr([].concat(apiConfig), apiMap);
  return {
    apiArr,
    install(Vue) {
      apiArr.forEach((item) => {
        Vue.prototype[item.http] = item.fun;
      });
    }
  }
}


// 新版 封装
export function platCreateService(apiObj, params, otherParams,  serviceConfig) {
  // return
  const apiOpt = Object.assign({}, {...apiObj});
  if (Object.prototype.toString.call(params) != '[object FormData]') {
    params = _.cloneDeep(params);
  }
  const { apiOptions, context, requestheader } = formatterApi(apiOpt)
  if (isDev) {
    return platServe(apiOptions, params, otherParams, axiosCreate(context, requestheader, serviceConfig));
  }
  return platServe(apiOpt, params, otherParams, axiosCreate('', requestheader, serviceConfig));
}
