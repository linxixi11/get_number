// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';





Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.use(ElementUI);


// Vue.prototype.$db = db
// Vue.prototype.$db = mysql

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
