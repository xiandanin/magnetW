const store = require('memory-cache')

function put (key, value) {
  store.put(key, value)
}

function get (key) {
  return store.get(key)
}

function deleteValue (key) {
  store.del(key)
}

function clear () {
  store.clear()
}

module.exports = {
  put, get, 'delete': deleteValue, clear
}
