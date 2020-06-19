import Vue from 'vue' // 这里引入需要的组件，记得要用加别名
import { MfbDataList, MfbCard, MfbPageTable, MfbSubmitButton, MfbDatePicker } from '@mfb/pc-components-micro'
import FuzzyQuerySelect from './fuzzy-query-select'

Vue.component('MfbDataList', MfbDataList)
Vue.component('MfbCard', MfbCard)
Vue.component('MfbPageTable', MfbPageTable)
Vue.component('MfbSubmitButton', MfbSubmitButton)
Vue.component('MfbDatePicker', MfbDatePicker)
Vue.component('DMSFuzzyQuerySelect', FuzzyQuerySelect) // 比如这里，DMS是微仓陈列的代号，这是项目内你自己写的组件，所以要和公共库区分组件注册名
