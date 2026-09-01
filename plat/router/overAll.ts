export default [
  {
    path: "/403",
    name: "403",
    component: () => import(/* webpackChunkName: "componentA" */ "../pages/err403.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import(/* webpackChunkName: "componentA" */ "../pages/err404.vue"),
  },
  {
    path: "/500",
    name: "500",
    component: () => import(/* webpackChunkName: "componentA" */ "../pages/err500.vue"),
  },
];
