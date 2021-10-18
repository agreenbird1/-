<template>
  <div class="home-banner">
    <Carousel :sliders="sliders" autoPlay />
  </div>
</template>

<script>
import { ref } from 'vue'
import { findBanner } from '@/api/home'
export default {
  name: 'HomeCarousel',
  setup () {
    // 在容器中获取数据传递给 carousel 组件
    const sliders = ref([])
    findBanner().then(res => {
      sliders.value = res.result
    })
    return {
      sliders
    }
  }
}
</script>

<style scoped lang='less'>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
}
.xtx-carousel {
  // ::v-deep .xxx和/deep/已经被弃用
  // 新实现
  ::v-deep(.carousel-btn.prev) {
    left: 270px;
  }
  // 简写
  :deep(.carousel-indicator) {
    padding-left: 250px;
  }
}
</style>
