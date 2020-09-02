import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果直接访问 登录页，直接放行
  if (to.path === '/login') return next()
  // 获取保存的token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果有 token 则直接放行
  if (tokenStr) return next()
  // 没有token 跳转到登录页
  next('/login')
})

export default router
