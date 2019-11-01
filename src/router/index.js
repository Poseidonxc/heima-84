import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import NotFount from '@/views/404'
import local from '@/utils/local'
import Article from '@/views/article'
Vue.use(VueRouter)
const router = new VueRouter(
  {
    routes: [
      {
        path: '/login',
        component: Login
      },
      {
        path: '/',
        component: Home,
        children: [
          // 欢迎页面
          { path: '/', component: Welcome },
          { path: '/article', component: Article }
        ]
      },
      { path: '*', component: NotFount }
    ]
  })
// 添加前置导航守卫
// to：到哪里去了（路由对象）
// from你要跳转的地方的路由对象（路由对象）
// next中间件(下一步方法)、、next()放行、、next('/login')拦截
router.beforeEach((to, from, next) => {
  const user = local.getUser()
  // 判断如果登录
  if (user && user.token) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
