import { createStore } from 'vuex'
import createPersistentStore from 'vuex-persistedstate'
import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'

export default createStore({
  modules: {
    user,
    cart,
    category
  },
  // 配置插件
  plugins: [createPersistentStore({
    // 且默认存储在local storage中
    // 配置本地存储key名
    key: 'fresh-rabbit',
    // 指定需要存储的模块
    paths: ['user', 'cart']
  })]
})
