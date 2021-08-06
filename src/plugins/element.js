import Vue from 'vue'
import {
  Button,
  Container,
  Header,
  Aside,
  Main,
  Message,
  MessageBox,
  Loading,
  Tabs,
  TabPane
} from 'element-ui'

Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Tabs)
Vue.use(TabPane)

// 需要全局挂载 挂载到Vue的原型上
Vue.prototype.$message = Message
// 用于游戏结束 弹出对话框
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$loading = Loading