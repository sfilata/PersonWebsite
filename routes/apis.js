const router = require('koa-router')()

router.prefix('/api')

router.get('/', function (ctx, next) {
  ctx.body = 'this is default api'
})

router.get('/login', function (ctx, next) {
  ctx.body = 'login failure!'
})

router.get('/json', async (ctx, next) => {
  ctx.response.body = {
    code: 200,
    response: {
        name: 'sfilata',
        type: 'super',
        password: '123123',
        level: 'high'
    },
    ts: 252233
  }
})

module.exports = router
