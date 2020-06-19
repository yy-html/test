import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { MfbStore } from "@mfb/pc-components-micro";

const debug = process.env.NODE_ENV !== 'production'
const { modules: mfbModules, actions: mfbActions, mutations: mfbMutations, } = MfbStore;

const store = new Vuex.Store({
  modules: {
    ...mfbModules
  },
  actions: {
    ...mfbActions,
    storeInit: function ({ state, commit }, { data = {} }) {

    },
  },
  mutations: {
    ...mfbMutations,
    storeInit: function (state, data) {
    }
  },
  strict: debug
})

const storeReady = store.dispatch({ type: 'storeInit', data: {} })
storeReady.then(() => {
  store.dispatch('storeReady')
})

export default store