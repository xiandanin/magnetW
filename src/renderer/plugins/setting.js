import createDefault from '../data/defaultSetting'

let local = createLocal()

function saveSetting (newSetting) {
  const tempSettingVariable = {}
  let defaultSetting = createDefault()
  for (let key in newSetting) {
    // 如果不是默认配置 就保存
    if (newSetting.hasOwnProperty(key)) {
      const value = newSetting[key]
      if (value !== defaultSetting[key]) {
        tempSettingVariable[key] = value
      }
    }
  }
  // 如果修改了配置 就重新合并配置数据
  const isModified = Object.keys(tempSettingVariable).length > 0
  if (isModified) {
    let tempSetting = createDefault()
    Object.assign(tempSetting, tempSettingVariable)
  }
  localStorage.setItem('local_setting_variable', isModified ? JSON.stringify(tempSettingVariable) : null)
  console.info('保存修改设置', tempSettingVariable)

  local = createLocal()
}

function createLocal () {
  function getLocalSettingVariable () {
    try {
      return JSON.parse(localStorage.getItem('local_setting_variable'))
    } catch (e) {
      return null
    }
  }

  let localSetting = createDefault()
  // 合并配置
  Object.assign(localSetting, getLocalSettingVariable())
  return localSetting
}

export default {
  install: (Vue, options) => {
    Vue.prototype.settings = {
      createDefault,
      createLocal,
      saveSetting,
      local
    }
  }
}
