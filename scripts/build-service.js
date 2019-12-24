/* 此脚本用于编译成node服务 */

const {execSync} = require('child_process')
const path = require('path')
const fs = require('fs-extra')
const Terser = require('terser')
// 需要忽略的文件/文件夹
const ignore = ['.DS_Store', 'service.js', 'index.js', 'index.dev.js', 'ipc.js', 'node_modules']
// 忽略压缩的文件
const ignoreMinify = ['defaultConfig.js', 'process-config.js']

const releases = 'build/releases/service'

// 源代码路径
const source = 'src/main'
const finder = require('findit2')(source)

console.info('开始编译')
execSync('cd web && npm run build', {stdio: 'inherit'})

// 清空发布文件夹
fs.emptyDirSync(releases)

// 复制web到发布web文件夹
fs.copySync('web/dist', `${releases}/web`)

fs.copySync('package.json', `${releases}/package.json`)
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

/**
 * 是否忽略此文件
 * @param file
 * @returns {boolean}
 */
function isIgnore (file) {
  for (let i = 0; i < ignore.length; i++) {
    if (new RegExp(ignore[i]).test(file)) {
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
