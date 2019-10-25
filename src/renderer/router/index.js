import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
// import Setting from '@/pages/Setting'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
