import Vue from 'vue'
import Router from 'vue-router'
// 导入组件
// import Login from '@/components/Login'
const Login = () => import(/* webpackChunkName: "login" */ '@/components/Login')

// import Home from '@/components/Home'
const Home = () => import(/* webpackChunkName: "home" */ '@/components/Home')

// import Users from '@/components/users/Users'
const Users = () =>
  import(/* webpackChunkName: "user" */ '@/components/users/Users')

// import Rights from '@/components/rights/Rights'
const Rights = () =>
  import(/* webpackChunkName: "right" */ '@/components/rights/Rights')

// import Roles from '@/components/rights/Roles'
const Roles = () =>
  import(/* webpackChunkName: "right" */ '@/components/rights/Roles')

// import Categories from '@/components/products/Categories'
const Categories = () =>
  import(/* webpackChunkName: "product" */ '@/components/products/Categories')

// 导入Goods.vue
// import Goods from '@/components/products/Goods'
const Goods = () =>
  import(/* webpackChunkName: "product" */ '@/components/products/Goods')

// import Add from '@/components/products/Add'
const Add = () =>
  import(/* webpackChunkName: "product" */ '@/components/products/Add')

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      // 给home路由配置子路由
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/goods-add',
          name: 'goods-add',
          component: Add
        }
      ]
    }
  ]
})

// 给router对象注册导航守卫
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
