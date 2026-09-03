import {createRouter as createVueRouter, createWebHashHistory, type RouteLocationNormalized} from 'vue-router'
import {useSystemConfig} from 'plat@/store/systemConfig.ts'
import {loadMenus, loadUserInfo} from 'plat@/utils/auth'
import {isGoToLogin} from 'plat@/utils/index'
import utils from 'plat@/utils/index'
import overAll from './overAll.ts';
export const createRouter = function (platConfig: Record<string, any>) {
  const systemConfig = useSystemConfig()
  const router = createVueRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'Entry',
        component: () => import(/* webpackChunkName: "entry" */ 'plat@/layouts/index.vue'),
         children: [].concat(  platConfig.routers || []),
      },
      ...overAll
    ],
  })

  /** 取菜单树第一个叶子节点的 code，用于兜底默认激活菜单 */
  const getFirstLeafCode = (tree: any[]): string => {
    if (!tree || !tree.length) return ''
    const first = tree[0]
    if (!first.children || !first.children.length) return first.code || ''
    return getFirstLeafCode(first.children)
  }

  /** 当 activeMenuCode 为空时，根据当前路由路径同步一次，确保首次进入/刷新后也能正常高亮 */
  const syncActiveMenuCodeByRoute = (path: string): void => {
    if (systemConfig.menusConfig.activeMenuCode) return
    const { normalMenu } = systemConfig.menusConfig
    // 优先用路径匹配（去掉开头的 '/'）
    const codeFromPath = path.startsWith('/') ? path.slice(1) : path
    if (codeFromPath && normalMenu.length) {
      const matched = utils.getMenuItem(normalMenu, codeFromPath, [])
      if (matched && matched.code) {
        systemConfig.setMenusConfig('activeMenuCode', matched.code)
        systemConfig.setLayoutTag(matched.code);
        return
      }
    }
    // 兜底：取菜单树第一个叶子节点
    const fallback = getFirstLeafCode(normalMenu)
    if (fallback) {
      systemConfig.setMenusConfig('activeMenuCode', fallback as string)
      // systemConfig.setLayoutTag(fallback as string);
    }
  }

  const routerBeforeEach = async (to: RouteLocationNormalized, _from: RouteLocationNormalized): Promise<void | { path: string; query: Record<string, never> } | boolean> => {
    // 一、登录流程：地址存在 token，从统一登录页跳转过来
    if (to.query['access_token']) {
      systemConfig.setToken(to.query['access_token'] as string)
      await loadMenus(platConfig)
      await loadUserInfo(platConfig)
      // 清除 URL 参数后跳转
      return { path: to.path, query: {} }
    }

    // 二、已登录：保证刷新 / 首次进入后 activeMenuCode 一定有值，再放行
    if (systemConfig.token) {
      syncActiveMenuCodeByRoute(to.path)
      // 如果到了根路径但已有激活菜单，跳转到对应路由，避免首次进入空白页
      if (to.path === '/' && systemConfig.menusConfig.activeMenuCode) {
        return { path: '/' + systemConfig.menusConfig.activeMenuCode, query: {} }
      }
      return true
    }

    // 三、未登录，跳转统一登录
    isGoToLogin(platConfig?.appConfig, () => {})
    return false
  }

  router.beforeEach(platConfig.resetRouterBeforeEach || routerBeforeEach)

  return router
}

