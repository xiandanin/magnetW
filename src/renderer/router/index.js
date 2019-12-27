import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'

const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Main
    }
  ]
})
