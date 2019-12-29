import Vue from 'vue'
import json from '../../../package.json'

Vue.use({
  install: (Vue, options) => {
    Vue.prototype.$app = {
      name: json.name,
      appName: json.appName,
      version: json.version,
      description: json.description,
      author: json.author,
      license: json.license
    }
  }
})
