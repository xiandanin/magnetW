// 合并过滤词库
// https://github.com/fighting41love/funNLP/tree/master/data/%E6%95%8F%E6%84%9F%E8%AF%8D%E5%BA%93
// https://raw.githubusercontent.com/toolgood/ToolGood.Words/8bfbcfbf7b1db26b06766146029a4615fd8cfa5c/csharp/ToolGood.Words.Contrast/BadWord.txt
// https://raw.githubusercontent.com/elulis/sensitive-words/master/src/main/resources/sensi_words.txt
// https://github.com/fanhua1994/DzFilter/blob/master/database/data_filter20180120.db
// https://raw.githubusercontent.com/FireLustre/php-dfa-sensitive/master/tests/data/words.txt
// https://raw.githubusercontent.com/spetacular/bannedwords/master/pub_banned_words.txt
// https://raw.githubusercontent.com/importcjj/sensitive/master/dict/dict.txt
// https://github.com/aojiaotage/text-censor/blob/master/keywords
const {execSync} = require('child_process')
const path = require('path')
const fs = require('fs-extra')

// 如果临时git文件夹不存在 就拉取
const zip = 'scripts/filter-data/data.zip'
const temp = 'scripts/filter-data/.temp'
fs.emptyDirSync(temp)
fs.mkdirsSync(temp)
execSync(`unzip ${zip} -d ${temp} -x __MACOSX/*> /dev/null 2>&1`, {stdio: 'inherit'})

const words = []
const files = fs.readdirSync(temp)
files.forEach((it) => {
  const file = `${temp}/${it}`
  const itemWords = fs.readFileSync(file, 'utf-8').split('\n')
  words.push.apply(words, itemWords)
  console.log('添加过滤词 %d条', itemWords.length)
})
const uniqueWords = unique(words)
console.log('去重复 %d 条', words.length - uniqueWords.length)
console.log('加载完成，共%d条', uniqueWords.length)

function unique (arr) {
  const result = []
  const hash = {}
  for (var i = 0, elem; (elem = arr[i]) != null; i++) {
    if (!hash[elem]) {
      result.push(elem)
      hash[elem] = true
    }
  }
  return result
}

fs.writeFileSync('static/keywords.txt', Buffer.from(uniqueWords.join('\n')).toString('base64'))
