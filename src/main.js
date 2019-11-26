// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'lib-flexible'
import App from './App'
import router from './router'
import fastClick from 'fastclick'
import store from './store'
// import Axios from 'axios'
import './assets/styles/reset.css'
import './assets/styles/border.css'

Vue.config.productionTip = false

fastClick.attach(document.body)

Vue.use(ElementUI)

// Axios.defaults.timeout = 5000 // 请求超时
// Axios.defaults.baseURL = 'http://backcalendar.hyzed.cn/'

// Axios.interceptors.request.use(config => {
//   if (store.state.token) {
//     config.headers.common['authorization'] = `Bearer ${store.state.token}`
//   }
//   return config
// }, error => {
//   return Promise.reject(error)
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
