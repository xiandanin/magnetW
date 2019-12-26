import Vue from 'vue'
import create from '@/plugins/axios'

import App from './App'
import router from './router'
import './plugins'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = create()
Vue.prototype.$resethttp = function () {
  Vue.http = Vue.prototype.$http = create()
}
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  template: '<App/>'
}).$mount('#app')
