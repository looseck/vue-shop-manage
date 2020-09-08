import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home.vue'
import Welcome from '@/components/pages/Welcome.vue'
import Users from '@/components/pages/Users.vue'
import Rights from '@/components/pages/Rights.vue'
import Roles from '@/components/pages/Roles.vue'
import Test from '@/components/pages/test.vue'
import Category from '@/components/pages/Category.vue'
import Params from '@/components/pages/Params.vue'

Vue.use(VueRouter)

// 修改首页路由重复点击报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
    component: Home,
    redirect: '/welcome',
    meta: [],
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
        meta: [],
      }, {
        path: '/users',
        name: 'Users',
        component: Users,
        meta: ['用户管理', '用户列表'],
      }, {
        path: '/rights',
        component: Rights,
        meta: ['权限管理', '权限列表'],
      }, {
        path: '/roles',
        component: Roles,
        meta: ['权限管理', '角色列表'],
      }, {
        path: '/categories',
        component: Category,
        meta: ['商品管理', '商品分类'],
      }, {
        path: '/params',
        component: Params,
        meta: ['商品管理', '分类参数'],
      }, {
        path: '/test',
        component: Test,
        meta: ['测试'],
      }
    ]
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
