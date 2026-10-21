import {type RouteLocationNormalized} from 'vue-router'
import {useSystemConfig} from 'plat@/store/systemConfig.ts';
import {loadMenus, loadUserInfo} from 'plat@/utils/auth'
import {isGoToLogin} from 'plat@/utils/index'

export const routerChildren = [
  {
    path: '/',
    name: 'Entry',
    // component: () => import(/* webpackChunkName: "entry" */ 'plat@/layouts/index.vue'),
    component: () => import('../views/layout.vue'),
    children: [
      {
        path: '/workOrderWorkbench',
        name: 'workOrderWorkbench',
        component: () => import('../views/workOrderWorkbench/index.vue'),
        // component: () => import('../views/test2.vue'),
        meta: {fullScreen: false, keepAlive: true},
      },
      {
        path: '/systemSetting',
        name: 'systemSetting',
        component: () => import('../views/systemSetting/index.vue'),
        meta: {fullScreen: false, keepAlive: true},
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: {fullScreen: false, keepAlive: false},
      },
    ],
  },
]


export const resetRouterBeforeEach = (to: RouteLocationNormalized, _from: RouteLocationNormalized): boolean | { path: string; query: Record<string, never> } => {
  const systemConfig = useSystemConfig()
  // console.log('resetRouterBeforeEach', to, _from)
  // 一、登录流程：地址存在 token，从统一登录页跳转过来
  if (to.query['access_token']) {
    systemConfig.setToken(to.query['access_token'] as string)
    return {path: to.path, query: {}}
  }

  // 二、已登录
  if (systemConfig.token) {
    if(to.path === '/home'){
      return true
    }
    return {path: '/home', query: { "_t": Date.now().toString()}}
    // return true;
  }

  // 三、未登录，跳转统一登录
  isGoToLogin(window.EWebPlat?.platConfig?.appConfig, () => {
  })
  return false
}
