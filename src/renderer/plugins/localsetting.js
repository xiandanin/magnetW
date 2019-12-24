import Vue from 'vue'

function save (newSetting) {
  const localSetting = get()
  for (let key in newSetting) {
    localSetting[key] = newSetting[key]
  }
  Vue.localStorage.set('local_setting', JSON.stringify(localSetting))
}

/**
 * 获取设置信息
 * @param key 如果null返回整个设置对象,否则返回对应属性值
 * @returns {*}
 */
function get (key) {
  let localSetting
  try {
    localSetting = JSON.parse(Vue.localStorage.get('local_setting'))
  } catch (e) {

  }
  if (key) {
    return localSetting && localSetting.hasOwnProperty(key) ? localSetting[key] : null
  }
  return localSetting || {}
}

Vue.use({
  install: (Vue, options) => {
    Vue.prototype.$localSetting = {
      saveValue (key, value) {
        const obj = {}
        obj[key] = value
        save(obj)
      },
      save: save,
      get: get
    }
  }
})
