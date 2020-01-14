const format = require('./format-parser')
const URI = require('urijs')
const fs = require('fs')
const createAxios = require('./axios')
const cacheManager = require('./cache')
const {loadFilterData, isFilter} = require('./filter/filter')
const xpath = require('xpath')
const DOMParser = require('xmldom').DOMParser
const htmlparser2 = require('htmlparser2')
const domParser = new DOMParser({
  errorHandler: {
    warning: w => {
      // console.warn(w)
    },
    error: e => {
      // console.error(e)
    },
    fatalError: e => {
      // console.error(e)
    }
  }
})

let ruleMap = {}
let config = null
let request = null

function applyConfig (newConfig) {
  config = newConfig
  request = createAxios(newConfig)

  if (config.filterBare) {
    loadFilterData()
  }
}

function clearCache () {
  cacheManager.clear()
}

/**
 * 补齐搜索参数
 * @param rule
 * @param keyword
 * @param page
 * @param sort
 * @returns {{id: *, page: *, sort: *, keyword: *, url: *}}
 */
function makeupSearchOption ({id, keyword, page, sort}) {
  const rule = getRuleById(id)

  const newPage = Math.max(1, page || null)
  // 如果没有指定的排序 就取第一个排序
  const pathKeys = Object.keys(rule.paths)
  const newSort = pathKeys.indexOf(sort) !== -1 ? sort : pathKeys[0]
  // 拼接完整url
  const url = rule.url + rule.paths[newSort].replace(/{k}/g, encodeURIComponent(keyword)).replace(/{p}/g, newPage)
  return {id: rule.id, keyword, page: newPage, sort: newSort, url}
}

function getRuleById (id) {
  return ruleMap[id] || ruleMap[Object.keys(ruleMap)[0]]
}

async function requestDocument (url, clientHeaders) {
  const timeout = config.timeout || 10000

  // header
  const uri = new URI(url)
  const host = uri.host()
  const origin = uri.origin()
  const headers = {
    'host': host,
    'origin': origin,
    'referer': origin
  }
  const acceptLanguage = clientHeaders['accept-language']
  headers['accept-language'] = acceptLanguage || 'zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7,und;q=0.6,ja;q=0.5'
  const xForwardedFor = clientHeaders['x-forwarded-for']
  if (xForwardedFor) {
    headers['x-forwarded-for'] = xForwardedFor
  }
  const userAgent = clientHeaders['user-agent']
  if (userAgent) {
    const newUserAgent = config.requestIdentifier && / windows | mac | android | ios /gi.test(userAgent) && process.env.npm_package_version ? `${userAgent} MWBrowser/${process.env.npm_package_version}` : userAgent
    headers['user-agent'] = config.customUserAgent && config.customUserAgentValue ? config.customUserAgentValue : newUserAgent
  }
  const options = {url: url, headers: headers, timeout: timeout}

  const html = await request(options)

  // 用htmlparser2转换一次再解析
  const outerHTML = htmlparser2.DomUtils.getOuterHTML(htmlparser2.parseDOM(html))
  return domParser.parseFromString(outerHTML)
}

async function obtainDetailResult ({id, path}, headers) {
  const rule = getRuleById(id)
  if (!rule || !rule.xpath.detail) {
    throw new Error('此源站没有配置详情规则')
  }
  const url = rule.url + path
  // 如果有缓存
  let detail = cacheManager.get(url)
  if (!detail) {
    // 去源站请求详情
    let document = await requestDocument(url, headers)
    detail = parseDetailDocument(document, rule.xpath.detail)

    if (detail) {
      detail['url'] = url

      // 缓存请求到的详情
      cacheManager.set(url, detail)
    }
  }
  return detail
}

