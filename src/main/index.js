'use strict'

import {app, BrowserWindow, Menu} from 'electron'
import openAboutWindow from 'about-window'
import registerIPC from './ipc'

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
  mainWindow = new BrowserWindow({
    height: 680,
    useContentSize: true,
    width: 1000,
    minWidth: 800,
    minHeight: 550,
    // 边框隐藏
    frame: true,
    titleBarStyle: 'hidden'
    // titleBarStyle: 'default'
  })

  if (process.env.NODE_ENV === 'development') {
    const menu = Menu.buildFromTemplate([{
      submenu: [
        {
          label: '关于',
          click: function () {
            openAboutWindow({
              open_devtools: false,
              icon_path: path.resolve('build/icons/256x256.png'),
              homepage: 'http://magnetw.github.io',
              css_path: path.resolve(__dirname, 'about.css'),
              package_json_dir: path.resolve(),
              titleBarStyle: 'hidden',
              win_options: {
                resizable: false,
                minimizable: false,
                maximizable: false,
                movable: false,
                titleBarStyle: 'hidden',
                modal: true
              }
            })
          }
        },
        {
          label: '开发人员工具',
          click: function () {
            mainWindow.webContents.openDevTools()
          }
        }]
    }])
    Menu.setApplicationMenu(menu)
  }

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

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
