import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
    // 用于判断当前页面是否需要登录
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    // 用于判断当前页面是否需要登录
    meta: { requiresAuth: true },
    children: [{
      path: '/home/community',
      component: () => import('../views/Community.vue'),
    }]
  }
]

const router = new VueRouter({
  routes
})

// to: 要访问的页面路由信息
// from: 来自那个页面的路由信息
// next: 放行的标记
router.beforeEach((to, from, next) => {
  // 检查上面配置的 每个页面配置的 meta 信息 是否为需要登录
  if (to.meta.requiresAuth) {
    // 如果已登录，则直接通过
    if (store.state.gameUser) {
      next()
    } else {
      next({ path: '/login' })  // // 未登录则跳转至login页面
    }
  } else {
    // 不需要登录的页面
    next()
  }
})

export default router
