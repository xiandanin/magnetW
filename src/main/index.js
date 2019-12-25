'use strict'

import {app, BrowserWindow, session} from 'electron'

const registerMenu = require('./menu')
const {build} = require('../../package.json')
const is = require('electron-is')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

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
    titleBarStyle: 'hidden'
  })

  registerMenu(mainWindow)

  const userAgent = mainWindow.webContents.getUserAgent().replace(new RegExp(`${app.getName()}\\/.* `, 'gi'), '')
  mainWindow.webContents.setUserAgent(userAgent)
  session.defaultSession.setUserAgent(userAgent)
  app.setName(build.productName)
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
