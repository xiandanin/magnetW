import {ipcRenderer, remote} from 'electron'
import axios from 'axios'
import URI from 'urijs'

function create () {
  const isDev = process.env.NODE_ENV === 'development'
  const config = ipcRenderer.sendSync('get-server-config')
  const localBaseURL = ipcRenderer.sendSync('api-base-url')
  const baseURI = config.cloud && config.cloudUrl ? new URI(config.cloudUrl) : new URI(localBaseURL)
  let http = axios.create({
    baseURL: baseURI.directory('api').toString(),
    timeout: 10000,
    responseType: 'json'
  })

  http.interceptors.response.use(response => {
      const data = response.data.data
      response.data = data
      return response
    }, error => {
      // 如果有success字段并且是false而且有提示 就替换提示
      if (error.response) {
        const rsp = error.response.data
        if (rsp.hasOwnProperty('success') && rsp.success === false && rsp.message) {
          error.message = rsp.message
        }
      }
      return Promise.reject(error)
    }
  )
  return http
}

export default create
