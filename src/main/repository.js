import format from './format-parser'

const got = require('got')
const xpath = require('xpath')
const DOMParser = require('xmldom').DOMParser
const htmlparser2 = require('htmlparser2')
const domParser = new DOMParser({
  errorHandler: {
    warning: w => {
    }
  }
})
const LRU = require('lru-cache')
const cache = new LRU()

let ruleMap = {}

const userAgentPool = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:47.0) Gecko/20100101 Firefox/47.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.6726.400 QQBrowser/10.2.2265.400',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18362'
]

function getUserAgent () {
  return userAgentPool[Math.floor((Math.random() * userAgentPool.length))]
}

function buildRequest (rule, option) {
  const keyword = option.keyword || '钢铁侠'
  const page = !option.page || option.page < 1 ? 1 : option.page
  // 如果没有指定的排序 就取第一个排序
  let sort = option.sort
  if (!(option.sort in rule.paths)) {
    for (let property in rule.paths) {
      sort = property
      break
    }
  }

  const root = rule.url
  const path = rule.paths[sort]
  const url = root + path.replace(/{keyword}/g, encodeURIComponent(keyword)).replace(/{page}/g, page)
  const host = root.substr(root.indexOf('://') + 3)
  const headers = {
    'Host': host,
    'Origin': root,
    'Referer': root,
    'User-Agent': getUserAgent()
  }
  const current = {
    url, keyword, page, sort
  }
  return {current, url, headers}
}

/**
 *
 * @param document
 * @param expression xpath表达式对象
 */
function parseDocument (document, expression) {
  const items = []
  const groupNodes = xpath.select(expression.group, document)
  groupNodes.forEach((child, index) => {
    // 名称
    const nameNode = xpath.select(expression.name, child)
    const name = format.extractTextByNode(nameNode)
    // 分辨率
    const resolution = format.extractResolution(name)
    // 磁力链
    const magnet = format.extractMagnet(format.extractTextByNode(xpath.select(expression.magnet, child)))
    // 时间
    const date = format.extractDate(format.extractTextByNode(xpath.select(expression.date, child)))
    // 文件大小
    const size = format.extractFileSize(format.extractTextByNode(xpath.select(expression.size, child)))
    // 人气
    const hot = expression.hot ? format.extractNumber(format.extractTextByNode(xpath.select(expression.hot, child))) : null
    // 详情url
    const detailExps = expression.name + '/@href'
    const detailUrl = format.extractTextByNode(xpath.select(detailExps, child))
    if (name) {
      items.push({
        name, magnet, resolution, date, size, hot, detailUrl
      })
    }
  })
  // console.log(items)
  return items
}

export default {
  getSourceSiteList: function () {
    let rule = require('./rule.json')
    rule.list.forEach(function (it) {
      ruleMap[it.id] = it
    })
    return rule
  },
  requestSearch: async function (option, callback) {
    // 根据id找出具体规则
    const rule = ruleMap[option.id]

    const {current, url, headers} = buildRequest(rule, option)

    let items = cache.get(url)
    if (items) {
      console.log('请求搜索，命中缓存', current)
      return items
    } else {
      console.log('请求搜索', current, headers)
    }

    const rsp = await got.get(url, {headers: headers, timeout: 12000})
    /* require('fs').writeFile('/Users/dengyuhan/Downloads/test.html', rsp.body, (err) => {
      console.error(err)
    }) */
    // 用htmlparser2转换一次再解析
    let outerHTML = htmlparser2.DomUtils.getOuterHTML(htmlparser2.parseDOM(rsp.body))
    const document = domParser.parseFromString(outerHTML)
    items = parseDocument(document, rule.xpath)
    if (items && items.length > 0) {
      cache.set(url, items, 3600)
    }
    const data = {current, items}
    callback(data)
  }
}
