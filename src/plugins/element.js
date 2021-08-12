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
  TabPane,
  Tooltip,
  Switch
} from 'element-ui'

Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tooltip)
Vue.use(Switch)

// 需要全局挂载 挂载到Vue的原型上
Vue.prototype.$message = Message
// 用于游戏结束 弹出对话框
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$loading = Loading