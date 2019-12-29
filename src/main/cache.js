const moment = require('moment')
const store = process.env.BUILD_TARGET === 'electron' ? require('./electron-cache') : require('./memory-cache')

/**
 * 添加缓存
 * @param key
 * @param value
 * @param expired 过期时间(秒) 0或null则永久
 */
function set (key, value, expired) {
  const expiredDate = expired > 0 ? new Date(Date.now() + (expired * 1000)) : new Date(2100, 0, 1)
  store.put(key, {
    created: new Date(),
    expired: expiredDate,
    data: value
  })
  console.info(`新增缓存: ${key}, 过期时间: ${moment(expiredDate).format('YYYY-MM-DD HH:mm:ss.SSS')}`)
}

/**
 * 获取缓存
 * @param key
 * @returns
 */
function get (key) {
  let value = store.get(key)
  if (value) {
    // 没过期
    if (moment().isBefore(value.expired)) {
      return value.data
    } else {
      store.delete(key)
      console.info(`删除过期缓存: ${key}`)
    }
  }
  return null
}

function clear () {
  store.clear()
}

module.exports = {
  set, get, clear
}
