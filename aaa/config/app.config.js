/**
 * 获取 app配置
 * @param {*} param0 
 */
function getAppConfig({ NODE_ENV }) {
    let options = {
        development: {
            API_ROOT: 'http://10.2.4.17:8040',
            DOMAIN_NAME: '//localhost:8080',
            PRIMARY_DOMAIN_NAME: 'localhost',
        },
        k8s: {
            // API_ROOT: '//wuliu-cloud-fe.b1.missfresh.net',
            API_ROOT: 'http://10.2.4.200:8040',
            DOMAIN_NAME: '//uac-web-staging.missfresh.net', // gateway
            // DOMAIN_NAME: '//wuliu-cloud-fe.b1.missfresh.net', // gateway
            PRIMARY_DOMAIN_NAME: '.missfresh.net',
        },
        staging: {
            API_ROOT: 'http://10.2.4.17:8040',
            DOMAIN_NAME: '//uac-web-staging.missfresh.net',
            PRIMARY_DOMAIN_NAME: '.missfresh.net',
        },
        production: {
            API_ROOT: '//56zuul.missfresh.cn', // 接口请求域名 或 ip
            DOMAIN_NAME: '//56cloud.missfresh.cn', // 登录页域名 或 ip
            PRIMARY_DOMAIN_NAME: '.missfresh.cn', // cookie域
        }
    }

    const config = {
        APP: { // app配置
            ...options[NODE_ENV],
            APP_VERSION: process.env.VUE_APP_VERSION, // app版本 按环境配置.env文件中VUE_APP_VERSION字段
            VERSION_CHECK: false, // 版本更新校验
            INCRE_PACK: true, // 增量更新
            ANALYZ: false, // 打包代码分析
            OPEN_CDN: true, // cdn开关
            CDN_URL: '//static-dms.missfresh.cn',// 微仓CND地址 按需要添加
        },
        NODE_ENV, // 环境变量
        IS_DEV: NODE_ENV === 'development', // dev开发环境
        IS_TEST: NODE_ENV === 'staging', // test测试环境
        IS_PROD: NODE_ENV === 'production', // prod生产环境
    }

    return config

    // 生产环境配置
    // if (config.IS_PROD) {
    //     // config.VERSION_CHECK = true
    //     config.CDN_URL = CDN_URL
    // }
    // const API_ROOT = {
    //     development: '',
    //     k8s: '',
    //     staging: '',
    //     production: '',
    // }
}

module.exports = {
    getAppConfig
}