var env = process.env.NODE_ENV
// 生成代理配置对象
var TARGET_URL_MAP = {
  skylark: 'http://10.2.4.17:8080/', // 测试环境
  ws: ''
}
var targetUrl = {
  'development': TARGET_URL_MAP['skylark'],
  'ws': TARGET_URL_MAP['ws'],
  'production': ''
}

// zuul用来处理上传超大图片
var proxySet = ['/api', '/auth', '/admin', '/dms', '/zuul', '/login', '/ws']
var proxy = {}

proxySet.forEach((path, index) => {
  let target = targetUrl[env]
  if (path == '/ws') {
    target = targetUrl['ws']
  }
  proxy[path] = {           // '/api':路径匹配项
    target, // 接口的域名
    // secure: false,       // 如果是https接口，需要配置这个参数
    changeOrigin: true,
    pathRewrite: {          // pathRewrite重写地址
      [`^${path}`]: path
    }
  }
})
// 'https://www.apiopen.top/satinGodApi?type=1&page=1'

// 本地环境
module.exports = {
  NODE_ENV: '"development"',
  proxy: proxy,
}

