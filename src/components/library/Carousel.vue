<template>
  <!-- 轮播图组件 -->
  <div
    class="xtx-carousel"
    @mouseleave="startTimer()"
    @mouseenter="stopTimer()"
  >
    <ul class="carousel-body">
      <!-- 轮播图图片 fade 类名控制当前展示的图片 -->
      <li
        class="carousel-item"
        v-for="(item, i) in sliders"
        :key="i"
        :class="{ fade: index === i }"
      >
        <RouterLink to="/">
          <img :src="item.imgUrl" alt="" />
        </RouterLink>
      </li>
    </ul>
    <!-- 左右两个点 -->
    <a href="javascript:;" class="carousel-btn prev" @click="leftClick()"
      ><i class="iconfont icon-angle-left"></i
    ></a>
    <a href="javascript:;" class="carousel-btn next" @click="rightClick()"
      ><i class="iconfont icon-angle-right"></i
    ></a>
    <!-- 轮播图指示原点 active 控制当前展示的圆点 -->
    <div class="carousel-indicator">
      <span
        v-for="(item, i) in sliders"
        :key="i"
        :class="{ active: index === i }"
        @click="changeSlider(i)"
      ></span>
    </div>
  </div>
</template>

<script>
import { ref, watch, onUnmounted } from 'vue'
export default {
  name: 'Carousel',
  props: {
    // 传递的轮播图的数据，根据数据进行结构的渲染
    sliders: {
      type: Array,
      default: () => []
    },
    // 是否自动播放
    autoPlay: {
      type: Boolean,
      default: false
    },
    // 切换时间
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup (props) {
    // 用来指示当前轮播图的下标
    // 统一⚪点与当前展示图片
    const index = ref(0)

    // 自动轮播
    let timer = null
    const autoPlayController = () => {
      clearInterval(timer)
      // 开启定时器
      timer = setInterval(() => {
        index.value++
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }

    // 初始监视slider的值，有值的时候进行判断开启循环定时器的播放
    watch(() => props.sliders, (newVal) => {
      if (newVal.length && props.autoPlay) {
        autoPlayController()
      }
    }, { immediate: true })

    // 鼠标进入暂停，离开继续
    const stopTimer = () => {
      // 进入时清除定时器
      clearInterval(timer)
    }
    const startTimer = () => {
      // 进入时候开启定时器，当然需要遵循之前的条件
      if (props.sliders.length && props.autoPlay) autoPlayController()
    }

    // 点击左右点进行切换
    const rightClick = () => {
      index.value = index.value === props.sliders.length - 1 ? 0 : index.value + 1
    }
    const leftClick = () => {
      index.value = index.value === 0 ? props.sliders.length - 1 : index.value - 1
    }
    // 圆点点击的切换
    const changeSlider = (i) => {
      index.value = i
    }
    onUnmounted(() => {
      clearInterval(timer)
    })
    return {
      index,
      stopTimer,
      startTimer,
      rightClick,
      leftClick,
      changeSlider
    }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
