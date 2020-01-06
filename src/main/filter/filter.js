// https://github.com/aojiaotage/text-censor

const path = require('path')
const fs = require('fs')
const iconv = require('iconv-lite')

const map = {}

function initialize () {
  const original = Buffer.from(fs.readFileSync(path.resolve(__dirname, './keywords.txt'), 'utf-8'), 'base64')
  const words = original.toString().split('\n')
  words.forEach((line) => {
    if (line) {
      addWord(line)
    }
  })
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
  initialize, isFilter
}
