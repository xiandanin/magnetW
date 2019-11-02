export default {
  // 解析规则文件URL 支持网络链接和本地路径
  ruleUrl: 'https://raw.githubusercontent.com/dengyuhan/magnetW/electron/src/main/rule.json',
  // 是否显示需要代理的源站
  showProxyRule: false,
  // 记住上次选择的源站
  rememberLastRule: false,
  // 使用代理
  proxy: false,
  proxyHost: '127.0.0.1',
  proxyPort: '1087',
  // 是否启用预加载 启用后会预加载下一页和下一个源站
  preload: true,
  // 是否启用Tracker 启用后复制链接时会自动拼接Tracker参数
  trackers: false,
  // Tracker服务器列表的更新地址
  trackersUrl: 'https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best.txt',
  // 缓存过期时间
  cacheExpired: 3600,
  // 自定义UserAgent
  customUserAgent: false,
  customUserAgentValue: null
}
