/*
 * @Description: ui
 * @Author: 李大玄
 * @Date: 2022-07-07 19:35:26
 * @FilePath: /framework/plat/src/router/overAll.js
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-08-03 17:57:36
 */

export default [
  // {
  //   path: "*",
  //   component: () =>
  //     import(/* webpackChunkName: "componentA" */ "../commonPage/err404.vue"),
  // },
  {
    path: "/401",
    name: "401",
    component: () => import(/* webpackChunkName: "componentA" */ "../commonPage/err404.vue"),
  },
  {
    path: "/403",
    name: "403",
    component: () => import(/* webpackChunkName: "componentA" */ "../commonPage/err403.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import(/* webpackChunkName: "componentA" */ "../commonPage/err404.vue"),
  },
  {
    path: "/500",
    name: "500",
    component: () => import(/* webpackChunkName: "componentA" */ "../commonPage/err500.vue"),
  },
  /*{
    path: "/login",
    name: "login",
    // component: () => import(/!* webpackChunkName: "componentA" *!/ "../components/Login"),
    // hidden: true,
  }*/
];
