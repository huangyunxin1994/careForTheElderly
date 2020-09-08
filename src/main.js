import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import routes from './router'
import echarts from 'echarts'
import VueRouter from 'vue-router'
import 'babel-polyfill'
import  '@/assets/iconfonts/iconfont.css'
import '@/assets/css/normalize.scss'
import { Message } from 'element-ui'

Vue.use(ElementUI);
Vue.use(VueRouter)
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

const router = new VueRouter({
  routes
})


router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let adminUser = JSON.parse(sessionStorage.getItem('user'));
  if (!adminUser && to.path != '/userLogin' && to.path != '/login') {
    next({ path: '/login' })
  }else if((!adminUser||adminUser.account != 'admin') && (to.path == '/organizationAdmin' || to.path == '/equipment')){
	Message({
	  message: '抱歉,没有权限!',
	  type: 'error',
	  duration: 1000
	})
	// next()
  }else {
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
