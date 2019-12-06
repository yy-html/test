const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const Koa = require('koa')
const static = require('koa-static')
const Router = require('koa-router')
const render = require('koa-art-template')

const log = console.log
const app = new Koa()
const router = new Router()
const wrapRouter = new Router()
const port = 8081

const a = require('./test.js')

log(a)
a.a = 1

const b = require('./test.js')

log(b)


render(app, {
  root: path.join(__dirname),   // 视图的位置
  extname: '.html',  // 后缀名
  debug: process.env.NODE_ENV !== 'production'  //是否开启调试模式
})

// router.all('*', async (ctx, next) => {
//   // const page = await fsp.readFile('./index.html', 'utf8')
//   // ctx.body = page
//   await ctx.render('index.html', {
//     title: 'run by nodeJS'
//   })
// })

wrapRouter.use('/', router.routes(), router.allowedMethods())

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  ctx.set("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  const start = Date.now()
  await next()
  const end = Date.now()
  console.log('rendering time:', end - start)
})

app.use(wrapRouter.routes())

app.use(static('.'))

app.listen(port, () => {
  console.log(`running at localhost:${port}`)
})




// const fsp = new Proxy(fs, {
//   get(target, key) {
//     return promisify(target[key])
//   }
// })

// function promisify(targetFunc) {
//   return function wrap(...args) {
//     return new Promise((rs, rj) => {
//       const callback = (err, data) => {
//         if (err) {
//           return rj(err)
//         }
//         rs(data)
//       }
//       args.push(callback)
//       targetFunc.apply(this, args)
//     })
//   }
// }


// 路由： 通过不同的访问路径 导向不同的controler

// 返回绝对路径
// console.log(path.resolve(__dirname, 'a')) // /Users/yy/Desktop/project/test/a
// console.log(path.resolve(__dirname, './a')) // /Users/yy/Desktop/project/test/a
// console.log(path.resolve(__dirname, '/a')) // /a
// console.log(__dirname)  // 当前目录绝对路径/Users/yy/Desktop/project/test
// console.log(__filename)  // 当前文件绝对路径
// console.log(path.resolve()) // 生成绝对路径 /Users/yy/Desktop/project/test
// console.log(path.resolve('a')) // 拼接字符串 a\


// process.nextTick(() => {
//   setTimeout(() => {
//     log(4)
//   })
//   log(1)
//   for (let i = 0; i < 900000; i ++) {}
// })
// setTimeout(() => {
//   log(2)
//   setTimeout(() => {
//     log(6)
//   })
//   setImmediate(() => log(3))
// })
// // setImmediate(() => log(3))
// setImmediate(() => log(7))


// node
// supervisor nodemon cheerio body-parser(express解析post请求 res.body) art-template

// npm script
// 传参
// node *.js --parameters 123 // process.avgr = [, , 'parameters', 123]
// 钩子
// script: {
//   start: 'echo start',
//   prestart: 'echo pre start',
//   poststart: 'echo post start'
// }
// npm start stop test restart(npm run stop && npm run restart && npm run start) 简写
// prerestart
// prestop
// stop
// poststop
// restart
// prestart
// start
// poststart
// postrestart
// 批量执行
// & : 并行执行
// && : 串行执行 继发执行
// 默认值
// "start": "node server.js"
// "install": "node-gyp rebuild"
// 变量 必须通过script脚本执行的js文件才能拿到npm环境变量
// process.env.npm_package_version // Bash: $npm_package_version
// process.env.npm_lifecycle_event = 当前脚本执行的名称（包含钩子脚本）