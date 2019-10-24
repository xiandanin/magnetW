import Vue from 'vue'
import Router from 'vue-router'
// import Index from '@/pages/Index'
import Config from '@/pages/Config'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'config',
      component: Config
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
