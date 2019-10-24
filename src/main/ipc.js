const {ipcMain} = require('electron')

export default function () {
  ipcMain.on('get-config', (event) => {
    const config = require('./config.json')
    event.sender.send('on-get-config', config)
  })
}
