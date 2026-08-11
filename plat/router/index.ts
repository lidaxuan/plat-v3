import {createRouter as createVueRouter, createWebHashHistory, type RouteLocationNormalized, type NavigationGuardNext} from 'vue-router'
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
        name: 'home',
        component: () => import(/* webpackChunkName: "entry" */ 'plat@/layouts/index.vue'),
         children: [].concat(overAll,  platConfig.routes || []),
      },
    ],
  })

  const routerBeforeEach = async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> => {
    // 一、登录流程：地址存在 token，从统一登录页跳转过来
    if (to.query['access_token']) {
      systemConfig.setToken(to.query['access_token'] as string)
      await loadMenus(platConfig)
      await loadUserInfo(platConfig)
      // 清除 URL 参数后跳转
      next({path: to.path, query: {}})
      return
    }

    // 二、已登录
    if (systemConfig.token) {
      next()
      return
    }

    // 三、未登录，跳转统一登录
    isGoToLogin(platConfig?.appConfig, () => {
      next()
    })
  }

  router.beforeEach(platConfig.resetRouterBeforeEach || routerBeforeEach)

  return router
}

