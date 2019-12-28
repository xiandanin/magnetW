const processConfig = require('./process-config')
const {start} = require('./api')

async function startServer () {
  let configVariable = null
  try {
    const args = process.argv.splice(2)
    const configPath = args[0]
    if (configPath) {
      configVariable = processConfig.extractConfigVariable(require(configPath)())
    }
  } catch (e) {
    console.error(e.message)
  }

  const newConfig = processConfig.getConfig(configVariable)
  configVariable ? console.info('使用自定义配置启动服务', configVariable, newConfig) : console.info('使用默认配置启动服务', configVariable, newConfig)
  const {port, ip, local, message} = await start(newConfig, true)
  if (message) {
    console.error(message)
  } else {
    console.info(`启动成功，本地访问 http://${local}:${port}，IP访问 http://${ip}:${port}`)
  }
}

startServer()
