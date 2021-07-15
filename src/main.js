import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'
import Axios from 'axios'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
import { Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
// 配置请求的根路径
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 除了登录接口以外，调用其他接口都需要token权限验证，使用axios的请求拦截器来添加token
Axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('login')
  return config
})
// 将axios挂载在vue实例的原型中，这样就可以在任何地方使用
Vue.prototype.$http = Axios

// 安装全局组件
Vue.component('tree-table', TreeTable)

// 注册全局的loading
Vue.prototype.showLoading = (options = {}) => {
  return Loading.service({
    fullscreen: options.fullscreen || true,
    text: options.text || '数据加载中',
    spinner: options.icon || 'el-icon-loading',
    background: options.background || 'rgba(0,0,0,0.7)'
  })
}
Vue.prototype.hideLoading = () => {
  Vue.prototype.showLoading().close()
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
