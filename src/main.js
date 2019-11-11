import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 全局样式表
import './assets/css/global.css'
// 字体图标库
import './assets/fonts/iconfont.css'
// 展示分类数据
import TreeTable from 'vue-table-with-tree-grid'
// 默认打开地址
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// axios请求拦截器
axios.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem("token");
        return config
    })
    // 挂载axios
Vue.prototype.$http = axios;

Vue.config.productionTip = false
    //全局注册组件
Vue.component('tree-table', TreeTable)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')