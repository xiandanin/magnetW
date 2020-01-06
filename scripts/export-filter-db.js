// 导出过滤词库
// https://github.com/fighting41love/funNLP/tree/master/data/%E6%95%8F%E6%84%9F%E8%AF%8D%E5%BA%93
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
  console.log('添加过滤词数 ', itemWords.length)
})
console.log('加载完成，过滤词数共%d条', words.length)

// sqlite
fs.writeFileSync('src/main/filter/keywords.txt', Buffer.from(words.join('\n')).toString('base64'))
