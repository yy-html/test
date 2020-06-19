var ExtractTextPlugin = require('extract-text-webpack-plugin');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var DEV_ENV_MAP = {
    'development': true,
    'micro.dev': true,
}
var isDev = !!DEV_ENV_MAP[process.env.NODE_ENV]

var appConfig = require('../public/dependen/app.json')
console.log('当前NODE_ENV：', process.env.NODE_ENV, isDev);

var cssLang = [{
    name: 'css',
    reg: /\.css$/,
    loader: 'css-loader'
}, {
    name: 'stylus',
    reg: /\.styl$/,
    loader: "stylus-loader"
}, {
    name: 'less',
    reg: /\.less$/,
    loader: "less-loader"
}, {
    name: 'sass',
    reg: /\.scss$/,
    loader: "sass-loader"
}];

function genLoaders(lang) {
    var loaders = ['css-loader', 'postcss-loader'];
    if (lang.name !== 'css') {
        loaders.push(lang.loader);
    }
    // if (!isDev) {
    //     loaders = ExtractTextPlugin.extract({
    //         use: loaders
    //     });
    // } else {
        loaders.unshift('vue-style-loader');
    // }
    return loaders;
}
// 各种CSS的loader
exports.styleLoaders = function () {
    var output = [];
    cssLang.forEach(lang => {
        output.push({
            test: lang.reg,
            use: genLoaders(lang)
        })
    })
    return output;
};
// vue-loader的options
exports.vueLoaderOptions = function () {
    var options = {
        loaders: {}
    };
    cssLang.forEach(lang => {
        options.loaders[lang.name] = genLoaders(lang);
    });
    return options;
}

/**
 * 多入口生成多页面
 * @returns {Array}
 */
exports.genHtmlPlugins = function () {

    var baseWebpackConfig = require('./webpack.base.config');
    var path = require('path')
    var plugins = [];
    Object.keys(baseWebpackConfig.entry).forEach(function (name) {
        plugins.push(
            new HtmlWebpackPlugin({
                filename: !isDev ? path.resolve(__dirname, `../dist/${appConfig.name}/index.html`) : 'index.html',
                template: 'public/index.tpl.html',
                inject: true
            }))
    })
    return plugins
}
