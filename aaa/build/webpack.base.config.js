var webpack = require('webpack')
var path = require('path')
var utils = require('./utils')
var alias = require('./alias')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

function resolve (relPath) {
  return path.resolve(__dirname, relPath)
}

module.exports = {
  entry: {
    // index: resolve('../src/main.js'),
    index: resolve('../public/dependen/dev-loader.js')
  },
  output: {
    filename: '[name].js',
    chunkFilename: "js/[name].[chunkhash].js"
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      // {
      //     test: /\.js$/,
      //     use: "babel-loader",
      //     include: [resolve('../src')]
      // },
      {
        test: /\.js?$/,
        // exclude: [path.resolve(__dirname, 'node_modules')],
        include: path.resolve(__dirname, "src"),
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
          // presets: ['stage-3', 'es2015']
        }
      },
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
          options: utils.vueLoaderOptions()
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000,
            name: 'images/[name].[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: "url-loader",
          options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
