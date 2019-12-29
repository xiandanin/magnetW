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
    console.error(e.message)
    const maxLength = 100
    const message = e.message
    ctx.status = e.statusCode || 500
    ctx.body = {
      success: false,
      message: message.length > maxLength ? `${message.substring(0, maxLength)}...` : message
    }
  }
}
