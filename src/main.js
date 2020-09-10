import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import _ from "lodash";


/* 引入全局样式 */
import "./assets/css/base.css";
// 引入富文本编辑器的样式文件
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(_)

// 时间过滤器
Vue.filter('dateFormat', function (value) {
  const dt = new Date(value)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2, 0)
  const d = (dt.getDate()).toString().padStart(2, 0)

  const hh = (dt.getHours()).toString().padStart(2, 0)
  const mm = (dt.getMinutes()).toString().padStart(2, 0)
  const ss = (dt.getSeconds()).toString().padStart(2, 0)

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
