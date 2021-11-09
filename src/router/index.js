import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/')
const Cart = () => import('@/views/cart/')

const Login = () => import('@/views/login/')
const LoginCallBack = () => import('@/views/login/LoginCallBack')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home
      },
      // 头部两级类目的两个导航
      {
        path: '/category/:id',
        component: TopCategory
      },
      {
        path: '/category/sub/:id',
        component: SubCategory
      },
      {
        path: '/product/:id',
        component: Goods
      },
      {
        path: '/cart',
        component: Cart
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: LoginCallBack
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 控制路由滚动行为，切换路由界面的时候会自动从底部跳转到顶部
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

export default router
