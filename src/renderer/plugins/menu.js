import {remote} from 'electron'

const {Menu, MenuItem} = remote

const menu = new Menu()
menu.append(new MenuItem({label: '剪切', role: 'cut'}))
menu.append(new MenuItem({label: '复制', role: 'copy'}))
menu.append(new MenuItem({label: '粘贴', role: 'paste'}))
menu.append(new MenuItem({label: '删除', role: 'delete'}))
menu.append(new MenuItem({label: '全选', role: 'selectAll'}))

const textMenu = new Menu()
textMenu.append(new MenuItem({label: '复制', role: 'copy'}))
textMenu.append(new MenuItem({label: '全选', role: 'selectAll'}))

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  if (e.target.localName === 'input') {
    menu.popup({window: remote.getCurrentWindow()})
  } else if (window.getSelection().toString()) {
    textMenu.popup({window: remote.getCurrentWindow()})
  }
})
