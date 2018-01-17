import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
// import './assets/theme/theme-darkblue/index.css'
import './assets/theme/theme-darkblue/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import Mock from './mock'
Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
//jquery引入
import $ from 'jquery'
import 'jquery.nicescroll'
import * as Constant from './common/js/constant.js'


import Home from './views/Home.vue';

Vue.prototype.Constant = Constant

import VueResource from 'vue-resource'
Vue.use(VueResource);



Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });
const router = new VueRouter({
  mode:'history',
  routes
});



router.beforeEach((to, from, next) => {

  next()


})

router.afterEach(transition => {

});

new Vue({
 
  router,
  store,

  render: h => h(App)
}).$mount('#app')


