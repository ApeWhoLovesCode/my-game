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
  Switch,
  Input,
  Form,
  FormItem,
  Popover,
  Notification,
  Drawer,
  Image,
  Avatar,
  Table,
  TableColumn,
  Pagination,
  Carousel,
  CarouselItem,
  RadioGroup,
  RadioButton,
  Dropdown,
  DropdownMenu,
  DropdownItem
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
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Popover)
Vue.use(Drawer)
Vue.use(Image)
Vue.use(Avatar)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

// 需要全局挂载 挂载到Vue的原型上
Vue.prototype.$message = Message
// 用于游戏结束 弹出对话框
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification
Vue.prototype.$loading = Loading.service;