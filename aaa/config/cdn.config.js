
const CDN_URL = '//static-dds.missfresh.cn' // 基础数据CND地址 按需要添加

/**
 * 获取 CND配置
 * @param {*} BASE_URL 常量基础路径
 * @param {*} CDN_URL CDN地址
 */
function getCdnConfig({ BASE_URL, CDN_URL }) {

    const RES_PATH = `${BASE_URL}static`

    const config = {
        CDN_URL, // cdn url
        externals: { // externals
            'axios': 'axios',
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'iview': 'iview',
            'element-ui': 'Element'
        },
        prod: { // 生产环境配置
            js: [
                `${RES_PATH}/vue/2.6.9/vue.min.js`,
                `${RES_PATH}/axios/0.15.3/axios.min.js`,
                `${RES_PATH}/vueRouter/3.0.1/vue-router.min.js`,
                `${RES_PATH}/vuex/3.0.1/vuex.min.js`,
                `${RES_PATH}/iview/3.3.0/iview.min.js`,
                `${RES_PATH}/element-ui@2.3.7/lib/index.js`,
                `${RES_PATH}/moment/2.22.2/moment.min.js`,
            ],
            // css: [
            //     '//static-sms.missfresh.cn',
            // ],
        }
        // dns预加载，优化接口请求
        // dnsPrefetch: [
        //   'https://mfb-smss.missfresh.com',
        // ],
    }
    return config
}

module.exports = {
    getCdnConfig: getCdnConfig,
}