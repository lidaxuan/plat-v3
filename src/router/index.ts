import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const children = [
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

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import( /*webpackChunkName: "entry"*/ 'plat@/layouts/index.vue'),
      // component: HomeView,
      children: children
    },
  ],
})

export default router
