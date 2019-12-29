const defaultConfig = require('./defaultConfig')

/**
 * 从修改后的配置对象中提取修改的变量
 * @param newConfig
 * @returns {null}
 */
function extractConfigVariable (newConfig) {
  const tempSettingVariable = {}
  let defaultSetting = defaultConfig()
  for (let key in newConfig) {
    // 如果不是默认配置 就保存
    if (newConfig.hasOwnProperty(key)) {
      const value = newConfig[key]
      if (value != null && value.toString().length > 0 && value !== defaultSetting[key]) {
        tempSettingVariable[key] = value
      }
    }
  }
  // 如果修改了配置 就重新合并配置数据
  const isModified = Object.keys(tempSettingVariable).length > 0
  if (isModified) {
    let tempSetting = defaultConfig()
    Object.assign(tempSetting, tempSettingVariable)
    return tempSettingVariable
  }
  return null
}

/**
 * 合并一个新的配置对象
 * @param configVariable 可为null
 * @returns {{trackers, checkUpdateURL, memoryLastRule, showProxyRule, customUserAgent, proxyHost, preload, proxy, proxyPort, customUserAgentValue, cacheExpired, trackersUrl, ruleUrl}}
 */
function getConfig (configVariable) {
  let localSetting = defaultConfig()
  // 合并配置
  Object.assign(localSetting, configVariable)
  return localSetting
}

module.exports = {
  defaultConfig,
  extractConfigVariable,
  getConfig
}
