import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import routes from './router'
import echarts from 'echarts'
import VueRouter from 'vue-router'
import  '@/assets/iconfonts/iconfont.css'
import '@/assets/css/normalize.scss'

Vue.use(ElementUI);
Vue.use(VueRouter)
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

const router = new VueRouter({
  routes
})


router.beforeEach((to, from, next) => {
  //NProgress.start();
  // if (to.path == '/login') {
  //   sessionStorage.removeItem('user');
  // }
  // let user = JSON.parse(sessionStorage.getItem('user'));
  // if (!user && to.path != '/login') {
  //   next({ path: '/login' })
  // } else {
  //   next()
  // }
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let adminUser = JSON.parse(sessionStorage.getItem('user'));
  console.log(adminUser)
  if (!adminUser && to.path != '/userLogin' && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
