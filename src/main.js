import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
// 引入lodash
import _ from 'lodash'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入修改的 element-ui 组件的样式
import './assets/css/element.css'
import './assets/css/iconfont.css'

Vue.prototype.$lodash = _
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
