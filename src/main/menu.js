const {Menu, app, session} = require('electron')
const is = require('electron-is')

module.exports = function (mainWindow) {
  const appSubmenu = [
    ...(is.dev() ? [
      {
        label: '开发人员工具',
        role: 'toggledevtools'
      },
      {type: 'separator'}
    ] : []),
    /* {label: `关于 ${app.name}`, role: 'about'}, */
    {label: '清除缓存', click: () => session.defaultSession.clearCache(() => console.info('清除完成'))},
    {type: 'separator'},
    ...(is.macOS() ? [
      {label: `隐藏 ${app.name}`, role: 'hide'},
      {label: '隐藏其他应用', role: 'hideothers'},
      {label: '显示全部', role: 'unhide'},
      {type: 'separator'}
    ] : []),
    {label: `退出 ${app.name}`, role: 'quit'}
  ]
  const windowMenu = [
    {label: '重新加载', role: 'reload'},
    {label: '最小化', role: 'minimize'},
    {label: '最大化', click: () => mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()},
    {type: 'separator'},
    {label: '关闭窗口', role: 'close'},
    ...(is.macOS() ? [
      {type: 'separator'},
      {label: '前置全部窗口', role: 'front'}
    ] : [])
  ]
  const editMenu = [
    {label: '撤销', role: 'undo'},
    {label: '重做', role: 'redo'},
    {type: 'separator'},
    {label: '剪切', role: 'cut'},
    {label: '复制', role: 'copy'},
    {label: '粘贴', role: 'paste'},
    ...(is.macOS() ? [
      {label: '粘贴并匹配样式', role: 'pasteAndMatchStyle'},
      {label: '删除', role: 'delete'},
      {label: '全选', role: 'selectAll'},
      {type: 'separator'},
      {
        label: '语音',
        submenu: [
          {label: '开始讲话', role: 'startspeaking'},
          {label: '停止讲话', role: 'stopspeaking'}
        ]
      }
    ] : [
      {label: '删除', role: 'delete'},
      {type: 'separator'},
      {label: '全选', role: 'selectAll'}
    ])
  ]
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: appSubmenu
    },
    {
      label: '编辑',
      submenu: editMenu
    },
    {
      label: '窗口',
      submenu: windowMenu
    }
  ])
  Menu.setApplicationMenu(menu)
}
