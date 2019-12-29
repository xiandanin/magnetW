const Koa = require('koa')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const app = new Koa()
const prefix = '/api'
const router = new Router({prefix})
const path = require('path')
const repo = require('./repository')

let serverInfo = null
let koaServer = null

app.use(require('@koa/cors')())
app.use(require('koa-bodyparser')())
app.use(require('./middleware/block'))
app.use(require('./middleware/response-template'))

router.get('/rule', async (ctx) => {
  ctx.success(await repo.getRule())
})

router.get('/load-rule', async (ctx) => {
  ctx.success(await repo.loadRuleByURL())
})

router.get('/search', async (ctx) => {
  if (ctx.query.keyword) {
    const current = repo.makeupSearchOption(ctx.query)
    const items = await repo.obtainSearchResult(current, ctx.headers)
    ctx.success({
      current,
      items
    })

    if (items && items.length > 0) {
      // 异步缓存后续结果
      repo.asyncCacheSearchResult(current, ctx.headers)
    }
  } else {
    ctx.throw(400, '请输入关键词')
  }
})

router.get('/detail', async (ctx) => {
  const id = ctx.query.id
  const path = ctx.query.path
  if (id && path) {
    const detail = await repo.obtainDetailResult({id, path}, ctx.headers)
    ctx.success(detail)
  } else {
    ctx.throw(400, '请指定ID和URL')
  }
})

app.use(router.routes()).use(router.allowedMethods())

function getIPAddress () {
  const interfaces = require('os').networkInterfaces()
  for (let devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}

async function reload (config, preload) {
  repo.applyConfig(config)

  if (preload) {
    const rule = await repo.loadRuleByURL()
    const ruleLog = rule.map((it) => `[加载][${it.name}][${it.url}]`).join('\n')
    const proxyCount = rule.filter(it => it.proxy).length
    const log = `${ruleLog}\n${rule.length}个规则加载完成，其中${rule.length - proxyCount}个可直接使用，${proxyCount}个需要代理\n`
    console.info(log)
  }
}

async function start (config, preload) {
  try {
    const port = process.env.PORT || 9000
    koaServer = app.listen(port)

    serverInfo = {
      port,
      ip: getIPAddress(),
      local: 'localhost'
    }

    await reload(config, preload)

    return serverInfo
  } catch (e) {
    return {message: e.message}
  }
}

function stop (callback) {
  if (koaServer) {
    koaServer.close(() => {
      serverInfo = null
      koaServer = null
      callback()
    })
  }
}

function isStarting () {
  return serverInfo !== null && serverInfo !== undefined
}

function getServerInfo () {
  return serverInfo
}

module.exports = {
  reload, start, stop, getServerInfo, isStarting, prefix, getProxyNetworkInfo: repo.getProxyNetworkInfo
}
