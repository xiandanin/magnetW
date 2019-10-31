import repo from './repository'

const {ipcMain} = require('electron')

export default function () {
  ipcMain.on('get-config', (event) => {
    const config = require('../renderer/config.json')
    event.sender.send('on-get-config', config)
  })

  ipcMain.on('load-rule-data', async (event, url) => {
    event.sender.send('on-load-rule-data', await repo.getRuleData(url))
  })

  ipcMain.on('search', (event, option, localSetting) => {
    const customUserAgent = localSetting.customUserAgent.enabled ? localSetting.customUserAgent : null
    repo.requestSearch(
      {
        option,
        userAgent: customUserAgent,
        cache: localSetting.cache,
        preload: localSetting.optimization.preload
      }, function (rsp) {
        event.sender.send('on-search-response', {
          success: true,
          data: rsp
        })
      })
  })
}