async function obtainSearchResult ({id, url}, headers) {
  const rule = getRuleById(id)

  // 如果没有缓存
  let items = cacheManager.get(url)
  if (!items || items.length <= 0) {
    // 去源站请求
    let document = await requestDocument(url, headers)
    items = parseItemsDocument(document, rule.xpath)

    if (items && items.length > 0) {
      // 缓存请求到的列表
      cacheManager.set(url, items, config.cacheExpired)
    }
  }

  // 过滤
  const originalCount = items.length
  if (config.filterBare || config.filterEmpty) {
    items = items.filter((item) => {
      if (config.filterBare) {
        return !isFilter(item.name.replace(/ /g, ''))
      } else if (config.filterEmpty) {
        return typeof item.size === 'number' && item.size > 0
      }
    })
  }

  return {originalCount, items}
}

/**
 * 缓存下一页
 * @param id
 * @param keyword
 * @param page
 * @param sort
 * @param headers
 * @param userAgent
 */
function asyncCacheSearchResult ({id, keyword, page, sort}, headers) {
  if (!config.preload) {
    return
  }

  // 缓存下一页
  const next = makeupSearchOption({id, keyword, page: page + 1, sort})
  obtainSearchResult({id, url: next.url}, headers)

  /*
  if (page === 1) {
    // 是第一页才缓存下一个源站
    let ruleKeys = Object.keys(ruleMap)
    const rule = ruleMap[ruleKeys[ruleKeys.indexOf(id) + 1]]
    if (rule) {
      const next = makeupSearchOption({id: rule.id, keyword, page, sort})
      obtainSearchResult({id: next.id, url: next.url}, headers)
    }
  }
  */
}

/**
 * 解析列表Document
 * @param document
 * @param expression xpath表达式对象
 */
function parseItemsDocument (document, expression) {
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
    const detailUrlText = format.extractTextByNode(xpath.select(detailExps, child))
    const detailUrl = detailUrlText ? new URI(detailUrlText).hostname('').toString() : null
    if (name) {
      items.push({
        name, magnet, resolution, date, size, hot, detailUrl
      })
    }
  })
  // console.silly(`\n${JSON.stringify(items, '\t', 2)}`)
  return items
}

/**
 * 解析详情
 * @param document
 * @param expression
 */
function parseDetailDocument (document, expression) {
  const rootNode = xpath.select1(expression.root, document)
  let magnet
  if (expression.magnet) {
    magnet = format.extractMagnet(format.extractTextByNode(xpath.select1(expression.magnet, rootNode)))
    if (!magnet) {
      return null
    }
  }
  const fileNodes = expression.files ? xpath.select(expression.files, rootNode) : null
  let files = null
  if (fileNodes) {
    files = []
    fileNodes.forEach((child, index) => {
      const fileArray = format.splitByFileSize(format.extractTextByNode(child))
      files.push({
        name: fileArray[0],
        size: format.extractFileSize(fileArray[1])
      })
    })
  }
  return {magnet, files}
}

/**
 * 从网络或者本地更新并缓存规则
 * @returns {Promise<void>}
 */
async function loadRuleByURL () {
  const url = config.ruleUrl
  let rule
  try {
    if (url.startsWith('http')) {
      // 如果是网络文件
      console.info('获取网络规则文件', url)
      rule = await request(url, {timeout: 8000, json: true})
    } else {
      console.info('读取本地规则文件', url)
      rule = JSON.parse(fs.readFileSync(url))
    }
    if (!Array.isArray(rule) || rule.length <= 0) {
      throw new Error('规则格式不正确')
    }
  } catch (e) {
    console.error(e.message, '规则加载失败，将使用内置规则')
    rule = require('../../rule.json')
  }
  cacheManager.set('rule_json', JSON.stringify(rule))

  rule.forEach((it) => {
    ruleMap[it.id] = it
  })
  return rule
}

async function getRule () {
  const ruleJson = cacheManager.get('rule_json')
  const rule = ruleJson ? JSON.parse(ruleJson) : await loadRuleByURL()
  return rule
}

module.exports = {
  applyConfig,
  loadRuleByURL,
  getRule,
  obtainSearchResult,
  clearCache,
  makeupSearchOption,
  obtainDetailResult,
  asyncCacheSearchResult
}
