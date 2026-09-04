import { type RouteLocationNormalized } from 'vue-router'
import { useSystemConfig } from 'plat@/store/systemConfig.ts';
import { loadMenus, loadUserInfo } from 'plat@/utils/auth'
import { isGoToLogin } from 'plat@/utils/index'

export const routerChildren = [
  {
    path: '/reportBuilderPage',
    name: 'reportBuilderPage',
    component: () => import('../views/test1.vue'),
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/test2.vue'),
  },
  {
    path: '/homeIndex/chatRecord',
    name: 'homeIndex/chatRecord',
    component: () => import('../views/test3.vue'),
  },
  {
    path: '/test1',
    name: 'test1',
    component: () => import('../views/test1.vue'),
  },
  {
    path: '/test2',
    name: 'test2',
    component: () => import('../views/test2.vue'),
  },
  {
    path: '/test3',
    name: 'test3',
    component: () => import('../views/test3.vue'),
  },
  {
    path: '/test333',
    name: 'test333',
    meta: {fullScreen: true, keepAlive: true},
    component: () => import('../views/test3.vue'),
  },
]


export const resetRouterBeforeEach = (to: RouteLocationNormalized, _from: RouteLocationNormalized): boolean | { path: string; query: Record<string, never> } => {
  const systemConfig = useSystemConfig()

  // 一、登录流程：地址存在 token，从统一登录页跳转过来
  if (to.query['access_token']) {
    systemConfig.setToken(to.query['access_token'] as string)
    loadMenus(window.EWebPlat?.platConfig)
    loadUserInfo(window.EWebPlat?.platConfig)
    // 清除 URL 参数后跳转
    return { path: to.path, query: {} }
  }

  // 二、已登录
  if (systemConfig.token) {
    return true
  }

  // 三、未登录，跳转统一登录
  isGoToLogin(window.EWebPlat?.platConfig?.appConfig, () => {})
  return false
}
