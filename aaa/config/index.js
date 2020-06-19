// const plugins = require('./plugin.config.js') // 插件选项

const alias = require('./alias.config.js') // 别名
const { proxy } = require('./dev.config.js') // 开发环境proxy
const { getAppConfig } = require('./app.config.js') // app配置-选项
const { getCdnConfig } = require('./cdn.config.js') // 环境配置-cdn选项

/**
 * 
 */

function getEnvOpts({ getAppConfig, getCdnConfig, getPluginsConfig }) {
    // 环境变量
    const NODE_ENV = process.env.NODE_ENV
    // let pluginsConfig = typeof getPluginsConfig === 'function' && getPluginsConfig(NODE_ENV)
    let appConfig = typeof getAppConfig === 'function' && getAppConfig({ NODE_ENV })
    // APP: { // app配置
    // ...options[NODE_ENV],
    // API_ROOT: 'http://10.2.4.17:8040',
    // DOMAIN_NAME: '//localhost:8080',
    // PRIMARY_DOMAIN_NAME: 'localhost',
    //     APP_VERSION: process.env.VUE_APP_VERSION, // app版本 按环境配置.env文件中VUE_APP_VERSION字段
    //     VERSION_CHECK: false, // 版本更新校验
    // OPEN_CDN: true, // cdn开关
    // ANALYZ: false, // 打包代码分析
    // },
    // NODE_ENV, // 环境变量
    // IS_DEV: NODE_ENV === 'development', // dev开发环境
    // IS_TEST: NODE_ENV === 'staging', // test测试环境
    // IS_PROD: NODE_ENV === 'production', // prod生产环境

    // -------------cdn-------------
    // CDN_URL,
    // externals,
    // prod

    let opts = {
        ...appConfig,
        BASE_URL: './', // 文件相对路径
        OUTPUT_DIR: 'dist', // 打包输出路径
        INDEX_PATH: 'index.html',
    }

    // PROD 环境
    if (opts.IS_PROD) {
        // options 增加配置

        if (opts.APP.INCRE_PACK) {
            // 增量更新 输出路径
            opts.OUTPUT_DIR = `${opts.OUTPUT_DIR}/v${opts.APP.APP_VERSION}`
            opts.INDEX_PATH = '../index.html'
            if (opts.APP.OPEN_CDN && opts.APP.CDN_URL) {
                // 如果开启cdn 配置base url 路径
                const BASE_URL = `${opts.APP.CDN_URL}/v${opts.APP.APP_VERSION}/`
                opts.BASE_URL = BASE_URL
                opts.CDN = typeof getCdnConfig === 'function' && getCdnConfig({ BASE_URL, CDN_URL: opts.APP.CDN_URL })
            } else {
                console.error('生产环境请确认是否开启cdn！，如果已开启，请注意配置cdn选项！！！')
            }
        }
    } else {
        // 非生产环境 开启cdn配置 将externals开启
        if (opts.APP && opts.APP.OPEN_CDN) {
            opts.CDN = typeof getCdnConfig === 'function' && getCdnConfig({ BASE_URL: opts.BASE_URL, CDN_URL: '' })
        }
    }

    return opts
}

let config = getEnvOpts({ getAppConfig, getCdnConfig })
config.ALIAS = alias
if (config.IS_DEV) {
    config.PROXY = proxy
}
// const config = {
//     env: env, // 环境变量
//     alias: alias, // 别名
//     // plugins: plugins, // 插件
//     proxy: devEnv.proxy, // 代理
//     appConfig: appConfig, // 环境配置
//     getAppConfig: getAppConfig, // app配置
//     getCdnConfig: getCdnConfig, // cdn选项
// }

module.exports = config

