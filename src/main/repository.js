import format from './format-parser'

const got = require('got')
const fs = require('fs')
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

async function handleUpdateRuleFile (url) {
  let rule
  try {
    if (url.startsWith('http')) {
      // 如果是网络文件
      console.error('准备从网络获取规则', url)
      const rsp = await got.get(url, {timeout: 5000, json: true})
      if (rsp.list) {
        rule = rsp
      }
    } else {
      console.error('读取本地规则文件', url)
      let rsp = JSON.parse(fs.readFileSync(url))
      if (rsp && rsp.list) {
        rule = rsp
      }
    }
  } catch (e) {
    console.error('缓存规则失败，使用本地规则', e)
    rule = require('./rule.json')
  }
  rule.list.forEach(function (it) {
    ruleMap[it.id] = it
  })
  cache.set('rule_json', JSON.stringify(rule))
}

async function getRuleData (url) {
  const rule = cache.get('rule_json')
  if (rule) {
    // 如果有缓存 直接使用缓存 然后异步更新
    handleUpdateRuleFile(url)
    return JSON.parse(rule)
  } else {
    // 如果没有缓存 等待更新到规则
    await handleUpdateRuleFile(url)
    return JSON.parse(cache.get('rule_json'))
  }
}

/**
 * 请求源站搜索结果并解析搜索结果
 */
async function requestParseSearchItems ({url, headers, xpath, customUserAgent}) {
  // 自定义ua
  if (customUserAgent) {
    headers['User-Agent'] = customUserAgent
  }
  const rsp = await got.get(url, {headers: headers, timeout: 12000})

  // 用htmlparser2转换一次再解析
  let outerHTML = htmlparser2.DomUtils.getOuterHTML(htmlparser2.parseDOM(rsp.body))
  const document = domParser.parseFromString(outerHTML)
  return parseDocument(document, xpath)
}

async function asyncCacheSearchResult ({option, userAgent, cache}) {
// 根据id找出具体规则
  const rule = ruleMap[option.id]

  const {current, url, headers} = buildRequest(rule, option)

  let items = cache.get(url)
  let useCache = false
  if (items) {
    // 有数据 使用缓存
    useCache = true
  }

  console.log(useCache ? '搜索命中缓存' : '请求搜索', current, headers)

  if (!useCache) {
    // 不使用缓存 去请求
    items = await requestParseSearchItems({url, headers, xpath: rule.xpath, userAgent})
    if (items && items.length > 0) {
      // 缓存过期时间 秒转毫秒
      const expired = cache.expired * 1000
      cache.set(url, items, expired)
    }
  }
}

export default {
  getRuleData,
  /**
   * 获取搜索结果
   * @param option 搜索的参数
   * @param userAgent 自定义UserAgent
   * @param cache 缓存设置
   * @param preload 预加载设置
   * @param callback 成功回调
   * @returns {Promise<void>}
   */
  requestSearch: async function ({option, userAgent, cache, preload}, callback) {
    let startTime = Date.now()

    // 根据id找出具体规则
    const rule = ruleMap[option.id]

    const {current, url, headers} = buildRequest(rule, option)

    let items = cache.get(url)
    let useCache = false
    if (items) {
      // 有数据 使用缓存
      useCache = true
    }

    console.log(useCache ? '搜索命中缓存' : '请求搜索', current, headers)

    if (!useCache) {
      // 不使用缓存 去请求
      items = await requestParseSearchItems({url, headers, xpath: rule.xpath, userAgent})
      if (items && items.length > 0) {
        // 缓存过期时间 秒转毫秒
        const expired = cache.expired * 1000
        cache.set(url, items, expired)
      }
    }

    const time = Date.now() - startTime
    const res = {useCache, time}
    const data = {current, res, items}
    callback(data)
  }
}
