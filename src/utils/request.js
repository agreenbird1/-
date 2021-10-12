import router from '@/router'
import store from '@/store'
import axios from 'axios'

// 创建一个新的axios实例
// 大写的 URL 千万别错
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 5000
})

// 创建请求拦截器
instance.interceptors.request.use(config => {
  // 1.获取用户信息进行token判断
  const { user } = store.state.user
  if (user.token) {
    // 设置请求头设置token
    console.log(store.state.user.token)
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 创建响应拦截器
// 剥除冗余，res 就可以直接获得 data 数据
instance.interceptors.response.use(res => res.data, error => {
  // 当 token 失效的时候
  // 注意是 response.status
  if (error.response && error.response.status === 401) {
    // 清空 user 数据
    store.commit('user/setUser', {})
    // 跳转到登录页
    // 获取当前路由页信息 当当前页面路由信息类似为 /user?a=1&b=2 时候,会出现截断导致信息出现错误,故需要转码
    // 组件里 $route.path and $route.fullPath 直接获取路径
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath) // router.Properties
    console.log('path', fullPath)
    // 跳转后需要返回当前跳转的页面,所以需要携带当前页面的路由信息
    router.push(`/login?redirectURL=${fullPath}`)
  }
  return Promise.reject(error)
})

// import xx from nowFile
// xx(url, method, requestData)，返回的就是一个 Promise 对象
export default (url, method, requestData) => {
  // instance 就是一个 axios 实例，请求返回的就是一个 promise 对象，相当于直接封装
  console.log(instance.prototype)
  return instance({
    url,
    method,
    // axios请求参数，url，method，参数
    // [] 中可以动态设置请求参数名，get方法时候使用params，其他时为data
    // 但是也可能写成 GET Get 之类的，所以需要转换为小写进行比较
    [method.toLowerCase() === 'get' ? 'params' : 'data']: requestData
  })
}
