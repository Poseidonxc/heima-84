import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import NotFount from '@/views/404'

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
          {
            path: '/',
            component: Welcome

          }

        ]
      },
      {
        path: '*',
        component: NotFount
      }
    ]
  })
export default router
