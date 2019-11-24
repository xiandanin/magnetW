import Vue from 'vue'
import axios from 'axios'

import './plugins/filter'
import App from './App'
import router from './router'
import store from './store'
import './plugins/element'
import Setting from './plugins/setting'
import Project from './data/project'
import './plugins/analytics.js'

Vue.use(Setting)
Vue.use(Project)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
