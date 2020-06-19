// 去console插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// gzip压缩插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 分析插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// copy plugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
// clean plugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
// COPY config
const COPY_PATH_MAP = [{
    from: path.resolve(__dirname, '../build/config/config.json'),
    to: path.resolve(__dirname, 'dist/appConfig'),
    ignore: ['.*']
}]
// CLEAN config
const CLEAN_PATH_MAP = ['dist/index.html', 'dist/appConfig']

const plugins = {
    UglifyJsPlugin: new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        sourceMap: false,
        parallel: true,
        uglifyOptions: {
            compress: {
                warnings: false,
                drop_console: true,
                drop_debugger: false,
                pure_funcs: ['console.log'] //移除console
            }
        },
    }),
    CompressionWebpackPlugin: new CompressionWebpackPlugin({
        test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, // 文件名匹配 gzipExtensions /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
        threshold: 10240, // >10kb 压缩
        deleteOriginalAssets: false // 是否删除源文件
    }),
    BundleAnalyzerPlugin: new BundleAnalyzerPlugin({
        analyzerMode: 'static',
    }),
}

module.exports = plugins

