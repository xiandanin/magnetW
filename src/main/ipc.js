import repo from './repository'

const {ipcMain} = require('electron')

export default function () {
  ipcMain.on('get-config', (event) => {
    const config = require('./config.json')
    event.sender.send('on-get-config', config)
  })

  ipcMain.on('get-all-source', (event) => {
    event.sender.send('on-get-all-source', repo.getSourceSiteList())
  })

  ipcMain.on('search', (event, option) => {
    repo.requestSearch(option, function (rsp) {
      event.sender.send('on-search-response', {
        success: true,
        data: rsp
      })
    })
  })
}
