// import Vue from 'vue'
// 默认导入的是vue.runtime.esm.js
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入elementUI创建
import ElementUI from 'element-ui'
// 引入elementui的样式
// import 'element-ui/lib/theme-chalk/index.css'

// 引入通用的样式
import '@/assets/common.css'

// 引入axios
import axios from 'axios'

// 引入moment
import moment from 'moment'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的css
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

// 把axios放到Vue的原型上
Vue.prototype.axios = axios

// 配置公共路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

// 给axios设置请求拦截器
axios.interceptors.request.use(function(config) {
  // 判断如果是登录接口,就不需要添加 Authorization 请求头
  if (!config.url.endsWith('/login')) {
    config.headers['Authorization'] = localStorage.getItem('token')
  }
  return config
})

// 响应拦截器
axios.interceptors.response.use(function(response) {
  if (response.data.meta.status === 401) {
    // 因为现在不是在组件中,通过上面导入的路由模块中的 router （路由实例）来访问到路由对象
    router.push('/login')
    localStorage.removeItem('token')
  }
  return response
})

// 使用elementui插件
Vue.use(ElementUI)

// 定义过滤器，用于过滤时间
Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(format)
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
