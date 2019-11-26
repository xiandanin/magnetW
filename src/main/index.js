'use strict'

import {app, BrowserWindow, session} from 'electron'
import registerIPC from './ipc'
import registerMenu from './menu'
import {build} from '../../package.json'
import is from 'electron-is'

import {autoUpdater} from 'electron-updater'

const path = require('path')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
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
    frame: false,
    titleBarStyle: 'hidden'
  })

  registerMenu(mainWindow)

  const userAgent = mainWindow.webContents.getUserAgent().replace(new RegExp(app.getName(), 'gi'), 'MWSpider')
  mainWindow.webContents.setUserAgent(userAgent)
  session.defaultSession.setUserAgent(userAgent)
  app.setName(build.productName)
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  registerIPC(mainWindow)
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
function sendStatusToWindow (text) {
  console.info(text)
  mainWindow.webContents.send('message', text)
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.')
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (progressObj) => {
  let message = 'Download speed: ' + progressObj.bytesPerSecond
  message = message + ' - Downloaded ' + progressObj.percent + '%'
  message = message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  sendStatusToWindow(message)
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded')
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.logger = console
    // autoUpdater.checkForUpdates()
  }
})
