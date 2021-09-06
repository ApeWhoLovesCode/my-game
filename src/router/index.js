import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    children: [{
      path: '/home/community',
      component: () => import('../views/Community.vue'),
    }]
  }
]

const router = new VueRouter({
  routes
})

export default router
