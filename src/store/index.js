import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentKey: ''
  },
  mutations: {
    setCurrentKey(state, key) {
      state.currentKey = key
    },
  },
  actions: {
  },
  modules: {
  }
})
