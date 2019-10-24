import {ipcRenderer} from 'electron'

export default {
  methods: {
    loadConfigInfo () {
      ipcRenderer.send('get-config')
    }
  },
  created () {
    ipcRenderer.on('on-get-config', (event, config) => {
      this.handleConfigInfo(config)
    })
  }
}
