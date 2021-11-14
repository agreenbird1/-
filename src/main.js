import App from '@/App.vue'
import '@/assets/styles/common.less'
import UI from '@/components/library'
// 随机模拟数据
import '@/mock'
import router from '@/router'
import store from '@/store'
import 'normalize.css'
import { createApp } from 'vue'

const app = createApp(App)
app.use(store)
app.use(router)
// 自定义全局组件
app.use(UI)
app.mount('#app')
