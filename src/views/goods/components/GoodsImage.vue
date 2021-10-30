<template>
  <div class="goods-image">
    <!-- 右边预览大图 -->
    <div
      class="large"
      :style="`background-image:url(${
        images[currIndex]
      });background-position-x:${
        elementX >= 100 && elementX <= 300
          ? -2 * (elementX - 100) + 'px'
          : elementX > 300
          ? '-400px'
          : ''
      };background-position-y:${
        elementY >= 100 && elementY <= 300
          ? -2 * (elementY - 100) + 'px'
          : elementY > 300
          ? '-400px'
          : ''
      }`"
      v-show="!isOutside"
    ></div>
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="" />
      <!-- 图片灰色遮罩层 -->
      <!--
        需要跟随鼠标的移动而移动
        移动的最大最小距离根据遮罩层和父元素的大小决定
       -->
      <div
        class="layer"
        v-show="!isOutside"
        :style="`top:${
          elementY >= 100 && elementY <= 300
            ? elementY - 100 + 'px'
            : elementY > 300
            ? '200px'
            : ''
        };left:${
          elementX >= 100 && elementX <= 300
            ? elementX - 100 + 'px'
            : elementX > 300
            ? '200px'
            : ''
        }`"
      ></div>
    </div>
    <ul class="small">
      <li
        v-for="(img, i) in images"
        :key="img"
        :class="{ active: i === currIndex }"
      >
        <img @mouseenter="currIndex = i" :src="img" alt="" />
      </li>
    </ul>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    // 图片组件，大图，右边小图
    // 进入时候可预览
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    // 小图的选择
    const currIndex = ref(0)
    // 被监听的元素
    const target = ref(null)
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    return { currIndex, elementX, elementY, isOutside, target }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }

  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
