const moment = require('moment')

const sizeUnit = ['B|bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
const sizeUnitSpare = ['B|bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
const sizeUnitRegx = sizeUnit.join('|')
const sizeUnitSpareRegx = sizeUnitSpare.join('|')

function extractNumber (str) {
  const match = /\d+/.exec(str)
  return match ? parseInt(match[0]) : str
}

function extractFloat (str) {
  const match = /(\d+(\.\d+)?)/.exec(str)
  return match ? parseFloat(match[0]) : str
}

function extractSizeText (str) {
  const match = new RegExp(`(\\d+(\\.\\d+)?)(&nbsp;| )*(${sizeUnitRegx}|${sizeUnitSpareRegx})`, 'gi').exec(str)
  return match ? match[0] : str
}

module.exports = {
  extractNumber,
  extractFloat,
  /**
   * 从节点里提取文本
   * @param node
   */
  extractTextByNode (node) {
    if (node) {
      if (Array.isArray(node)) {
        if (node.length > 0) {
          return node[0].textContent.trim()
        }
      } else {
        return node.textContent.trim()
      }
    }
    return null
  },
  /**
   * 提取分辨率
   * @param name
   */
  extractResolution (name) {
    const regx = {
      '4K': '2160|4k',
      '2K': '1440|2k',
      '1080P': '1920|1080',
      '720P': '1280|720'
    }
    for (let key in regx) {
      if (new RegExp(regx[key], 'i').test(name)) {
        return key
      }
    }
  },
  /**
   * 提取磁力链
   * @param url
   */
  extractMagnet (url) {
    if (url) {
      // 如果是磁力链 直接返回
      if (/^(magnet:\?xt=urn:btih:)/.test(url)) {
        return url.toLowerCase()
      } else {
        // 如果不是磁力链 就提取 连续字母数字32-40位
        let match = /[\da-zA-Z]{32,40}/.exec(url)
        if (match) {
          return `magnet:?xt=urn:btih:${match[0]}`.toLowerCase()
        }
      }
    }
    return null
  },
  /**
   * 提取时间
   * @param dateText
   */
  extractDate: function (dateText) {
    if (dateText) {
      const parser = [
        {
          // 2019-12-22
          regx: /(\d{4})-(\d{1,2})-(\d{1,2})/,
          format: ['YYYY-MM-DD']
        },
        {
          // 2019-12-22 21:26
          regx: /(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})/,
          format: ['YYYY-MM-DD HH:mm']
        },
        {
          // 2019-12-22 21:26:51
          regx: /(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})/,
          format: ['YYYY-MM-DD HH:mm:ss']
        },
        {
          // 09-09 2018
          regx: /(\d{1,2})-(\d{1,2})(&nbsp;| )(\d{4})/,
          format: 'MM-DD YYYY'
        },
        {
          // 12-17 08:08
          regx: /(\d{1,2})-(\d{1,2})(&nbsp;| )(\d{2}):(\d{2})/,
          format: 'MM-DD HH:mm'
        }
      ]
      for (let i = 0; i < parser.length; i++) {
        const regx = parser[i].regx
        if (regx.test(dateText)) {
          const exec = regx.exec(dateText)
          const text = exec ? exec[0] : dateText
          return moment(text, parser[i].format).valueOf()
        }
      }
      // 如果是时间间隔
      if (/yesterday|昨天/.test(dateText)) {
        return moment().subtract(1, 'day').valueOf()
      } else {
        const unit = [
          {regx: 'yesterday|昨天', name: 'days'},
          {regx: 'year|年', name: 'years'}, {regx: 'month|月', name: 'months'},
          {regx: 'day|天', name: 'days'}, {regx: 'hour|小时', name: 'hour'},
          {regx: 'minute|分钟', name: 'minutes'}, {regx: 'second|秒', name: 'seconds'}
        ]
        for (let i = 0; i < unit.length; i++) {
          const dateTextMatches = new RegExp(`\\d+( {0,3})${unit[i].regx}`, 'gi').exec(dateText)
          if (dateTextMatches) {
            const number = extractNumber(dateTextMatches[0])
            return moment().subtract(number, unit[i].name).valueOf()
          }
        }
      }
      return 0
    }
  },
  /**
   * 提取文件大小(字节)
   * @param sizeText
   */
  extractFileSize (sizeText) {
    let extSizeText = extractSizeText(sizeText)
    if (extSizeText) {
      let index = -1
      for (let i = sizeUnit.length - 1; i >= 0; i--) {
        if (new RegExp(`${sizeUnit[i]}|${sizeUnitSpare[i]}`, 'i').test(sizeText)) {
          index = i
          break
        }
      }
      if (index >= 0) {
        return parseInt(extractFloat(extSizeText) * Math.pow(1024, index))
      }
      return extSizeText
    } else {
      return sizeText
    }
  },
  splitByFileSize (str) {
    const regx = new RegExp(`(\\d+(\\.\\d+)?) {1,3}(${sizeUnitRegx})$`, 'gi')
    const match = regx.exec(str)
    const filesize = match ? match[0] : str
    const filename = str.replace(regx, '')
    const array = [filename, filesize]
    return array.filter(it => it.trim())
  }
}
