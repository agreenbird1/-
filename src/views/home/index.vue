<template>
  <!-- home布局分为左侧导航一级二级推荐以及右侧整体轮播图 -->
  <HomeCategory />
</template>

<script>
import HomeCategory from './components/HomeCategory.vue'
export default {
  name: 'home',
  components: {
    HomeCategory
  }
}
</script>

<style>
</style>
