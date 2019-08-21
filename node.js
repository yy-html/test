const process = require('process')
const fs = require('fs')

console.log(process.env.npm_package_config_aaa)



// process.nextTick(() => log(1))
// setTimeout(() => log(2))
// setImmediate(() => log(3))

// node
// supervisor nodemon cheerio

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

// process.nextTick // 调用栈结束后执行（事件循环前）
// setTimeout // timer 事件轮询poll后执行
// setImmediate // check 事件轮询后执行（在主环境里 或先于timer或晚于timer 不确定）（在I/O操作的回调中 总是先于timer执行 晚于next tick队列）
