import Vue from 'vue'
import {ipcRenderer, shell} from 'electron'

import defaultSetting from '../config'

let localSetting = deepCopy(defaultSetting)
let localSettingVariable = getLocalSettingVariable()
if (localSettingVariable) {
  // 合并配置
  Object.assign(localSetting, localSettingVariable)
}

function deepCopy (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function getLocalSettingVariable () {
  try {
    return JSON.parse(localStorage.getItem('local_setting_variable'))
  } catch (e) {
    return null
  }
}

function saveSetting (setting) {
  const tempSettingVariable = {}
  for (let key in setting) {
    // 如果不是默认配置 就保存
    const value = setting[key]
    if (value !== defaultSetting[key]) {
      tempSettingVariable[key] = value
    }
  }
  let tempSetting = deepCopy(defaultSetting)
  // 如果修改了配置 就重新合并配置数据
  const isModified = Object.keys(tempSettingVariable).length > 0
  if (isModified) {
    Object.assign(tempSetting, tempSettingVariable)
  }
  Vue.prototype.global.settings.localSetting = tempSetting
  localStorage.setItem('local_setting_variable', isModified ? JSON.stringify(tempSettingVariable) : null)
  console.debug('保存修改设置', tempSettingVariable)
}

Vue.prototype.global = {
  settings: {
    defaultSetting,
    localSetting,
    saveSetting
  }
}

Vue.prototype.deepCopy = deepCopy
