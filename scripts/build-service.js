/* 编译成node服务 */

const path = require('path')
const fs = require('fs-extra')
const Terser = require('terser')
// 需要忽略的文件/文件夹
const ignore = ['.DS_Store', 'service.js', 'index.js', 'index.dev.js', 'ipc.js', 'node_modules', 'electron-cache.js', 'menu.js']
// 忽略压缩的文件
const ignoreMinify = ['defaultConfig.js', 'process-config.js']

const releases = 'build/releases'
if (!fs.existsSync(releases)) {
  fs.mkdirsSync(releases)
}

// 源代码路径
const source = 'src/main'
const finder = require('findit2')(source)

// 清空发布文件夹
const releasesIgnore = ['package-lock.json', 'node_modules']
const dir = fs.readdirSync(releases)
dir.forEach((file) => {
  if (!isIgnore(file, releasesIgnore)) {
    fs.removeSync(`${releases}/${file}`)
  }
})

fs.copySync(`${source}/service.js`, `${releases}/index.js`)
finder.on('file', function (file, stat, linkPath) {
  if (isIgnore(file)) {
    console.info('忽略路径', file)
    return
  }

  const target = file.replace(source, releases)
  const targetDir = path.join(target, '..')
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir)
  }
  if (/\.js$/.test(file) && isMinify(file)) {
    const result = Terser.minify(fs.readFileSync(file, 'utf-8'))
    fs.writeFileSync(target, result.code)
    // console.info('压缩js', file)
  } else {
    fs.copySync(file, target)
    // console.info('复制文件', file, target)
  }
})
// 生成package.json
console.log('生成package.json')
const json = require(path.resolve('package.json'))
json.main = './index.js'
json.scripts = {
  'start': 'node index.js'
}
delete json.build
delete json.appName
delete json.description
json.name = 'magnetw-service'
fs.writeFileSync(path.resolve(releases, 'package.json'), JSON.stringify(json, '\t', 2))

/**
 * 是否忽略此文件
 * @param file
 * @returns {boolean}
 */
function isIgnore (file, ignoreArray) {
  const array = ignoreArray || ignore
  for (let i = 0; i < array.length; i++) {
    if (new RegExp(array[i]).test(file)) {
      return true
    }
  }
  return false
}

/**
 * 是否需要压缩
 * @param file
 * @returns {boolean}
 */
function isMinify (file) {
  const minify = ignore.concat(ignoreMinify)
  for (let i = 0; i < minify.length; i++) {
    if (new RegExp(minify[i]).test(file)) {
      return false
    }
  }
  return true
}
