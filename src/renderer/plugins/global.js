import Vue from 'vue'
import {ipcRenderer, shell} from 'electron'

import defaultSetting from '../config'

let localSetting = deepCopy(defaultSetting)
let localSettingVariable = JSON.parse(localStorage.getItem('local_setting_variable'))
if (localSettingVariable) {
  // 合并配置
  Object.assign(localSetting, localSettingVariable)
}

function deepCopy (obj) {
  return JSON.parse(JSON.stringify(obj))
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
  // 如果修改了配置
  if (Object.keys(tempSettingVariable).length > 0) {
    // 重新合并配置数据
    let tempSetting = deepCopy(defaultSetting)
    Object.assign(tempSetting, tempSettingVariable)
    localSetting = tempSetting

    localStorage.setItem('local_setting_variable', JSON.stringify(tempSettingVariable))
    console.debug('保存修改设置', tempSettingVariable)
  }
}

Vue.prototype.global = {
  settings: {
    defaultSetting,
    localSetting,
    saveSetting
  }
}

Vue.prototype.deepCopy = deepCopy
