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
//导入vue-quill-editor（富文本编辑器）
import VueQuillEditor from 'vue-quill-editor'
//导入vue-quill-editor的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
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
    //全局注册富文本组件
Vue.use(VueQuillEditor)
    //创建过滤器将秒数过滤为年月日，时分秒
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')