module.exports = function () {
  return {
    checkUpdateURL: 'https://magnetw.app/update.json',
    // 云解析URL
    cloud: false,
    cloudUrl: '',
    // 解析规则文件URL 支持网络链接和本地路径
    ruleUrl: 'https://magnetw.app/rule.json',
    // 默认最大化窗口
    maxWindow: false,
    // 是否显示需要代理的源站
    showProxyRule: false,
    // 是否显示源站入口
    showSourceLink: false,
    // 过滤
    filterBare: true,
    // 使用代理
    proxy: false,
    proxyType: 'http',
    proxyHost: '127.0.0.1',
    proxyPort: 1087,
    // 是否启用预加载 启用后会预加载下一页和下一个源站
    preload: true,
    // 缓存过期时间
    cacheExpired: 7200,
    // 追加请求标识
    requestIdentifier: false,
    // 自定义UserAgent
    customUserAgent: false,
    customUserAgentValue: null
  }
}
