import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/Users.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/power/Roles.vue'
import Cate from './components/goods/Cate.vue'

// 解决vueRouter在3.0版本以上重复点击菜单报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    component: Login,
    props: true
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    props: true,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫，原理是查看是否有token，如果没有的话，禁止访问处理登录以为的其他模块，即使访问了也会将路由重定向到登录模块
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }

  // 获取token
  const loginToken = window.sessionStorage.getItem('login')
  if (!loginToken) {
    return next('/login')
  } else {
    return next()
  }
})
export default router
