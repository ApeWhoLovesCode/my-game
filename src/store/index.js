import Vue from 'vue'
import Vuex from 'vuex'
import { getStorage, setStorage } from '@/utils/storage'
import adminApi from "@/utils/adminApi";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 当前登录用户的登录状态 (token等数据) 从本地读取 
    gameUser: getStorage('gameUser'),
    // 管理员端信息
    adminUser: getStorage('adminUser'),
    // 键盘事件
    currentKey: '',
    timeHello: '你好',
    // 管理端搜索到的结果
    searchRes: [],
    // 分享的信息
    shareData: {}
  },
  mutations: {
    setUserInfo(state, data) {
      state.gameUser = data
      // 为了防止页面刷新数据丢失 我们还需要把数据放到本地存储中 是为了持久化数据
      setStorage('gameUser', data)
    },
    setAdminUser(state, data) {
      state.adminUser = data
      setStorage('adminUser', data)
    },
    // 用于键盘事件特效
    setCurrentKey(state, key) {
      state.currentKey = key
    },
    setSearchRes(state, data) {
      state.searchRes = data
    },
    // 分享的信息
    setShareData(state, data) {
      state.shareData = data
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
    async adminSearch(context, params) {
      const {data: res} = await adminApi.search(params)
      context.state.searchRes = res.data
      console.log(context.state.searchRes);
    }
  },
  modules: {
  }
})
