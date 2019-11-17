import format from './format-parser'

const request = require('request-promise-native')
const fs = require('fs')
const cacheManager = require('./cache')
const xpath = require('xpath')
const DOMParser = require('xmldom').DOMParser
const htmlparser2 = require('htmlparser2')
const domParser = new DOMParser({
  errorHandler: {
    warning: w => {
    }
  }
})

let ruleMap = {}

const userAgentPool = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:47.0) Gecko/20100101 Firefox/47.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.6726.400 QQBrowser/10.2.2265.400',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18362'
]

function clearCache () {
  cacheManager.clear()
}

/**
 * 随机获取ua
 * @returns {string}
 */
function randomUserAgent () {
  return userAgentPool[Math.floor((Math.random() * userAgentPool.length))]
}

/**
 * 变换搜索参数
 * @param option
 * @param id
 * @param paths
 * @returns
 */
function transformSearchOption ({option, id, paths}) {
  const keyword = option.keyword
  const page = !option.page || option.page < 1 ? 1 : option.page
  // 如果没有指定的排序 就取第一个排序
  let sort = option.sort
  if (!(option.sort in paths)) {
    for (let property in paths) {
      sort = property
      break
    }
  }
  const path = paths[sort].replace(/{k}/g, encodeURIComponent(keyword)).replace(/{p}/g, page)
  return {id, keyword, page, sort, path}
}

/**
 * 根据规则和参数构建请求
 * @param rule
 * @param searchOption
 * @param setting
 * @returns
 */
function buildRequest ({rule, option, setting}) {
  const current = transformSearchOption({option, id: rule.id, paths: rule.paths})

  const root = rule.url
  const url = root + current.path
  current['url'] = url

  const host = root.substr(root.indexOf('://') + 3)
  const userAgent = setting.customUserAgent ? setting.customUserAgentValue : randomUserAgent()
  const headers = {
    'Host': host,
    'Origin': root,
    'Referer': root,
    'User-Agent': userAgent
  }
  const proxy = rule.proxy && setting.proxy ? `http://${setting.proxyHost}:${setting.proxyPort}` : null
  const requestOptions = {
    url: url,
    headers: headers,
    timeout: 10000,
    proxy: proxy
  }

  return {current, requestOptions}
}

/**
 * 解析Document
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
  console.silly(`\n${JSON.stringify(items, '\t', 2)}`)
  return items
}

/**
 * 从网络或者本地更新并缓存规则
 * @param url
 * @returns {Promise<void>}
 */
async function handleUpdateRuleFile (url) {
  let rule
  try {
    if (url.startsWith('http')) {
      // 如果是网络文件
      console.info('获取网络规则文件', url)
      const rsp = await request(url, {timeout: 8000, json: true})
      if (rsp.list) {
        rule = rsp
      }
    } else {
      console.info('读取本地规则文件', url)
      let rsp = JSON.parse(fs.readFileSync(url))
      if (rsp && rsp.list) {
        rule = rsp
      }
    }
  } catch (e) {
    rule = require('./rule.json')
    console.error('缓存规则失败，将使用本地规则', e.message)
  }
  let log = ''
  let proxy = 0
  rule.list.forEach(function (it) {
    log += `\n[加载][${it.name}][${it.url}]`
    if (it.proxy) {
      proxy++
    }
  })
  log += `\n${rule.list.length}个规则加载完成，其中${rule.list.length - proxy}个可直接使用，${proxy}个需要代理`
  console.info(log)
  cacheManager.set('rule_json', JSON.stringify(rule))
}

async function getRuleData (url) {
  let ruleJson = cacheManager.get('rule_json')
  if (ruleJson) {
    // 如果有缓存 直接使用缓存 然后异步更新
    handleUpdateRuleFile(url)
  } else {
    // 如果没有缓存 等待更新到规则
    await handleUpdateRuleFile(url)
    ruleJson = cacheManager.get('rule_json')
  }
  let rule = JSON.parse(ruleJson)
  rule.list.forEach(function (it) {
    ruleMap[it.id] = it
  })
  return rule
}

/**
 * 请求源站搜索结果并解析搜索结果
 * @param url 已拼接好的url
 * @param xpath 规则xpath
 */
async function requestParseSearchItems ({requestOptions, xpath}) {
  try {
    const rsp = await request(requestOptions)

    // 用htmlparser2转换一次再解析
    let outerHTML = htmlparser2.DomUtils.getOuterHTML(htmlparser2.parseDOM(rsp))
    const document = domParser.parseFromString(outerHTML)
    return {items: parseDocument(document, xpath)}
  } catch (e) {
    console.error('解析失败', e)
    return {err: e}
  }
}

/**
 * 异步缓存搜索结果
 * @param current
 * @param setting
 * @returns
 */
async function asyncCacheSearchResult ({current, setting}) {
  async function asyncRequest (option) {
    const rule = ruleMap[option.id]
    const {current, requestOptions} = buildRequest({rule, option, setting})
    const key = requestOptions.url
    if (cacheManager.get(key)) {
      // 如果还有缓存 就不请求了
      return
    }
    console.info('构建预加载请求', requestOptions)
    const {err, items} = await requestParseSearchItems({requestOptions, xpath: rule.xpath})
    if (items && items.length > 0) {
      // 存入缓存
      cacheManager.set(key, items, setting.cacheExpired)
    }
  }

  if (current.page === 1) {
    // 是第一页才缓存源站
    const option = JSON.parse(JSON.stringify(current))
    const keys = Object.keys(ruleMap)
    let nextIndex
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === option.id) {
        nextIndex = i + 1
        break
      }
    }
    if (nextIndex && nextIndex < keys.length) {
      option.id = ruleMap[keys[nextIndex]].id
    }
    asyncRequest(option)
  }

  // 缓存下一页
  const pageOption = JSON.parse(JSON.stringify(current))
  pageOption.page++
  asyncRequest(pageOption)
}

/**
 * 获取搜索结果
 * @param option 搜索的参数
 * @param setting
 * @param callback 回调
 * @returns
 */
async function obtainSearchResult (option, setting, callback) {
  if (!option.keyword) {
    const err = {message: '请输入要搜索的关键词'}
    callback(err)
    return
  }
  let startTime = Date.now()

  // 根据id找出具体规则
  const rule = ruleMap[option.id]

  const {current, requestOptions} = buildRequest({rule, option, setting})
  console.info('发起搜索', requestOptions)

  // 缓存
  const key = requestOptions.url
  let items = cacheManager.get(key)
  let useCache = !!items

  let err = null
  if (!useCache) {
    // 不使用缓存 去请求
    const result = await requestParseSearchItems({requestOptions, xpath: rule.xpath})
    err = result.err
    items = result.items
    if (items && items.length > 0) {
      // 存入缓存
      cacheManager.set(key, items, setting.cacheExpired)
    }
  }

  const time = Date.now() - startTime
  const res = {useCache, time}
  const data = {current, res, items}
  callback(err, data)

  // 异步预加载并缓存
  if (items && items.length > 0 && setting.preload) {
    asyncCacheSearchResult({current, setting})
  }
}

export default {
  getRuleData,
  obtainSearchResult,
  clearCache
}
