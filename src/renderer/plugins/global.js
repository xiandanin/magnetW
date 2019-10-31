import Vue from 'vue'

const defaultSetting = require('../config.json')
let localSetting = JSON.parse(localStorage.getItem('local_setting'))
if (!localSetting) {
  localSetting = copyObject(defaultSetting)
}
console.log(localSetting)

function copyObject (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function saveSetting (setting) {
  console.log('保存设置', setting)
  localSetting = setting
  localStorage.setItem('local_setting', JSON.stringify(setting))
}

Vue.prototype.global = {
  active: null,
  settings: {
    defaultSetting,
    localSetting,
    saveSetting
  }
}

Vue.prototype.copyObject = copyObject
