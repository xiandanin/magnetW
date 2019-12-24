const {Menu} = require('electron')

module.exports = function (mainWindow) {
  const submenu = [
    {
      label: '重新加载',
      click: function () {
        mainWindow.reload()
      }
    }]
  if (process.env.NODE_ENV === 'development') {
    submenu.push({
      label: '开发人员工具',
      click: function () {
        mainWindow.webContents.openDevTools()
      }
    })
  }
  const menu = Menu.buildFromTemplate([
    {
      label: 'app',
      submenu: submenu
    },
    {
      label: '编辑',
      role: 'editMenu'
    },
    {
      label: '窗口',
      role: 'windowMenu'
    }
  ])
  Menu.setApplicationMenu(menu)
}
