function extractNumber (str) {
  const match = /\d+/.exec(str)
  return parseInt(match ? match[0] : str)
}

function extractFloat (str) {
  const match = /(\d+(\.\d+)?)/.exec(str)
  return parseFloat(match ? match[0] : str)
}

export default {
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
      if (/magnet:?[^\\"]+/.test(url)) {
        return url
      } else {
        // 如果不是磁力链 就提取 连续字母数字32-40位
        let match = /[\da-zA-Z]{32,40}/.exec(url)
        return match ? `magnet:?xt=urn:btih:${match[0]}`.toLowerCase() : url
      }
    } else {
      return null
    }
  },
  /**
   * 提取时间
   * @param dateText
   */
  extractDate (dateText) {
    return dateText
  },
  /**
   * 提取文件大小
   * @param sizeText
   */
  extractFileSize (sizeText) {
    if (sizeText) {
      let unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let index = -1
      for (let i = 0; i < unit.length; i++) {
        if (new RegExp(unit[i], 'i').test(sizeText)) {
          index = i
          break
        }
      }
      if (index >= 0) {
        console.log(sizeText, extractFloat(sizeText) * Math.pow(1024, index))
        return extractFloat(sizeText) * Math.pow(1024, index)
      }
      return sizeText
    }
  }
}
