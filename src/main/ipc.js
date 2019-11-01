import repo from './repository'
import path from 'path'
import logger from './logger'

const {ipcMain} = require('electron')

export default function () {
  ipcMain.on('load-rule-data', async (event, url) => {
    event.sender.send('on-load-rule-data', await repo.getRuleData(url))
  })

  ipcMain.on('search', (event, option, localSetting) => {
    const customUserAgent = localSetting.request.customUserAgent.enabled ? localSetting.request.customUserAgent : null
    repo.obtainSearchResult(
      {
        option,
        userAgent: customUserAgent,
        cache: localSetting.cache,
        proxy: localSetting.proxy,
        preload: localSetting.optimization.preload
      }, function (rsp) {
        event.sender.send('on-search-response', {
          success: true,
          data: rsp
        })
      })
  })

  ipcMain.on('get-app-info', async (event) => {
    let dir = path.resolve(logger.transports.file.file, '..')
    event.sender.send('on-get-app-info', {
      logDir: dir
    })
  })
}
