import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import Index from '@/pages/Index'
import Setting from '@/pages/Setting'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      children: [
        {
          path: 'index',
          component: Index
        },
        {
          path: 'setting',
          component: Setting
        }
      ]
    }
  ]
})
