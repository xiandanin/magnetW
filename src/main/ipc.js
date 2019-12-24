// import fs from 'fs'

const {ipcMain, app} = require('electron')
const request = require('request-promise-native')
const {reload} = require('./api')
const processConfig = require('./process-config')
const Store = require('electron-store')
const store = new Store()

function registerIPC (mainWindow) {
  ipcMain.on('window-max', function () {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })
  /**
   * 保存配置
   */
  ipcMain.on('save-server-config', async (event, config) => {
    const configVariable = processConfig.extractConfigVariable(config)
    const newConfig = processConfig.getConfig(configVariable)

    configVariable ? console.info('使用自定义配置加载服务', configVariable, newConfig) : console.info('使用默认配置加载服务', configVariable, newConfig)
    let err
    try {
      await reload(newConfig)
    } catch (e) {
      err = e.message
    }
    configVariable ? store.set('config_variable', configVariable) : store.delete('config_variable')
    event.sender.send('on-save-server-config', newConfig, err)
  })
  /**
   * 获取配置信息
   */
  ipcMain.on('get-server-config', (event) => {
    event.sender.send('on-server-config', processConfig.getConfig(store.get('config_variable')))
  })
  /**
   * 获取默认配置信息
   */
  ipcMain.on('get-default-server-config', (event, callbackName) => {
    event.returnValue = processConfig.defaultConfig()
  })
  /**
   * 检查更新
   */
  ipcMain.on('check-update', async (event) => {
    try {
      const response = await request({
        url: processConfig.defaultConfig().checkUpdateURL,
        json: true
      })
      let newVerArray = response.version.split('.')
      let currentVerArray = app.getVersion().split('.')
      for (let i = 0; i < newVerArray.length; i++) {
        if (parseInt(newVerArray[i]) > parseInt(currentVerArray[i])) {
          event.sender.send('new-version', response)
          return
        }
      }
      console.info('暂无更新', response.version)
    } catch (e) {
      console.error(e.message)
    }
  })
}

module.exports = registerIPC
