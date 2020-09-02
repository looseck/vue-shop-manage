import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'


/* 引入全局样式 */
import "./assets/css/base.css";

Vue.config.productionTip = false
Vue.use(ElementUI);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
