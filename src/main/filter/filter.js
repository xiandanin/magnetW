const path = require('path')
const fs = require('fs')

const map = {}
let load = false

const isDev = process.env.NODE_ENV === 'development'

async function loadFilterData () {
  if (load) {
    return
  }
  load = true
  const file = isDev ? path.resolve('static/keywords.txt') : path.resolve(__dirname, './static/keywords.txt')
  const original = Buffer.from(fs.readFileSync(file, 'utf-8'), 'base64')
  const words = original.toString().split('\n')
  words.forEach((line) => {
    if (line) {
      addWord(line)
    }
  })
  console.info('加载词条%d条', words.length)
}

function addWord (word) {
  let parent = map

  for (let i = 0; i < word.length; i++) {
    if (!parent[word[i]]) parent[word[i]] = {}
    parent = parent[word[i]]
  }
  parent.isEnd = true
}

function isFilter (s, cb) {
  let parent = map

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '*') {
      continue
    }

    let found = false
    let skip = 0
    let sWord = ''

    for (let j = i; j < s.length; j++) {
      if (!parent[s[j]]) {
        found = false
        skip = j - i
        parent = map
        break
      }

      sWord = sWord + s[j]
      if (parent[s[j]].isEnd) {
        found = true
        skip = j - i
        break
      }
      parent = parent[s[j]]
    }

    if (skip > 1) {
      i += skip - 1
    }

    if (!found) {
      continue
    }

    let stars = '*'
    for (let k = 0; k < skip; k++) {
      stars = stars + '*'
    }

    let reg = new RegExp(sWord, 'g')
    if (reg.test(s)) {
      return true
    }
    // s = s.replace(reg, stars)
  }

  if (typeof cb === 'function') {
    cb(null, s)
  }

  return false
}

module.exports = {
  loadFilterData, isFilter
}
