process.env.NODE_ENV = 'micro.dev'
var path = require('path')
var webpack = require("webpack")
var merge = require("webpack-merge")
var baseWebpackConfig = require("./webpack.base.config")
var utils = require("./utils")
var config = require("./config")
var proxy = require('./proxy')
var alias = require('./alias')
var FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")
var CopyWebpackPlugin = require('copy-webpack-plugin')


function resolve (relPath) {
  return path.resolve(__dirname, relPath)
}
const a = merge(baseWebpackConfig, {
  context: path.resolve('./'),
  resolve: {
    alias: {
      'config': path.resolve(__dirname),
      'common': path.resolve(__dirname, '../common'),
      '@': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'images': path.resolve(__dirname, '../src/assets/static/image'),
      'components': path.resolve(__dirname, '../src/components'),
      'apis': path.resolve(__dirname, '../src/apis'),
      'store': path.resolve(__dirname, '../src/store'),
      'views': path.resolve(__dirname, '../src/views'),
    }
  },
  entry: {
    index: resolve('../public/dependen/dev-loader.js')
  },
  node: {
    fs: 'empty'
  },
  devServer: {
    hot: false,
    port: config.dev.port,
    open: false, // 自动打开浏览器
    proxy: proxy
  },
  devtool: 'source-map',
  output: {
    path: config.dev.outputPath,
    publicPath: config.dev.outputPublicPath
  },
  module: {
    rules: utils.styleLoaders()
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        "NODE_ENV": JSON.stringify('development'),
        "VUE_APP_API_ROOT": require('../config.env').VUE_APP_API_ROOT,
        "VUE_APP_VERSION": require('../config.env').VUE_APP_VERSION
      })
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    ...utils.genHtmlPlugins(),
    new FriendlyErrorsPlugin(),
    new CopyWebpackPlugin([{
      from: path.resolve('./public'),
    }, {
      from: path.resolve(__dirname, 'config/config.json'),
    }])
  ]
})
// console.log(a);


module.exports = a