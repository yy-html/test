// 设定为预发环境
process.env.NODE_ENV = 'pre'
var webpack = require('webpack')
var merge = require('webpack-merge')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path')
var baseWebpackConfig = require('./webpack.base.config')
var utils = require('./utils')
var config = require('./config')
var CopyWebpackPlugin = require('copy-webpack-plugin')


const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const resolve = relativePath => path.resolve(appDirectory, relativePath)

const configR = merge(baseWebpackConfig, {
  mode:'production',
  devtool:'cheap-module-source-map',
  entry: {
    index: resolve('src/main.js')
    // routes: resolve('src/config/router/routes.js'),
  },
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
  output: {
    path: config.microProd.outputPath,
    publicPath: config.microStaging.outputPublicPath,
    filename: '[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
    libraryTarget: config.microProd.libraryTarget,
    library: config.microProd.name, //模块的名称
  },
  module: {
    rules: [...utils.styleLoaders()]
  },
  externals: {
    'axios': 'axios',
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'iview': 'iview',
    'element-ui': 'Element',
    moment: 'moment',
    '@mfb/pc-components-micro':'@mfb/pc-components-micro',
    '@mfb/pc-utils-micro':'@mfb/pc-utils-micro'
  },
  optimization: {
    minimize: false,
    namedModules: true, //取代插件中的 new webpack.NamedModulesPlugin()
    namedChunks: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        sourceMap: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger:false,
            pure_funcs: ['console.log']
          }
        }
      })
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 8996,
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   logLevel: 'info'
    // }),
    new CleanWebpackPlugin([config.microProd.outputPath], {
      root: path.resolve(__dirname, '../'), //根目录
      // verbose Write logs to console.
      verbose: true, //开启在控制台输出信息
      // dry Use boolean "true" to test/emulate delete. (will not remove files).
      // Default: false - remove files
      dry: false
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        "NODE_ENV": "pre",
        "VUE_APP_API_ROOT": require('../config.pre.env').VUE_APP_API_ROOT,
        "VUE_APP_VERSION": require('../config.pre.env').VUE_APP_VERSION,
        "VUE_APP_DOMAIN_NAME": require('../config.pre.env').VUE_APP_DOMAIN_NAME
      }),
      'process.env.NODE_ENV':JSON.stringify("pre"),
      'process.env.VUE_APP_PRIMARY_DOMAIN_NAME': JSON.stringify(require('../config.pre.env').VUE_APP_PRIMARY_DOMAIN_NAME)
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../config/config.json'),
      to: path.resolve(__dirname, '../dist/dms'),
    }]),
    // new ExtractTextPlugin({
    //     allChunks: true,
    //     filename: "css/[name].css?[hash:8]"
    // }),
    ...utils.genHtmlPlugins()
  ]
})

console.log(configR)


module.exports = configR