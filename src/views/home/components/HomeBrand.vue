<template>
  <!-- 热门品牌 -->
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <!-- 左右点击按钮 -->
      <a
        href="javascript:;"
        @click="toggle(-1)"
        :class="{ disabled: index === 0 }"
        class="iconfont icon-angle-left prev"
      ></a>
      <a
        href="javascript:;"
        @click="toggle(1)"
        :class="{ disabled: index === 1 }"
        class="iconfont icon-angle-right next"
      ></a>
    </template>

    <div class="box" ref="box">
      <!-- 添加过度动画 -->
      <transition name="fade">
        <ul
          class="list"
          :style="`transform: translateX(${-index * 1240}px)`"
          v-if="brands.length"
        >
          <li v-for="(item, index) in brands" :key="index">
            <RouterLink to="/">
              <img :src="item.picture" alt="" />
            </RouterLink>
          </li>
        </ul>
        <div v-else class="skeleton">
          <Skeleton
            class="item"
            v-for="i in 5"
            :key="i"
            animated
            bg="#e4e4e4"
            width="240px"
            height="305px"
          />
        </div>
      </transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import { getLazyData } from '@/hooks'
import { findBrands } from '@/api/home'
import HomePanel from './HomePanel.vue'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    // findBrands 默认限制寻找6个数据，需要传递参数，直接调用返回的是一个 Promise 对象
    // 故这里可以使用高阶函数
    const { result: brands, target } = getLazyData(() => findBrands(10))
    // 创建一个 index 来控制按钮点击，brand 的左右滑动
    const index = ref(0)
    const toggle = (val) => {
      // 当超出了便不予理会
      const newIndex = index.value + val
      if (newIndex < 0 || newIndex > 1) return
      index.value = newIndex
    }
    return {
      brands,
      box: target,
      index,
      toggle
    }
  }
}
</script>

<style scoped lang='less'>
.skeleton {
  width: 100%;
  display: flex;
  .item {
    margin-right: 10px;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
