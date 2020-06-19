// proxy
const proxyTable = {
  '/admin': {
    target: 'http://10.2.4.17:8040/',
    pathRewrite: {
      '^admin': '/admin'
    }
  },
  '/login': {
    target: 'http://10.2.4.17:8040/',
    pathRewrite: {
      '^login': '/login'
    }
  },
  '/auth': {
    target: 'http://10.2.4.17:8040/',
    pathRewrite: {
      '^auth': '/auth'
    }
  },
  '/static': {
    target: 'http://56hub-web-staging.missfresh.net/'
  },
  '/apps.config.js': {
    target: 'http://56hub-web-staging.missfresh.net/'
  },
  '/brain': {
      target: 'http://56hub-web-staging.missfresh.net/',
  },
  '/sms': {
    target: 'http://10.2.4.17:8040/',
  },
  // '/dms': {
  //   target: 'http://wuliu-ocean-gateway.b22.missfresh.net/',
  //   changeOrigin: true,
  //   pathRewrite: {
  //     // '^/dms': ''
  //   }
  // },
  '/dms': {
    target: 'http://wuliu-ocean-gateway.b22.missfresh.net/',
    // target: 'http://172.16.178.228:8080/',
    changeOrigin: true,
    pathRewrite: {
      // '^/dms': ''
    }
  },
  '/mds': {
    target: 'http://wuliu-ocean-gateway.b22.missfresh.net/',
    changeOrigin: true,
    pathRewrite: {
      // '^/dms': ''
    }
  },

}
module.exports = proxyTable