const path = require('path')
// 去console插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// gzip压缩插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 分析插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// copy plugin
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// clean plugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
// COPY config
// const COPY_PATH_MAP = [{
//     from: path.resolve(__dirname, 'config/config.json'),
//     to: path.resolve(__dirname, 'dist/appConfig'),
//     ignore: ['.*']
// }]
// CLEAN config
const CLEAN_PATH_MAP = ['dist/index.html', 'dist/appConfig']

// vue config
const OPTS = require('./config')
const { BASE_URL, OUTPUT_DIR, INDEX_PATH, PROXY, NODE_ENV, IS_DEV, IS_TEST, IS_PROD, APP, ALIAS, CDN, } = OPTS

console.log('---config----');
console.log(OPTS);
// console.log(`NODE_ENV: ${OPTS.NODE_ENV}, APP_VERSION: ${OPTS.APP_VERSION}, BASE_URL: ${OPTS.BASE_URL}, OUTPUT_DIR: ${OPTS.OUTPUT_DIR}`);
module.exports = {
    baseUrl: BASE_URL,
    outputDir: OUTPUT_DIR,
    indexPath: INDEX_PATH,
    assetsDir: './src/assets',
    productionSourceMap: false,
    lintOnSave: false, // 配置eslint
    configureWebpack: config => {
        config.resolve.extensions = ['.js', '.vue', '.json']
        if (!IS_DEV) {
            // 非dev环境 开启cdn状态：externals生效
            if (APP.OPEN_CDN) {
                config.externals = CDN.externals
            }
            // 开启打包分析
            if (APP.ANALYZ) {
                config.plugins.push(new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                }))
            }
            if (APP.INCRE_PACK) {
                config.plugins.push(
                    new CleanWebpackPlugin(CLEAN_PATH_MAP),
                    // new CopyWebpackPlugin(COPY_PATH_MAP)
                )
            }
            // 非本地开发环境 默认插件选项
            config.plugins.push(
                new UglifyJsPlugin({
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
                new CompressionWebpackPlugin({
                    test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, // 文件名匹配 gzipExtensions /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
                    threshold: 10240, // >10kb 压缩
                    deleteOriginalAssets: false // 是否删除源文件
                })
            )

        }
    },
    chainWebpack: (config) => {
        for (let key in ALIAS) {
            if (ALIAS.hasOwnProperty(key)) {
                config.resolve.alias.set(key, ALIAS[key])
            }
        }
        // config.plugins.delete('prefetch')
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 10240 }))
        // 文件后缀
        config.output.filename('[name].[hash].js').end()
        // 添加CDN参数到htmlWebpackPlugin配置中， 修改 public/index.html
        config.when(!IS_DEV, config =>
            config.plugin('html').tap(args => {
                if (APP.OPEN_CDN) {
                    args[0].cdn = CDN.prod
                    // args[0].dnsPrefetch = OPTS.CDN.dnsPrefetch // dns预加载
                }
                return args
            })
        )
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        proxy: PROXY, // string | Object
        before: app => { }
    }
}
