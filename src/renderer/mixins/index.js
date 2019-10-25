import {ipcRenderer} from 'electron'

export default {
  methods: {
    loadAllSource () {
      ipcRenderer.send('get-all-source')
    }
  },
  created () {
    ipcRenderer.on('on-get-all-source', (event, list) => {
      this.handleAllSource(list)
    })
  }
}
