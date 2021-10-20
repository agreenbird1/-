<template>
  <!-- home布局分为左侧导航一级二级推荐以及右侧整体轮播图 -->
  <HomeCategory />
  <!-- 轮播图 -->
  <HomeCarousel />
  <HomeNew />
  <HomeHot />
  <!-- 热门品牌 -->
  <HomeBrand />
  <!-- 商品区块 -->
  <HomeProduct />
  <!-- 最新推荐 -->
  <HomeSpecial />
</template>

<script>
import HomeCategory from './components/HomeCategory.vue'
import HomeCarousel from './components/HomeCarousel.vue'
import HomeNew from './components/HomeNew.vue'
import HomeHot from './components/HomeHot.vue'
import HomeBrand from './components/HomeBrand.vue'
import HomeProduct from './components/HomeProduct.vue'
import HomeSpecial from './components/HomeSpecial.vue'
export default {
  name: 'Home',
  components: {
    HomeCategory,
    HomeCarousel,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  }
}
</script>

<style>
</style>
