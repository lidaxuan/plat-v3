/*
 * @Description:
 * @Author: 李大玄
 * @Date: 2022-08-15 14:49:52
 * @FilePath: /framework/plat/src/createApp/mixin.js
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-08-15 15:29:40
 */
import _ from 'lodash';
// import ElWebBasic from "el-web-basic";
import platDirectives from "../directives/index.js";

export function mixinProto(Vue, options) {
  const { store } = options;
  Vue.prototype.$hasAuthority = function (sourceStr) {
    let authorities = '';
    const reg = new RegExp(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/, 'g');
    authorities = sourceStr.replace(reg, '');
    authorities = authorities.toLowerCase();
    let authCodeArr = store.getters.authCodeArr;
    authCodeArr = authCodeArr.map((item) => {
      return item.toLowerCase();
    });

    return authorities.split(',').some((itemS) => {
      let code = itemS
        .split(':')
        .map((item, index) => {
          if (index > 0) {
            item = _.capitalize(item)
          }
          return item;
        })
        .join('');
      return authCodeArr.includes(code);
    });
  };
}

// test
// palindrome('测试空 格DSGGEG 和asd1 23 ,./!@#$%^&*()_+{}:"|<>?asdasd，。、ASDSDGFG《》？EG！@#￥%……&*（）——+{}：“');


export function mixinUse(Vue, options) {
  const { service, platConfig } = options;
  Vue.use(service);
  Vue.use(platDirectives);
  Vue.use(platConfig.directives || {});
  Vue.use(ElWebBasic);
}
