import {Menu} from 'electron'
import openAboutWindow from 'about-window'

const path = require('path')

export default function (mainWindow) {
  const submenu = [
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
    }]
  if (process.env.NODE_ENV !== 'development') {
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
