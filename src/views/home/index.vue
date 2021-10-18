<template>
  <!-- home布局分为左侧导航一级二级推荐以及右侧整体轮播图 -->
  <HomeCategory />
  <!-- 轮播图 -->
  <HomeCarousel />
  <HomeNew />
  <HomeHot />
</template>

<script>
import HomeCategory from './components/HomeCategory.vue'
import HomeCarousel from './components/HomeCarousel.vue'
import HomeNew from './components/HomeNew.vue'
import HomeHot from './components/HomeHot.vue'
export default {
  name: 'Home',
  components: {
    HomeCategory,
    HomeCarousel,
    HomeNew,
    HomeHot
  }
}
</script>

<style>
</style>
