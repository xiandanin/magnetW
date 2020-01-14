const axios = require('axios')
const tunnel = require('tunnel')
const SocksProxyAgent = require('socks-proxy-agent')

/**
 * @param appConfig 必填
 * @returns {*}
 */
function create (appConfig) {
  const defaultTimeout = 5000

  const http = axios.create({
    timeout: defaultTimeout
  })
  http.interceptors.request.use(config => {
    let proxyURL
    if (appConfig && appConfig.hasOwnProperty('proxy') && appConfig.hasOwnProperty('proxyType') &&
      appConfig.hasOwnProperty('proxyHost') && appConfig.hasOwnProperty('proxyPort')) {
      const {proxy, proxyType, proxyHost, proxyPort} = appConfig
      if (proxy) {
        const timeout = config.timeout
        proxyURL = `${proxyType}://${proxyHost}:${proxyPort}`
        const proxyAgent = proxyType.startsWith('socks') ? new SocksProxyAgent({
          protocol: `${proxyType}:`,
          hostname: proxyHost,
          port: proxyPort,
          timeout: timeout
        }) : tunnel.httpsOverHttp({
          timeout: timeout,
          proxy: {
            host: proxyHost,
            port: proxyPort
          }
        })
        config.httpAgent = proxyAgent
        config.httpsAgent = proxyAgent
      }
    }
    const headers = config.headers
    const customHeaders = {}
    for (let key in headers) {
      if (!/common|delete|get|head|post|put|patch/.test(key)) {
        customHeaders[key] = headers[key]
      }
    }
    console.info({
      url: config.url,
      headers: customHeaders,
      proxy: proxyURL
    })
    return config
  })
  http.interceptors.response.use(rsp => rsp.data, error => Promise.reject(error))
  return http
}

module.exports = create
