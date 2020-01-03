module.exports = async (ctx, next) => {
  try {
    ctx.success = function (data) {
      ctx.body = {
        success: true,
        data: data
      }
    }

    await next()

    if (ctx.status !== 200) {
      ctx.throw(ctx.status, ctx.message)
    }
  } catch (e) {
    const statusCode = e.statusCode || 500
    console.error(statusCode, e.message)
    const maxLength = 100
    const message = `${statusCode} - 请求异常，请查看日志`
    ctx.status = statusCode
    ctx.body = {
      success: false,
      message: message.length > maxLength ? `${message.substring(0, maxLength)}...` : message
    }
  }
}
