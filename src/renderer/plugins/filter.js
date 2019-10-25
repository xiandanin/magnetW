import Vue from 'vue'

Vue.filter('isNotEmpty', function (obj) {
  if (Array.isArray(obj)) {
    return obj.length > 0
  }
  return !!obj
})
