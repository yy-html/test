import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'view-design'
// import 'view-design/dist/styles/iview.css';
import './styles/common.scss'
import './styles/override.scss'
import './components'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import * as moment from "moment";

// 外链引入三方库的一种方法，不需要可以删除 start
const script = document.createElement("script");
script.src = 'https://static-web.missfresh.cn/fabric.3.4.0.min.js'
document.body.appendChild(script);
// 外链引入三方库的一种方法，不需要可以删除 end

Vue.use(Viewer)
Vue.config.productionTip = false
Vue.use(iView)
Vue.prototype.$Message.config({
  duration: 3                            //设置3秒后消失
});

// 微服务接入
import microAdaptor from '@mfb/micro-adapter-vue';
import appConfig from 'public/dependen/app.json'

const lifecycles = microAdaptor({
  Vue,
  appOptions: {
    el: '#app',
    ...appConfig,
    router,
    store,
    render: h => h(App)
  }
})
iView.InputNumber.computed.precisionValue = function () {
  let arr = (this.currentValue + '').split('.')
  if (this.precision && arr[1] && this.precision < arr[1].length)
    return this.currentValue.toFixed(this.precision)
  return this.currentValue;
};
// 引用moment,可以用this.moment
Vue.prototype.moment = moment
export const bootstrap = [
  lifecycles.bootstrap
]

export const mount = [
  lifecycles.mount
]

export const unmount = [
  lifecycles.unmount
]