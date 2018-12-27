const router = require('koa-router')()
// const mongoose = require('mongoose')

// const db = mongoose.connect('mongodb://localhost/testDB')

// let UserSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     email: String
// })

// let User = mongoose.model('User', UserSchema)

// let user = {
//     username: 'sfilata',
//     password: '123456',
//     email: 'shubaiqiao@126.com'
// }
// let newUser = new User(user);
// newUser.save();

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: '杜柯禹'
  })
})

router.get('/string', async (ctx, next) => {
    await ctx.render('layout', {
        title: 'koa2 string'
    })
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

router.get('/test', async (ctx, next) => {
    // let val = null
    // const data = await User.findOne({username: 'sfilata'})
    // const result = {
    //     code: 200,
    //     response: data,
    //     ts: 12345
    // }
    // ctx.response.body = result
    // return result
})

module.exports = router
