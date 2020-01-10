'use strict'

import {app, BrowserWindow, session} from 'electron'

const registerMenu = require('./menu')
const {appName, build} = require('../../package.json')
const is = require('electron-is')
const Store = require('electron-store')
const store = new Store()

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
// 关闭安全警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  const width = is.dev() ? 1200 : 1000
  mainWindow = new BrowserWindow({
    height: 680,
    useContentSize: true,
    width: width,
    minWidth: 900,
    minHeight: 550,
    frame: true,
    titleBarStyle: 'hidden',
    backgroundColor: '#fff',
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // 是否设置最大化
  const configVariable = store.get('config_variable')
  if (configVariable && configVariable.maxWindow) {
    mainWindow.maximize()
  }
  mainWindow.show()

  const userAgent = mainWindow.webContents.userAgent.replace(new RegExp(`${app.name}\\/.* `, 'gi'), '')
  mainWindow.webContents.userAgent = userAgent
  session.defaultSession.setUserAgent(userAgent)

  registerMenu(mainWindow)

  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  registerServer()
}

async function registerServer () {
  const {registerIPC, registerServer} = require('./ipc')
  registerIPC(mainWindow)
  registerServer()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
