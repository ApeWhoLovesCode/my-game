import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
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
  },
  // 管理员端
  { path: '/admin/Login', component: () => import('../views/admin/Login.vue') },
  {
    path: '/admin/Home',
    name: 'Home',
    component: () => import('../views/admin/Home.vue'),
    redirect: '/admin/welcome',
    children: [
      {
        path: '/admin/welcome',
        name: 'Welcome',
        component: () => import('../views/admin/Welcome.vue')
      },
      {
        path: '/admin/user',
        name: 'User',
        component: () => import('../views/admin/User.vue')
      },
      {
        path: '/admin/game',
        name: 'Game',
        component: () => import('../views/admin/Game.vue')
      },
      {
        path: '/admin/comment',
        name: 'Comment',
        component: () => import('../views/admin/Comment.vue')
      },
      {
        path: '/admin/score',
        name: 'Score',
        component: () => import('../views/admin/Score.vue')
      },
    ]
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
    // let user = store.state.gameUser
    // if (user && user.gameToken === `lhh_token_${user.id}`) {
    //   next()
    // } else {
    //   next({ path: '/login' })  // // 未登录则跳转至login页面
    // }
    next()
  } else {
    // 不需要登录的页面
    next()
  }
})

export default router
