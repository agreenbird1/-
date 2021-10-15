<template>
  <!-- 一级路由 -->
  <AppNavBar />
  <AppHeaderSticky />
  <AppHeader />
  <div class="app-body">
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
  <AppFooter />
</template>

<script>
import { useStore } from 'vuex'
import AppNavBar from '@/components/AppNavBar.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeaderSticky from '@/components/AppHeaderSticky.vue'
export default {
  name: 'Layout',
  components: { AppNavBar, AppHeader, AppFooter, AppHeaderSticky },
  setup () {
    // 加载时获取数据
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style scoped lang="less">
.app-body {
  min-height: 600px;
}
</style>
