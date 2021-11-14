import store from '@/store'
import { h } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/')
const Cart = () => import('@/views/cart/')

const Login = () => import('@/views/login/')
const LoginCallBack = () => import('@/views/login/LoginCallBack')

const Checkout = () => import('@/views/member/pay/Checkout')
const Pay = () => import('@/views/member/pay/')
const PayResult = () => import('@/views/member/pay/PayResult')

const MemberLayout = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home')
const MemberOrder = () => import('@/views/member/order')
const MemberOrderDetail = () => import('@/views/member/order/Detail')

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
      }, {
        path: '/member/checkout',
        component: Checkout
      }, {
        path: '/member/pay',
        component: Pay
      }, {
        path: '/pay/callback',
        component: PayResult
      }, {
        path: '/member',
        component: MemberLayout,
        children: [
          {
            path: '/member',
            component: MemberHome
          },
          {
            // 实现模糊匹配这里需要继续嵌套路由，所以用render函数渲染一个组件当作父组件
            path: '/member/order',
            component: { render: () => h(<RouterView />) },
            children: [{
              path: '',
              component: MemberOrder
            }, {
              path: ':id',
              component: MemberOrderDetail
            }]
          }
        ]
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

router.beforeEach((to, from, next) => {
  // 先进行登录状态验证
  const { user } = store.state.user
  if (!user.token && to.path.startsWith('/member')) {
    // 未登录状态
    // 跳转到登录页且携带当前被拦截的地址方便回跳
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  // 否则直接放行
  next()
})

export default router
