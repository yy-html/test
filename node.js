const process = require('process')
const fs = require('fs')

// process.nextTick(() => log(1))
// setTimeout(() => log(2))
// setImmediate(() => log(3))

// node
// supervisor nodemon cheerio

// process.nextTick // 调用栈结束后执行（事件循环前）
// setTimeout // timer 事件轮询poll后执行
// setImmediate // check 事件轮询后执行（在主环境里 或先于timer或晚于timer 不确定）（在I/O操作的回调中 总是先于timer执行 晚于next tick队列）
