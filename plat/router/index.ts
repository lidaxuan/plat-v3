import {createRouter as createVueRouter, createWebHashHistory, type RouteLocationNormalized} from 'vue-router'
import {useSystemConfig} from 'plat@/store/systemConfig.ts'
import {loadMenus, loadUserInfo} from 'plat@/utils/auth'
import {isGoToLogin} from 'plat@/utils/index'
import overAll from './overAll.js';
export const createRouter = function (platConfig: Record<string, any>) {
  const systemConfig = useSystemConfig()
  const router = createVueRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'Entry',
        component: () => import(/* webpackChunkName: "entry" */ 'plat@/layouts/index.vue'),
         children: [].concat(overAll,  platConfig.routers || []),
      },
    ],
  })

  const routerBeforeEach = async (to: RouteLocationNormalized, _from: RouteLocationNormalized): Promise<void | { path: string; query: Record<string, never> } | boolean> => {
    // 一、登录流程：地址存在 token，从统一登录页跳转过来
    if (to.query['access_token']) {
      systemConfig.setToken(to.query['access_token'] as string)
      await loadMenus(platConfig)
      await loadUserInfo(platConfig)
      // 清除 URL 参数后跳转
      return { path: to.path, query: {} }
    }

    // 二、已登录
    if (systemConfig.token) {
      return true
    }

    // 三、未登录，跳转统一登录
    isGoToLogin(platConfig?.appConfig, () => {})
    return false
  }

  router.beforeEach(platConfig.resetRouterBeforeEach || routerBeforeEach)

  return router
}

