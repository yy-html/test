var path = require('path')
var appConfig = require('../public/dependen/app.json')

module.exports = {
  dev: {
    outputPath: path.resolve(__dirname, '../'),
    outputPublicPath: '/',
    open: false,
    port: 9098
  },
  prod: {
    outputPath: path.resolve(__dirname, '../dist'),
    outputPublicPath: '/assets/'
  },
  microDev: {
    env: 'micro.dev',
    name: appConfig.name,
    outputPath: path.resolve(__dirname, `../dist/${appConfig.preFilePath}`)
    // outputPublicPath: appConfig.preFilePath,
    // filename: 'js/[name].js?[chunkhash]',
    // libraryTarget: 'umd',
  },
  microStaging: {
    env: 'staging',
    name: appConfig.name,
    outputPath: path.resolve(__dirname, `../dist/${appConfig.preFilePath}`),
    outputPublicPath: appConfig.preFilePath,
    filename: 'js/[name].js?[chunkhash]',
    libraryTarget: 'umd'
  },
  microProd: {
    env: 'production',
    name: appConfig.name,
    outputPath: path.resolve(__dirname, `../dist/${appConfig.preFilePath}`),
    outputPublicPath: 'https://static-gorilla.missfresh.cn' + appConfig.preFilePath,
    filename: 'js/[name].js?[chunkhash]',
    libraryTarget: 'umd'
  }
}
