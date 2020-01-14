const moment = require('moment')
const logger = require('./logger')
const path = require('path')
const {ipcMain, app} = require('electron')
const createAxios = require('./axios')
const {reload, start, isStarting, getServerInfo} = require('./api')
const {defaultConfig, extractConfigVariable, getConfig} = require('./process-config')
const Store = require('electron-store')
const store = new Store()

async function registerServer () {
  if (isStarting()) {
    console.info('服务已启动')
  } else {
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
}

function getLocalConfig () {
  return getConfig(store.get('config_variable'))
}

function registerIPC (mainWindow) {
  ipcMain.on('get-server-info', function (event) {
    const configVariable = store.get('config_variable')
    const newConfig = getConfig(configVariable)
    event.sender.send('on-get-server-info', getServerInfo(), newConfig)
  })

  ipcMain.on('window-max', function () {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })
  ipcMain.on('api-base-url', function (event) {
    let serverInfo = getServerInfo()
    event.returnValue = serverInfo && serverInfo.url ? serverInfo.url : ''
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
      const request = createAxios(getLocalConfig())
      const response = await request({
        url: defaultConfig().checkUpdateURL,
        responseType: 'json'
      })
      let newVerArray = response.version.split('.')
      let currentVerArray = app.getVersion().split('.')
      for (let i = 0; i < newVerArray.length; i++) {
        if (parseInt(newVerArray[i]) > parseInt(currentVerArray[i])) {
          event.sender.send('new-version', response)
          return
        }
      }
      console.info(`is the latest, cur: ${app.getVersion()}, latest: ${response.version}`)
    } catch (e) {
      console.error(e.message)
    }
  })

  /**
   * 获取信息
   */
  ipcMain.on('get-app-info', (event) => {
    event.returnValue = {
      logDir: path.resolve(logger.transports.file.file, '..'),
      server: getServerInfo()
    }
  })

  /**
   * 获取网络信息
   */
  ipcMain.on('get-network-info', async (event, config) => {
    const ip = {
      url: 'http://gip.dog',
      headers: {'User-Agent': 'curl'}
    }
    const options = {
      url: 'https://www.google.com'
    }
    let googleTest = false
    let ipBody
    const start = Date.now()
    try {
      const request = createAxios(config)
      const googleBody = await request(options)
      googleTest = googleBody.length > 0
      ipBody = await request(ip)
    } catch (e) {
      console.error(e.message)
    }
    const time = Date.now() - start
    const test = {info: ipBody, test: googleTest, time}
    console.info(test)
    event.sender.send('on-get-network-info', test)
  })
}

module.exports = {registerIPC, registerServer}
