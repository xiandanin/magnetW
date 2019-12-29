const Store = require('electron-store')
const store = new Store()

function put (key, value) {
  store.set(key, value)
}

function get (key) {
  return store.get(key)
}

function deleteValue (key) {
  store.delete(key)
}

function clear () {
  store.clear()
}

module.exports = {
  put, get, 'delete': deleteValue, clear
}
