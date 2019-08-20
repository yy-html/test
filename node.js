const process = require('process')
const fs = require('fs')
const log = console.log

// process.nextTick(() => log(1))

setTimeout(() => log(2))
setImmediate(() => log(3))
// setTimeout(() => log(4))


// fs.readFile('./index.html', () => {
    
// })



// setTimeout(() => {

//     setTimeout(() => {
//         console.log('timeout')
//     })
//     setImmediate(() => {
//         console.log('immediate')
//     })
//     process.nextTick(() => log(1))

// })