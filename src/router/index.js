import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/categories.vue'
import Params from '../components/goods/params.vue'
import GoodList from '../components/goods/List.vue'
import GoodAdd from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'

Vue.use(Router)

const router = new Router({
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', component: Login },
            {
                path: '/home',
                component: Home,
                redirect: '/Welcome',
                children: [{
                        path: '/Welcome',
                        component: Welcome
                    },
                    {
                        path: '/users',
                        component: Users
                    },
                    {
                        path: '/rights',
                        component: Rights
                    },
                    {
                        path: '/roles',
                        component: Roles
                    },
                    {
                        path: '/categories',
                        component: Cate
                    },
                    {
                        path: '/params',
                        component: Params
                    },
                    {
                        path: '/goods',
                        component: GoodList
                    },
                    {
                        path: "/goods/add",
                        component: GoodAdd
                    },
                    {
                        path: "/orders",
                        component: Order
                    },
                    {
                        path: "/reports",
                        component: Report
                    }
                ]
            }
        ]
    })
    // 路由导航守卫
router.beforeEach((to, from, next) => {
        if (to.path === '/login') next();
        const tokenStr = window.sessionStorage.getItem('token');
        if (!tokenStr)
            return next('/login');
        next();
    })
    // 解决重复点击报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router;