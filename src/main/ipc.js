import repo from './repository'
import path from 'path'
import logger from './logger'
import fs from 'fs'

const {ipcMain} = require('electron')

export default function (mainWindow) {
  process.on('uncaughtException', function (e) {
    console.error('出现异常', e)
  })

  ipcMain.on('window-max', function () {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })
  ipcMain.on('get-rule', async (event) => {
    event.returnValue = await repo.getRule()
  })

  ipcMain.on('load-rule-data', async (event, url) => {
    const rule = await repo.loadRuleByURL(url)
    if (rule) {
      event.sender.send('on-load-rule-data', rule)
    }
  })

  ipcMain.on('reload-rule-data', async (event, url) => {
    const rule = await repo.loadRuleByURL(url)
    event.sender.send('on-reload-rule-data', rule)
  })

  ipcMain.on('search', (event, option, localSetting) => {
    repo.obtainSearchResult(option, localSetting, function (err, rsp) {
      const success = !err
      const message = success ? null : err.message
      event.sender.send('on-search-response', {
        success: success,
        message: message,
        data: rsp
      })
    })
  })

  ipcMain.on('clear-cache', async (event) => {
    repo.clearCache()
  })

  ipcMain.on('get-app-info', async (event) => {
    let dir = path.resolve(logger.transports.file.file, '..')
    event.sender.send('on-get-app-info', {
      logDir: dir
    })
  })
}
