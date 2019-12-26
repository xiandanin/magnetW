import Vue from 'vue'
import moment from 'moment'

function highlightWord (keyword, content) {
  const idx = content.toLowerCase().indexOf(keyword)
  let t = []
  if (idx > -1) {
    if (idx === 0) {
      t = highlightWord(keyword, content.substring(keyword.length))
      t.unshift({
        key: true,
        str: content.substring(idx, idx + keyword.length)
      })
      return t
    }
    if (idx > 0) {
      t = highlightWord(keyword, content.substring(idx))
      t.unshift({
        key: false,
        str: content.substring(0, idx)
      })
      return t
    }
  }
  return [{
    key: false,
    str: content
  }]
}

Vue.prototype.highlight = function (keyword, content, className) {
  let str = ''
  let array = highlightWord(keyword, content)
  array.forEach((it) => {
    if (it.key) {
      str += `<span class='${className}'>${it.str}</span>`
    } else {
      str += it.str
    }
  })
  return str
}

Vue.filter('size', function (size) {
  if (!size || size <= 0) {
    return '0 Bytes'
  }
  if (/^\d+$/.test(size)) {
    let unit = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let index = Math.floor(Math.log(size) / Math.log(1024))
    return (size / Math.pow(1024, index)).toFixed(2) + ' ' + unit[index]
  } else {
    return size
  }
})

Vue.filter('date', function (time) {
  if (/^-?\d+$/.test(time)) {
    const momentTime = moment(time)
    return momentTime.format(momentTime.hour() === 0 && momentTime.minute() === 0 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm')
  } else {
    return time
  }
})

Vue.filter('date_interval', function (time) {
  if (/^\d+$/.test(time)) {
    let delta = moment().valueOf() - time
    delta /= 60 * 1000
    if (delta < 60) {
      return Math.floor(delta) + ' 分钟前'
    }
    delta /= 60
    if (delta < 24) {
      return Math.floor(delta) + ' 小时前'
    }
    return moment(time).format('YYYY-MM-DD')
  } else {
    return time
  }
})

Vue.filter('hash', function (magnet) {
  return magnet.replace('magnet:?xt=urn:btih:', '')
})

Vue.filter('isNotEmpty', function (obj) {
  if (Array.isArray(obj)) {
    return obj.length > 0
  }
  return !!obj
})

Vue.filter('formatURL', function (url) {
  if (url && url.startsWith('http')) {
    const params = 'from=mw'
    const symbol = url.indexOf('?') !== -1 ? '&' : '?'
    return url + symbol + params
  } else {
    return url
  }
})
