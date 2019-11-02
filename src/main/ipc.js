import repo from './repository'
import path from 'path'
import logger from './logger'

const {ipcMain} = require('electron')

export default function () {
  ipcMain.on('load-rule-data', async (event, url) => {
    event.sender.send('on-load-rule-data', await repo.getRuleData(url))
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
