// import fs from 'fs'

const logger = require('./logger')
const path = require('path')
const {ipcMain, app} = require('electron')
const request = require('request-promise-native')
const {reload, start, getProxyNetworkInfo} = require('./api')
const {defaultConfig, extractConfigVariable, getConfig} = require('./process-config')
const Store = require('electron-store')
const store = new Store()

async function registerServer () {
  const configVariable = store.get('config_variable')
  const newConfig = getConfig(configVariable)
  configVariable ? console.info('使用自定义配置加载服务', configVariable, newConfig) : console.info('使用默认配置加载服务', configVariable, newConfig)
  const {port, ip, local, message} = await start(newConfig, false)
  if (message) {
    console.error(message)
  } else {
    console.info(`启动成功，本地访问 http://${local}:${port}，IP访问 http://${ip}:${port}`)
  }
}

function getLocalConfig () {
  return getConfig(store.get('config_variable'))
}

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
    let oldConfig = getLocalConfig()
    const configVariable = extractConfigVariable(config)
    const newConfig = getConfig(configVariable)

    let err
    try {
      // 如果修改了规则url 就重新加载
      await reload(newConfig, newConfig.ruleUrl !== oldConfig.ruleUrl)
    } catch (e) {
      err = e.message
    }
    if (configVariable) {
      store.set('config_variable', configVariable)
      console.info('保存配置', configVariable, newConfig)
    } else {
      store.delete('config_variable')
    }
    event.sender.send('on-save-server-config', newConfig, oldConfig, err)
  })
  /**
   * 获取配置信息
   */
  ipcMain.on('get-server-config', (event) => {
    event.returnValue = getLocalConfig()
  })
  /**
   * 获取默认配置信息
   */
  ipcMain.on('get-default-server-config', (event) => {
    event.returnValue = defaultConfig()
  })
  /**
   * 检查更新
   */
  ipcMain.on('check-update', async (event) => {
    try {
      const response = await request({
        url: defaultConfig().checkUpdateURL,
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

  /**
   * 获取信息
   */
  ipcMain.on('get-app-info', (event) => {
    event.returnValue = {
      logDir: path.resolve(logger.transports.file.file, '..')
    }
  })

  /**
   * 获取网络信息
   */
  ipcMain.on('get-network-info', async (event, proxy) => {
    event.sender.send('on-get-network-info', await getProxyNetworkInfo(proxy))
  })
}

module.exports = {registerIPC, registerServer}
