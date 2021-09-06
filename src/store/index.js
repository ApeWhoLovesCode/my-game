import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentKey: '',
    timeHello: '你好'
  },
  mutations: {
    setCurrentKey(state, key) {
      state.currentKey = key
    },
    // 获取当前的时间 小时 判断是早上中午下午晚上
    getTime(state) {
      let timeNow = new Date();
      let hours = timeNow.getHours();
      // 判断当前时间段
      if (hours >= 0 && hours <= 10) {
        state.timeHello = `早上好`;
      } else if (hours > 10 && hours <= 14) {
        state.timeHello = `中午好`;
      } else if (hours > 14 && hours <= 18) {
        state.timeHello = `下午好`;
      } else if (hours > 18 && hours <= 24) {
        state.timeHello = `晚上好`;
      }
    },
  },
  actions: {
  },
  modules: {
  }
})
