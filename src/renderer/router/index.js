import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import Index from '@/pages/Index'
import Setting from '@/pages/Setting'

const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
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
