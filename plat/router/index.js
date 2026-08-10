/*
 * @Description:
 * @Author: 李大玄
 * @Date: 2022-07-07 13:56:23
 * @FilePath: /framework/plat/src/router/index.ts
 * @LastEditors: 李大玄
 * @LastEditTime: 2025-01-07 10:36:31
 */

// import Vue from "vue";
// import VueRouter from "vue-router";
// import NProgress from "nprogress"; //进度条
// import "nprogress/nprogress.css";// 进度条样式
// import platOverAll from "./overAll.js";
// import EWebPlat from '../index.ts';
// import auth from "../utils/auth.ts";
// import utils from "../utils/index.ts";
//
// NProgress.configure({ showSpinner: false }); // 不显示螺旋加载
// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err);
// };
// Vue.use(VueRouter);

function jumpRoute(routeName, next, to) {
  if (routeName !== "/") {
    // 情况1)
    if (auth.checkPermission(routeName)) {
      auth.jumpConfig(to);
      next();
    }
    // 情况2)
    else {
      next("./404");
    }
  }
  // 情况3)
  else {
    next(auth.getFirstPermission());
  }
}


export const createRouter = function (platConfig) {
  const router = new VueRouter({
    mode: "hash",
    routes: platOverAll.concat(platConfig.routes)
  });
  router.beforeEach(async (to, from, next) => {
    // 开启进度条
    NProgress.start();
    try {
      // 一、登录流程
      // 步骤1.地址存在token信息，表示从统一页面登录也跳转过来，首先缓存token信息；
      // 步骤2.获取菜单和用户信息，并缓存；
      // 步骤3.地址跳转逻辑「调用进入系统，清除地址参数相关」
      if (to.query["access_token"]) {
        // 步骤1
        auth.cacheQuery(to.query);
        // 步骤2
        await auth.loadMenuInfo();
        await auth.loadUserInfo();
        // 步骤3
        auth.entrySystem(to.path, next, to.query);
        const menus = [].concat(EWebPlat.menusStore.nomalMenu || []);
        EWebPlat.creatOtherProductSrcList(menus);
      }
      // 二、正常页面跳转「已登录（缓存中存在Token）」
      // 情况1.校验登录信息是否完整，存在「菜单信息」
      //   步骤1).执行跳转路由
      // 情况2.不存在「菜单信息」
      //   步骤1).获取菜单信息
      //   步骤2).执行跳转路由
      else if (EWebPlat.userStore.token) {
        // 情况1
        if (auth.checkLoginInfo()) {
          jumpRoute(to.path, next, to);
        }
        // 情况2
        else {
          // 步骤1)
          await auth.loadMenuInfo();
          // 步骤2)
          jumpRoute(to.path, next, to);
        }
      }
      // 三、非正常页面跳转「未登录（缓存中不存在Token）」
      // 编码当前地址作为回调地址，以及其它登录必要参数，跳转到统一登录页面
      else {
        if (platConfig.loginUrl) {
          window.location.href = platConfig.loginUrl
        } else {
          auth.jumpLogin();
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  router.afterEach((to) => {
    const params = utils.getMenuItem(EWebPlat.menusStore.nomalMenu, to.path.replace('/', '') || to.name, []) || { menuModules: ['--'], menuItem: '--' };
    if (to.meta.title || params.menuItem) {
      document.title = to.meta.title || params.menuItem;
    }
    NProgress.done();// 结束Progress
  });

  // router.onError((error) => {
  //   const pattern = /Loading chunk (d)+ failed/g;
  //   const isChunkLoadFailed = error.message.match(pattern);
  //   const targetPath = router.history.pending.fullPath;
  //   if (isChunkLoadFailed) {
  //     router.replace(targetPath);
  //   }
  // });
  return router;
}
