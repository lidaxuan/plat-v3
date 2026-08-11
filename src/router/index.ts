import { createRouter, createWebHashHistory, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import { useSystemConfig } from 'plat@/store/systemConfig.ts';
import { loadMenus, loadUserInfo } from 'plat@/utils/auth'
import { isGoToLogin } from 'plat@/utils/index'

export const routerChildren = [
  {
    path: '/reportBuilderPage',
    name: 'reportBuilderPage',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/homeIndex/chatRecord',
    name: 'homeIndex/chatRecord',
    component: () => import('../views/AboutView.vue'),
  },
]


export const resetRouterBeforeEach = (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const systemConfig = useSystemConfig()

  // 一、登录流程：地址存在 token，从统一登录页跳转过来
  if (to.query['access_token']) {
    systemConfig.setToken(to.query['access_token'] as string)
    loadMenus(window.EWebPlat?.platConfig)
    loadUserInfo(window.EWebPlat?.platConfig)
    // 清除 URL 参数后跳转
    next({ path: to.path, query: {} })
    return
  }

  // 二、已登录
  if (systemConfig.token) {
    next()
    return
  }

  // 三、未登录，跳转统一登录
  isGoToLogin(window.EWebPlat?.platConfig?.appConfig, () => {
    next()
  })
}